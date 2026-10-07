-- MMS clinical service dependency enforcement.
-- Preview-safe governance metadata only.

begin;

create table if not exists mms_governance.clinical_service_dependencies (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references mms_governance.clinical_services(id) on delete cascade,
  dependency_type text not null check (dependency_type in (
    'REGULATORY','PROTOCOL','FACILITY','CREDENTIAL','PRIVILEGE','COMPETENCY',
    'STAFFING','PRODUCT','DIAGNOSTIC','EMERGENCY','CONSENT','INSURANCE','OTHER'
  )),
  dependency_reference text not null,
  required boolean not null default true,
  status text not null check (status in ('NOT_READY','IN_REVIEW','READY','RESTRICTED','SUSPENDED','EXPIRED','NOT_APPLICABLE')),
  evidence_reference text,
  owner_role text not null,
  review_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (service_id, dependency_type, dependency_reference)
);

create index if not exists clinical_service_dependencies_service_status_idx
  on mms_governance.clinical_service_dependencies(service_id,status);

drop trigger if exists clinical_service_dependencies_touch_updated_at on mms_governance.clinical_service_dependencies;
create trigger clinical_service_dependencies_touch_updated_at
  before update on mms_governance.clinical_service_dependencies
  for each row execute function mms_governance.touch_updated_at();

alter table mms_governance.clinical_service_dependencies enable row level security;
alter table mms_governance.clinical_service_dependencies force row level security;
revoke all on table mms_governance.clinical_service_dependencies from public, anon, authenticated;

create or replace function mms_governance.enforce_clinical_service_activation()
returns trigger
language plpgsql
set search_path = pg_catalog, mms_governance
as $$
declare
  required_count integer;
  not_ready_count integer;
begin
  if new.clinical_status <> 'ACTIVE' then
    new.booking_enabled := false;
    new.crm_enabled := false;
    new.partner_enabled := false;
    new.ling_enabled := false;
    if new.public_exposure_status = 'PUBLIC_AVAILABLE' then
      new.public_exposure_status := 'INTERNAL_ONLY';
    end if;
    return new;
  end if;

  if new.approval_reference is null or btrim(new.approval_reference) = '' then
    raise exception 'ACTIVE clinical service requires an approval reference';
  end if;

  select count(*) into required_count
  from mms_governance.clinical_service_dependencies
  where service_id = new.id and required;

  if required_count = 0 then
    raise exception 'ACTIVE clinical service requires explicit dependency records';
  end if;

  select count(*) into not_ready_count
  from mms_governance.clinical_service_dependencies
  where service_id = new.id
    and required
    and status not in ('READY','NOT_APPLICABLE');

  if not_ready_count > 0 then
    raise exception 'ACTIVE clinical service has required dependencies that are not ready';
  end if;

  return new;
end;
$$;

drop trigger if exists clinical_services_activation_guard on mms_governance.clinical_services;
create trigger clinical_services_activation_guard
  before insert or update on mms_governance.clinical_services
  for each row execute function mms_governance.enforce_clinical_service_activation();

revoke all on function mms_governance.enforce_clinical_service_activation() from public, anon, authenticated;

commit;
