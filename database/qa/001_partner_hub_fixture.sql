-- QA-only fixture for the dedicated MMS commercial test database.
-- NEVER apply this file to production.
-- Creates one Active, selling-enabled Partner with current training, assessment
-- and certification evidence so Partner Hub sessions/read APIs can be exercised.

begin;

DO $$
BEGIN
  IF current_database() = 'postgres' THEN
    RAISE EXCEPTION 'Refusing to seed the default postgres database.';
  END IF;
END
$$;

with upsert_partner as (
  insert into mms_commercial.partners (
    partner_code,
    crm_record_id,
    stage,
    level,
    territory,
    selling_enabled,
    crm_access_enabled,
    agreement_version,
    agreement_accepted_at,
    compliance_version,
    compliance_acknowledged_at,
    activated_at
  ) values (
    'MMSP-99990001',
    'QA-PARTNER-HUB-0001',
    'Active',
    'Associate',
    'QA',
    true,
    true,
    'MMS-SPA-2026-08-v1',
    now() - interval '30 days',
    'MMS-SP-COMPLIANCE-2026-08-v1',
    now() - interval '30 days',
    now() - interval '29 days'
  )
  on conflict (crm_record_id) do update set
    stage = excluded.stage,
    level = excluded.level,
    territory = excluded.territory,
    selling_enabled = excluded.selling_enabled,
    crm_access_enabled = excluded.crm_access_enabled,
    agreement_version = excluded.agreement_version,
    agreement_accepted_at = excluded.agreement_accepted_at,
    compliance_version = excluded.compliance_version,
    compliance_acknowledged_at = excluded.compliance_acknowledged_at,
    activated_at = excluded.activated_at,
    updated_at = now()
  returning id
)
select id from upsert_partner;

delete from mms_commercial.partner_training_evidence
where partner_id = (select id from mms_commercial.partners where crm_record_id = 'QA-PARTNER-HUB-0001');

insert into mms_commercial.partner_training_evidence (
  partner_id,
  module_id,
  bundle_version,
  module_version,
  completed_at,
  acknowledged_at,
  passed,
  refresh_required
)
select
  p.id,
  module_id,
  'MMS-SP-TRAINING-2026-08-v1',
  'MMS-SP-TRAINING-2026-08-v1',
  now() - interval '31 days',
  now() - interval '31 days',
  true,
  false
from mms_commercial.partners p
cross join unnest(array[
  'MMS-SP-T01','MMS-SP-T02','MMS-SP-T03','MMS-SP-T04','MMS-SP-T05',
  'MMS-SP-T06','MMS-SP-T07','MMS-SP-T08','MMS-SP-T09','MMS-SP-T10'
]) as module_id
where p.crm_record_id = 'QA-PARTNER-HUB-0001';

delete from mms_commercial.partner_assessment_attempts
where partner_id = (select id from mms_commercial.partners where crm_record_id = 'QA-PARTNER-HUB-0001');

insert into mms_commercial.partner_assessment_attempts (
  partner_id,
  assessment_version,
  overall_score,
  no_medical_claims_score,
  passed,
  attempted_at
)
select
  id,
  'MMS-SP-ASSESSMENT-2026-08-v1',
  90,
  100,
  true,
  now() - interval '30 days'
from mms_commercial.partners
where crm_record_id = 'QA-PARTNER-HUB-0001';

delete from mms_commercial.partner_certifications
where partner_id = (select id from mms_commercial.partners where crm_record_id = 'QA-PARTNER-HUB-0001');

insert into mms_commercial.partner_certifications (
  partner_id,
  certification_version,
  issued_at,
  renewal_due_at,
  expires_at,
  issued_by
)
select
  id,
  'MMS-SP-CERT-2026-08-v1',
  now() - interval '30 days',
  now() + interval '245 days',
  now() + interval '335 days',
  'qa-fixture'
from mms_commercial.partners
where crm_record_id = 'QA-PARTNER-HUB-0001';

commit;
