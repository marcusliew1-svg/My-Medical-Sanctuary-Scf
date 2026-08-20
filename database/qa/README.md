# MMS Partner Hub QA database fixture

These SQL files are for the dedicated non-production MMS commercial database only.

Apply the production migrations first. Then, in a disposable QA/staging database, run `001_partner_hub_fixture.sql` to create one deterministic Active test Partner (`MMSP-99990001`) with the current ten-module training bundle, a passing assessment and a current certification.

Run `002_partner_hub_verify.sql` afterwards to verify the fixture before using the protected `/api/internal/partner-hub/qa-session` endpoint. `003_partner_hub_commerce_fixture.sql` and `004_partner_hub_commerce_verify.sql` provide the existing commercial application/payment/membership fixture checks.

After migrations through `0013_mms_partner_lead_lifecycle.sql` are applied, run `005_partner_lead_controls_transactional.sql` as an operator. It is a self-contained transaction that tests the duplicate-clearance gate, Partner-owned lead progression, stale-stage rejection, ownership transfer, exact transfer replay, application attribution and the ownership lock after application creation. The script ends with `ROLLBACK`.

After migrations through `0014_mms_commission_transition_policy_alignment.sql` are applied, run `006_commission_state_machine_transactional.sql`. It validates the Finance commission transition policy, hold/release path, payout evidence retention and full Paid clawback behavior, then rolls back.

After migrations through `0016_mms_lead_ownership_certification_time.sql` are applied, run `007_partner_provenance_and_certification_time_transactional.sql`. It verifies that future-issued certification cannot qualify a destination Partner for an earlier lead transfer and that commission eligibility independently requires Clear duplicate review plus accepted Partner agreement evidence before a valid persisted commercial chain can become commission-eligible. It also ends with `ROLLBACK`.

After migrations through `0017_mms_partner_lead_registration_eligibility.sql` are applied, run `008_partner_lead_registration_eligibility_transactional.sql`. It verifies that future-issued certification and disabled CRM access both block Partner lead registration, then confirms a valid Active/selling/CRM-enabled/current-certified Partner can register exactly one lead and that an exact idempotency replay returns the same lead without duplication. The script ends with `ROLLBACK`.

After migrations through `0018_mms_partner_application_evidence_hardening.sql` are applied, run `009_partner_application_evidence_transactional.sql`. It verifies that application submission independently rejects a non-Clear lead, missing Partner agreement acceptance and missing compliance acknowledgement, then confirms a fully evidenced submission succeeds and exact idempotency replay returns the same application. The script ends with `ROLLBACK`.

After migrations through `0019_mms_finance_temporal_evidence_hardening.sql` are applied, run `010_finance_temporal_evidence_transactional.sql`. It verifies that Finance clearance cannot pre-date the persisted payment submission, materially future verification/activation evidence is rejected, activation cannot pre-date Finance clearance, and exact valid verification/activation retries remain idempotent. The script ends with `ROLLBACK`.

After migrations through `0020_mms_commission_hold_release_evidence_hardening.sql` are applied, run `011_commission_hold_release_evidence_transactional.sql`. It verifies that a Finance hold persists its reason, release clears the hold reason, exact hold/release retries do not duplicate immutable events, and conflicting release replay evidence is rejected. The script ends with `ROLLBACK`.

Never apply persistent QA fixtures to production. The transactional control tests are also intended for non-production validation only. All QA files create or exercise synthetic commercial Partner/lead data and must never be used in a patient/clinical database or any iPivot database.
