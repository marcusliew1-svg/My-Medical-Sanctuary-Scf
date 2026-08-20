# MMS staging activation runbook

This runbook is for the dedicated My Medical Sanctuary commercial environment only. Never apply these steps to iPivot or to any clinical/patient database.

## Deployment discipline

Vercel deployments are intentionally conserved. Batch related repository changes into one branch update, wait for GitHub CI once, and avoid manual Vercel redeploys while the Partner Hub is still behind feature gates.

## Database bring-up order

1. Provision a dedicated PostgreSQL database for MMS commercial data.
2. Apply migrations `0001` through `0005` in order.
3. Apply `database/provision/001_mms_commercial_runtime_role.sql` as an operator. This creates the least-privilege `mms_commercial_app` role required by later migration GRANT statements.
4. Apply migrations `0006` through `0017` in order.
5. Re-run `database/provision/001_mms_commercial_runtime_role.sql` so the runtime role receives privileges on every function now present.
6. Assign LOGIN credentials to `mms_commercial_app` outside source control.
7. Run `database/provision/002_mms_commercial_runtime_role_verify.sql` and confirm the denied privileges remain false, RLS is enabled, and all required runtime functions are executable.
8. Configure `MMS_COMMERCIAL_DATABASE_URL` with the least-privilege runtime credentials.
9. Keep `MMS_COMMERCIAL_DATABASE_ENABLED=false` until structural and smoke checks pass.

## Controlled commercial flow

Migration `0005` makes Finance payment verification and membership activation retry-safe and establishes the persisted commission state machine. Exact retries are no-ops; mismatched replays fail. Eligible commission cannot move directly to Paid, and a Paid reversal requires full clawback.

Migration `0006` governs Partner-originated application submission: authenticated Partner identity only, owned Qualified lead only, Active/selling/CRM-enabled/current-certified Partner only, CSRF at HTTP boundary and idempotency at the database boundary.

Migration `0007` governs internal application review and payment intake. Review uses an explicit expected state and immutable workflow events. Payment submission is server-side only, requires a Payment Pending application, durable transaction reference, positive minor-unit amount, currency, audit actor and Idempotency-Key.

Migration `0008` fills the gap between Finance clearance and activation. A pending commercial membership may be prepared only after the application is Paid, the payment is Cleared and durable Finance verification evidence exists. Preparation is idempotent by application/member reference and accepts no clinical information.

Migration `0009` creates the initial-sale CommissionTransaction only after the application is Activated, payment remains fully Cleared with durable verification evidence, membership is Active and uncancelled, Partner attribution is intact, the Partner is Active/selling/CRM-enabled with compliance acknowledgement and current certification, and exactly one approved effective-dated commission rule applies. Partner level, commission rate, rule version and eligibility booleans are derived from persisted database state; they are never accepted from the caller. Partial refunds remain blocked pending an approved Finance formula. No downline, equaliser or breakaway transaction is created.

Migration `0010` controls membership cancellation and commission reversal. Cancellation is commercial-only, appends immutable workflow evidence and reverses the related commission transaction; a commission already marked Paid requires a 100% clawback of the approved amount. Payment/refund state remains a separate Finance concern.

Migration `0011` controls lead ownership transfer. Every transfer records old owner, new owner, reason, approver and timestamp. Transfers require the expected current owner, an eligible certified destination Partner and are locked once application attribution exists.

Migration `0012` adds immutable duplicate-review decisions and requires `duplicate_status = Clear` before Partner application submission. Confirmed duplicates move to the Duplicate lead stage, while application-linked leads cannot have their duplicate decision silently rewritten.

Migration `0013` governs Partner-owned lead progression: Registered → Accepted → Contacted → Qualified, with Lost/Withdrawn exits. Forward progression requires duplicate clearance, expected-stage locking, current Partner selling eligibility and immutable lifecycle events.

Migration `0014` aligns the persisted commission state machine with the Finance API. A hold can only be placed from Eligible; a Held commission must be released back to Eligible before approval; an Approved commission cannot be put back on hold. Reversal remains available from Eligible, Held, Approved or Paid, with a full clawback required after payment.

Migration `0015` hardens initial-sale commission eligibility with defense-in-depth evidence: accepted Partner agreement version/timestamp, compliance version/timestamp, Clear lead duplicate status, intact lead ownership attribution and certification issued/current at the eligibility timestamp.

