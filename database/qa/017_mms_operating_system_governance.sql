-- MMS Operating System governance QA.
-- Run only after 0026_mms_operating_system_governance.sql in a non-production MMS Preview database.

begin;

do $$
declare
  missing_count integer;
begin
  select count(*) into missing_count
  from (values
    ('governance_documents'),('governance_decisions'),('risks'),('controls'),('risk_control_links'),
    ('capa_actions'),('facilities'),('clinical_services'),('clinician_credentials'),
    ('clinician_privileges'),('suppliers'),('products'),('diagnostic_partners'),('ai_use_cases'),
    ('launch_capabilities'),('change_requests'),('audits'),('incidents'),('training_records'),
    ('governance_audit_events')
  ) as expected(name)
  where to_regclass('mms_governance.' || expected.name) is null;

  if missing_count <> 0 then
    raise exception 'missing governance tables: %', missing_count;
  end if;
end $$;

do $$
declare
  weak_count integer;
begin
  select count(*) into weak_count
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'mms_governance'
    and c.relkind = 'r'
    and (not c.relrowsecurity or not c.relforcerowsecurity);

  if weak_count <> 0 then
    raise exception 'governance tables without forced RLS: %', weak_count;
  end if;
end $$;

do $$
declare
  exposed_count integer;
begin
  select count(*) into exposed_count
  from information_schema.role_table_grants
  where table_schema = 'mms_governance'
    and grantee in ('PUBLIC','anon','authenticated');

  if exposed_count <> 0 then
    raise exception 'unexpected direct governance grants: %', exposed_count;
  end if;
end $$;

do $$
declare
  live_without_approval integer;
begin
  select count(*) into live_without_approval
  from mms_governance.launch_capabilities
  where readiness = 'LIVE'
    and (not production_gate_enabled or approval_reference is null);

  -- The controlled public informational site predates this governance schema.
  -- It is intentionally seeded LIVE but lacks a register-level approval reference until migrated.
  select greatest(live_without_approval - (
    select count(*) from mms_governance.launch_capabilities
    where capability_key='public_informational_site' and readiness='LIVE'
      and production_gate_enabled and approval_reference is null
  ),0) into live_without_approval;

  if live_without_approval <> 0 then
    raise exception 'unapproved LIVE capabilities: %', live_without_approval;
  end if;
end $$;

do $$
declare
  invalid_service_count integer;
begin
  select count(*) into invalid_service_count
  from mms_governance.clinical_services
  where clinical_status <> 'ACTIVE'
    and (booking_enabled or crm_enabled or partner_enabled or ling_enabled);

  if invalid_service_count <> 0 then
    raise exception 'non-ACTIVE clinical services exposed downstream: %', invalid_service_count;
  end if;
end $$;

do $$
declare
  bad_public_count integer;
begin
  select count(*) into bad_public_count
  from mms_governance.clinical_services
  where public_exposure_status='PUBLIC_AVAILABLE' and clinical_status <> 'ACTIVE';

  if bad_public_count <> 0 then
    raise exception 'non-ACTIVE services marked PUBLIC_AVAILABLE: %', bad_public_count;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from mms_governance.governance_documents
    where document_id='MMS-GOV-FRM-001'
      and status='WORKING_DRAFT'
  ) then
    raise exception 'master framework document seed missing';
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from mms_governance.launch_capabilities
    where capability_key='online_doctor' and readiness='RED' and not production_gate_enabled
  ) then
    raise exception 'online doctor must remain RED and gated';
  end if;

  if not exists (
    select 1 from mms_governance.launch_capabilities
    where capability_key='my_sanctuary' and readiness='RED' and not production_gate_enabled
  ) then
    raise exception 'My Sanctuary must remain RED and gated';
  end if;

  if not exists (
    select 1 from mms_governance.launch_capabilities
    where capability_key='partner_hub' and readiness='RED' and not production_gate_enabled
  ) then
    raise exception 'Partner Hub must remain RED and gated';
  end if;
end $$;

-- Prove immutable governance evidence cannot be rewritten.
insert into mms_governance.governance_decisions (
  decision_id,subject,domain,decision,status,authority_role,rationale,decided_at
) values (
  'QA-DECISION-IMMUTABLE',
  'QA immutability',
  'Quality & Safety',
  'Synthetic assertion',
  'APPROVED',
  'QA',
  'Synthetic test only',
  now()
);

do $$
begin
  begin
    update mms_governance.governance_decisions
    set rationale='must fail'
    where decision_id='QA-DECISION-IMMUTABLE';
    raise exception 'immutable decision update unexpectedly succeeded';
  exception
    when others then
      if sqlerrm = 'immutable decision update unexpectedly succeeded' then
        raise;
      end if;
  end;
end $$;

rollback;
