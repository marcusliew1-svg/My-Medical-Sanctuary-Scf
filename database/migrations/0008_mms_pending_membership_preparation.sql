-- MMS pending membership preparation hardening.
-- Apply only to the dedicated MMS commercial database after migration 0007.
-- Runtime role should already exist from database/provision/001 after migrations 0001..0005.

begin;

create or replace function mms_commercial.prepare_membership(
  p_application_id text,
  p_member_reference text,
  p_prepared_by text,
  p_prepared_at timestamptz
)
returns table(public_membership_id text, replayed boolean)
language plpgsql
security definer
set search_path = mms_commercial, pg_temp
as $$
declare
  v_application mms_commercial.applications%rowtype;
  v_payment mms_commercial.payments%rowtype;
  v_membership mms_commercial.memberships%rowtype;
begin
  if nullif(trim(coalesce(p_application_id,'')), '') is null
     or nullif(trim(coalesce(p_member_reference,'')), '') is null
     or length(trim(p_member_reference)) > 160
     or nullif(trim(coalesce(p_prepared_by,'')), '') is null
     or p_prepared_at is null
     or p_prepared_at > now() + interval '5 minutes' then
    raise exception using errcode='22023', message='invalid_membership_preparation_input';
  end if;

  select * into v_application
  from mms_commercial.applications
  where public_application_id = trim(p_application_id)
  for update;
  if v_application.id is null then
    raise exception using errcode='P0001', message='application_not_found';
  end if;
  if v_application.stage not in ('Paid','Activated') then
    raise exception using errcode='P0001', message='application_not_paid';
  end if;

  select * into v_payment
  from mms_commercial.payments
  where application_id = v_application.id
    and stage = 'Cleared'
  order by cleared_at desc, created_at desc
  limit 1
  for share;
  if v_payment.id is null or v_payment.cleared_at is null then
    raise exception using errcode='P0001', message='payment_not_cleared';
  end if;
  if not exists (
    select 1 from mms_commercial.payment_verifications pv
    where pv.payment_id = v_payment.id
  ) then
    raise exception using errcode='P0001', message='payment_verification_missing';
  end if;
  if p_prepared_at < v_payment.cleared_at then
    raise exception using errcode='P0001', message='membership_preparation_precedes_payment_clearance';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_application.id::text, 63));

  select * into v_membership
  from mms_commercial.memberships
  where application_id = v_application.id
  for update;

  if v_membership.id is not null then
    if v_membership.member_reference = trim(p_member_reference)
       and v_membership.membership_code = v_application.membership_code
       and v_membership.status in ('Pending Activation','Active') then
      return query select v_membership.public_membership_id, true;
      return;
    end if;
    raise exception using errcode='P0001', message='membership_preparation_conflict';
  end if;

  insert into mms_commercial.memberships(
    application_id, member_reference, membership_code, status
  ) values (
    v_application.id, trim(p_member_reference), v_application.membership_code, 'Pending Activation'
  ) returning * into v_membership;

  insert into mms_commercial.commercial_workflow_events(
    entity_type, entity_public_id, previous_state, next_state, actor, reason, occurred_at
  ) values (
    'Membership', v_membership.public_membership_id, 'Created', 'Pending Activation',
    trim(p_prepared_by), 'Commercial membership record prepared after Finance-cleared payment.', p_prepared_at
  );

  return query select v_membership.public_membership_id, false;
end;
$$;

revoke all on function mms_commercial.prepare_membership(text,text,text,timestamptz) from public;
grant execute on function mms_commercial.prepare_membership(text,text,text,timestamptz) to mms_commercial_app;

insert into mms_commercial.schema_migrations(migration_key,notes)
values('0008_mms_pending_membership_preparation.sql','Idempotent pending membership preparation after Finance-cleared payment.')
on conflict(migration_key) do nothing;

commit;
