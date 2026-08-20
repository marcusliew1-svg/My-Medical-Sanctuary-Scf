-- MMS transactional commercial database foundation
-- Commercial data only. Never store diagnosis, treatment recommendations, test
-- results, medications, imaging, clinician notes or other clinical information here.
-- PostgreSQL 15+ compatible. Apply only to a dedicated MMS commercial database.

begin;

create extension if not exists pgcrypto;
create schema if not exists mms_commercial;

revoke all on schema mms_commercial from public;

create sequence if not exists mms_commercial.partner_code_seq start with 1001;

create table if not exists mms_commercial.partners (
  id uuid primary key default gen_random_uuid(),
  partner_code text unique,
  crm_record_id text unique,
  stage text not null check (stage in ('Applicant','Under Review','Approved','Agreement Pending','Training','Active','Suspended','Inactive','Rejected')),
  level text check (level in ('Associate','Senior','Elite','Chairman')),
  introducer_partner_code text,
  territory text,
  selling_enabled boolean not null default false,
  crm_access_enabled boolean not null default false,
  agreement_version text,
  agreement_accepted_at timestamptz,
  agreement_accepted_ip inet,
  compliance_version text,
  compliance_acknowledged_at timestamptz,
  compliance_acknowledged_ip inet,
  activated_at timestamptz,
  suspended_at timestamptz,
  inactive_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint partner_code_format check (partner_code is null or partner_code ~ '^MMSP-[0-9]{4,}$'),
  constraint introducer_code_format check (introducer_partner_code is null or introducer_partner_code ~ '^MMSP-[0-9]{4,}$')
);

create unique index if not exists partners_partner_code_ci on mms_commercial.partners (upper(partner_code)) where partner_code is not null;

create or replace function mms_commercial.allocate_partner_code()
returns text
language plpgsql
security definer
set search_path = mms_commercial, pg_temp
as $$
declare
  next_value bigint;
begin
  next_value := nextval('mms_commercial.partner_code_seq');
  return 'MMSP-' || next_value::text;
end;
$$;

create table if not exists mms_commercial.partner_audit_events (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references mms_commercial.partners(id) on delete restrict,
  event_type text not null,
  previous_state jsonb,
  next_state jsonb,
  actor text not null,
  reason text,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists mms_commercial.partner_training_evidence (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references mms_commercial.partners(id) on delete restrict,
  module_id text not null,
  bundle_version text not null,
  module_version text not null,
  completed_at timestamptz not null,
  acknowledged_at timestamptz not null,
  acknowledged_ip inet,
  passed boolean,
  refresh_required boolean not null default false,
  created_at timestamptz not null default now(),
  unique (partner_id, module_id, module_version, completed_at)
);

create table if not exists mms_commercial.partner_assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references mms_commercial.partners(id) on delete restrict,
  assessment_version text not null,
  overall_score numeric(5,2) not null,
  no_medical_claims_score numeric(5,2) not null,
  passed boolean not null,
  attempted_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (overall_score between 0 and 100),
  check (no_medical_claims_score between 0 and 100)
);

create table if not exists mms_commercial.partner_certifications (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references mms_commercial.partners(id) on delete restrict,
  certification_version text not null,
  issued_at timestamptz not null,
  renewal_due_at timestamptz not null,
  expires_at timestamptz not null,
  issued_by text not null,
  revoked_at timestamptz,
  revocation_reason text,
  created_at timestamptz not null default now(),
  check (renewal_due_at > issued_at),
  check (expires_at > renewal_due_at)
);

create table if not exists mms_commercial.idempotency_keys (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  key_hash text not null,
  resource_type text,
  resource_id text,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  unique (scope, key_hash)
);

create table if not exists mms_commercial.leads (
  id uuid primary key default gen_random_uuid(),
  public_lead_id text not null unique default ('MMSL-' || replace(gen_random_uuid()::text, '-', '')),
  registered_by_partner_id uuid not null references mms_commercial.partners(id) on delete restrict,
  current_partner_id uuid not null references mms_commercial.partners(id) on delete restrict,
  full_name text not null,
  email_normalized text,
  phone_normalized text,
  source text,
  campaign text,
  stage text not null default 'Registered' check (stage in ('Registered','Accepted','Contacted','Qualified','Application','Payment Pending','Payment Verified','Activated','Closed','Lost','Withdrawn','Duplicate','Rejected')),
  duplicate_status text not null default 'Unchecked' check (duplicate_status in ('Unchecked','Clear','Possible Duplicate','Confirmed Duplicate')),
  consent_version text not null,
  consent_captured_at timestamptz not null,
  registered_at timestamptz not null,
  last_activity_at timestamptz,
  next_action_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (email_normalized is not null or phone_normalized is not null)
);

create index if not exists leads_current_partner_idx on mms_commercial.leads(current_partner_id, stage);
create index if not exists leads_email_idx on mms_commercial.leads(email_normalized) where email_normalized is not null;
create index if not exists leads_phone_idx on mms_commercial.leads(phone_normalized) where phone_normalized is not null;

