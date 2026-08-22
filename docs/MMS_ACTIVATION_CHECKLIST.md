# MMS Activation Checklist

This checklist keeps My Medical Sanctuary commercial systems isolated from iPivot and keeps production fail-closed until the standalone MMS infrastructure is verified.

## Permanent Supabase target

- Standalone MMS project: `mzdvcchausgqmcxnwbsy` (Tokyo).
- Do not use the older MMS project `ywbqfkhrshmpilgzytpl` under the iPivot organization for production configuration.
- Do not delete the older project until the standalone project passes migrations, role checks, security advisors and preview smoke testing.

## Database gate — VERIFIED 2026-08-22

The standalone database gate is complete:

1. Repository migrations are applied through `0021_mms_database_post_provision_hardening.sql` in order.
2. `mms_commercial_app` runtime-role provisioning was applied after 0005 and its grants rerun after 0021.
3. The migration manifest retains the historical 0015 provenance key and contains the canonical repository key `0015_mms_commission_eligibility_evidence_hardening.sql`.
4. The final required structural baseline is 22 base tables and 17 functions. The application probe must include `idempotency_keys`, `reject_immutable_mutation` and `touch_updated_at`.
5. All 22 commercial tables have RLS enabled and runtime policies present.
6. Supabase security advisors report zero security lints.
7. Performance advisors report only informational unused-index notices expected on a newly provisioned database; do not remove required operational indexes merely because they have not yet accumulated usage.

Do not rerun migrations unless a future ledger check proves a migration is actually missing.

## Vercel Preview environment

Configure Preview first. Do not enable Production at the same time.

Required commercial settings:

- `MMS_COMMERCIAL_DATABASE_URL` = standalone MMS database connection string, server-side only.
- `MMS_COMMERCIAL_DATABASE_SCHEMA=mms_commercial`.
- `MMS_COMMERCIAL_DATABASE_ENABLED=true` only in Preview now that the database verification above is complete and when controlled integration testing is ready.

Partner Hub settings:

- `NEXT_PUBLIC_SUPABASE_URL` = standalone MMS project API URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = standalone MMS publishable key.
- `MMS_PARTNER_HUB_ENABLED=true` only for controlled Preview testing after Partner test identities have valid server-controlled `app_metadata.partner_id`.

Internal operator settings:

- `MMS_OPERATOR_SUPABASE_URL` = standalone MMS project API URL, server-side only.
- `MMS_OPERATOR_SUPABASE_PUBLISHABLE_KEY` = standalone MMS publishable key, server-side only.
- `MMS_OPERATOR_SESSION_SECRET` = high-entropy server-only signing secret; never expose to browser code or repository files.
- `MMS_OPERATOR_SESSION_MAX_AGE_SECONDS=900` unless security review approves another value.
- `MMS_OPERATOR_STEP_UP_MAX_AGE_SECONDS=600` unless security review approves another value.
- `MMS_OPERATOR_ACCESS_ENABLED=true` only in Preview after operator test users have valid server-controlled `app_metadata.operator_id` and `app_metadata.operator_roles`.

Also keep `MMS_PARTNER_HUB_QA_BOOTSTRAP_ENABLED=false` unless a specific non-production integration test requires it. The application refuses the helper in production, but the default release posture remains disabled.

Keep `MMS_OPERATOR_ACCESS_ENABLED=false`, `MMS_PARTNER_HUB_ENABLED=false` and `MMS_COMMERCIAL_DATABASE_ENABLED=false` in Production until Preview validation is complete.

## Identity separation

Partner authorization and internal operator authorization are independent.

- Partner Hub uses only server-controlled `app_metadata.partner_id`.
- Operations/Finance uses only server-controlled `app_metadata.operator_id` and `app_metadata.operator_roles`.
- Partner `partner_id` never grants Operations/Finance access.
- Operator metadata never grants Partner Hub access.
- `user_metadata` is never used for authorization.

## Preview smoke tests

Partner Hub:

1. Anonymous `/partner-hub` request redirects to Partner login.
2. Valid Supabase user without `partner_id` is denied.
3. Valid Partner user can enter only their authenticated Partner context.
4. Logout revokes/clears the Partner session.

Operations/Finance:

1. Anonymous `/operations` access fails closed or redirects to operator login according to the stacked console implementation.
2. Valid Supabase user without operator metadata is denied.
3. Operations role cannot perform Finance-only mutations.
4. Auditor role is read-only.
5. Finance-sensitive actions fail without recent step-up.
6. Password step-up for the same operator identity succeeds and permits the protected action only within the configured step-up window.
7. Removing/changing operator metadata causes subsequent protected requests to fail closed.
8. Logout revokes the Supabase Auth session and clears operator cookies.

Commercial workflow:

1. Application state transitions preserve expected-state concurrency.
2. Payment verification uses persisted Finance evidence.
3. Membership activation cannot occur without valid Finance verification evidence.
4. Cancelled/refunded membership produces zero commission and reverses attributable paid commission according to policy.
5. Commission approval/payment/reversal cannot accept caller-supplied rate, approved amount, actor or timestamp.

## Pull request release order

Current intended release sequence:

1. PR #26 `next15-security-refresh` — framework/security baseline.
2. PR #22 `operator-security-foundation`.
3. Refresh PR #23 `operations-console-foundation` against the latest #22 branch; after #22 merges, retarget #23 to `main` and revalidate.
4. Refresh PR #24 `commission-control-centre` against the refreshed #23 branch; after #23 merges, retarget #24 to `main` and revalidate.
5. PR #25 `feat/supabase-auth` remains an independent Partner Hub auth change based on `main`; rebase/revalidate against the final merged main before release.

Do not merge any of these solely because CI is green. Production merge requires explicit approval after the Preview environment and smoke tests are complete.

## Production activation

Only after Preview passes:

1. Configure the same standalone MMS database/auth values in Production using Production-scoped Vercel secrets.
2. Keep feature gates false for the deployment that introduces the code/configuration.
3. Deploy and verify fail-closed readiness.
4. Enable the commercial database gate.
5. Enable Partner Hub and operator access in a controlled sequence.
6. Run production smoke tests with non-clinical test records.
7. Monitor runtime/auth/database errors.
8. Only after stable operation, retire the older MMS project under iPivot.

No patient/clinical data belongs in the MMS commercial database, Partner Hub commercial records or Operations/Finance console.
