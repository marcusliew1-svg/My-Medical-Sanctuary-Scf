-- MMS commission hold/release evidence hardening.
-- Apply only to the dedicated MMS commercial database after migration 0019.
-- Commercial commission controls only. Never apply to iPivot or clinical/patient databases.

begin;

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
     or p_occurred_at > now() + interval '5 minutes'
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

  if v_row.status = p_next_status then
    if p_next_status = 'Held'
       and v_row.hold_reason = trim(p_reason)
       and exists (
         select 1 from mms_commercial.commission_events e
         where e.commission_transaction_id = v_row.id
           and e.previous_status = p_expected_status
           and e.next_status = 'Held'
           and e.actor = trim(p_actor)
           and e.reason = trim(p_reason)
           and e.occurred_at = p_occurred_at
       ) then
      return;
    elsif p_next_status = 'Eligible'
       and p_expected_status = 'Held'
       and v_row.hold_reason is null
       and exists (
         select 1 from mms_commercial.commission_events e
         where e.commission_transaction_id = v_row.id
           and e.previous_status = 'Held'
           and e.next_status = 'Eligible'
           and e.actor = trim(p_actor)
           and e.reason = trim(p_reason)
           and e.occurred_at = p_occurred_at
       ) then
      return;
    elsif p_next_status = 'Approved'
       and p_approved_amount is not null
       and v_row.approved_commission_minor_units = p_approved_amount
       and v_row.approved_by = trim(p_actor)
       and v_row.approved_at = p_occurred_at then
      return;
    elsif p_next_status = 'Paid'
       and v_row.payout_batch_id = trim(p_payout_batch_id)
       and v_row.payout_reference = trim(p_payout_reference)
       and v_row.paid_by = trim(p_actor)
       and v_row.paid_at = p_occurred_at then
      return;
    elsif p_next_status = 'Reversed'
       and v_row.reversal_reason = trim(p_reason)
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
    (p_expected_status = 'Eligible' and p_next_status in ('Held', 'Approved', 'Reversed')) or
    (p_expected_status = 'Held' and p_next_status in ('Eligible', 'Reversed')) or
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
      hold_reason = case
        when p_next_status = 'Held' then trim(p_reason)
        when p_expected_status = 'Held' and p_next_status = 'Eligible' then null
        else hold_reason
      end,
      approved_commission_minor_units = case when p_next_status = 'Approved' then p_approved_amount else approved_commission_minor_units end,
      approved_by = case when p_next_status = 'Approved' then trim(p_actor) else approved_by end,
      approved_at = case when p_next_status = 'Approved' then p_occurred_at else approved_at end,
      payout_batch_id = case when p_next_status = 'Paid' then trim(p_payout_batch_id) else payout_batch_id end,
      payout_reference = case when p_next_status = 'Paid' then trim(p_payout_reference) else payout_reference end,
      paid_by = case when p_next_status = 'Paid' then trim(p_actor) else paid_by end,
      paid_at = case when p_next_status = 'Paid' then p_occurred_at else paid_at end,
      reversed_at = case when p_next_status = 'Reversed' then p_occurred_at else reversed_at end,
      reversal_reason = case when p_next_status = 'Reversed' then trim(p_reason) else reversal_reason end,
      clawback_minor_units = case when p_next_status = 'Reversed' then coalesce(p_clawback_amount, 0) else clawback_minor_units end,
      updated_at = now()
  where id = v_row.id;

  insert into mms_commercial.commission_events(
    commission_transaction_id, previous_status, next_status, actor, reason, occurred_at
  ) values (
    v_row.id, p_expected_status, p_next_status, trim(p_actor), trim(p_reason), p_occurred_at
  );
end;
$$;

revoke all on function mms_commercial.transition_commission(text,text,text,text,timestamptz,text,bigint,text,text,bigint) from public;

insert into mms_commercial.schema_migrations(migration_key, notes)
values (
  '0020_mms_commission_hold_release_evidence_hardening.sql',
  'Persist commission hold reason, clear it on release, and support exact evidence-bound hold/release retries.'
)
on conflict (migration_key) do nothing;

commit;
