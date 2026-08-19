-- Verification queries for the dedicated MMS commercial runtime role.
-- Run as an operator after assigning LOGIN credentials to mms_commercial_app.
-- This file is read-only and is safe to rerun.

select
  r.rolname,
  r.rolsuper,
  r.rolcreatedb,
  r.rolcreaterole,
  r.rolinherit,
  r.rolcanlogin
from pg_roles r
where r.rolname = 'mms_commercial_app';

select
  has_schema_privilege('mms_commercial_app', 'mms_commercial', 'USAGE') as schema_usage,
  has_schema_privilege('mms_commercial_app', 'mms_commercial', 'CREATE') as schema_create_should_be_false,
  has_table_privilege('mms_commercial_app', 'mms_commercial.partners', 'SELECT') as partners_select,
  has_table_privilege('mms_commercial_app', 'mms_commercial.partners', 'INSERT') as partners_insert,
  has_table_privilege('mms_commercial_app', 'mms_commercial.partners', 'UPDATE') as partners_update,
  has_table_privilege('mms_commercial_app', 'mms_commercial.partners', 'DELETE') as partners_delete_should_be_false,
  has_table_privilege('mms_commercial_app', 'mms_commercial.partner_audit_events', 'INSERT') as audit_insert,
  has_table_privilege('mms_commercial_app', 'mms_commercial.partner_audit_events', 'UPDATE') as audit_update_should_be_false,
  has_table_privilege('mms_commercial_app', 'mms_commercial.partner_audit_events', 'DELETE') as audit_delete_should_be_false;

select
  has_sequence_privilege('mms_commercial_app', 'mms_commercial.partner_code_seq', 'USAGE') as partner_code_sequence_usage,
  has_sequence_privilege('mms_commercial_app', 'mms_commercial.partner_code_seq', 'UPDATE') as partner_code_sequence_update;

select
  p.proname,
  has_function_privilege(
    'mms_commercial_app',
    p.oid,
    'EXECUTE'
  ) as runtime_can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'mms_commercial'
  and p.proname in (
    'allocate_partner_code',
    'issue_partner_code_for_crm_record',
    'register_partner_lead',
    'finance_verify_payment',
    'activate_membership',
    'transition_commission'
  )
order by p.proname;

-- Every currently approved commercial table must have the explicit runtime RLS
-- policy. Expected: 22 of 22. Future tables are intentionally not auto-added.
select
  count(*) filter (where c.relrowsecurity) as rls_enabled_count,
  count(*) filter (
    where exists (
      select 1
      from pg_policies p
      where p.schemaname = 'mms_commercial'
        and p.tablename = c.relname
        and p.policyname = 'mms_commercial_app_runtime'
        and 'mms_commercial_app' = any(p.roles)
    )
  ) as runtime_policy_count,
  count(*) as expected_table_count
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'mms_commercial'
  and c.relkind = 'r'
  and c.relname in (
    'partners','partner_audit_events','partner_training_evidence','partner_assessment_attempts',
    'partner_certifications','idempotency_keys','leads','lead_duplicate_decisions',
    'lead_ownership_events','lead_lifecycle_events','applications','payments',
    'payment_verifications','memberships','commercial_workflow_events','commission_rules',
    'commission_transactions','commission_events','partner_sessions','partner_csrf_tokens',
    'presentation_assets','schema_migrations'
  );
