-- MMS application review + payment intake hardening.
-- Apply only to the dedicated MMS commercial database after migration 0006.

begin;

create or replace function mms_commercial.transition_application(
  p_application_id text,
  p_expected_stage text,
  p_next_stage text,
  p_actor text,
  p_occurred_at timestamptz,
  p_reason text
)
returns table(current_stage text, replayed boolean)
language plpgsql
security definer
set search_path = mms_commercial, pg_temp
as $$
declare
  v_application mms_commercial.applications%rowtype;
  v_lead mms_commercial.leads%rowtype;
  v_allowed boolean := false;
begin
  if nullif(trim(p_application_id), '') is null
     or nullif(trim(p_expected_stage), '') is null
     or nullif(trim(p_next_stage), '') is null
     or nullif(trim(p_actor), '') is null
     or p_occurred_at is null
     or nullif(trim(p_reason), '') is null then
    raise exception using errcode = '22023', message = 'invalid_application_transition_input';
  end if;

  select * into v_application
  from mms_commercial.applications
  where public_application_id = trim(p_application_id)
  for update;

  if v_application.id is null then
    raise exception using errcode = 'P0001', message = 'application_not_found';
  end if;

  if v_application.stage = p_next_stage then
    if exists (
      select 1 from mms_commercial.commercial_workflow_events e
      where e.entity_type = 'Application'
        and e.entity_public_id = v_application.public_application_id
        and e.next_state = p_next_stage
        and e.actor = trim(p_actor)
        and e.occurred_at = p_occurred_at
        and coalesce(e.reason, '') = trim(p_reason)
    ) then
      return query select v_application.stage, true;
      return;
    end if;
    raise exception using errcode = 'P0001', message = 'application_transition_replay_conflict';
  end if;

  if v_application.stage <> p_expected_stage then
    raise exception using errcode = 'P0001', message = 'application_stage_conflict';
  end if;

  v_allowed := case
    when p_expected_stage = 'Submitted' and p_next_stage in ('Under Review','Documents Outstanding','Rejected','Withdrawn') then true
    when p_expected_stage = 'Under Review' and p_next_stage in ('Documents Outstanding','Approved','Rejected','Withdrawn') then true
    when p_expected_stage = 'Documents Outstanding' and p_next_stage in ('Under Review','Rejected','Withdrawn') then true
    when p_expected_stage = 'Approved' and p_next_stage in ('Payment Pending','Withdrawn') then true
    else false
  end;

  if not v_allowed then
    raise exception using errcode = 'P0001', message = 'application_transition_not_allowed';
  end if;

  update mms_commercial.applications
  set stage = p_next_stage,
      approved_at = case when p_next_stage = 'Approved' then p_occurred_at else approved_at end,
      updated_at = now()
  where id = v_application.id
  returning * into v_application;

  select * into v_lead from mms_commercial.leads where id = v_application.lead_id for update;

  if p_next_stage = 'Payment Pending' and v_lead.stage = 'Application' then
    update mms_commercial.leads
    set stage = 'Payment Pending', last_activity_at = p_occurred_at
    where id = v_lead.id;
    insert into mms_commercial.lead_lifecycle_events(lead_id,previous_stage,next_stage,actor,reason,occurred_at)
    values(v_lead.id,'Application','Payment Pending',trim(p_actor),trim(p_reason),p_occurred_at);
  elsif p_next_stage = 'Rejected' and v_lead.stage in ('Application','Payment Pending') then
    update mms_commercial.leads set stage='Rejected', last_activity_at=p_occurred_at where id=v_lead.id;
    insert into mms_commercial.lead_lifecycle_events(lead_id,previous_stage,next_stage,actor,reason,occurred_at)
    values(v_lead.id,v_lead.stage,'Rejected',trim(p_actor),trim(p_reason),p_occurred_at);
  elsif p_next_stage = 'Withdrawn' and v_lead.stage in ('Application','Payment Pending') then
    update mms_commercial.leads set stage='Withdrawn', last_activity_at=p_occurred_at where id=v_lead.id;
    insert into mms_commercial.lead_lifecycle_events(lead_id,previous_stage,next_stage,actor,reason,occurred_at)
    values(v_lead.id,v_lead.stage,'Withdrawn',trim(p_actor),trim(p_reason),p_occurred_at);
  end if;

  insert into mms_commercial.commercial_workflow_events(entity_type,entity_public_id,previous_state,next_state,actor,reason,occurred_at)
  values('Application',v_application.public_application_id,p_expected_stage,p_next_stage,trim(p_actor),trim(p_reason),p_occurred_at);

  return query select v_application.stage, false;
end;
$$;

revoke all on function mms_commercial.transition_application(text,text,text,text,timestamptz,text) from public;
grant execute on function mms_commercial.transition_application(text,text,text,text,timestamptz,text) to mms_commercial_app;

