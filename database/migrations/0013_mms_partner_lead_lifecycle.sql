-- MMS Partner-owned lead lifecycle hardening.
-- Apply only to the dedicated MMS commercial database after migration 0012.
-- Commercial workflow only. No clinical notes, diagnosis or treatment data belongs here.

begin;

create or replace function mms_commercial.transition_partner_lead_stage(
  p_partner_code text,
  p_public_lead_id text,
  p_expected_stage text,
  p_next_stage text,
  p_occurred_at timestamptz,
  p_next_action_at timestamptz default null
)
returns table(
  public_lead_id text,
  previous_stage text,
  next_stage text,
  replayed boolean
)
language plpgsql
security definer
set search_path = mms_commercial, pg_temp
as $$
declare
  v_partner mms_commercial.partners%rowtype;
  v_lead mms_commercial.leads%rowtype;
  v_allowed boolean := false;
  v_reason text := 'Partner Hub commercial lead stage update.';
begin
  if p_partner_code is null or upper(trim(p_partner_code)) !~ '^MMSP-[0-9]{4,}$'
     or nullif(trim(coalesce(p_public_lead_id,'')), '') is null
     or p_expected_stage not in ('Registered','Accepted','Contacted','Qualified')
     or p_next_stage not in ('Accepted','Contacted','Qualified','Lost','Withdrawn')
     or p_occurred_at is null
     or p_occurred_at > now() + interval '5 minutes' then
    raise exception using errcode='22023', message='invalid_partner_lead_stage_transition_input';
  end if;

  if p_next_stage in ('Lost','Withdrawn') and p_next_action_at is not null then
    raise exception using errcode='22023', message='terminal_lead_stage_cannot_have_next_action';
  end if;
  if p_next_action_at is not null and p_next_action_at < p_occurred_at then
    raise exception using errcode='22023', message='lead_next_action_precedes_transition';
  end if;

  select * into v_partner
  from mms_commercial.partners p
  where upper(p.partner_code)=upper(trim(p_partner_code))
  for share;
  if v_partner.id is null then
    raise exception using errcode='P0001', message='partner_not_found';
  end if;
  if v_partner.stage <> 'Active' or not v_partner.selling_enabled or not v_partner.crm_access_enabled then
    raise exception using errcode='P0001', message='partner_not_selling_eligible';
  end if;
  if not exists(
    select 1 from mms_commercial.partner_certifications c
    where c.partner_id=v_partner.id
      and c.revoked_at is null
      and c.issued_at <= p_occurred_at
      and c.expires_at > p_occurred_at
  ) then
    raise exception using errcode='P0001', message='partner_certification_not_current';
  end if;

  select * into v_lead
  from mms_commercial.leads l
  where l.public_lead_id=trim(p_public_lead_id)
    and l.current_partner_id=v_partner.id
  for update;
  if v_lead.id is null then
    raise exception using errcode='P0001', message='lead_not_owned_by_partner';
  end if;

  if v_lead.stage = p_next_stage then
    if exists(
      select 1 from mms_commercial.lead_lifecycle_events e
      where e.lead_id=v_lead.id
        and e.previous_stage=p_expected_stage
        and e.next_stage=p_next_stage
        and e.actor=v_partner.partner_code
        and e.reason=v_reason
        and e.occurred_at=p_occurred_at
    ) and v_lead.next_action_at is not distinct from p_next_action_at then
      return query select v_lead.public_lead_id,p_expected_stage,p_next_stage,true;
      return;
    end if;
    raise exception using errcode='P0001', message='lead_stage_transition_replay_conflict';
  end if;

  if v_lead.stage <> p_expected_stage then
    raise exception using errcode='P0001', message='lead_stage_conflict';
  end if;
  if v_lead.last_activity_at is not null and p_occurred_at < v_lead.last_activity_at then
    raise exception using errcode='P0001', message='lead_stage_transition_precedes_last_activity';
  end if;
  if exists(select 1 from mms_commercial.applications a where a.lead_id=v_lead.id) then
    raise exception using errcode='P0001', message='lead_stage_locked_after_application';
  end if;

  v_allowed :=
    (p_expected_stage='Registered' and p_next_stage in ('Accepted','Lost','Withdrawn')) or
    (p_expected_stage='Accepted' and p_next_stage in ('Contacted','Lost','Withdrawn')) or
    (p_expected_stage='Contacted' and p_next_stage in ('Qualified','Lost','Withdrawn')) or
    (p_expected_stage='Qualified' and p_next_stage in ('Lost','Withdrawn'));
  if not v_allowed then
    raise exception using errcode='P0001', message='lead_stage_transition_not_allowed';
  end if;

  if p_next_stage in ('Accepted','Contacted','Qualified') and v_lead.duplicate_status <> 'Clear' then
    raise exception using errcode='P0001', message='lead_duplicate_review_not_clear';
  end if;

  update mms_commercial.leads
  set stage=p_next_stage,
      last_activity_at=p_occurred_at,
      next_action_at=p_next_action_at,
      updated_at=now()
  where id=v_lead.id;

  insert into mms_commercial.lead_lifecycle_events(
    lead_id,previous_stage,next_stage,actor,reason,occurred_at
  ) values (
    v_lead.id,p_expected_stage,p_next_stage,v_partner.partner_code,v_reason,p_occurred_at
  );

  return query select v_lead.public_lead_id,p_expected_stage,p_next_stage,false;
end;
$$;

revoke all on function mms_commercial.transition_partner_lead_stage(text,text,text,text,timestamptz,timestamptz) from public;
grant execute on function mms_commercial.transition_partner_lead_stage(text,text,text,text,timestamptz,timestamptz) to mms_commercial_app;

insert into mms_commercial.schema_migrations(migration_key,notes)
values(
  '0013_mms_partner_lead_lifecycle.sql',
  'Partner-owned, certified and retry-safe commercial lead lifecycle transitions with duplicate-clearance and concurrency gates.'
)
on conflict(migration_key) do nothing;

commit;
