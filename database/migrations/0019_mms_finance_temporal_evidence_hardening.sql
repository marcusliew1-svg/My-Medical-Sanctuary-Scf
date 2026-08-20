-- MMS finance temporal-evidence hardening.
-- Apply only to the dedicated MMS commercial database after migration 0018.
-- Commercial payment/membership controls only. Never apply to iPivot or clinical/patient databases.

begin;

create or replace function mms_commercial.finance_verify_payment(
  p_application_id text,
  p_payment_id text,
  p_verified_by text,
  p_verified_at timestamptz,
  p_cleared_amount bigint,
  p_currency text,
  p_source text,
  p_source_reference text
) returns void
language plpgsql
security definer
set search_path = mms_commercial, pg_temp
as $$
declare
  v_app uuid;
  v_app_stage text;
  v_pay uuid;
  v_pay_stage text;
  v_amount bigint;
  v_currency text;
  v_submitted_at timestamptz;
  v_cleared_at timestamptz;
  v_existing mms_commercial.payment_verifications%rowtype;
begin
  if nullif(trim(coalesce(p_verified_by, '')), '') is null
     or p_verified_at is null
     or p_verified_at > now() + interval '5 minutes'
     or p_cleared_amount is null or p_cleared_amount <= 0
     or upper(trim(coalesce(p_currency, ''))) !~ '^[A-Z]{3}$'
     or nullif(trim(coalesce(p_source, '')), '') is null
     or nullif(trim(coalesce(p_source_reference, '')), '') is null then
    raise exception using errcode = '22023', message = 'invalid_payment_verification_evidence';
  end if;

  select a.id, a.stage into v_app, v_app_stage
  from mms_commercial.applications a
  where a.public_application_id = p_application_id
  for update;
  if v_app is null then
    raise exception using errcode = 'P0001', message = 'application_not_found';
  end if;

  select p.id, p.stage, p.amount_minor_units, p.currency, p.submitted_at, p.cleared_at
    into v_pay, v_pay_stage, v_amount, v_currency, v_submitted_at, v_cleared_at
  from mms_commercial.payments p
  where p.public_payment_id = p_payment_id
    and p.application_id = v_app
  for update;
  if v_pay is null then
    raise exception using errcode = 'P0001', message = 'payment_not_found';
  end if;

  if p_cleared_amount <> v_amount or upper(trim(p_currency)) <> v_currency then
    raise exception using errcode = 'P0001', message = 'payment_verification_mismatch';
  end if;
  if v_submitted_at is null then
    raise exception using errcode = 'P0001', message = 'payment_submission_timestamp_missing';
  end if;
  if p_verified_at < v_submitted_at then
    raise exception using errcode = 'P0001', message = 'payment_verification_precedes_submission';
  end if;

  -- Exact replay after clearance is a no-op, including after membership activation.
  if v_pay_stage = 'Cleared' and v_app_stage in ('Paid', 'Activated') then
    select * into v_existing
    from mms_commercial.payment_verifications
    where payment_id = v_pay
      and source = p_source
      and source_reference = p_source_reference
    order by verified_at desc
    limit 1;

    if v_existing.id is not null
       and v_existing.verified_by = p_verified_by
       and v_existing.verified_at = p_verified_at
       and v_existing.cleared_amount_minor_units = p_cleared_amount
       and v_existing.currency = upper(trim(p_currency))
       and v_cleared_at = p_verified_at then
      return;
    end if;
    raise exception using errcode = 'P0001', message = 'payment_verification_replay_conflict';
  end if;

  if v_app_stage <> 'Payment Pending' then
    raise exception using errcode = 'P0001', message = 'application_not_payment_pending';
  end if;
  if v_pay_stage <> 'Submitted' then
    raise exception using errcode = 'P0001', message = 'payment_not_submitted';
  end if;

  insert into mms_commercial.payment_verifications(
    payment_id, verified_by, verified_at, cleared_amount_minor_units,
    currency, source, source_reference
  ) values (
    v_pay, trim(p_verified_by), p_verified_at, p_cleared_amount,
    upper(trim(p_currency)), p_source, trim(p_source_reference)
  );

  update mms_commercial.payments
  set stage = 'Cleared', cleared_at = p_verified_at, updated_at = now()
  where id = v_pay;

  update mms_commercial.applications
  set stage = 'Paid', updated_at = now()
  where id = v_app;

  insert into mms_commercial.commercial_workflow_events(
    entity_type, entity_public_id, previous_state, next_state, actor, reason, occurred_at
  ) values
    ('Payment', p_payment_id, 'Submitted', 'Cleared', trim(p_verified_by), p_source || ': ' || trim(p_source_reference), p_verified_at),
    ('Application', p_application_id, 'Payment Pending', 'Paid', trim(p_verified_by), 'Application marked Paid after Finance verified cleared funds.', p_verified_at);
