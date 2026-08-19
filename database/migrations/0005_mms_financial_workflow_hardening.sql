-- MMS financial workflow hardening
-- Apply only after 0004 on the dedicated MMS commercial PostgreSQL database.
-- Commercial data only. Never apply to iPivot or any clinical/patient database.

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
  v_cleared_at timestamptz;
  v_existing mms_commercial.payment_verifications%rowtype;
begin
  if nullif(trim(coalesce(p_verified_by, '')), '') is null
     or p_verified_at is null
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

  select p.id, p.stage, p.amount_minor_units, p.currency, p.cleared_at
    into v_pay, v_pay_stage, v_amount, v_currency, v_cleared_at
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
  set stage = 'Cleared', cleared_at = p_verified_at
  where id = v_pay;

  update mms_commercial.applications
  set stage = 'Paid'
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
     or p_finance_verified_at is null then
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
  set status = 'Active', activated_at = p_activated_at
  where id = v_mem;

  update mms_commercial.applications
  set stage = 'Activated', activated_at = p_activated_at
  where id = v_app;

  insert into mms_commercial.commercial_workflow_events(
    entity_type, entity_public_id, previous_state, next_state, actor, reason, occurred_at
  ) values
    ('Application', p_application_id, 'Paid', 'Activated', trim(p_activated_by), 'Membership activated after Finance-cleared payment.', p_activated_at),
    ('Membership', p_membership_id, 'Pending Activation', 'Active', trim(p_activated_by), 'Commercial membership activated.', p_activated_at);
end;
$$;

create or replace function mms_commercial.transition_commission(
  p_transaction_id text,
  p_expected_status text,
  p_next_status text,
  p_actor text,
  p_occurred_at timestamptz,
  p_reason text,
  p_approved_amount bigint default null,
  p_payout_batch_id text default null,
  p_payout_reference text default null,
  p_clawback_amount bigint default null
) returns void
language plpgsql
security definer
set search_path = mms_commercial, pg_temp
as $$
declare
  v_row mms_commercial.commission_transactions%rowtype;
  v_allowed boolean := false;
