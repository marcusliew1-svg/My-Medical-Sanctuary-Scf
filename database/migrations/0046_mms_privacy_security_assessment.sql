-- T6.42 privacy/security breach assessment and notification-decision governance.
-- Preview/integration only until separately approved for Production.
-- Governance metadata only; no breach or notification duty is asserted by this migration.

begin;

create table if not exists mms_governance.privacy_security_assessments (
  id uuid primary key default gen_random_uuid(),
  assessment_id text not null unique,
  incident_id uuid not null references mms_governance.incidents(id) on delete restrict,
  jurisdiction text not null,
  assessment_type text not null check (assessment_type in (
    'POTENTIAL_PRIVACY_EVENT',
    'POTENTIAL_SECURITY_EVENT',
    'POTENTIAL_PERSONAL_DATA_BREACH',
    'CONFIDENTIALITY_EVENT',
    'INTEGRITY_EVENT',
    'AVAILABILITY_EVENT',
    'OTHER'
  )),
  affected_data_classes jsonb not null default '[]'::jsonb,
  affected_subject_count_estimate integer check (affected_subject_count_estimate is null or affected_subject_count_estimate >= 0),
  exposure_scope text,
  risk_to_individuals text not null default 'NOT_ASSESSED'
    check (risk_to_individuals in ('NOT_ASSESSED','LOW','MODERATE','HIGH','UNKNOWN')),
  notification_assessment_state text not null default 'NOT_ASSESSED'
    check (notification_assessment_state in ('NOT_ASSESSED','REQUIRED','NOT_REQUIRED','PENDING_AUTHORITY_REVIEW','UNKNOWN')),
  authority_notification_state text not null default 'NOT_ASSESSED'
    check (authority_notification_state in ('NOT_ASSESSED','NOT_REQUIRED','PENDING','COMPLETED','BLOCKED')),
  subject_notification_state text not null default 'NOT_ASSESSED'
    check (subject_notification_state in ('NOT_ASSESSED','NOT_REQUIRED','PENDING','COMPLETED','BLOCKED')),
  legal_privacy_review_reference text,
  decision_reference text,
  authority_notification_reference text,
  subject_notification_reference text,
  evidence_id uuid references mms_governance.evidence_artifacts(id) on delete restrict,
  owner_role text not null,
  assessed_at timestamptz not null,
  notes text,
  created_at timestamptz not null default now(),
  check (
    notification_assessment_state = 'NOT_ASSESSED'
    or (
      legal_privacy_review_reference is not null
      and decision_reference is not null
      and evidence_id is not null
    )
  ),
  check (
    authority_notification_state <> 'COMPLETED'
    or authority_notification_reference is not null
  ),
  check (
    subject_notification_state <> 'COMPLETED'
    or subject_notification_reference is not null
  )
);

create index if not exists privacy_security_assessments_incident_idx
  on mms_governance.privacy_security_assessments(incident_id,assessed_at desc);

drop trigger if exists privacy_security_assessments_immutable on mms_governance.privacy_security_assessments;
create trigger privacy_security_assessments_immutable
  before update or delete on mms_governance.privacy_security_assessments
  for each row execute function mms_governance.reject_immutable_mutation();

alter table mms_governance.privacy_security_assessments enable row level security;
alter table mms_governance.privacy_security_assessments force row level security;
revoke all on table mms_governance.privacy_security_assessments from public, anon, authenticated;

commit;
