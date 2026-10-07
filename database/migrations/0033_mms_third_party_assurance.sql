-- T6.28 generic third-party/vendor assurance governance.
-- Preview/integration only until separately approved for Production.
-- Contains governance metadata only; patient clinical records are prohibited.

begin;

create table if not exists mms_governance.third_party_assessments (
  id uuid primary key default gen_random_uuid(),
  third_party_id text not null unique,
  legal_name text not null,
  category text not null check (category in (
    'INFRASTRUCTURE_CLOUD',
    'SAAS_APPLICATION',
    'CRM',
    'PAYMENTS',
    'DATA_PROCESSOR',
    'AI_MODEL_PROVIDER',
    'CLINICAL_SUPPLIER',
    'DIAGNOSTIC_PARTNER',
    'PROFESSIONAL_SERVICE',
    'OTHER'
  )),
  jurisdiction text,
  criticality text not null check (criticality in ('LOW','MODERATE','HIGH','CRITICAL')),
  data_access_class text not null check (data_access_class in ('NONE','BUSINESS','PERSONAL','SENSITIVE','CLINICAL')),
  status text not null check (status in (
    'PROPOSED','DUE_DILIGENCE','APPROVED','CONDITIONAL','SUSPENDED','DISQUALIFIED','EXITING','TERMINATED'
  )),
  owner_role text not null,
  due_diligence_reference text,
  contract_reference text,
  privacy_terms_reference text,
  security_assurance_reference text,
  continuity_reference text,
  subprocessor_reference text,
  exit_plan_reference text,
  approval_reference text,
  assessed_at timestamptz,
  review_due_at timestamptz,
  restrictions jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    status not in ('APPROVED','CONDITIONAL')
    or (
      due_diligence_reference is not null
      and approval_reference is not null
      and assessed_at is not null
    )
  ),
  check (
    status not in ('APPROVED','CONDITIONAL')
    or criticality <> 'CRITICAL'
    or (continuity_reference is not null and exit_plan_reference is not null)
  ),
  check (
    status not in ('APPROVED','CONDITIONAL')
    or data_access_class not in ('SENSITIVE','CLINICAL')
    or privacy_terms_reference is not null
  )
);

create index if not exists third_party_assessments_status_review_idx
  on mms_governance.third_party_assessments(status, review_due_at);

create index if not exists third_party_assessments_criticality_idx
  on mms_governance.third_party_assessments(criticality, data_access_class);

drop trigger if exists third_party_assessments_touch_updated_at on mms_governance.third_party_assessments;
create trigger third_party_assessments_touch_updated_at
  before update on mms_governance.third_party_assessments
  for each row execute function mms_governance.touch_updated_at();

alter table mms_governance.third_party_assessments enable row level security;
alter table mms_governance.third_party_assessments force row level security;
revoke all on table mms_governance.third_party_assessments from public, anon, authenticated;

commit;