Migration `0016` hardens lead transfer certification timing so a destination Partner certification must have been issued by, and remain current at, the ownership-transfer timestamp.

Migration `0017` hardens Partner lead registration so the Partner must be Active, selling-enabled, CRM-enabled and certified with a certification issued/current at the registration timestamp.

The runtime role has no DELETE privilege. Audit/event tables remain append-only. RLS policies are explicit and future tables remain fail-closed until deliberately provisioned.

## Non-production Partner Hub test order

1. Apply migrations through `0017`, provision/re-provision the runtime role, and run the runtime verification SQL.
2. Run the persistent Partner Hub and commerce QA fixtures (`001` through `004`) and their verification queries only in a disposable non-production database.
3. Run `005_partner_lead_controls_transactional.sql`; confirm duplicate clearance, lead progression, stale-stage rejection, ownership transfer/replay and post-application ownership locking all pass and the script rolls back.
4. Run `006_commission_state_machine_transactional.sql`; confirm Eligible → Paid is rejected, Eligible → Held is allowed, Held → Approved is rejected until release, Held → Eligible → Approved → Paid → Reversed succeeds, partial Paid clawback is rejected, full clawback succeeds, payout evidence remains retained, five successful commission events exist, and the script rolls back.
5. Run `007_partner_provenance_and_certification_time_transactional.sql`; confirm future-issued certification cannot qualify an earlier lead transfer, commission creation rejects non-Clear duplicate review and missing accepted Partner agreement evidence, and valid commercial provenance succeeds.
6. Run `008_partner_lead_registration_eligibility_transactional.sql`; confirm future-issued certification and disabled CRM access block lead registration, while an eligible Partner can register one lead and exact idempotency replay does not duplicate it.
7. Enable the MMS commercial database and Partner Hub only in non-production.
8. Require `GET /api/internal/commerce/database-readiness` and `GET /api/internal/commerce/database-smoke-test` to report ready.
9. Enable the QA bootstrap only in non-production and issue the QA Partner session for `MMSP-99990001`.
10. Test dashboard, Leads, Applications, Academy, Presentation Centre, Commission Wallet, Referral Tools and Sign Out.
11. Test Partner lead registration, duplicate review, Registered → Accepted → Contacted → Qualified progression, application submission and ownership locking.
12. Exercise application review to Payment Pending and record a payment; confirm payment Idempotency-Key replay behavior.
13. Verify payment through Finance, then repeat the exact HTTP request and confirm `already_verified` with no duplicate workflow events.
14. Prepare the pending membership through `POST /api/internal/commerce/memberships/prepare`, repeat the same preparation and confirm the same membership is returned.
15. Activate the membership, repeat the exact HTTP request and confirm `already_activated` with no duplicate workflow events.
16. Publish a clearly non-production approved effective-dated commission rule for the QA timestamp. Do not copy draft/public marketing percentages into this rule.
17. Call `POST /api/internal/commerce/commissions/eligibility` with only the activated application ID and audit actor. Confirm Partner level, rule version and rate are derived by the server/database and the second call returns `already_eligible`.
18. Confirm eligibility is rejected for an inactive/cancelled membership, non-Cleared/refunded payment, expired/revoked/future-issued Partner certification, disabled selling/CRM access, missing agreement/compliance evidence, non-Clear duplicate status, broken lead attribution, absent rule or overlapping rules.
19. Exercise commission hold/release, approval, payout and cancellation reversal. Confirm a Held commission cannot be approved until it is released and a Paid reversal requires the full approved amount as clawback.
20. Exercise membership cancellation and confirm an unpaid commission reverses with zero clawback while a Paid commission records full clawback.

## Acceptance criteria

The environment is ready for Partner Hub integration testing only when all seventeen required migrations are present, the structural/smoke probes pass, runtime least privilege and RLS checks pass, transactional QA suites `005` through `008` pass cleanly, Partner/application/payment/membership retries are safe, commission eligibility is database-derived and retry-safe, Partner identity is session-derived, Partner mutations remain CSRF protected, and no Partner-facing API or fixture contains clinical/patient information.

## Production gate

Do not enable production Partner Hub access from the QA bootstrap. Production activation additionally requires the selected Partner identity provider, production secrets, a clean production database migration run, security review, successful end-to-end testing without QA fixtures, and an operational MMS PostgreSQL runtime client.
