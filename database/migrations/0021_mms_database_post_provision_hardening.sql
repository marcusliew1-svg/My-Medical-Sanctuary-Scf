-- MMS database post-provision hardening.
-- Apply only to the dedicated MMS commercial database after migration 0020.
-- Fixes trigger-function search_path hardening and adds covering indexes for
-- commercial foreign keys used by operator/Partner workflow queries.

begin;

-- Trigger helpers execute in trusted schema context. Pin search_path so object
-- resolution cannot be influenced by a caller-controlled schema path.
alter function mms_commercial.reject_immutable_mutation()
  set search_path = mms_commercial, pg_temp;

alter function mms_commercial.touch_updated_at()
  set search_path = mms_commercial, pg_temp;

-- Cover foreign keys used in joins, ownership history, audit timelines and
-- Finance/commission queue projections. Existing unique indexes already cover
-- some other foreign keys and are intentionally not duplicated here.
create index if not exists applications_lead_id_idx
  on mms_commercial.applications(lead_id);
create index if not exists applications_partner_id_idx
  on mms_commercial.applications(partner_id);
create index if not exists commission_events_transaction_id_idx
  on mms_commercial.commission_events(commission_transaction_id);
create index if not exists commission_transactions_application_id_idx
  on mms_commercial.commission_transactions(application_id);
create index if not exists commission_transactions_commission_rule_id_idx
  on mms_commercial.commission_transactions(commission_rule_id);
create index if not exists commission_transactions_membership_id_idx
  on mms_commercial.commission_transactions(membership_id);
create index if not exists commission_transactions_partner_id_idx
  on mms_commercial.commission_transactions(partner_id);
create index if not exists lead_duplicate_decisions_lead_id_idx
  on mms_commercial.lead_duplicate_decisions(lead_id);
create index if not exists lead_lifecycle_events_lead_id_idx
  on mms_commercial.lead_lifecycle_events(lead_id);
create index if not exists lead_ownership_events_lead_id_idx
  on mms_commercial.lead_ownership_events(lead_id);
create index if not exists lead_ownership_events_new_partner_id_idx
  on mms_commercial.lead_ownership_events(new_partner_id);
create index if not exists lead_ownership_events_previous_partner_id_idx
  on mms_commercial.lead_ownership_events(previous_partner_id);
create index if not exists leads_registered_by_partner_id_idx
  on mms_commercial.leads(registered_by_partner_id);
create index if not exists partner_assessment_attempts_partner_id_idx
  on mms_commercial.partner_assessment_attempts(partner_id);
create index if not exists partner_audit_events_partner_id_idx
  on mms_commercial.partner_audit_events(partner_id);
create index if not exists partner_certifications_partner_id_idx
  on mms_commercial.partner_certifications(partner_id);
create index if not exists partner_csrf_tokens_session_id_idx
  on mms_commercial.partner_csrf_tokens(session_id);
create index if not exists payments_application_id_idx
  on mms_commercial.payments(application_id);

-- Migration 0015 was historically recorded under an earlier working filename.
-- Retain the legacy row for audit history while ensuring the repository's
-- canonical migration key is present for structural readiness checks.
insert into mms_commercial.schema_migrations(migration_key, notes)
values (
  '0015_mms_commission_eligibility_evidence_hardening.sql',
  'Canonical manifest key for migration 0015; legacy provenance key retained for audit history.'
)
on conflict (migration_key) do nothing;

insert into mms_commercial.schema_migrations(migration_key, notes)
values (
  '0021_mms_database_post_provision_hardening.sql',
  'Pins trigger helper search_path and adds covering foreign-key indexes for commercial workflow queries.'
)
on conflict (migration_key) do nothing;

commit;
