-- MMS commission eligibility creation hardening.
-- Apply only to the dedicated MMS commercial database after migration 0008.
-- No commission rates are hard-coded here; an approved effective-dated rule is required.

begin;

create or replace function mms_commercial.create_eligible_commission(
  p_application_id text,
  p_checked_by text,
  p_checked_at timestamptz
)
returns table(public_transaction_id text, replayed boolean)
language plpgsql
security definer
set search_path = mms_commercial, pg_temp
as $$
declare
  v_app mms_commercial.applications%rowtype;
  v_partner mms_commercial.partners%rowtype;
  v_payment mms_commercial.payments%rowtype;
  v_membership mms_commercial.memberships%rowtype;
  v_rule mms_commercial.commission_rules%rowtype;
  v_existing mms_commercial.commission_transactions%rowtype;
  v_rule_count integer;
  v_rate numeric(8,6);
  v_gross bigint;
begin
  if nullif(trim(coalesce(p_application_id,'')), '') is null
     or nullif(trim(coalesce(p_checked_by,'')), '') is null
     or p_checked_at is null
     or p_checked_at > now() + interval '5 minutes' then
    raise exception using errcode='22023', message='invalid_commission_eligibility_input';
  end if;

  select * into v_app
  from mms_commercial.applications
  where public_application_id=trim(p_application_id)
  for update;
  if v_app.id is null then
    raise exception using errcode='P0001', message='application_not_found';
  end if;
  if v_app.stage <> 'Activated' then
    raise exception using errcode='P0001', message='application_not_activated';
  end if;

  select * into v_partner from mms_commercial.partners where id=v_app.partner_id for share;
  if v_partner.id is null or v_partner.partner_code is null then
    raise exception using errcode='P0001', message='partner_attribution_missing';
  end if;
  if v_partner.stage <> 'Active'
     or v_partner.selling_enabled <> true
     or v_partner.crm_access_enabled <> true
     or v_partner.level is null
     or v_partner.compliance_acknowledged_at is null then
    raise exception using errcode='P0001', message='partner_not_commission_eligible';
  end if;
  if not exists (
    select 1 from mms_commercial.partner_certifications c
    where c.partner_id=v_partner.id
      and c.revoked_at is null
      and c.issued_at <= p_checked_at
      and c.expires_at > p_checked_at
  ) then
    raise exception using errcode='P0001', message='partner_certification_not_current';
  end if;

  select * into v_payment
  from mms_commercial.payments
  where application_id=v_app.id
  order by created_at desc
  limit 1
  for share;
  if v_payment.id is null or v_payment.stage <> 'Cleared' or v_payment.cleared_at is null then
    raise exception using errcode='P0001', message='payment_not_cleared';
  end if;
  if coalesce(v_payment.refund_amount_minor_units,0) <> 0 then
    raise exception using errcode='P0001', message='payment_refund_requires_finance_review';
  end if;
  if p_checked_at < v_payment.cleared_at then
    raise exception using errcode='P0001', message='eligibility_precedes_payment_clearance';
  end if;
  if not exists (
    select 1 from mms_commercial.payment_verifications pv
    where pv.payment_id=v_payment.id
      and pv.cleared_amount_minor_units=v_payment.amount_minor_units
      and pv.currency=v_payment.currency
  ) then
    raise exception using errcode='P0001', message='payment_verification_missing';
  end if;

  select * into v_membership
  from mms_commercial.memberships
  where application_id=v_app.id
  for share;
  if v_membership.id is null
     or v_membership.status <> 'Active'
     or v_membership.cancelled_at is not null
     or v_membership.activated_at is null then
    raise exception using errcode='P0001', message='membership_not_active';
  end if;
  if v_membership.membership_code <> v_app.membership_code then
    raise exception using errcode='P0001', message='membership_application_mismatch';
  end if;
  if p_checked_at < v_membership.activated_at then
    raise exception using errcode='P0001', message='eligibility_precedes_membership_activation';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_payment.id::text || ':' || v_partner.id::text, 73));

  select * into v_existing
  from mms_commercial.commission_transactions
  where payment_id=v_payment.id and partner_id=v_partner.id
  for update;
  if v_existing.id is not null then
    if v_existing.application_id=v_app.id
       and v_existing.membership_id=v_membership.id
       and v_existing.status in ('Eligible','Held','Approved','Paid') then
      return query select v_existing.public_transaction_id, true;
      return;
    end if;
    raise exception using errcode='P0001', message='commission_transaction_conflict';
  end if;

  select count(*) into v_rule_count
  from mms_commercial.commission_rules r
  where r.effective_from <= p_checked_at
    and (r.effective_to is null or r.effective_to > p_checked_at);
  if v_rule_count = 0 then
    raise exception using errcode='P0001', message='commission_rule_not_found';
  elsif v_rule_count > 1 then
    raise exception using errcode='P0001', message='commission_rule_overlap';
  end if;

  select * into v_rule
  from mms_commercial.commission_rules r
  where r.effective_from <= p_checked_at
    and (r.effective_to is null or r.effective_to > p_checked_at)
  limit 1;

  begin
    v_rate := (v_rule.rates_by_level ->> v_partner.level)::numeric;
  exception when others then
    raise exception using errcode='P0001', message='commission_rate_invalid';
  end;
  if v_rate is null or v_rate < 0 or v_rate > 1 then
    raise exception using errcode='P0001', message='commission_rate_missing_or_invalid';
  end if;

  v_gross := round(v_payment.amount_minor_units::numeric * v_rate)::bigint;

  insert into mms_commercial.commission_transactions(
    partner_id,application_id,payment_id,membership_id,member_reference,membership_code,
    payment_transaction_reference,currency,eligible_revenue_minor_units,
    commission_rule_id,commission_rule_version,partner_level_at_eligibility,
    commission_rate,gross_commission_minor_units,adjustment_minor_units,
    approved_commission_minor_units,status,eligibility_checked_by,eligibility_checked_at
  ) values (
    v_partner.id,v_app.id,v_payment.id,v_membership.id,v_membership.member_reference,v_membership.membership_code,
    v_payment.transaction_reference,v_payment.currency,v_payment.amount_minor_units,
    v_rule.id,v_rule.version,v_partner.level,
    v_rate,v_gross,0,0,'Eligible',trim(p_checked_by),p_checked_at
  ) returning * into v_existing;

  insert into mms_commercial.commission_events(
    commission_transaction_id,previous_status,next_status,actor,reason,occurred_at
  ) values (
    v_existing.id,'Pending Eligibility','Eligible',trim(p_checked_by),
    'Eligibility verified from persisted attribution, cleared payment, active membership, current certification and approved commission rule ' || v_rule.version || '.',
    p_checked_at
  );

  return query select v_existing.public_transaction_id, false;
end;
$$;

revoke all on function mms_commercial.create_eligible_commission(text,text,timestamptz) from public;
grant execute on function mms_commercial.create_eligible_commission(text,text,timestamptz) to mms_commercial_app;

insert into mms_commercial.schema_migrations(migration_key,notes)
values('0009_mms_commission_eligibility_creation.sql','Database-derived commission eligibility using persisted attribution, Finance-cleared payment, active membership, current Partner certification and approved effective-dated rules.')
on conflict(migration_key) do nothing;

commit;
