-- MMS lead duplicate-review hardening.
-- Apply only to the dedicated MMS commercial database after migration 0011.
-- Commercial duplicate control only. No clinical or patient data belongs here.

begin;

create or replace function mms_commercial.review_lead_duplicate_status(
  p_public_lead_id text,
  p_status text,
  p_matched_public_lead_ids text[],
  p_checked_by text,
  p_checked_at timestamptz
)
returns table(
  public_lead_id text,
  duplicate_status text,
  lead_stage text,
  replayed boolean
)
language plpgsql
security definer
set search_path = mms_commercial, pg_temp
as $$
declare
  v_lead mms_commercial.leads%rowtype;
  v_existing mms_commercial.lead_duplicate_decisions%rowtype;
  v_matches text[] := coalesce(p_matched_public_lead_ids, '{}'::text[]);
  v_previous_stage text;
  v_next_stage text;
begin
  if nullif(trim(coalesce(p_public_lead_id,'')), '') is null
     or p_status not in ('Clear','Possible Duplicate','Confirmed Duplicate')
     or nullif(trim(coalesce(p_checked_by,'')), '') is null
     or p_checked_at is null
     or p_checked_at > now() + interval '5 minutes' then
    raise exception using errcode='22023', message='invalid_lead_duplicate_review_input';
  end if;

  if p_status='Clear' and cardinality(v_matches) <> 0 then
    raise exception using errcode='22023', message='clear_duplicate_review_cannot_include_matches';
  end if;
  if p_status in ('Possible Duplicate','Confirmed Duplicate') and cardinality(v_matches)=0 then
    raise exception using errcode='22023', message='duplicate_review_requires_matches';
  end if;
  if exists(select 1 from unnest(v_matches) x where nullif(trim(x),'') is null or trim(x)=trim(p_public_lead_id)) then
    raise exception using errcode='22023', message='invalid_duplicate_match_reference';
  end if;

  select * into v_lead
  from mms_commercial.leads
  where public_lead_id=trim(p_public_lead_id)
  for update;
  if v_lead.id is null then
    raise exception using errcode='P0001', message='lead_not_found';
  end if;

  if exists(select 1 from mms_commercial.applications a where a.lead_id=v_lead.id) then
    raise exception using errcode='P0001', message='duplicate_review_locked_after_application';
  end if;

  select * into v_existing
  from mms_commercial.lead_duplicate_decisions
  where lead_id=v_lead.id
  order by checked_at desc, created_at desc
  limit 1;

  if v_existing.id is not null
     and v_existing.status=p_status
     and v_existing.matched_public_lead_ids=v_matches
     and v_existing.checked_by=trim(p_checked_by)
     and v_existing.checked_at=p_checked_at then
    return query select v_lead.public_lead_id, v_lead.duplicate_status, v_lead.stage, true;
    return;
  end if;

  if p_status in ('Possible Duplicate','Confirmed Duplicate') and exists(
    select 1 from unnest(v_matches) x
    where not exists(select 1 from mms_commercial.leads l where l.public_lead_id=trim(x))
  ) then
    raise exception using errcode='P0001', message='duplicate_match_lead_not_found';
  end if;

  v_previous_stage := v_lead.stage;
  v_next_stage := case when p_status='Confirmed Duplicate' then 'Duplicate' else v_lead.stage end;

  update mms_commercial.leads
  set duplicate_status=p_status,
      stage=v_next_stage,
      last_activity_at=p_checked_at,
      updated_at=now()
  where id=v_lead.id
  returning * into v_lead;

  insert into mms_commercial.lead_duplicate_decisions(
    lead_id,status,matched_public_lead_ids,checked_by,checked_at
  ) values (
    v_lead.id,p_status,v_matches,trim(p_checked_by),p_checked_at
  );

  if p_status='Confirmed Duplicate' and v_previous_stage <> 'Duplicate' then
    insert into mms_commercial.lead_lifecycle_events(
      lead_id,previous_stage,next_stage,actor,reason,occurred_at
    ) values (
      v_lead.id,v_previous_stage,'Duplicate',trim(p_checked_by),'Lead confirmed as duplicate.',p_checked_at
    );
  end if;

  return query select v_lead.public_lead_id, v_lead.duplicate_status, v_lead.stage, false;
end;
$$;

revoke all on function mms_commercial.review_lead_duplicate_status(text,text,text[],text,timestamptz) from public;
grant execute on function mms_commercial.review_lead_duplicate_status(text,text,text[],text,timestamptz) to mms_commercial_app;

-- Replace Partner application submission with an explicit duplicate-clearance gate.
create or replace function mms_commercial.submit_partner_application(
  p_idempotency_key_hash text,
  p_partner_code text,
  p_public_lead_id text,
  p_membership_code text,
  p_submitted_at timestamptz
)
returns table(public_application_id text, replayed boolean)
language plpgsql
security definer
set search_path = mms_commercial, pg_temp
as $$
declare
  v_partner_id uuid;
  v_lead_id uuid;
  v_lead_stage text;
  v_duplicate_status text;
  v_existing_resource text;
  v_existing mms_commercial.applications%rowtype;
  v_application mms_commercial.applications%rowtype;
