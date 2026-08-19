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
