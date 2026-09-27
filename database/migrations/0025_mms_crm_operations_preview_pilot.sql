-- MMS CRM + AI Operations Preview pilot.
-- Apply only to the dedicated non-production MMS commercial database.
-- This migration accepts synthetic administrative data only and contains no
-- diagnosis, medication, results, clinical notes or treatment-suitability fields.

begin;

create table if not exists mms_commercial.crm_idempotency_reservations (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope = 'synthetic_crm_enquiry'),
  key_hash text not null,
  request_fingerprint text not null,
  state text not null check (state in ('Reserved','Completed','Failed')),
  enquiry_id uuid,
  reserved_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (scope,key_hash)
);

create table if not exists mms_commercial.crm_enquiries (
  id uuid primary key default gen_random_uuid(),
  public_enquiry_id text not null unique default ('MMSE-' || replace(gen_random_uuid()::text,'-','')),
  idempotency_reservation_id uuid not null unique references mms_commercial.crm_idempotency_reservations(id) on delete restrict,
  data_classification text not null default 'Synthetic Preview' check (data_classification = 'Synthetic Preview'),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email_normalized text,
  phone_normalized text,
  country text,
  preferred_location text,
  preferred_language text,
  source text not null,
  campaign text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referral_code text,
  partner_id text,
  landing_page text,
  broad_interest_category text,
  programme_interest text,
  treatment_information_interest text,
  preferred_contact_channel text,
  preferred_contact_time text,
  lead_status text not null check (lead_status in (
    'New Enquiry','Contact Attempted','Contacted','Qualified','Consultation Requested',
    'Consultation Scheduled','Consultation Completed','Programme Proposed','Decision Pending',
    'Converted','Not Proceeding','Duplicate','Spam','Unreachable','Follow Up Later','Do Not Contact'
  )),
  contact_consent_at timestamptz not null,
  contact_consent_version text not null,
  marketing_consent boolean not null default false,
  source_consent_evidence text not null,
  do_not_contact boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (email_normalized is not null or phone_normalized is not null),
  check (partner_id is null or partner_id ~ '^SYNTH-[A-Z0-9_-]{3,80}$')
);

alter table mms_commercial.crm_idempotency_reservations
  drop constraint if exists crm_idempotency_reservations_enquiry_id_fkey;
alter table mms_commercial.crm_idempotency_reservations
  add constraint crm_idempotency_reservations_enquiry_id_fkey
  foreign key (enquiry_id) references mms_commercial.crm_enquiries(id) on delete restrict;

create table if not exists mms_commercial.crm_sync_state (
  enquiry_id uuid primary key references mms_commercial.crm_enquiries(id) on delete restrict,
  provider text not null check (provider in ('Synthetic Adapter','Zoho Preview')),
  sync_status text not null check (sync_status in ('Pending','In Progress','Synced','Retry Due','Permanent Failure')),
  provider_record_id text,
  attempt_count integer not null default 0 check (attempt_count between 0 and 20),
  next_retry_at timestamptz,
  last_error_class text check (last_error_class in ('Transient','Permanent')),
  last_error_code text,
  last_attempt_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists mms_commercial.crm_queue_state (
  enquiry_id uuid primary key references mms_commercial.crm_enquiries(id) on delete restrict,
  queue_state text not null check (queue_state in ('New','Awaiting Contact','Follow-Up Due','Consultation Requested','Scheduled','Escalated','Completed')),
  assigned_owner_id text,
  next_action text,
  next_action_due_at timestamptz,
  first_response_at timestamptz,
  escalated boolean not null default false,
  closed_reason text,
  version integer not null default 1 check (version > 0),
  updated_at timestamptz not null default now()
);

create table if not exists mms_commercial.crm_audit_events (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references mms_commercial.crm_enquiries(id) on delete restrict,
  event_type text not null,
  actor_id text not null,
  actor_type text not null check (actor_type in ('Operator','System')),
  previous_state jsonb,
  new_state jsonb,
  reason text,
  suggestion_source text not null check (suggestion_source in ('Human','AI Advisory','System')),
  human_approved boolean not null,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (suggestion_source <> 'AI Advisory' or human_approved)
);

create index if not exists crm_enquiries_queue_created_idx on mms_commercial.crm_enquiries(lead_status,created_at desc);
create index if not exists crm_enquiries_email_idx on mms_commercial.crm_enquiries(email_normalized) where email_normalized is not null;
create index if not exists crm_enquiries_phone_idx on mms_commercial.crm_enquiries(phone_normalized) where phone_normalized is not null;
create index if not exists crm_enquiries_partner_idx on mms_commercial.crm_enquiries(partner_id) where partner_id is not null;
create index if not exists crm_queue_due_idx on mms_commercial.crm_queue_state(next_action_due_at) where queue_state <> 'Completed';
create index if not exists crm_audit_enquiry_time_idx on mms_commercial.crm_audit_events(enquiry_id,occurred_at);
create index if not exists crm_idempotency_enquiry_idx on mms_commercial.crm_idempotency_reservations(enquiry_id) where enquiry_id is not null;

create trigger crm_audit_events_immutable
  before update or delete on mms_commercial.crm_audit_events
  for each row execute function mms_commercial.reject_immutable_mutation();

create trigger crm_enquiries_touch_updated_at
  before update on mms_commercial.crm_enquiries
  for each row execute function mms_commercial.touch_updated_at();

create trigger crm_queue_state_touch_updated_at
  before update on mms_commercial.crm_queue_state
  for each row execute function mms_commercial.touch_updated_at();

create trigger crm_sync_state_touch_updated_at
  before update on mms_commercial.crm_sync_state
  for each row execute function mms_commercial.touch_updated_at();

alter table mms_commercial.crm_idempotency_reservations enable row level security;
alter table mms_commercial.crm_idempotency_reservations force row level security;
alter table mms_commercial.crm_enquiries enable row level security;
alter table mms_commercial.crm_enquiries force row level security;
alter table mms_commercial.crm_sync_state enable row level security;
alter table mms_commercial.crm_sync_state force row level security;
alter table mms_commercial.crm_queue_state enable row level security;
alter table mms_commercial.crm_queue_state force row level security;
alter table mms_commercial.crm_audit_events enable row level security;
alter table mms_commercial.crm_audit_events force row level security;

revoke all on table
  mms_commercial.crm_idempotency_reservations,
  mms_commercial.crm_enquiries,
  mms_commercial.crm_sync_state,
  mms_commercial.crm_queue_state,
  mms_commercial.crm_audit_events
from public,anon,authenticated;

insert into mms_commercial.schema_migrations(migration_key,notes)
values ('0025_mms_crm_operations_preview_pilot.sql','Synthetic-only CRM persistence, queue, sync state, atomic idempotency reservation and immutable audit foundation.')
on conflict (migration_key) do nothing;

commit;
