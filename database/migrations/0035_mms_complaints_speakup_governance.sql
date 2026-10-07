-- T6.31 complaints, concerns and speak-up governance.
-- Preview/integration only until separately approved for Production.
-- Governance metadata only; patient clinical records are prohibited.

begin;

create table if not exists mms_governance.complaints_and_concerns (
  id uuid primary key default gen_random_uuid(),
  case_id text not null unique,
  case_type text not null check (case_type in (
    'CUSTOMER_COMPLAINT',
    'PARTNER_COMPLAINT',
    'WORKFORCE_CONCERN',
    'PRIVACY_CONCERN',
    'SECURITY_CONCERN',
    'CLINICAL_SAFETY_CONCERN',
    'SPEAK_UP',
    'OTHER'
  )),
  source_channel text not null check (source_channel in (
    'WEB',
    'EMAIL',
    'PHONE',
    'IN_PERSON',
    'INTERNAL',
    'OTHER'
  )),
  confidentiality text not null default 'RESTRICTED' check (confidentiality in ('INTERNAL','RESTRICTED','HIGHLY_RESTRICTED')),
  severity text not null check (severity in ('CRITICAL','MAJOR','MODERATE','MINOR')),
  summary text not null,
  owner_role text not null,
  status text not null check (status in (
    'OPEN',
    'TRIAGED',
    'INVESTIGATING',
    'ACTION_REQUIRED',
    'RESPONSE_PREPARED',
    'RESOLVED',
    'CLOSED'
  )),
  received_at timestamptz not null,
  acknowledged_at timestamptz,
  triaged_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz,
  response_reference text,
  evidence_reference text,
  capa_reference text,
  incident_reference text,
  regulator_assessment_state text not null default 'NOT_ASSESSED'
    check (regulator_assessment_state in ('NOT_ASSESSED','NOT_REQUIRED','REQUIRED','SUBMITTED','COMPLETE')),
  non_retaliation_reviewed boolean not null default false,
  complainant_notified boolean not null default false,
  anonymous_or_confidential_source boolean not null default false,
  resolution_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    status not in ('RESOLVED','CLOSED')
    or (
      resolution_summary is not null
      and evidence_reference is not null
      and resolved_at is not null
    )
  ),
  check (
    status <> 'CLOSED'
    or (
      closed_at is not null
      and regulator_assessment_state <> 'NOT_ASSESSED'
    )
  )
);

create index if not exists complaints_concerns_status_received_idx
  on mms_governance.complaints_and_concerns(status,received_at desc);

create index if not exists complaints_concerns_type_severity_idx
  on mms_governance.complaints_and_concerns(case_type,severity);

drop trigger if exists complaints_and_concerns_touch_updated_at on mms_governance.complaints_and_concerns;
create trigger complaints_and_concerns_touch_updated_at
  before update on mms_governance.complaints_and_concerns
  for each row execute function mms_governance.touch_updated_at();

alter table mms_governance.complaints_and_concerns enable row level security;
alter table mms_governance.complaints_and_concerns force row level security;
revoke all on table mms_governance.complaints_and_concerns from public, anon, authenticated;

commit;
