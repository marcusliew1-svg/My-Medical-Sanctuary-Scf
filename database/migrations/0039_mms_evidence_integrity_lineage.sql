-- T6.35 records integrity, evidence lineage and tamper-evidence governance.
-- Preview/integration only until separately approved for Production.
-- Stores evidence metadata only; patient/clinical content must not be copied into this register.

begin;

create table if not exists mms_governance.evidence_artifacts (
  id uuid primary key default gen_random_uuid(),
  evidence_id text not null unique,
  evidence_type text not null check (evidence_type in (
    'DOCUMENT',
    'SCREENSHOT',
    'EXPORT',
    'REPORT',
    'LOG_EXTRACT',
    'DATABASE_QUERY_RESULT',
    'APPROVAL_RECORD',
    'TEST_RESULT',
    'OTHER'
  )),
  subject_type text not null,
  subject_reference text not null,
  source_system text not null,
  source_reference text not null,
  storage_location text not null,
  content_digest_sha256 text not null
    check (content_digest_sha256 ~ '^[0-9a-f]{64}$'),
  captured_by_role text not null,
  captured_at timestamptz not null,
  verified_by_role text,
  verified_at timestamptz,
  verification_method text,
  confidentiality text not null default 'INTERNAL'
    check (confidentiality in ('PUBLIC','INTERNAL','RESTRICTED','HIGHLY_RESTRICTED')),
  notes text,
  created_at timestamptz not null default now(),
  check (
    verified_at is null
    or (verified_by_role is not null and verification_method is not null)
  )
);

create index if not exists evidence_artifacts_subject_idx
  on mms_governance.evidence_artifacts(subject_type,subject_reference,captured_at desc);

create index if not exists evidence_artifacts_digest_idx
  on mms_governance.evidence_artifacts(content_digest_sha256);

drop trigger if exists evidence_artifacts_immutable on mms_governance.evidence_artifacts;
create trigger evidence_artifacts_immutable
  before update or delete on mms_governance.evidence_artifacts
  for each row execute function mms_governance.reject_immutable_mutation();

alter table mms_governance.evidence_artifacts enable row level security;
alter table mms_governance.evidence_artifacts force row level security;
revoke all on table mms_governance.evidence_artifacts from public, anon, authenticated;

alter table mms_governance.governance_audit_events
  add column if not exists evidence_id uuid references mms_governance.evidence_artifacts(id) on delete restrict;

create index if not exists governance_audit_events_evidence_idx
  on mms_governance.governance_audit_events(evidence_id);

commit;
