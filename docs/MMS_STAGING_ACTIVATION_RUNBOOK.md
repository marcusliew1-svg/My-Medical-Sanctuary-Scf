# MMS staging activation runbook

This runbook is for the dedicated My Medical Sanctuary commercial environment only. Never apply these steps to iPivot or to any clinical/patient database.

## Deployment discipline

Vercel deployments are intentionally conserved. Batch related repository changes into one branch update, wait for GitHub CI once, and avoid manual Vercel redeploys while the Partner Hub is still behind feature gates. Database-only and documentation work should be accumulated before pushing rather than emitted as a sequence of tiny commits.

## Database bring-up order

1. Provision a dedicated PostgreSQL database for MMS commercial data.
2. Apply migrations `0001` through `0004` in order.
3. Apply `database/provision/001_mms_commercial_runtime_role.sql` as an operator.
4. Assign LOGIN credentials to the dedicated `mms_commercial_app` runtime role outside source control.
5. Run `database/provision/002_mms_commercial_runtime_role_verify.sql` and confirm all `*_should_be_false` privilege checks are false.
6. Configure the server-side `MMS_COMMERCIAL_DATABASE_URL` with the least-privilege runtime role credentials.
7. Keep `MMS_COMMERCIAL_DATABASE_ENABLED=false` until the runtime PostgreSQL package is present in both `package.json` and `package-lock.json` and the structural/smoke checks pass.

## Sales Partner registry reconciliation

Zoho remains the applicant/onboarding workflow source while the dedicated MMS commercial database is the permanent Partner/Partner Hub registry. Permanent Partner ID issuance creates the database Partner row. After a controlled CRM onboarding transition has been recorded, call `POST /api/internal/sales-partners/registry-reconcile` with the CRM `recordId` and an auditable operator `actor`.

The reconciliation path is deliberately retry-safe. It reads the controlled CRM description, validates that the permanent Partner ID and CRM record match the database registry, synchronises stage/selling/CRM-access state, and idempotently records available training, assessment, certification and registry-audit evidence. It does not accept Partner state supplied by the browser or caller.

Do not enable selling from a manually edited database row. Active/selling state must be traceable to the controlled CRM onboarding audit record and a permanent Partner ID.

## Non-production Partner Hub test order

1. Apply `database/qa/001_partner_hub_fixture.sql`.
2. Run `database/qa/002_partner_hub_verify.sql`.
3. Apply `database/qa/003_partner_hub_commerce_fixture.sql`.
4. Run `database/qa/004_partner_hub_commerce_verify.sql`.
5. Enable the MMS commercial database and Partner Hub only in the non-production environment.
6. Call `GET /api/internal/commerce/database-readiness` with the MMS internal bearer credential.
7. Call `GET /api/internal/commerce/database-smoke-test` and require `status=ready` before any Partner Hub QA session is issued.
8. For a real non-QA Sales Partner CRM record, issue the permanent Partner ID first, then run the protected registry reconciliation and confirm the returned Partner ID/stage match CRM.
9. Enable `MMS_PARTNER_HUB_QA_BOOTSTRAP_ENABLED=true` only in non-production.
10. Issue the QA Partner session for `MMSP-99990001` through the protected internal QA-session endpoint.
11. Test Partner Hub dashboard, Leads, Applications, Academy, Presentation Centre, Commission Wallet, Referral Tools and Sign Out.

## Acceptance criteria

The environment is ready for Partner Hub integration testing only when:

- all required migrations are present in the migration manifest;
- the structural database probe is ready;
- the runtime transaction round-trip succeeds;
- the runtime role cannot CREATE in the MMS schema;
- the runtime role cannot DELETE Partner records;
- immutable audit/event tables cannot be updated or deleted by the runtime role;
- permanent Partner ID and CRM record linkage reconcile without conflict;
- Active/selling-enabled database state is traceable to the controlled CRM onboarding audit state;
- the QA Partner is Active, selling-enabled, certified and has complete controlled training;
- Partner-facing APIs derive Partner identity exclusively from the verified session;
- Lead registration remains CSRF-protected and idempotent;
- no Partner-facing API, registry sync or fixture contains clinical/patient information.

## Production gate

Do not enable production Partner Hub access from the QA bootstrap. The QA bootstrap must remain disabled in production. Production activation additionally requires the selected Partner identity provider, production secrets, a clean production database migration run, security review, registry reconciliation checks, and successful end-to-end testing without QA fixtures.
