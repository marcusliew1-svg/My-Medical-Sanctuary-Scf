-- MMS Operating System governance foundation.
-- Non-production migration until explicitly approved.
-- Contains governance / operational metadata only. Patient clinical records are prohibited.

begin;

create schema if not exists mms_governance;
revoke all on schema mms_governance from public;

create or replace function mms_governance.touch_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, mms_governance
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function mms_governance.reject_immutable_mutation()
returns trigger
language plpgsql
set search_path = pg_catalog, mms_governance
as $$
begin
  raise exception 'immutable governance record';
end;
$$;

create table if not exists mms_governance.governance_documents (
  id uuid primary key default gen_random_uuid(),
  document_id text not null unique,
  title text not null,
  domain text not null check (domain in ('Master Control','Corporate Governance','Commercial Operations','Patient Administration','Partner Operations','Privacy & Data','Clinical Governance','Clinical Operations','Clinical Workforce','Facilities','Products & Suppliers','Diagnostics','Quality & Safety','Technology & AI','Content & Brand','Launch & Change','Finance')),
  owner_role text not null,
  approver_role text,
  version text not null,
  status text not null check (status in ('WORKING_DRAFT','REVIEW','APPROVED','EFFECTIVE','SUPERSEDED','RETIRED')),
  confidentiality text not null default 'Internal' check (confidentiality in ('Public','Internal','Restricted','Highly Restricted')),
  effective_at timestamptz,
  review_due_at timestamptz,
  supersedes_document_id text,
  evidence_location text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_governance.governance_decisions (
  id uuid primary key default gen_random_uuid(),
  decision_id text not null unique,
  subject text not null,
  domain text not null,
  decision text not null,
  status text not null check (status in ('APPROVED','APPROVED_WITH_CONDITIONS','DEFERRED','REJECTED','SUSPENDED','RETIRED')),
  authority_role text not null,
  rationale text not null,
  conditions jsonb not null default '[]'::jsonb,
  conflicts jsonb not null default '[]'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  effective_at timestamptz,
  review_due_at timestamptz,
  decided_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists mms_governance.risks (
  id uuid primary key default gen_random_uuid(),
  risk_id text not null unique,
  domain text not null check (domain in ('Clinical','Regulatory / Legal','Privacy / Data','Technology / Cybersecurity','Commercial / Operational','Financial','Reputational')),
  title text not null,
  risk_statement text not null,
  owner_role text not null,
  inherent_likelihood smallint not null check (inherent_likelihood between 1 and 5),
  inherent_impact smallint not null check (inherent_impact between 1 and 5),
  residual_likelihood smallint not null check (residual_likelihood between 1 and 5),
  residual_impact smallint not null check (residual_impact between 1 and 5),
  response text not null check (response in ('ACCEPT','REDUCE','AVOID','TRANSFER')),
  status text not null check (status in ('OPEN','MITIGATING','ACCEPTED','CLOSED')),
  action_summary text,
  action_due_at timestamptz,
  review_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_governance.controls (
  id uuid primary key default gen_random_uuid(),
  control_id text not null unique,
  domain text not null,
  name text not null,
  control_type text not null check (control_type in ('PREVENTIVE','DETECTIVE','CORRECTIVE')),
  owner_role text not null,
  operator_role text,
  frequency text not null,
  evidence_requirement text not null,
  automation_level text not null check (automation_level in ('MANUAL','SEMI_AUTOMATED','AUTOMATED')),
  system_name text,
  failure_threshold text,
  test_method text not null,
  effectiveness text not null default 'NOT_TESTED' check (effectiveness in ('EFFECTIVE','NEEDS_IMPROVEMENT','INEFFECTIVE','NOT_TESTED')),
  status text not null default 'ACTIVE' check (status in ('ACTIVE','WEAK','SUSPENDED','RETIRED')),
  last_tested_at timestamptz,
  next_test_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_governance.risk_control_links (
  risk_id uuid not null references mms_governance.risks(id) on delete restrict,
  control_id uuid not null references mms_governance.controls(id) on delete restrict,
  primary key (risk_id, control_id)
);

create table if not exists mms_governance.capa_actions (
  id uuid primary key default gen_random_uuid(),
  capa_id text not null unique,
  source_type text not null check (source_type in ('INCIDENT','AUDIT','COMPLAINT','CONTROL_TEST','RISK_REVIEW','SUPPLIER','OTHER')),
  source_reference text not null,
  finding text not null,
  severity text not null check (severity in ('CRITICAL','MAJOR','MODERATE','MINOR','OBSERVATION')),
  owner_role text not null,
  action text not null,
  status text not null check (status in ('OPEN','IN_PROGRESS','IMPLEMENTED','EFFECTIVENESS_REVIEW','CLOSED')),
  due_at timestamptz,
  implemented_at timestamptz,
  effectiveness_evidence text,
  verified_by_role text,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_governance.facilities (
  id uuid primary key default gen_random_uuid(),
  facility_id text not null unique,
  name text not null,
  jurisdiction text not null,
  legal_entity text,
  capability_level smallint not null check (capability_level between 1 and 4),
  medical_director_role text,
  status text not null check (status in ('PROPOSED','FIT_OUT','INSPECTION','APPROVED','ACTIVE','RESTRICTED','SUSPENDED','CLOSED')),
  emergency_readiness text not null default 'RED' check (emergency_readiness in ('GREEN','AMBER','RED')),
  approval_reference text,
  review_due_at timestamptz,
  restrictions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_governance.clinical_services (
  id uuid primary key default gen_random_uuid(),
  service_id text not null unique,
  service_name text not null,
  category text not null,
  jurisdiction text not null,
  risk_tier smallint not null check (risk_tier between 1 and 4),
  responsible_medical_director_role text,
  clinical_status text not null check (clinical_status in ('PROPOSED','CLINICAL_REVIEW','REGULATORY_REVIEW','OPERATIONAL_REVIEW','APPROVED','ACTIVE','SUSPENDED','RETIRED')),
  public_exposure_status text not null check (public_exposure_status in ('HIDDEN','INTERNAL_ONLY','PLANNED_PUBLIC','PUBLIC_AVAILABLE','REFERRAL_ONLY')),
  booking_enabled boolean not null default false,
  crm_enabled boolean not null default false,
  partner_enabled boolean not null default false,
  ling_enabled boolean not null default false,
  protocol_reference text,
  consent_document_reference text,
  facility_id uuid references mms_governance.facilities(id) on delete restrict,
  approval_reference text,
  effective_at timestamptz,
  review_due_at timestamptz,
  restrictions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    clinical_status = 'ACTIVE'
    or (booking_enabled = false and crm_enabled = false and partner_enabled = false and ling_enabled = false)
  ),
  check (
    public_exposure_status <> 'PUBLIC_AVAILABLE'
    or clinical_status = 'ACTIVE'
  )
);

create table if not exists mms_governance.clinician_credentials (
  id uuid primary key default gen_random_uuid(),
  clinician_id text not null,
  jurisdiction text not null,
  credential_type text not null,
  registration_reference text not null,
  status text not null check (status in ('PENDING_VERIFICATION','VALID','RESTRICTED','EXPIRED','SUSPENDED','REVOKED')),
  verified_by_role text,
  verified_at timestamptz,
  expires_at timestamptz,
  review_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (clinician_id,jurisdiction,credential_type,registration_reference)
);

create table if not exists mms_governance.clinician_privileges (
  id uuid primary key default gen_random_uuid(),
  privilege_id text not null unique,
  clinician_id text not null,
  service_id uuid not null references mms_governance.clinical_services(id) on delete restrict,
  facility_id uuid references mms_governance.facilities(id) on delete restrict,
  status text not null check (status in ('PROVISIONAL','SUPERVISED','ACTIVE','RESTRICTED','SUSPENDED','WITHDRAWN','EXPIRED')),
  supervision_requirement text,
  competency_evidence text,
  approver_role text not null,
  effective_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_governance.suppliers (
  id uuid primary key default gen_random_uuid(),
  supplier_id text not null unique,
  legal_name text not null,
  jurisdiction text,
  category text not null,
  quality_owner_role text,
  status text not null check (status in ('PROPOSED','UNDER_REVIEW','APPROVED','CONDITIONAL','SUSPENDED','DISQUALIFIED')),
  approval_reference text,
  review_due_at timestamptz,
  quality_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_governance.products (
  id uuid primary key default gen_random_uuid(),
  product_id text not null unique,
  product_name text not null,
  category text not null,
  supplier_id uuid references mms_governance.suppliers(id) on delete restrict,
  manufacturer text,
  jurisdiction text,
  intended_mms_use text,
  status text not null check (status in ('PROPOSED','QUALITY_REVIEW','CLINICAL_REVIEW','APPROVED','ACTIVE','QUARANTINED','SUSPENDED','RETIRED')),
  storage_requirements text,
  batch_traceability_required boolean not null default false,
  approval_reference text,
  review_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_governance.diagnostic_partners (
  id uuid primary key default gen_random_uuid(),
  partner_id text not null unique,
  legal_name text not null,
  partner_type text not null check (partner_type in ('LABORATORY','IMAGING','PATHOLOGY','GENETICS','OTHER')),
  jurisdiction text not null,
  licence_or_accreditation_reference text,
  critical_result_process_reference text,
  status text not null check (status in ('PROPOSED','DUE_DILIGENCE','APPROVED','CONDITIONAL','SUSPENDED','DISQUALIFIED')),
  approval_reference text,
  review_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_governance.ai_use_cases (
  id uuid primary key default gen_random_uuid(),
  use_case_id text not null unique,
  name text not null,
  domain text not null,
  intended_use text not null,
  prohibited_uses jsonb not null default '[]'::jsonb,
  data_classification text not null,
  human_review_required boolean not null default true,
  provider_name text,
  status text not null check (status in ('DRAFT','REVIEW','APPROVED','ACTIVE','RESTRICTED','SUSPENDED','RETIRED')),
  clinical_governance_required boolean not null default false,
  privacy_review_required boolean not null default true,
  approval_reference text,
  review_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_governance.launch_capabilities (
  id uuid primary key default gen_random_uuid(),
  capability_key text not null unique,
  capability_name text not null,
  owner_role text not null,
  readiness text not null check (readiness in ('RED','AMBER','GREEN','LIVE','SUSPENDED')),
  production_gate_enabled boolean not null default false,
  approval_reference text,
  blocker_summary text,
  rollback_reference text,
  monitoring_reference text,
  last_verified_at timestamptz,
  review_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (readiness <> 'LIVE' or (production_gate_enabled and approval_reference is not null))
);

create table if not exists mms_governance.change_requests (
  id uuid primary key default gen_random_uuid(),
  change_id text not null unique,
  title text not null,
  domain text not null,
  owner_role text not null,
  impact_summary text not null,
  status text not null check (status in ('PROPOSED','IMPACT_ASSESSMENT','APPROVED','IMPLEMENTED','VERIFIED','CLOSED','REJECTED')),
  approver_role text,
  approval_reference text,
  rollback_plan text,
  implemented_at timestamptz,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_governance.audits (
  id uuid primary key default gen_random_uuid(),
  audit_id text not null unique,
  domain text not null,
  scope text not null,
  owner_role text not null,
  status text not null check (status in ('PLANNED','IN_PROGRESS','REPORTING','COMPLETE','CANCELLED')),
  overall_rating text check (overall_rating in ('COMPLIANT','PARTIALLY_COMPLIANT','NON_COMPLIANT','NOT_APPLICABLE')),
  started_at timestamptz,
  completed_at timestamptz,
  report_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_governance.incidents (
  id uuid primary key default gen_random_uuid(),
  incident_id text not null unique,
  incident_type text not null,
  domain text not null,
  severity text not null check (severity in ('P1','P2','P3','P4','CLINICAL_SAFETY')),
  summary text not null,
  owner_role text not null,
  status text not null check (status in ('OPEN','CONTAINED','INVESTIGATING','RECOVERED','REVIEW','CLOSED')),
  detected_at timestamptz not null,
  contained_at timestamptz,
  resolved_at timestamptz,
  root_cause text,
  capa_required boolean not null default false,
  external_reporting_state text not null default 'NOT_ASSESSED' check (external_reporting_state in ('NOT_ASSESSED','NOT_REQUIRED','REQUIRED','SUBMITTED','COMPLETE')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_governance.training_records (
  id uuid primary key default gen_random_uuid(),
  training_record_id text not null unique,
  subject_id text not null,
  role_name text not null,
  module_name text not null,
  module_version text not null,
  competency_method text,
  status text not null check (status in ('NOT_STARTED','IN_PROGRESS','SUPERVISED_PRACTICE','COMPETENT','COMPETENT_WITH_CONDITIONS','EXPIRED','SUSPENDED')),
  assessor_role text,
  completed_at timestamptz,
  expires_at timestamptz,
  conditions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_governance.governance_audit_events (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  actor_id text not null,
  actor_role text not null,
  reason text,
  previous_state jsonb,
  new_state jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists governance_documents_review_idx on mms_governance.governance_documents(status,review_due_at);
create index if not exists risks_status_review_idx on mms_governance.risks(status,review_due_at);
create index if not exists controls_effectiveness_test_idx on mms_governance.controls(effectiveness,next_test_due_at);
create index if not exists capa_status_due_idx on mms_governance.capa_actions(status,due_at);
create index if not exists clinical_services_status_idx on mms_governance.clinical_services(clinical_status,public_exposure_status);
create index if not exists clinician_credentials_expiry_idx on mms_governance.clinician_credentials(status,expires_at);
create index if not exists clinician_privileges_expiry_idx on mms_governance.clinician_privileges(status,expires_at);
create index if not exists facilities_status_review_idx on mms_governance.facilities(status,review_due_at);
create index if not exists suppliers_status_review_idx on mms_governance.suppliers(status,review_due_at);
create index if not exists products_status_review_idx on mms_governance.products(status,review_due_at);
create index if not exists diagnostic_partners_status_review_idx on mms_governance.diagnostic_partners(status,review_due_at);
create index if not exists ai_use_cases_status_review_idx on mms_governance.ai_use_cases(status,review_due_at);
create index if not exists launch_capabilities_readiness_idx on mms_governance.launch_capabilities(readiness,review_due_at);
create index if not exists incidents_status_time_idx on mms_governance.incidents(status,detected_at desc);
create index if not exists audit_events_entity_time_idx on mms_governance.governance_audit_events(entity_type,entity_id,occurred_at);

do $$
declare
  t text;
begin
  foreach t in array array[
    'governance_documents','risks','controls','capa_actions','facilities','clinical_services',
    'clinician_credentials','clinician_privileges','suppliers','products','diagnostic_partners',
    'ai_use_cases','launch_capabilities','change_requests','audits','incidents','training_records'
  ]
  loop
    execute format('drop trigger if exists %I_touch_updated_at on mms_governance.%I', t, t);
    execute format('create trigger %I_touch_updated_at before update on mms_governance.%I for each row execute function mms_governance.touch_updated_at()', t, t);
  end loop;
end $$;

drop trigger if exists governance_decisions_immutable on mms_governance.governance_decisions;
create trigger governance_decisions_immutable
  before update or delete on mms_governance.governance_decisions
  for each row execute function mms_governance.reject_immutable_mutation();

drop trigger if exists governance_audit_events_immutable on mms_governance.governance_audit_events;
create trigger governance_audit_events_immutable
  before update or delete on mms_governance.governance_audit_events
  for each row execute function mms_governance.reject_immutable_mutation();

do $$
declare
  t text;
begin
  foreach t in array array[
    'governance_documents','governance_decisions','risks','controls','risk_control_links','capa_actions',
    'facilities','clinical_services','clinician_credentials','clinician_privileges','suppliers','products',
    'diagnostic_partners','ai_use_cases','launch_capabilities','change_requests','audits','incidents',
    'training_records','governance_audit_events'
  ]
  loop
    execute format('alter table mms_governance.%I enable row level security', t);
    execute format('alter table mms_governance.%I force row level security', t);
    execute format('revoke all on table mms_governance.%I from public, anon, authenticated', t);
  end loop;
end $$;

revoke all on function mms_governance.touch_updated_at() from public, anon, authenticated;
revoke all on function mms_governance.reject_immutable_mutation() from public, anon, authenticated;

insert into mms_governance.governance_documents (
  document_id,title,domain,owner_role,version,status,confidentiality,evidence_location,notes
) values (
  'MMS-GOV-FRM-001',
  'MMS Master Operating System v1.0',
  'Master Control',
  'Management',
  '1.0-WD',
  'WORKING_DRAFT',
  'Internal',
  'docs/MMS_MASTER_OPERATING_SYSTEM_V1.md',
  'Master architecture implemented in repository. No Production or clinical activation authority.'
)
on conflict (document_id) do nothing;

insert into mms_governance.launch_capabilities (capability_key,capability_name,owner_role,readiness,production_gate_enabled,blocker_summary)
values
  ('public_informational_site','Public informational site','Operations','LIVE',true,'Controlled informational launch only; operational/clinical features remain gated.'),
  ('zoho_crm','Zoho CRM','Commercial Operations','AMBER',false,'Live tenant credentials/mapping and Preview E2E closure required.'),
  ('clinic_manager_queue','Clinic Manager Queue','Operations','AMBER',false,'Authenticated operator pilot and Production approval required.'),
  ('management_intelligence','Management Intelligence','Management','AMBER',false,'Production data-source and access approval required.'),
  ('ai_operations','AI Operations','Technology / Operations','AMBER',false,'Provider/privacy/use-case approvals required.'),
  ('ling','Ling public concierge','Technology / Clinical Governance','AMBER',false,'Approved corpus and governance approval required.'),
  ('booking_persistence','Booking persistence','Operations','RED',false,'Production persistence/owner/failure-handling approval required.'),
  ('my_sanctuary','My Sanctuary','Patient Operations','RED',false,'Production patient-auth and operational readiness required.'),
  ('partner_hub','Partner Hub','Partner Operations','RED',false,'Production Partner auth/provisioning and approval required.'),
  ('online_doctor','Online Doctor','Clinical Governance','RED',false,'Jurisdiction, clinician, privacy and telemedicine approval required.')
on conflict (capability_key) do nothing;

commit;