create or replace function mms_commercial.record_payment_submission(
  p_idempotency_key_hash text,
  p_application_id text,
  p_transaction_reference text,
  p_amount_minor_units bigint,
  p_currency text,
  p_submitted_at timestamptz,
  p_recorded_by text
)
returns table(public_payment_id text, replayed boolean)
language plpgsql
security definer
set search_path = mms_commercial, pg_temp
as $$
declare
  v_application mms_commercial.applications%rowtype;
  v_existing_resource text;
  v_existing mms_commercial.payments%rowtype;
  v_payment mms_commercial.payments%rowtype;
begin
  if p_idempotency_key_hash is null or length(trim(p_idempotency_key_hash)) < 32 then
    raise exception using errcode = '22023', message = 'invalid_idempotency_key';
  end if;
  if nullif(trim(p_application_id), '') is null
     or nullif(trim(p_transaction_reference), '') is null
     or p_amount_minor_units is null or p_amount_minor_units <= 0
     or upper(trim(coalesce(p_currency,''))) !~ '^[A-Z]{3}$'
     or p_submitted_at is null
     or nullif(trim(p_recorded_by), '') is null then
    raise exception using errcode = '22023', message = 'invalid_payment_submission_input';
  end if;

  select * into v_application
  from mms_commercial.applications
  where public_application_id = trim(p_application_id)
  for update;
  if v_application.id is null then
    raise exception using errcode = 'P0001', message = 'application_not_found';
  end if;
  if v_application.stage <> 'Payment Pending' then
    raise exception using errcode = 'P0001', message = 'application_not_payment_pending';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_application.id::text, 52));

  select resource_id into v_existing_resource
  from mms_commercial.idempotency_keys
  where scope = 'payment_submission'
    and key_hash = p_idempotency_key_hash
  for update;

  if v_existing_resource is not null then
    select * into v_existing from mms_commercial.payments where id::text = v_existing_resource;
    if v_existing.id is null then
      raise exception using errcode = 'P0001', message = 'idempotency_resource_missing';
    end if;
    if v_existing.application_id <> v_application.id
       or v_existing.transaction_reference <> trim(p_transaction_reference)
       or v_existing.amount_minor_units <> p_amount_minor_units
       or v_existing.currency <> upper(trim(p_currency)) then
      raise exception using errcode = 'P0001', message = 'idempotency_payload_conflict';
    end if;
    return query select v_existing.public_payment_id, true;
    return;
  end if;

  if exists (
    select 1 from mms_commercial.payments p
    where p.application_id = v_application.id
      and p.stage in ('Pending','Submitted','Cleared','Partially Refunded','Refunded','Chargeback')
  ) then
    raise exception using errcode = 'P0001', message = 'application_already_has_live_payment';
  end if;

  insert into mms_commercial.idempotency_keys(scope,key_hash,resource_type)
  values('payment_submission',p_idempotency_key_hash,'payment')
  on conflict(scope,key_hash) do nothing;

  select resource_id into v_existing_resource
  from mms_commercial.idempotency_keys
  where scope='payment_submission' and key_hash=p_idempotency_key_hash
  for update;

  if v_existing_resource is not null then
    select * into v_existing from mms_commercial.payments where id::text=v_existing_resource;
    if v_existing.id is null then
      raise exception using errcode = 'P0001', message = 'idempotency_resource_missing';
    end if;
    if v_existing.application_id <> v_application.id
       or v_existing.transaction_reference <> trim(p_transaction_reference)
       or v_existing.amount_minor_units <> p_amount_minor_units
       or v_existing.currency <> upper(trim(p_currency)) then
      raise exception using errcode = 'P0001', message = 'idempotency_payload_conflict';
    end if;
    return query select v_existing.public_payment_id, true;
    return;
  end if;

  insert into mms_commercial.payments(application_id,transaction_reference,amount_minor_units,currency,stage,submitted_at)
  values(v_application.id,trim(p_transaction_reference),p_amount_minor_units,upper(trim(p_currency)),'Submitted',p_submitted_at)
  returning * into v_payment;

  update mms_commercial.idempotency_keys
  set resource_id=v_payment.id::text
  where scope='payment_submission' and key_hash=p_idempotency_key_hash;

  insert into mms_commercial.commercial_workflow_events(entity_type,entity_public_id,previous_state,next_state,actor,reason,occurred_at)
  values('Payment',v_payment.public_payment_id,'Created','Submitted',trim(p_recorded_by),'Commercial payment submission recorded.',p_submitted_at);

  return query select v_payment.public_payment_id, false;
end;
$$;

revoke all on function mms_commercial.record_payment_submission(text,text,text,bigint,text,timestamptz,text) from public;
grant execute on function mms_commercial.record_payment_submission(text,text,text,bigint,text,timestamptz,text) to mms_commercial_app;

insert into mms_commercial.schema_migrations(migration_key,notes)
values('0007_mms_application_review_and_payment_intake.sql','Controlled application review transitions plus idempotent payment submission intake.')
on conflict(migration_key) do nothing;

commit;