end;
$$;

create or replace function mms_commercial.activate_membership(
  p_application_id text,
  p_payment_id text,
  p_membership_id text,
  p_activated_by text,
  p_activated_at timestamptz,
  p_finance_verified_at timestamptz
) returns void
language plpgsql
security definer
set search_path = mms_commercial, pg_temp
as $$
declare
  v_app uuid;
  v_app_stage text;
  v_app_activated_at timestamptz;
  v_pay uuid;
  v_pay_stage text;
  v_cleared_at timestamptz;
  v_mem uuid;
  v_mem_status text;
  v_mem_activated_at timestamptz;
begin
  if nullif(trim(coalesce(p_activated_by, '')), '') is null
     or p_activated_at is null
     or p_finance_verified_at is null
     or p_activated_at > now() + interval '5 minutes'
     or p_finance_verified_at > now() + interval '5 minutes' then
    raise exception using errcode = '22023', message = 'invalid_membership_activation_evidence';
  end if;

  select id, stage, activated_at into v_app, v_app_stage, v_app_activated_at
  from mms_commercial.applications
  where public_application_id = p_application_id
  for update;
  if v_app is null then
    raise exception using errcode = 'P0001', message = 'application_not_found';
  end if;

  select id, stage, cleared_at into v_pay, v_pay_stage, v_cleared_at
  from mms_commercial.payments
  where public_payment_id = p_payment_id
    and application_id = v_app
  for share;
  if v_pay is null then
    raise exception using errcode = 'P0001', message = 'payment_not_found';
  end if;

  select id, status, activated_at into v_mem, v_mem_status, v_mem_activated_at
  from mms_commercial.memberships
  where public_membership_id = p_membership_id
    and application_id = v_app
  for update;
  if v_mem is null then
    raise exception using errcode = 'P0001', message = 'membership_not_found';
  end if;

  if v_pay_stage <> 'Cleared' or v_cleared_at is null then
    raise exception using errcode = 'P0001', message = 'payment_not_cleared';
  end if;
  if v_cleared_at <> p_finance_verified_at then
    raise exception using errcode = 'P0001', message = 'finance_timestamp_mismatch';
  end if;
  if p_activated_at < p_finance_verified_at then
    raise exception using errcode = 'P0001', message = 'activation_precedes_finance_verification';
  end if;

  -- Exact activation replay is safe and does not duplicate workflow events.
  if v_app_stage = 'Activated' and v_mem_status = 'Active' then
    if v_app_activated_at = p_activated_at and v_mem_activated_at = p_activated_at then
      return;
    end if;
    raise exception using errcode = 'P0001', message = 'membership_activation_replay_conflict';
  end if;

  if v_app_stage <> 'Paid' then
    raise exception using errcode = 'P0001', message = 'application_not_paid';
  end if;
  if v_mem_status <> 'Pending Activation' then
    raise exception using errcode = 'P0001', message = 'membership_not_pending';
  end if;

  update mms_commercial.memberships
  set status = 'Active', activated_at = p_activated_at, updated_at = now()
  where id = v_mem;

  update mms_commercial.applications
  set stage = 'Activated', activated_at = p_activated_at, updated_at = now()
  where id = v_app;

  insert into mms_commercial.commercial_workflow_events(
    entity_type, entity_public_id, previous_state, next_state, actor, reason, occurred_at
  ) values
    ('Application', p_application_id, 'Paid', 'Activated', trim(p_activated_by), 'Membership activated after Finance-cleared payment.', p_activated_at),
    ('Membership', p_membership_id, 'Pending Activation', 'Active', trim(p_activated_by), 'Commercial membership activated.', p_activated_at);
end;
$$;

revoke all on function mms_commercial.finance_verify_payment(text,text,text,timestamptz,bigint,text,text,text) from public;
revoke all on function mms_commercial.activate_membership(text,text,text,text,timestamptz,timestamptz) from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'mms_commercial_app') then
    grant execute on function mms_commercial.finance_verify_payment(text,text,text,timestamptz,bigint,text,text,text) to mms_commercial_app;
    grant execute on function mms_commercial.activate_membership(text,text,text,text,timestamptz,timestamptz) to mms_commercial_app;
  end if;
end $$;

insert into mms_commercial.schema_migrations(migration_key, notes)
values (
  '0019_mms_finance_temporal_evidence_hardening.sql',
  'Finance verification and membership activation now enforce non-future evidence and chronological ordering against persisted payment submission/clearance timestamps.'
)
on conflict (migration_key) do nothing;

commit;
