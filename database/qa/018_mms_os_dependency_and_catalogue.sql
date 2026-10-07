-- MMS OS dependency and catalogue QA. Non-production only.

begin;

do $$
declare
  service_count integer;
  active_count integer;
  exposed_count integer;
  dependency_count integer;
begin
  select count(*) into service_count
  from mms_governance.clinical_services
  where service_id like 'SVC-MY-%';

  if service_count <> 7 then
    raise exception 'expected 7 proposed baseline services, found %', service_count;
  end if;

  select count(*) into active_count
  from mms_governance.clinical_services
  where service_id like 'SVC-MY-%' and clinical_status='ACTIVE';

  if active_count <> 0 then
    raise exception 'proposed baseline services must not be ACTIVE';
  end if;

  select count(*) into exposed_count
  from mms_governance.clinical_services
  where service_id like 'SVC-MY-%'
    and (booking_enabled or crm_enabled or partner_enabled or ling_enabled or public_exposure_status='PUBLIC_AVAILABLE');

  if exposed_count <> 0 then
    raise exception 'proposed services have downstream exposure';
  end if;

  select count(*) into dependency_count
  from mms_governance.clinical_service_dependencies d
  join mms_governance.clinical_services s on s.id=d.service_id
  where s.service_id like 'SVC-MY-%' and d.required;

  if dependency_count < 70 then
    raise exception 'baseline service dependency matrix is incomplete: %', dependency_count;
  end if;
end $$;

do $$
declare
  target_id uuid;
begin
  select id into target_id
  from mms_governance.clinical_services
  where service_id='SVC-MY-PREV-001';

  begin
    update mms_governance.clinical_services
    set clinical_status='ACTIVE',
        approval_reference='QA-SHOULD-NOT-ACTIVATE'
    where id=target_id;
    raise exception 'activation unexpectedly succeeded';
  exception
    when others then
      if sqlerrm = 'activation unexpectedly succeeded' then
        raise;
      end if;
  end;

  if exists (
    select 1 from mms_governance.clinical_services
    where id=target_id and clinical_status='ACTIVE'
  ) then
    raise exception 'failed activation altered the clinical service state';
  end if;
end $$;

do $$
declare
  doc_count integer;
begin
  select count(*) into doc_count
  from mms_governance.governance_documents;

  if doc_count < 30 then
    raise exception 'controlled document catalogue unexpectedly small: %', doc_count;
  end if;

  if exists (
    select 1 from mms_governance.governance_documents
    where document_id <> 'MMS-GOV-FRM-001'
      and status <> 'WORKING_DRAFT'
  ) then
    raise exception 'catalogue contains falsely approved documents';
  end if;
end $$;

rollback;