begin
  if p_idempotency_key_hash is null or length(trim(p_idempotency_key_hash)) < 32 then
    raise exception using errcode='22023', message='invalid_idempotency_key';
  end if;
  if p_partner_code is null or upper(trim(p_partner_code)) !~ '^MMSP-[0-9]{4,}$' then
    raise exception using errcode='22023', message='invalid_partner_code';
  end if;
  if p_public_lead_id is null or length(trim(p_public_lead_id))=0 then
    raise exception using errcode='22023', message='lead_required';
  end if;
  if p_membership_code not in ('ASCEND','EVOLVE','ETERNA','PINNACLE') then
    raise exception using errcode='22023', message='invalid_membership_code';
  end if;
  if p_submitted_at is null or p_submitted_at > now() + interval '5 minutes' then
    raise exception using errcode='22023', message='invalid_submission_timestamp';
  end if;

  select p.id into v_partner_id
  from mms_commercial.partners p
  where upper(p.partner_code)=upper(trim(p_partner_code))
    and p.stage='Active' and p.selling_enabled=true and p.crm_access_enabled=true
    and exists(
      select 1 from mms_commercial.partner_certifications c
      where c.partner_id=p.id and c.revoked_at is null
        and c.issued_at <= p_submitted_at and c.expires_at > p_submitted_at
    )
  for share;
  if v_partner_id is null then
    raise exception using errcode='P0001', message='partner_not_eligible_to_submit_application';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(trim(p_public_lead_id),41));

  select l.id,l.stage,l.duplicate_status into v_lead_id,v_lead_stage,v_duplicate_status
  from mms_commercial.leads l
  where l.public_lead_id=trim(p_public_lead_id) and l.current_partner_id=v_partner_id
  for update;
  if v_lead_id is null then
    raise exception using errcode='P0001', message='lead_not_owned_by_partner';
  end if;
  if v_duplicate_status <> 'Clear' then
    raise exception using errcode='P0001', message='lead_duplicate_review_not_clear';
  end if;
  if v_lead_stage not in ('Qualified','Application') then
    raise exception using errcode='P0001', message='lead_not_ready_for_application';
  end if;

  select resource_id into v_existing_resource
  from mms_commercial.idempotency_keys
  where scope='partner_application_submission' and key_hash=p_idempotency_key_hash
  for update;
  if v_existing_resource is not null then
    select * into v_existing from mms_commercial.applications where id::text=v_existing_resource;
    if v_existing.id is null then raise exception using errcode='P0001', message='idempotency_resource_missing'; end if;
    if v_existing.partner_id<>v_partner_id or v_existing.lead_id<>v_lead_id or v_existing.membership_code<>p_membership_code then
      raise exception using errcode='P0001', message='idempotency_payload_conflict';
    end if;
    return query select v_existing.public_application_id,true;
    return;
  end if;

  if exists(select 1 from mms_commercial.applications a where a.lead_id=v_lead_id and a.stage not in ('Withdrawn','Rejected')) then
    raise exception using errcode='P0001', message='lead_already_has_open_application';
  end if;

  insert into mms_commercial.idempotency_keys(scope,key_hash,resource_type)
  values('partner_application_submission',p_idempotency_key_hash,'application')
  on conflict(scope,key_hash) do nothing;

  select resource_id into v_existing_resource
  from mms_commercial.idempotency_keys
  where scope='partner_application_submission' and key_hash=p_idempotency_key_hash
  for update;
  if v_existing_resource is not null then
    select * into v_existing from mms_commercial.applications where id::text=v_existing_resource;
    if v_existing.id is null then raise exception using errcode='P0001', message='idempotency_resource_missing'; end if;
    if v_existing.partner_id<>v_partner_id or v_existing.lead_id<>v_lead_id or v_existing.membership_code<>p_membership_code then
      raise exception using errcode='P0001', message='idempotency_payload_conflict';
    end if;
    return query select v_existing.public_application_id,true;
    return;
  end if;

  insert into mms_commercial.applications(lead_id,partner_id,membership_code,stage,submitted_at)
  values(v_lead_id,v_partner_id,p_membership_code,'Submitted',p_submitted_at)
  returning * into v_application;

  update mms_commercial.idempotency_keys set resource_id=v_application.id::text
  where scope='partner_application_submission' and key_hash=p_idempotency_key_hash;

  if v_lead_stage='Qualified' then
    update mms_commercial.leads set stage='Application',last_activity_at=p_submitted_at where id=v_lead_id;
    insert into mms_commercial.lead_lifecycle_events(lead_id,previous_stage,next_stage,actor,reason,occurred_at)
    values(v_lead_id,'Qualified','Application',trim(p_partner_code),'Partner submitted a commercial membership application.',p_submitted_at);
  end if;

  insert into mms_commercial.commercial_workflow_events(entity_type,entity_public_id,previous_state,next_state,actor,reason,occurred_at)
  values('Application',v_application.public_application_id,'Created','Submitted',trim(p_partner_code),'Partner submitted a commercial membership application.',p_submitted_at);

  return query select v_application.public_application_id,false;
end;
$$;

revoke all on function mms_commercial.submit_partner_application(text,text,text,text,timestamptz) from public;
grant execute on function mms_commercial.submit_partner_application(text,text,text,text,timestamptz) to mms_commercial_app;

insert into mms_commercial.schema_migrations(migration_key,notes)
values(
  '0012_mms_lead_duplicate_review_gate.sql',
  'Immutable duplicate-review decisions plus mandatory Clear status before Partner application submission.'
)
on conflict(migration_key) do nothing;

commit;
