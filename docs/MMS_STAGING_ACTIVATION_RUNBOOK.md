# MMS staging activation runbook

This runbook is for the dedicated My Medical Sanctuary commercial environment only. Never apply these steps to iPivot or to any clinical/patient database.

## Deployment discipline

Vercel deployments are intentionally conserved. Batch related repository changes into one branch update, wait for GitHub CI once, and avoid manual Vercel redeploys while the Partner Hub is still behind feature gates. Database-only and documentation work should be accumulated before pushing rather than emitted as a sequence of tiny commits.

## Database bring-up order

1. Provision a dedicated PostgreSQL database for MMS commercial data.
2. Apply migrations `0001` through `0007` in order.
3. Apply `database/provision/001_mms_commercial_runtime_role.sql` as an operator.
4. Assign LOGIN credentials to the dedicated `mms_commercial_app` runtime role outside source control.
5. Run `database/provision/002_mms_commercial_runtime_role_verify.sql` and confirm all `*_should_be_false` privilege checks are false, RLS is enabled on all approved commercial tables, and all required runtime functions are executable.
6. Configure the server-side `MMS_COMMERCIAL_DATABASE_URL` with the least-privilege runtime role credentials.
7. Keep `MMS_COMMERCIAL_DATABASE_ENABLED=false` until the runtime driver is installed and the structural/smoke checks pass.

## Partner application submission controls

Migration `0006_mms_partner_application_submission.sql` governs Partner-originated application creation. A Partner may submit only for a lead they currently own and only once that lead is Qualified. The Partner must be Active, selling-enabled, CRM-enabled and hold a current non-revoked certification. Submission is CSRF-protected at the HTTP boundary, idempotent at the database boundary and will not allow two simultaneous non-terminal applications for the same lead. The Partner ID is always derived from the authenticated session; it is never accepted from the browser request body.

## Application review and payment intake controls

Migration `0007_mms_application_review_and_payment_intake.sql` adds the controlled internal review state machine and the payment-recording boundary.

Application review requires an explicit expected state so stale operators cannot silently overwrite another review decision. The allowed pre-payment flow is `Submitted → Under Review / Documents Outstanding / Rejected / Withdrawn`, `Under Review → Documents Outstanding / Approved / Rejected / Withdrawn`, `Documents Outstanding → Under Review / Rejected / Withdrawn`, then `Approved → Payment Pending / Withdrawn`. Every transition appends an immutable workflow event. Moving to Payment Pending also advances the commercial lead to Payment Pending. Rejected and Withdrawn transitions update the commercial lead accordingly.

Payment creation is not a Partner-facing mutation. A Finance/gateway-authorized server path records the payment only after the application is Payment Pending. The call is idempotent, requires a durable transaction reference, positive minor-unit amount, ISO-style three-letter currency and an audit actor, and refuses a second live payment while an existing payment is still Pending, Submitted, Cleared, refunded or under chargeback. A new attempt is possible only after an earlier payment has Failed.

## Financial workflow controls

Migration `0005_mms_financial_workflow_hardening.sql` makes Finance payment verification and membership activation retry-safe, rejects mismatched replays, and enforces a database commission state machine. Commission cannot move directly from Eligible to Paid; Finance approval must happen first. A Paid transition requires a payout batch ID and payout reference. A Paid commission that is subsequently reversed requires a full clawback equal to the approved commission amount.

The runtime role is intentionally not granted DELETE privileges. Immutable audit/event tables remain append-only. Because the commercial schema uses PostgreSQL row-level security, the provisioning script installs explicit policies for the approved commercial tables. Future tables remain inaccessible until deliberately added to the provisioning allow-list.

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
11. Move a QA lead to Qualified, submit an application through `POST /api/partner-hub/applications`, retry with the same Idempotency-Key and confirm the same application is returned without a duplicate workflow event.
12. Exercise review transitions through the protected internal application-transition endpoint and confirm stale expected-state attempts are rejected.
13. Advance an approved application to Payment Pending, record a payment through the Finance-authorized payment-record endpoint, retry with the same Idempotency-Key and confirm the same payment is returned.
14. Confirm a changed payload with the same payment Idempotency-Key and a second live payment for the same application are both rejected.
15. Exercise an exact retry of Finance payment verification and membership activation and confirm no duplicate workflow event is created.
16. Exercise commission transitions through Eligible → Approved → Paid and confirm Eligible → Paid is rejected.
17. Exercise Paid → Reversed and confirm anything other than a full approved-amount clawback is rejected.

## Acceptance criteria

The environment is ready for Partner Hub integration testing only when:

- all seven required migrations are present in the migration manifest;
- the structural database probe is ready;
- the runtime transaction round-trip succeeds;
- the runtime role can read/write approved commercial rows through explicit RLS policies;
- the runtime role cannot CREATE in the MMS schema;
- the runtime role cannot DELETE Partner records;
- immutable audit/event tables cannot be updated or deleted by the runtime role;
- Partner application submission is owned-lead-only, certification-gated, CSRF-protected and idempotent;
- application review uses explicit expected-state transitions with immutable audit events;
- payment submission is server-only, Payment-Pending-only and idempotent;
- payment verification and membership activation are retry-safe;
- the commission state machine rejects direct Eligible-to-Paid transitions;
- Paid commission reversals require full clawback;
- the QA Partner is Active, selling-enabled, certified and has complete controlled training;
- Partner-facing APIs derive Partner identity exclusively from the verified session;
- Lead registration remains CSRF-protected and idempotent;
- no Partner-facing API or fixture contains clinical/patient information.

## Production gate

Do not enable production Partner Hub access from the QA bootstrap. The QA bootstrap must remain disabled in production. Production activation additionally requires the selected Partner identity provider, production secrets, a clean production database migration run, security review, and successful end-to-end testing without QA fixtures.
