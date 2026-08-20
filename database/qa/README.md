# MMS Partner Hub QA database fixture

These SQL files are for the dedicated non-production MMS commercial database only.

Apply the production migrations first. Then, in a disposable QA/staging database, run `001_partner_hub_fixture.sql` to create one deterministic Active test Partner (`MMSP-99990001`) with the current ten-module training bundle, a passing assessment and a current certification.

Run `002_partner_hub_verify.sql` afterwards to verify the fixture before using the protected `/api/internal/partner-hub/qa-session` endpoint. `003_partner_hub_commerce_fixture.sql` and `004_partner_hub_commerce_verify.sql` provide the existing commercial application/payment/membership fixture checks.

After migrations through `0013_mms_partner_lead_lifecycle.sql` are applied, run `005_partner_lead_controls_transactional.sql` as an operator. It is a self-contained transaction that tests the newer duplicate-clearance gate, Partner-owned lead progression, stale-stage rejection, ownership transfer, exact transfer replay, application attribution, and the ownership lock after application creation. The script ends with `ROLLBACK`, so successful execution leaves no synthetic rows behind.

Never apply persistent QA fixtures to production. The transactional control test is also intended for non-production validation only. All QA files create or exercise synthetic commercial Partner/lead data and must never be used in a patient/clinical database or any iPivot database.