begin
  if nullif(trim(coalesce(p_actor, '')), '') is null
     or p_occurred_at is null
     or nullif(trim(coalesce(p_reason, '')), '') is null then
    raise exception using errcode = '22023', message = 'invalid_commission_transition_evidence';
  end if;

  select * into v_row
  from mms_commercial.commission_transactions
  where public_transaction_id = p_transaction_id
  for update;
  if v_row.id is null then
    raise exception using errcode = 'P0001', message = 'commission_transaction_not_found';
  end if;

  -- Retry-safe exact terminal/control transition handling.
  if v_row.status = p_next_status then
    if p_next_status = 'Approved'
       and p_approved_amount is not null
       and v_row.approved_commission_minor_units = p_approved_amount
       and v_row.approved_by = p_actor
       and v_row.approved_at = p_occurred_at then
      return;
    elsif p_next_status = 'Paid'
       and v_row.payout_batch_id = p_payout_batch_id
       and v_row.payout_reference = p_payout_reference
       and v_row.paid_by = p_actor
       and v_row.paid_at = p_occurred_at then
      return;
    elsif p_next_status = 'Reversed'
       and v_row.reversal_reason = p_reason
       and v_row.reversed_at = p_occurred_at
       and v_row.clawback_minor_units = coalesce(p_clawback_amount, v_row.clawback_minor_units) then
      return;
    end if;
    raise exception using errcode = 'P0001', message = 'commission_transition_replay_conflict';
  end if;

  if v_row.status <> p_expected_status then
    raise exception using errcode = 'P0001', message = 'commission_status_conflict';
  end if;

  v_allowed :=
    (p_expected_status = 'Pending Eligibility' and p_next_status in ('Eligible', 'Held', 'Reversed')) or
    (p_expected_status = 'Eligible' and p_next_status in ('Held', 'Approved', 'Reversed')) or
    (p_expected_status = 'Held' and p_next_status in ('Eligible', 'Approved', 'Reversed')) or
    (p_expected_status = 'Approved' and p_next_status in ('Paid', 'Reversed')) or
    (p_expected_status = 'Paid' and p_next_status = 'Reversed');

  if not v_allowed then
    raise exception using errcode = 'P0001', message = 'commission_transition_not_allowed';
  end if;

  if p_next_status = 'Approved' then
    if p_approved_amount is null or p_approved_amount < 0 then
      raise exception using errcode = '22023', message = 'commission_approval_amount_required';
    end if;
    if p_approved_amount > greatest(0, v_row.gross_commission_minor_units + v_row.adjustment_minor_units) then
      raise exception using errcode = '22023', message = 'commission_approval_exceeds_adjusted_amount';
    end if;
  elsif p_approved_amount is not null then
    raise exception using errcode = '22023', message = 'commission_approval_amount_only_valid_for_approval';
  end if;

  if p_next_status = 'Paid' then
    if v_row.approved_by is null or v_row.approved_at is null or v_row.approved_commission_minor_units <= 0 then
      raise exception using errcode = 'P0001', message = 'commission_not_finance_approved';
    end if;
    if nullif(trim(coalesce(p_payout_batch_id, '')), '') is null
       or nullif(trim(coalesce(p_payout_reference, '')), '') is null then
      raise exception using errcode = '22023', message = 'commission_payout_reference_required';
    end if;
  elsif p_payout_batch_id is not null or p_payout_reference is not null then
    raise exception using errcode = '22023', message = 'commission_payout_fields_only_valid_for_paid';
  end if;

  if p_next_status = 'Reversed' then
    if p_expected_status = 'Paid' then
      if p_clawback_amount is null or p_clawback_amount <> v_row.approved_commission_minor_units then
        raise exception using errcode = '22023', message = 'paid_commission_requires_full_clawback';
      end if;
    elsif coalesce(p_clawback_amount, 0) <> 0 then
      raise exception using errcode = '22023', message = 'unpaid_commission_cannot_have_clawback';
    end if;
  elsif p_clawback_amount is not null then
    raise exception using errcode = '22023', message = 'clawback_only_valid_for_reversal';
  end if;

  update mms_commercial.commission_transactions
  set status = p_next_status,
      approved_commission_minor_units = case when p_next_status = 'Approved' then p_approved_amount else approved_commission_minor_units end,
      approved_by = case when p_next_status = 'Approved' then trim(p_actor) else approved_by end,
      approved_at = case when p_next_status = 'Approved' then p_occurred_at else approved_at end,
      payout_batch_id = case when p_next_status = 'Paid' then trim(p_payout_batch_id) else payout_batch_id end,
      payout_reference = case when p_next_status = 'Paid' then trim(p_payout_reference) else payout_reference end,
      paid_by = case when p_next_status = 'Paid' then trim(p_actor) else paid_by end,
      paid_at = case when p_next_status = 'Paid' then p_occurred_at else paid_at end,
      reversed_at = case when p_next_status = 'Reversed' then p_occurred_at else reversed_at end,
      reversal_reason = case when p_next_status = 'Reversed' then trim(p_reason) else reversal_reason end,
      clawback_minor_units = case when p_next_status = 'Reversed' then coalesce(p_clawback_amount, 0) else clawback_minor_units end
  where id = v_row.id;

  insert into mms_commercial.commission_events(
    commission_transaction_id, previous_status, next_status, actor, reason, occurred_at
  ) values (
    v_row.id, p_expected_status, p_next_status, trim(p_actor), trim(p_reason), p_occurred_at
  );
end;
$$;

-- SECURITY DEFINER functions must not remain executable by PUBLIC.
revoke all on function mms_commercial.finance_verify_payment(text,text,text,timestamptz,bigint,text,text,text) from public;
revoke all on function mms_commercial.activate_membership(text,text,text,text,timestamptz,timestamptz) from public;
revoke all on function mms_commercial.transition_commission(text,text,text,text,timestamptz,text,bigint,text,text,bigint) from public;

insert into mms_commercial.schema_migrations(migration_key, notes)
values ('0005_mms_financial_workflow_hardening.sql', 'Retry-safe payment and activation flows plus strict commission transition controls.')
on conflict (migration_key) do nothing;

commit;
