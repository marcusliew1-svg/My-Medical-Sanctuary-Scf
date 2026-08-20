-- MMS commercial runtime role hardening.
-- Run only against the dedicated MMS commercial PostgreSQL database AFTER
-- database/migrations/0001..0005 have been applied.
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

grant select on all tables in schema mms_commercial to mms_commercial_app;

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

grant insert on table
  mms_commercial.partner_audit_events,
  mms_commercial.lead_ownership_events,
  mms_commercial.lead_lifecycle_events,
  mms_commercial.commercial_workflow_events,
  mms_commercial.commission_events
  to mms_commercial_app;

grant usage, select on sequence mms_commercial.partner_code_seq to mms_commercial_app;

grant execute on function mms_commercial.allocate_partner_code() to mms_commercial_app;
grant execute on all functions in schema mms_commercial to mms_commercial_app;

-- The foundation enables RLS on every commercial table. The runtime role is a
-- trusted backend service role, so explicit policies are required or direct
-- Partner Hub reads/writes would be blocked despite GRANTs. The table list is
-- intentionally explicit so future tables remain fail-closed until reviewed.
do $$
declare
  v_table text;
begin
  foreach v_table in array array[
    'partners',
    'partner_audit_events',
    'partner_training_evidence',
    'partner_assessment_attempts',
    'partner_certifications',
    'idempotency_keys',
    'leads',
    'lead_duplicate_decisions',
    'lead_ownership_events',
    'lead_lifecycle_events',
    'applications',
    'payments',
    'payment_verifications',
    'memberships',
    'commercial_workflow_events',
    'commission_rules',
    'commission_transactions',
    'commission_events',
    'partner_sessions',
    'partner_csrf_tokens',
    'presentation_assets',
    'schema_migrations'
  ]
  loop
    execute format('drop policy if exists mms_commercial_app_runtime on mms_commercial.%I', v_table);
    execute format(
      'create policy mms_commercial_app_runtime on mms_commercial.%I for all to mms_commercial_app using (true) with check (true)',
      v_table
    );
  end loop;
end
$$;

alter default privileges in schema mms_commercial revoke all on tables from public;
alter default privileges in schema mms_commercial revoke all on sequences from public;
alter default privileges in schema mms_commercial revoke all on functions from public;

commit;
