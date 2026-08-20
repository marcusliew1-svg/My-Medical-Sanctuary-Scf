-- MMS membership cancellation and commission reversal hardening.
-- Apply only to the dedicated MMS commercial database after migration 0009.
-- Commercial workflow only. This does not calculate partial-refund treatment.

begin;

create or replace function mms_commercial.cancel_membership_and_reverse_commission(
  p_application_id text,
  p_actor text,
  p_occurred_at timestamptz,
  p_reason text
)
returns table(
  public_membership_id text,
  membership_status text,
  commission_transaction_id text,
  commission_status text,
  clawback_minor_units bigint,
  replayed boolean
)
language plpgsql
security definer
set search_path = mms_commercial, pg_temp
as $$
declare
  v_app mms_commercial.applications%rowtype;
  v_membership mms_commercial.memberships%rowtype;
  v_commission mms_commercial.commission_transactions%rowtype;
  v_previous_membership_status text;
  v_clawback bigint := 0;
begin
  if nullif(trim(coalesce(p_application_id,'')), '') is null
     or nullif(trim(coalesce(p_actor,'')), '') is null
     or p_occurred_at is null
     or p_occurred_at > now() + interval '5 minutes'
     or nullif(trim(coalesce(p_reason,'')), '') is null then
    raise exception using errcode='22023', message='invalid_membership_cancellation_input';
  end if;

  select * into v_app
  from mms_commercial.applications
  where public_application_id=trim(p_application_id)
  for update;
  if v_app.id is null then
    raise exception using errcode='P0001', message='application_not_found';
  end if;

  select * into v_membership
  from mms_commercial.memberships
  where application_id=v_app.id
  for update;
  if v_membership.id is null then
    raise exception using errcode='P0001', message='membership_not_found';
  end if;

  select * into v_commission
  from mms_commercial.commission_transactions
  where membership_id=v_membership.id
  order by created_at desc
  limit 1
  for update;

  if v_membership.status = 'Cancelled' then
    if exists (
      select 1 from mms_commercial.commercial_workflow_events e
      where e.entity_type='Membership'
        and e.entity_public_id=v_membership.public_membership_id
        and e.next_state='Cancelled'
        and e.actor=trim(p_actor)
        and e.occurred_at=p_occurred_at
        and coalesce(e.reason,'')=trim(p_reason)
    ) then
      return query select
        v_membership.public_membership_id,
        v_membership.status,
        v_commission.public_transaction_id,
        v_commission.status,
        coalesce(v_commission.clawback_minor_units,0),
        true;
      return;
    end if;
    raise exception using errcode='P0001', message='membership_cancellation_replay_conflict';
  end if;

  if v_membership.status not in ('Pending Activation','Active') then
    raise exception using errcode='P0001', message='membership_cancellation_not_allowed';
  end if;
  if v_membership.activated_at is not null and p_occurred_at < v_membership.activated_at then
    raise exception using errcode='P0001', message='cancellation_precedes_membership_activation';
  end if;

  v_previous_membership_status := v_membership.status;

  update mms_commercial.memberships
  set status='Cancelled', cancelled_at=p_occurred_at, updated_at=now()
  where id=v_membership.id
  returning * into v_membership;

  insert into mms_commercial.commercial_workflow_events(
    entity_type,entity_public_id,previous_state,next_state,actor,reason,occurred_at
  ) values (
    'Membership',v_membership.public_membership_id,v_previous_membership_status,'Cancelled',
    trim(p_actor),trim(p_reason),p_occurred_at
  );

  if v_commission.id is not null and v_commission.status <> 'Reversed' then
    v_clawback := case when v_commission.status='Paid' then v_commission.approved_commission_minor_units else 0 end;
    perform mms_commercial.transition_commission(
      v_commission.public_transaction_id,
      v_commission.status,
      'Reversed',
      trim(p_actor),
      p_occurred_at,
      'Membership cancelled: ' || trim(p_reason),
      null,
      null,
      null,
      v_clawback
    );
    select * into v_commission
    from mms_commercial.commission_transactions
    where id=v_commission.id;
  end if;

  return query select
    v_membership.public_membership_id,
    v_membership.status,
    v_commission.public_transaction_id,
    v_commission.status,
    coalesce(v_commission.clawback_minor_units,0),
    false;
end;
$$;

revoke all on function mms_commercial.cancel_membership_and_reverse_commission(text,text,timestamptz,text) from public;
grant execute on function mms_commercial.cancel_membership_and_reverse_commission(text,text,timestamptz,text) to mms_commercial_app;

insert into mms_commercial.schema_migrations(migration_key,notes)
values(
  '0010_mms_membership_cancellation_and_commission_reversal.sql',
  'Atomic commercial membership cancellation with automatic zero commission or full paid-commission clawback.'
)
on conflict(migration_key) do nothing;

commit;
