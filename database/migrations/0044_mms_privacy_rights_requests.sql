-- T6.40 privacy-rights request intake, assessment and evidence governance.
-- Preview/integration only until separately approved for Production.
-- Governance metadata only; no privacy right is asserted to apply universally by this migration.

begin;

create table if not exists mms_governance.privacy_rights_requests (
  id uuid primary key default gen_random_uuid(),
  request_id text not null unique,
  request_type text not null check (request_type in (
    'ACCESS',
    'CORRECTION',
    'DELETION_OR_ERASURE',
    'WITHDRAWAL',
    'OBJECTION',
    'RESTRICTION',
    'PORTABILITY',
    'COMPLAINT',
    'OTHER'
  )),
  jurisdiction text not null,
  subject_reference text not null,
  source_channel text not null check (source_channel in (
    'WEB',
    'EMAIL',
    'PHONE',
    'IN_PERSON',
    'INTERNAL',
    'OTHER'
  )),
  owner_role text not null,
  status text not null check (status in (
    'RECEIVED',
    'IDENTITY_VERIFICATION',
    'UNDER_REVIEW',
    'ACTION_REQUIRED',
    'PARTIALLY_FULFILLED',
    'FULFILLED',
    'DENIED',
    'CLOSED'
  )),
  received_at timestamptz not null,
  identity_verified_at timestamptz,
  identity_verification_reference text,
  jurisdiction_assessment_reference text,
  legal_hold_state text not null default 'UNKNOWN'
    check (legal_hold_state in ('UNKNOWN','CLEAR','HELD','NOT_APPLICABLE')),
  retention_assessment_reference text,
  decision_reference text,
  response_reference text,
  completed_at timestamptz,
  denial_or_limitation_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    status in ('RECEIVED','IDENTITY_VERIFICATION')
    or (
      identity_verified_at is not null
      and identity_verification_reference is not null
      and jurisdiction_assessment_reference is not null
    )
  ),
  check (
    status not in ('PARTIALLY_FULFILLED','FULFILLED','DENIED','CLOSED')
    or (
      decision_reference is not null
      and response_reference is not null
      and completed_at is not null
    )
  ),
  check (
    status <> 'DENIED'
    or denial_or_limitation_reason is not null
  ),
  check (
    request_type <> 'DELETION_OR_ERASURE'
    or status <> 'FULFILLED'
    or (
      legal_hold_state = 'CLEAR'
      and retention_assessment_reference is not null
    )
  )
);

create index if not exists privacy_rights_requests_status_received_idx
  on mms_governance.privacy_rights_requests(status,received_at desc);

create index if not exists privacy_rights_requests_subject_idx
  on mms_governance.privacy_rights_requests(subject_reference,received_at desc);

drop trigger if exists privacy_rights_requests_touch_updated_at on mms_governance.privacy_rights_requests;
create trigger privacy_rights_requests_touch_updated_at
  before update on mms_governance.privacy_rights_requests
  for each row execute function mms_governance.touch_updated_at();

alter table mms_governance.privacy_rights_requests enable row level security;
alter table mms_governance.privacy_rights_requests force row level security;
revoke all on table mms_governance.privacy_rights_requests from public, anon, authenticated;

create table if not exists mms_governance.privacy_rights_request_actions (
  id uuid primary key default gen_random_uuid(),
  action_id text not null unique,
  privacy_request_id uuid not null references mms_governance.privacy_rights_requests(id) on delete restrict,
  action_type text not null check (action_type in (
    'IDENTITY_VERIFIED',
    'SCOPE_ASSESSED',
    'SEARCH_COMPLETED',
    'CORRECTION_APPLIED',
    'EXPORT_PREPARED',
    'DELETION_OR_ANONYMISATION_EXECUTED',
    'RESTRICTION_APPLIED',
    'WITHDRAWAL_RECORDED',
    'RESPONSE_SENT',
    'DENIAL_RECORDED',
    'OTHER'
  )),
  action_summary text not null,
  actor_role text not null,
  occurred_at timestamptz not null,
  evidence_id uuid references mms_governance.evidence_artifacts(id) on delete restrict,
  notes text,
  created_at timestamptz not null default now(),
  check (
    action_type not in (
      'CORRECTION_APPLIED',
      'EXPORT_PREPARED',
      'DELETION_OR_ANONYMISATION_EXECUTED',
      'RESTRICTION_APPLIED',
      'WITHDRAWAL_RECORDED',
      'RESPONSE_SENT',
      'DENIAL_RECORDED'
    )
    or evidence_id is not null
  )
);

create index if not exists privacy_rights_actions_request_idx
  on mms_governance.privacy_rights_request_actions(privacy_request_id,occurred_at desc);

drop trigger if exists privacy_rights_request_actions_immutable on mms_governance.privacy_rights_request_actions;
create trigger privacy_rights_request_actions_immutable
  before update or delete on mms_governance.privacy_rights_request_actions
  for each row execute function mms_governance.reject_immutable_mutation();

alter table mms_governance.privacy_rights_request_actions enable row level security;
alter table mms_governance.privacy_rights_request_actions force row level security;
revoke all on table mms_governance.privacy_rights_request_actions from public, anon, authenticated;

commit;
