-- QA verification queries for the dedicated MMS commercial test database.
-- Read-only. Intended to be run after migrations and the QA Partner fixture.

-- 1. Exactly one QA Partner and it is eligible for Partner Hub selling controls.
select
  partner_code,
  stage,
  level,
  selling_enabled,
  crm_access_enabled
from mms_commercial.partners
where crm_record_id = 'QA-PARTNER-HUB-0001';

-- 2. All ten current training modules exist and none requires refresh.
select
  count(*) as module_count,
  count(*) filter (where passed is not false and refresh_required = false) as valid_module_count
from mms_commercial.partner_training_evidence e
join mms_commercial.partners p on p.id = e.partner_id
where p.crm_record_id = 'QA-PARTNER-HUB-0001'
  and e.bundle_version = 'MMS-SP-TRAINING-2026-08-v1'
  and e.module_version = 'MMS-SP-TRAINING-2026-08-v1';

-- 3. Assessment meets the current 80% overall / 100% No Medical Claims gate.
select
  assessment_version,
  overall_score,
  no_medical_claims_score,
  passed
from mms_commercial.partner_assessment_attempts a
join mms_commercial.partners p on p.id = a.partner_id
where p.crm_record_id = 'QA-PARTNER-HUB-0001'
order by attempted_at desc
limit 1;

-- 4. Certification is current and has a renewal window.
select
  certification_version,
  issued_at,
  renewal_due_at,
  expires_at,
  revoked_at,
  (expires_at > now() and revoked_at is null) as certification_current
from mms_commercial.partner_certifications c
join mms_commercial.partners p on p.id = c.partner_id
where p.crm_record_id = 'QA-PARTNER-HUB-0001'
order by issued_at desc
limit 1;

-- 5. No QA session exists until the protected QA session API explicitly creates one.
select count(*) as active_qa_sessions
from mms_commercial.partner_sessions s
join mms_commercial.partners p on p.id = s.partner_id
where p.crm_record_id = 'QA-PARTNER-HUB-0001'
  and s.revoked_at is null
  and s.expires_at > now();
