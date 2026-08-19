# MMS Partner Hub QA database fixture

These SQL files are for the dedicated non-production MMS commercial database only.

Apply the production migrations first. Then, in a disposable QA/staging database, run `001_partner_hub_fixture.sql` to create one deterministic Active test Partner (`MMSP-99990001`) with the current ten-module training bundle, a passing assessment and a current certification.

Run `002_partner_hub_verify.sql` afterwards to verify the fixture before using the protected `/api/internal/partner-hub/qa-session` endpoint.

Never apply the fixture to production. It intentionally creates synthetic commercial Partner data and must never be used in a patient/clinical database or any iPivot database.
