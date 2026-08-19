# MMS staging activation runbook

This runbook is for the dedicated My Medical Sanctuary commercial environment only. Never apply these steps to iPivot or to any clinical/patient database.

## Deployment discipline

Vercel deployments are intentionally conserved. Batch related repository changes into one branch update, wait for GitHub CI once, and avoid manual Vercel redeploys while the Partner Hub is still behind feature gates. Database-only and documentation work should be accumulated before pushing rather than emitted as a sequence of tiny commits.

## Database bring-up order

1. Provision a dedicated PostgreSQL database for MMS commercial data.
2. Apply migrations `0001` through `0005` in order.
3. Apply `database/provision/001_mms_commercial_runtime_role.sql` as an operator.
4. Assign LOGIN credentials to the dedicated `mms_commercial_app` runtime role outside source control.
5. Run `database/provision/002_mms_commercial_runtime_role_verify.sql` and confirm all `*_should_be_false` privilege checks are false, RLS is enabled on all 22 approved commercial tables, and the runtime policy count is 22.
6. Configure the server-side `MMS_COMMERCIAL_DATABASE_URL` with the least-privilege runtime role credentials.
7. Keep `MMS_COMMERCIAL_DATABASE_ENABLED=false` until the runtime driver is installed and the structural/smoke checks pass.

## Financial workflow controls

Migration `0005_mms_financial_workflow_hardening.sql` is mandatory before integration testing. It makes Finance payment verification and membership activation retry-safe, rejects mismatched replays, and enforces a database commission state machine. Commission cannot move directly from Eligible to Paid; Finance approval must happen first. A Paid transition requires a payout batch ID and payout reference. A Paid commission that is subsequently reversed requires a full clawback equal to the approved commission amount.

The runtime role is intentionally not granted DELETE privileges. Immutable audit/event tables remain append-only. Because the commercial schema uses PostgreSQL row-level security, the provisioning script also installs explicit policies for the current 22 approved commercial tables. Future tables remain inaccessible until deliberately added to the provisioning allow-list.

## Non-production Partner Hub test order

1. Apply `database/qa/001_partner_hub_fixture.sql`.
2. Run `database/qa/002_partner_hub_verify.sql`.
3. Apply `database/qa/003_partner_hub_commerce_fixture.sql`.
4. Run `database/qa/004_partner_hub_commerce_verify.sql`.
5. Enable the MMS commercial database and Partner Hub only in the non-production environment.
6. Call `GET /api/internal/commerce/database-readiness` with the MMS internal bearer credential.
7. Call `GET /api/internal/commerce/database-smoke-test` and require `status=ready` before any Partner Hub QA session is issued.
8. Enable `MMS_PARTNER_HUB_QA_BOOTSTRAP_ENABLED=true` only in non-production.
9. Issue the QA Partner session for `MMSP-99990001` through the protected internal QA-session endpoint.
10. Test Partner Hub dashboard, Leads, Applications, Academy, Presentation Centre, Commission Wallet, Referral Tools and Sign Out.
11. Exercise an exact retry of Finance payment verification and membership activation and confirm no duplicate workflow event is created.
12. Exercise commission transitions through Eligible → Approved → Paid and confirm Eligible → Paid is rejected.
13. Exercise Paid → Reversed and confirm anything other than a full approved-amount clawback is rejected.

## Acceptance criteria

The environment is ready for Partner Hub integration testing only when:

- all five required migrations are present in the migration manifest;
- the structural database probe is ready;
- the runtime transaction round-trip succeeds;
- the runtime role can read/write approved commercial rows through explicit RLS policies;
- the runtime role cannot CREATE in the MMS schema;
- the runtime role cannot DELETE Partner records;
- immutable audit/event tables cannot be updated or deleted by the runtime role;
- payment verification and membership activation are retry-safe;
- the commission state machine rejects direct Eligible-to-Paid transitions;
- Paid commission reversals require full clawback;
- the QA Partner is Active, selling-enabled, certified and has complete controlled training;
- Partner-facing APIs derive Partner identity exclusively from the verified session;
- Lead registration remains CSRF-protected and idempotent;
- no Partner-facing API or fixture contains clinical/patient information.

## Production gate

Do not enable production Partner Hub access from the QA bootstrap. The QA bootstrap must remain disabled in production. Production activation additionally requires the selected Partner identity provider, production secrets, a clean production database migration run, security review, and successful end-to-end testing without QA fixtures.
