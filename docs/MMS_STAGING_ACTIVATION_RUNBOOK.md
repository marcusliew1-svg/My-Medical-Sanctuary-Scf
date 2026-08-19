# MMS staging activation runbook

This runbook is for the dedicated My Medical Sanctuary commercial environment only. Never apply these steps to iPivot or to any clinical/patient database.

## Deployment discipline

Vercel deployments are intentionally conserved. Batch related repository changes into one branch update, wait for GitHub CI once, and avoid manual Vercel redeploys while the Partner Hub is still behind feature gates.

## Database bring-up order

1. Provision a dedicated PostgreSQL database for MMS commercial data.
2. Apply migrations `0001` through `0005` in order.
3. Apply `database/provision/001_mms_commercial_runtime_role.sql` as an operator. This creates the least-privilege `mms_commercial_app` role required by later migration GRANT statements.
4. Apply migrations `0006` through `0008` in order.
5. Re-run `database/provision/001_mms_commercial_runtime_role.sql` so the runtime role receives privileges on every function now present.
6. Assign LOGIN credentials to `mms_commercial_app` outside source control.
7. Run `database/provision/002_mms_commercial_runtime_role_verify.sql` and confirm the denied privileges remain false, RLS is enabled, and all required runtime functions are executable.
8. Configure `MMS_COMMERCIAL_DATABASE_URL` with the least-privilege runtime credentials.
9. Keep `MMS_COMMERCIAL_DATABASE_ENABLED=false` until structural and smoke checks pass.

## Controlled commercial flow

Migration `0006` governs Partner-originated application submission: authenticated Partner identity only, owned Qualified lead only, Active/selling/CRM-enabled/current-certified Partner only, CSRF at HTTP boundary and idempotency at the database boundary.

Migration `0007` governs internal application review and payment intake. Review uses an explicit expected state and immutable workflow events. Payment submission is server-side only, requires a Payment Pending application, durable transaction reference, positive minor-unit amount, currency, audit actor and Idempotency-Key.

Migration `0005` makes Finance payment verification and membership activation retry-safe and enforces the commission state machine. Exact retries are no-ops; mismatched replays fail. Eligible commission cannot move directly to Paid, and a Paid reversal requires full clawback.

Migration `0008` fills the gap between Finance clearance and activation. A pending commercial membership may be prepared only after the application is Paid, the payment is Cleared and durable Finance verification evidence exists. Preparation is idempotent by application/member reference and accepts no clinical information.

The runtime role has no DELETE privilege. Audit/event tables remain append-only. RLS policies are explicit and future tables remain fail-closed until deliberately provisioned.

## Non-production Partner Hub test order

1. Apply the Partner Hub and commerce QA fixtures and run their verification queries.
2. Enable the MMS commercial database and Partner Hub only in non-production.
3. Require `GET /api/internal/commerce/database-readiness` and `GET /api/internal/commerce/database-smoke-test` to report ready.
4. Enable the QA bootstrap only in non-production and issue the QA Partner session for `MMSP-99990001`.
5. Test dashboard, Leads, Applications, Academy, Presentation Centre, Commission Wallet, Referral Tools and Sign Out.
6. Submit a Qualified owned lead application and confirm same-key replay returns the same application.
7. Exercise application review to Payment Pending and record a payment; confirm payment Idempotency-Key replay behavior.
8. Verify payment through Finance, then repeat the exact HTTP request and confirm `already_verified` with no duplicate workflow events.
9. Prepare the pending membership through `POST /api/internal/commerce/memberships/prepare`, repeat the same preparation and confirm the same membership is returned.
10. Activate the membership, repeat the exact HTTP request and confirm `already_activated` with no duplicate workflow events.
11. Exercise commission transitions Eligible → Approved → Paid; confirm Eligible → Paid is rejected and Paid reversal requires full approved-amount clawback.

## Acceptance criteria

The environment is ready for Partner Hub integration testing only when all eight required migrations are present, the structural/smoke probes pass, runtime least privilege and RLS checks pass, Partner/application/payment/membership retries are safe, Partner identity is session-derived, Partner mutations remain CSRF protected, and no Partner-facing API or fixture contains clinical/patient information.

## Production gate

Do not enable production Partner Hub access from the QA bootstrap. Production activation additionally requires the selected Partner identity provider, production secrets, a clean production database migration run, security review, and successful end-to-end testing without QA fixtures.
