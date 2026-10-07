-- T6.41 consent, authorization and withdrawal governance.
-- Preview/integration only until separately approved for Production.
-- Governance metadata only; no real consent is created by this migration.

begin;

create table if not exists mms_governance.consent_authorizations (
  id uuid primary key default gen_random_uuid(),
  consent_id text not null unique,
  subject_reference text not null,
  consent_type text not null check (consent_type in (
    'TREATMENT',
    'DATA_PROCESSING',
    'MARKETING',
    'COMMUNICATIONS',
    'RESEARCH',
    'IMAGE_MEDIA',
    'THIRD_PARTY_SHARING',
    'OTHER'
  )),
  jurisdiction text not null,
  service_id uuid references mms_governance.clinical_services(id) on delete restrict,
  document_reference text not null,
  document_version text not null,
  scope_summary text not null,
  status text not null check (status in (
    'DRAFT',
    'PENDING',
    'ACTIVE',
    'WITHDRAWN',
    'EXPIRED',
    'REVOKED',
    'SUPERSEDED'
  )),
  capture_method text,
  captured_by_role text,
  granted_at timestamptz,
  evidence_id uuid references mms_governance.evidence_artifacts(id) on delete restrict,
  expires_at timestamptz,
  withdrawal_reference text,
  withdrawn_at timestamptz,
  withdrawal_effective_scope text,
  revocation_reference text,
  revoked_at timestamptz,
  supersedes_consent_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    status <> 'ACTIVE'
    or (
      capture_method is not null
      and captured_by_role is not null
      and granted_at is not null
      and evidence_id is not null
    )
  ),
  check (
    status <> 'WITHDRAWN'
    or (
      withdrawal_reference is not null
      and withdrawn_at is not null
      and withdrawal_effective_scope is not null
    )
  ),
  check (
    status <> 'REVOKED'
    or (
      revocation_reference is not null
      and revoked_at is not null
    )
  ),
  check (
    expires_at is null
    or granted_at is null
    or expires_at > granted_at
  )
);

create index if not exists consent_authorizations_subject_idx
  on mms_governance.consent_authorizations(subject_reference,consent_type,created_at desc);

create index if not exists consent_authorizations_status_idx
  on mms_governance.consent_authorizations(status,expires_at);

drop trigger if exists consent_authorizations_touch_updated_at on mms_governance.consent_authorizations;
create trigger consent_authorizations_touch_updated_at
  before update on mms_governance.consent_authorizations
  for each row execute function mms_governance.touch_updated_at();

alter table mms_governance.consent_authorizations enable row level security;
alter table mms_governance.consent_authorizations force row level security;
revoke all on table mms_governance.consent_authorizations from public, anon, authenticated;

create table if not exists mms_governance.consent_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  consent_authorization_id uuid not null references mms_governance.consent_authorizations(id) on delete restrict,
  event_type text not null check (event_type in (
    'PRESENTED',
    'GRANTED',
    'DECLINED',
    'WITHDRAWN',
    'EXPIRED',
    'REVOKED',
    'SUPERSEDED',
    'SCOPE_REVIEWED',
    'OTHER'
  )),
  event_summary text not null,
  actor_role text not null,
  occurred_at timestamptz not null,
  evidence_id uuid references mms_governance.evidence_artifacts(id) on delete restrict,
  notes text,
  created_at timestamptz not null default now(),
  check (
    event_type in ('PRESENTED','SCOPE_REVIEWED','OTHER')
    or evidence_id is not null
  )
);

create index if not exists consent_events_consent_idx
  on mms_governance.consent_events(consent_authorization_id,occurred_at desc);

drop trigger if exists consent_events_immutable on mms_governance.consent_events;
create trigger consent_events_immutable
  before update or delete on mms_governance.consent_events
  for each row execute function mms_governance.reject_immutable_mutation();

alter table mms_governance.consent_events enable row level security;
alter table mms_governance.consent_events force row level security;
revoke all on table mms_governance.consent_events from public, anon, authenticated;

commit;
