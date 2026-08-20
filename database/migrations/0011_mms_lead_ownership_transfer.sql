-- MMS lead ownership transfer hardening.
-- Apply only to the dedicated MMS commercial database after migration 0010.
-- Commercial lead routing only. Existing application/financial attribution is never rewritten.

begin;

create or replace function mms_commercial.transfer_lead_ownership(
  p_public_lead_id text,
  p_expected_partner_code text,
  p_new_partner_code text,
  p_approved_by text,
  p_occurred_at timestamptz,
  p_reason text
)
returns table(
  public_lead_id text,
  previous_partner_code text,
  new_partner_code text,
  replayed boolean
)
language plpgsql
security definer
set search_path = mms_commercial, pg_temp
as $$
declare
  v_lead mms_commercial.leads%rowtype;
  v_previous mms_commercial.partners%rowtype;
  v_new mms_commercial.partners%rowtype;
  v_existing mms_commercial.lead_ownership_events%rowtype;
begin
  if nullif(trim(coalesce(p_public_lead_id,'')), '') is null
     or nullif(trim(coalesce(p_expected_partner_code,'')), '') is null
     or nullif(trim(coalesce(p_new_partner_code,'')), '') is null
     or nullif(trim(coalesce(p_approved_by,'')), '') is null
     or p_occurred_at is null
     or p_occurred_at > now() + interval '5 minutes'
     or nullif(trim(coalesce(p_reason,'')), '') is null then
    raise exception using errcode='22023', message='invalid_lead_ownership_transfer_input';
  end if;

  if upper(trim(p_expected_partner_code)) = upper(trim(p_new_partner_code)) then
    raise exception using errcode='22023', message='lead_ownership_transfer_same_partner';
  end if;

  select * into v_lead
  from mms_commercial.leads
  where public_lead_id=trim(p_public_lead_id)
  for update;
  if v_lead.id is null then
    raise exception using errcode='P0001', message='lead_not_found';
  end if;

  select * into v_previous from mms_commercial.partners where id=v_lead.current_partner_id;
  if v_previous.id is null or upper(coalesce(v_previous.partner_code,'')) <> upper(trim(p_expected_partner_code)) then
    -- Exact replay after the transfer is safe when the immutable ownership event matches.
    select e.* into v_existing
    from mms_commercial.lead_ownership_events e
    join mms_commercial.partners oldp on oldp.id=e.previous_partner_id
    join mms_commercial.partners newp on newp.id=e.new_partner_id
    where e.lead_id=v_lead.id
      and upper(oldp.partner_code)=upper(trim(p_expected_partner_code))
      and upper(newp.partner_code)=upper(trim(p_new_partner_code))
      and e.approved_by=trim(p_approved_by)
      and e.occurred_at=p_occurred_at
      and e.reason=trim(p_reason)
    order by e.created_at desc
    limit 1;
    if v_existing.id is not null then
      return query select v_lead.public_lead_id, upper(trim(p_expected_partner_code)), upper(trim(p_new_partner_code)), true;
      return;
    end if;
    raise exception using errcode='P0001', message='lead_ownership_expected_owner_conflict';
  end if;

  if exists(select 1 from mms_commercial.applications a where a.lead_id=v_lead.id) then
    raise exception using errcode='P0001', message='lead_ownership_locked_after_application';
  end if;

  if v_lead.stage in ('Payment Pending','Payment Verified','Activated','Closed','Lost','Withdrawn','Duplicate','Rejected') then
    raise exception using errcode='P0001', message='lead_ownership_transfer_stage_locked';
  end if;

  select * into v_new
  from mms_commercial.partners
  where upper(partner_code)=upper(trim(p_new_partner_code))
  for share;
  if v_new.id is null then
    raise exception using errcode='P0001', message='new_partner_not_found';
  end if;
  if v_new.stage <> 'Active' or not v_new.selling_enabled or not v_new.crm_access_enabled then
    raise exception using errcode='P0001', message='new_partner_not_selling_eligible';
  end if;
  if not exists(
    select 1 from mms_commercial.partner_certifications c
    where c.partner_id=v_new.id
      and c.revoked_at is null
      and c.expires_at > p_occurred_at
  ) then
    raise exception using errcode='P0001', message='new_partner_certification_not_current';
  end if;

  update mms_commercial.leads
  set current_partner_id=v_new.id,
      last_activity_at=p_occurred_at,
      updated_at=now()
  where id=v_lead.id;

  insert into mms_commercial.lead_ownership_events(
    lead_id,previous_partner_id,new_partner_id,reason,approved_by,occurred_at
  ) values (
    v_lead.id,v_previous.id,v_new.id,trim(p_reason),trim(p_approved_by),p_occurred_at
  );

  return query select v_lead.public_lead_id, v_previous.partner_code, v_new.partner_code, false;
end;
$$;

revoke all on function mms_commercial.transfer_lead_ownership(text,text,text,text,timestamptz,text) from public;
grant execute on function mms_commercial.transfer_lead_ownership(text,text,text,text,timestamptz,text) to mms_commercial_app;

insert into mms_commercial.schema_migrations(migration_key,notes)
values(
  '0011_mms_lead_ownership_transfer.sql',
  'Immutable, retry-safe lead ownership transfers with expected-owner locking, current-certification gating and application attribution lock.'
)
on conflict(migration_key) do nothing;

commit;