create table if not exists mms_commercial.lead_duplicate_decisions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references mms_commercial.leads(id) on delete restrict,
  status text not null check (status in ('Clear','Possible Duplicate','Confirmed Duplicate')),
  matched_public_lead_ids text[] not null default '{}',
  checked_by text not null,
  checked_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists mms_commercial.lead_ownership_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references mms_commercial.leads(id) on delete restrict,
  previous_partner_id uuid references mms_commercial.partners(id) on delete restrict,
  new_partner_id uuid not null references mms_commercial.partners(id) on delete restrict,
  reason text not null,
  approved_by text not null,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (previous_partner_id is null or previous_partner_id <> new_partner_id)
);

create table if not exists mms_commercial.lead_lifecycle_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references mms_commercial.leads(id) on delete restrict,
  previous_stage text not null,
  next_stage text not null,
  actor text not null,
  reason text,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists mms_commercial.applications (
  id uuid primary key default gen_random_uuid(),
  public_application_id text not null unique default ('MMSA-' || replace(gen_random_uuid()::text, '-', '')),
  lead_id uuid not null references mms_commercial.leads(id) on delete restrict,
  partner_id uuid not null references mms_commercial.partners(id) on delete restrict,
  membership_code text not null check (membership_code in ('ASCEND','EVOLVE','ETERNA','PINNACLE')),
  stage text not null check (stage in ('Draft','Submitted','Under Review','Documents Outstanding','Approved','Payment Pending','Paid','Activated','Withdrawn','Rejected')),
  submitted_at timestamptz,
  approved_at timestamptz,
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_commercial.payments (
  id uuid primary key default gen_random_uuid(),
  public_payment_id text not null unique default ('MMSPAY-' || replace(gen_random_uuid()::text, '-', '')),
  application_id uuid not null references mms_commercial.applications(id) on delete restrict,
  transaction_reference text not null unique,
  amount_minor_units bigint not null check (amount_minor_units > 0),
  currency char(3) not null check (currency ~ '^[A-Z]{3}$'),
  stage text not null check (stage in ('Pending','Submitted','Cleared','Failed','Refunded','Partially Refunded','Chargeback')),
  submitted_at timestamptz,
  cleared_at timestamptz,
  refund_amount_minor_units bigint check (refund_amount_minor_units is null or refund_amount_minor_units >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_commercial.payment_verifications (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references mms_commercial.payments(id) on delete restrict,
  verified_by text not null,
  verified_at timestamptz not null,
  cleared_amount_minor_units bigint not null check (cleared_amount_minor_units > 0),
  currency char(3) not null check (currency ~ '^[A-Z]{3}$'),
  source text not null check (source in ('Stripe','Bank Transfer','Finance Manual Review','Other Approved Gateway')),
  source_reference text not null,
  created_at timestamptz not null default now(),
  unique(payment_id, source, source_reference)
);

create table if not exists mms_commercial.memberships (
  id uuid primary key default gen_random_uuid(),
  public_membership_id text not null unique default ('MMSM-' || replace(gen_random_uuid()::text, '-', '')),
  application_id uuid not null unique references mms_commercial.applications(id) on delete restrict,
  member_reference text not null,
  membership_code text not null check (membership_code in ('ASCEND','EVOLVE','ETERNA','PINNACLE')),
  status text not null check (status in ('Pending Activation','Active','Cancelled','Expired')),
  activated_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_commercial.commercial_workflow_events (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('Application','Payment','Membership')),
  entity_public_id text not null,
  previous_state text not null,
  next_state text not null,
  actor text not null,
  reason text,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists mms_commercial.commission_rules (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  effective_from timestamptz not null,
  effective_to timestamptz,
  rates_by_level jsonb not null,
  eligible_renewal_residual_rate numeric(8,6),
  approved_by text not null,
  approved_at timestamptz not null,
  notes text,
  created_at timestamptz not null default now(),
  check (effective_to is null or effective_to > effective_from),
  check (eligible_renewal_residual_rate is null or eligible_renewal_residual_rate between 0 and 1)
);

create table if not exists mms_commercial.commission_transactions (
  id uuid primary key default gen_random_uuid(),
  public_transaction_id text not null unique default ('MMSC-' || replace(gen_random_uuid()::text, '-', '')),
  partner_id uuid not null references mms_commercial.partners(id) on delete restrict,
  application_id uuid not null references mms_commercial.applications(id) on delete restrict,
  payment_id uuid not null references mms_commercial.payments(id) on delete restrict,
  membership_id uuid not null references mms_commercial.memberships(id) on delete restrict,
  member_reference text not null,
  membership_code text not null check (membership_code in ('ASCEND','EVOLVE','ETERNA','PINNACLE')),
  payment_transaction_reference text not null,
  currency char(3) not null check (currency ~ '^[A-Z]{3}$'),
  eligible_revenue_minor_units bigint not null check (eligible_revenue_minor_units >= 0),
  commission_rule_id uuid not null references mms_commercial.commission_rules(id) on delete restrict,
  commission_rule_version text not null,
  partner_level_at_eligibility text not null check (partner_level_at_eligibility in ('Associate','Senior','Elite','Chairman')),
  commission_rate numeric(8,6) not null check (commission_rate between 0 and 1),
  gross_commission_minor_units bigint not null check (gross_commission_minor_units >= 0),
  adjustment_minor_units bigint not null default 0,
  approved_commission_minor_units bigint not null default 0 check (approved_commission_minor_units >= 0),
  status text not null check (status in ('Pending Eligibility','Eligible','Held','Approved','Paid','Reversed')),
  eligibility_checked_by text,
  eligibility_checked_at timestamptz,
  hold_reason text,
  approved_by text,
  approved_at timestamptz,
  payout_batch_id text,
  paid_by text,
  paid_at timestamptz,
  payout_reference text,
  reversed_at timestamptz,
  reversal_reason text,
  clawback_minor_units bigint not null default 0 check (clawback_minor_units >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(payment_id, partner_id)
);

create table if not exists mms_commercial.commission_events (
  id uuid primary key default gen_random_uuid(),
  commission_transaction_id uuid not null references mms_commercial.commission_transactions(id) on delete restrict,
  previous_status text not null,
  next_status text not null,
  actor text not null,
  reason text not null,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists mms_commercial.partner_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id_hash text not null unique,
  partner_id uuid not null references mms_commercial.partners(id) on delete restrict,
  subject text not null,
  authentication_method text not null check (authentication_method in ('passwordless','oidc','sso','managed-identity')),
  assurance_level text not null check (assurance_level in ('standard','step-up')),
  issued_at timestamptz not null,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  revoke_reason text,
  created_at timestamptz not null default now(),
  check (expires_at > issued_at)
);

create index if not exists partner_sessions_partner_active_idx on mms_commercial.partner_sessions(partner_id, expires_at) where revoked_at is null;

create table if not exists mms_commercial.partner_csrf_tokens (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references mms_commercial.partner_sessions(id) on delete cascade,
  token_hash text not null unique,
  issued_at timestamptz not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now(),
  check (expires_at > issued_at)
);

create table if not exists mms_commercial.presentation_assets (
  id uuid primary key default gen_random_uuid(),
  asset_code text not null,
  category text not null,
  title text not null,
  version text not null,
  content_url text not null,
  effective_from timestamptz not null,
  effective_to timestamptz,
  approved_by text not null,
  approved_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique(asset_code, version),
  check (effective_to is null or effective_to > effective_from)
);

-- Immutable audit/event tables: historical rows may not be updated or deleted.
create or replace function mms_commercial.reject_immutable_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'immutable MMS commercial audit/event rows cannot be updated or deleted';
end;
$$;

create trigger partner_audit_events_immutable before update or delete on mms_commercial.partner_audit_events for each row execute function mms_commercial.reject_immutable_mutation();
create trigger lead_duplicate_decisions_immutable before update or delete on mms_commercial.lead_duplicate_decisions for each row execute function mms_commercial.reject_immutable_mutation();
create trigger lead_ownership_events_immutable before update or delete on mms_commercial.lead_ownership_events for each row execute function mms_commercial.reject_immutable_mutation();
create trigger lead_lifecycle_events_immutable before update or delete on mms_commercial.lead_lifecycle_events for each row execute function mms_commercial.reject_immutable_mutation();
create trigger payment_verifications_immutable before update or delete on mms_commercial.payment_verifications for each row execute function mms_commercial.reject_immutable_mutation();
create trigger commercial_workflow_events_immutable before update or delete on mms_commercial.commercial_workflow_events for each row execute function mms_commercial.reject_immutable_mutation();
create trigger commission_events_immutable before update or delete on mms_commercial.commission_events for each row execute function mms_commercial.reject_immutable_mutation();

-- If this schema is used through Supabase/PostgREST later, keep direct client access
-- denied by default. Partner-facing access should continue through MMS server APIs.
alter table mms_commercial.partners enable row level security;
alter table mms_commercial.partner_audit_events enable row level security;
alter table mms_commercial.partner_training_evidence enable row level security;
alter table mms_commercial.partner_assessment_attempts enable row level security;
alter table mms_commercial.partner_certifications enable row level security;
alter table mms_commercial.idempotency_keys enable row level security;
alter table mms_commercial.leads enable row level security;
alter table mms_commercial.lead_duplicate_decisions enable row level security;
alter table mms_commercial.lead_ownership_events enable row level security;
alter table mms_commercial.lead_lifecycle_events enable row level security;
alter table mms_commercial.applications enable row level security;
alter table mms_commercial.payments enable row level security;
alter table mms_commercial.payment_verifications enable row level security;
alter table mms_commercial.memberships enable row level security;
alter table mms_commercial.commercial_workflow_events enable row level security;
alter table mms_commercial.commission_rules enable row level security;
alter table mms_commercial.commission_transactions enable row level security;
alter table mms_commercial.commission_events enable row level security;
alter table mms_commercial.partner_sessions enable row level security;
alter table mms_commercial.partner_csrf_tokens enable row level security;
alter table mms_commercial.presentation_assets enable row level security;

commit;
