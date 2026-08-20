-- MMS atomic commerce + commission operations
-- Apply only to the dedicated MMS commercial database after 0001/0002.
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
  v_pay uuid;
  v_amount bigint;
  v_currency text;
  v_txref text;
begin
  select a.id into v_app from mms_commercial.applications a
   where a.public_application_id = p_application_id and a.stage = 'Payment Pending'
   for update;
  if v_app is null then raise exception 'application_not_payment_pending'; end if;

  select p.id, p.amount_minor_units, p.currency, p.transaction_reference
    into v_pay, v_amount, v_currency, v_txref
    from mms_commercial.payments p
   where p.public_payment_id = p_payment_id and p.application_id = v_app and p.stage = 'Submitted'
   for update;
  if v_pay is null then raise exception 'payment_not_submitted'; end if;
  if p_cleared_amount <> v_amount or upper(p_currency) <> v_currency then raise exception 'payment_verification_mismatch'; end if;

  insert into mms_commercial.payment_verifications(payment_id,verified_by,verified_at,cleared_amount_minor_units,currency,source,source_reference)
  values (v_pay,p_verified_by,p_verified_at,p_cleared_amount,upper(p_currency),p_source,p_source_reference);

  update mms_commercial.payments set stage='Cleared', cleared_at=p_verified_at where id=v_pay;
  update mms_commercial.applications set stage='Paid' where id=v_app;

  insert into mms_commercial.commercial_workflow_events(entity_type,entity_public_id,previous_state,next_state,actor,reason,occurred_at)
  values
    ('Payment',p_payment_id,'Submitted','Cleared',p_verified_by,p_source || ': ' || p_source_reference,p_verified_at),
    ('Application',p_application_id,'Payment Pending','Paid',p_verified_by,'Application marked Paid after Finance verified cleared funds.',p_verified_at);
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
  v_pay uuid;
  v_mem uuid;
  v_cleared_at timestamptz;
begin
  select id into v_app from mms_commercial.applications
   where public_application_id=p_application_id and stage='Paid' for update;
  if v_app is null then raise exception 'application_not_paid'; end if;

  select id, cleared_at into v_pay, v_cleared_at from mms_commercial.payments
   where public_payment_id=p_payment_id and application_id=v_app and stage='Cleared' for share;
  if v_pay is null or v_cleared_at is null then raise exception 'payment_not_cleared'; end if;
  if v_cleared_at <> p_finance_verified_at then raise exception 'finance_timestamp_mismatch'; end if;
  if p_activated_at < p_finance_verified_at then raise exception 'activation_precedes_finance_verification'; end if;

  select id into v_mem from mms_commercial.memberships
   where public_membership_id=p_membership_id and application_id=v_app and status='Pending Activation' for update;
  if v_mem is null then raise exception 'membership_not_pending'; end if;

  update mms_commercial.memberships set status='Active', activated_at=p_activated_at where id=v_mem;
  update mms_commercial.applications set stage='Activated', activated_at=p_activated_at where id=v_app;

  insert into mms_commercial.commercial_workflow_events(entity_type,entity_public_id,previous_state,next_state,actor,reason,occurred_at)
  values
    ('Application',p_application_id,'Paid','Activated',p_activated_by,'Membership activated after Finance-cleared payment.',p_activated_at),
    ('Membership',p_membership_id,'Pending Activation','Active',p_activated_by,'Commercial membership activated.',p_activated_at);
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
  v_id uuid;
begin
  select id into v_id from mms_commercial.commission_transactions
   where public_transaction_id=p_transaction_id and status=p_expected_status for update;
  if v_id is null then raise exception 'commission_status_conflict'; end if;

  update mms_commercial.commission_transactions
     set status=p_next_status,
         approved_commission_minor_units=coalesce(p_approved_amount,approved_commission_minor_units),
         approved_by=case when p_next_status='Approved' then p_actor else approved_by end,
         approved_at=case when p_next_status='Approved' then p_occurred_at else approved_at end,
         payout_batch_id=case when p_next_status='Paid' then p_payout_batch_id else payout_batch_id end,
         payout_reference=case when p_next_status='Paid' then p_payout_reference else payout_reference end,
         paid_by=case when p_next_status='Paid' then p_actor else paid_by end,
         paid_at=case when p_next_status='Paid' then p_occurred_at else paid_at end,
         reversed_at=case when p_next_status='Reversed' then p_occurred_at else reversed_at end,
         reversal_reason=case when p_next_status='Reversed' then p_reason else reversal_reason end,
         clawback_minor_units=coalesce(p_clawback_amount,clawback_minor_units)
   where id=v_id;

  insert into mms_commercial.commission_events(commission_transaction_id,previous_status,next_status,actor,reason,occurred_at)
  values(v_id,p_expected_status,p_next_status,p_actor,p_reason,p_occurred_at);
end;
$$;

commit;
