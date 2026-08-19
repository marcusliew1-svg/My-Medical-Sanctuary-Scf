-- MMS commercial runtime role hardening.
-- Run only against the dedicated MMS commercial PostgreSQL database AFTER
-- database/migrations/0001..0004 have been applied.
--
-- This script intentionally does not set or commit a password. Provision the
-- LOGIN credential out-of-band in the database provider and place only the
-- resulting connection URL in MMS_COMMERCIAL_DATABASE_URL.
--
-- Never run this against iPivot or any clinical/patient database.

begin;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'mms_commercial_app') then
    create role mms_commercial_app nologin nosuperuser nocreatedb nocreaterole noinherit;
  end if;
end
$$;

revoke all on schema mms_commercial from public;
grant usage on schema mms_commercial to mms_commercial_app;

-- Runtime reads. The Partner Hub and internal operational APIs read commercial
-- state directly but never need access to any other schema.
grant select on all tables in schema mms_commercial to mms_commercial_app;

-- Controlled writes used by existing adapters. DELETE is deliberately omitted.
grant insert, update on table
  mms_commercial.partners,
  mms_commercial.partner_training_evidence,
  mms_commercial.partner_assessment_attempts,
  mms_commercial.partner_certifications,
  mms_commercial.partner_sessions,
  mms_commercial.partner_csrf_tokens,
  mms_commercial.idempotency_keys,
  mms_commercial.leads,
  mms_commercial.lead_duplicate_decisions,
  mms_commercial.applications,
  mms_commercial.payments,
  mms_commercial.payment_verifications,
  mms_commercial.memberships,
  mms_commercial.commission_rules,
  mms_commercial.commission_transactions,
  mms_commercial.presentation_assets
  to mms_commercial_app;

-- Immutable event tables permit append-only INSERT. Their mutation-reject
-- triggers remain a second line of defence even for privileged operators.
grant insert on table
  mms_commercial.partner_audit_events,
  mms_commercial.lead_ownership_events,
  mms_commercial.lead_lifecycle_events,
  mms_commercial.commercial_workflow_events,
  mms_commercial.commission_events
  to mms_commercial_app;

-- Permanent Partner IDs use a database sequence; the runtime may advance it but
-- does not receive schema ownership or DDL privileges.
grant usage, select on sequence mms_commercial.partner_code_seq to mms_commercial_app;

-- Atomic operations remain the preferred mutation boundary.
grant execute on function mms_commercial.allocate_partner_code() to mms_commercial_app;
grant execute on all functions in schema mms_commercial to mms_commercial_app;

-- Keep future objects fail-closed. New migrations must explicitly grant any
-- new runtime privilege after review instead of inheriting broad defaults.
alter default privileges in schema mms_commercial revoke all on tables from public;
alter default privileges in schema mms_commercial revoke all on sequences from public;
alter default privileges in schema mms_commercial revoke all on functions from public;

commit;
