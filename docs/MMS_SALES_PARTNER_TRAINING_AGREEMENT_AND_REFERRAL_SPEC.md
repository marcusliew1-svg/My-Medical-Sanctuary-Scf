# MMS Sales Partner Training, Agreement & Referral Specification

Status: implementation specification. Final legal wording remains subject to MMS legal/compliance approval.

## 1. Activation principle

A Sales Partner may not be treated as Active merely because an application was approved.

Required activation conditions:

1. Application approved.
2. Current Sales Partner Agreement accepted/signed.
3. Core training completed.
4. Compliance acknowledgement completed.
5. Required payout/tax details verified.
6. Permanent Partner ID allocated by the system of record.

Only after all required conditions are satisfied should the partner status change to Active.

## 2. Agreement acceptance record

The onboarding system should retain an auditable acceptance record rather than a single editable Yes/No value.

Minimum record:

- Partner record ID
- Agreement version
- Agreement effective date
- Accepted/signed timestamp
- Acceptance method / e-sign provider
- Document reference or immutable storage reference
- IP/device/audit metadata only where permitted and justified
- Status: Pending, Accepted, Superseded, Revoked

A new material agreement version should require re-acceptance before continued Active status if Legal determines this is necessary.

## 3. Core online training

Core modules:

1. MMS brand, vision and positioning
2. Membership tiers and approved package explanations
3. Ling: what it can and cannot do
4. Treatment/service explanation boundaries
5. No diagnosis, prescription or guaranteed medical outcomes by Sales Partners
6. No unapproved earnings, investment, return or recruitment-chain representations
7. Lead/referral handling and attribution
8. Privacy/PDPA and prohibited collection of clinical information
9. Payment, refund/cancellation and commission eligibility basics
10. Complaint, escalation and compliance incident procedure

Each module should store:

- Training module ID
- Version
- Completion timestamp
- Result/pass status if assessed
- Acknowledgement timestamp
- Refresh required flag

Training states:

- Not Started
- In Progress
- Completed
- Refresh Required

## 4. Partner ID

Permanent format:

`MMSP-1001`, `MMSP-1002`, etc.

Rules:

- Allocate only after approval/onboarding conditions are satisfied.
- Never derive the next number in browser code.
- Generate centrally in a transactional system of record.
- Never recycle an ID.
- Suspended/inactive partners keep their historic ID for auditability.

## 5. Referral URL and QR

Canonical form:

`https://<approved-mms-domain>/<landing-path>?ref=MMSP-1001`

QR codes must resolve to the same controlled first-party URL.

Rules:

- Validate Partner ID against the active partner register before commission approval.
- A referral code is an attribution identifier only.
- Do not include health information, diagnosis, treatment interest or clinical information in the referral URL or QR payload.
- Invalid referral values must be ignored rather than trusted.

## 6. Referral attribution

Recommended first-release attribution sequence:

1. Visitor arrives with a valid `ref` parameter.
2. Website normalises and validates the Partner ID format.
3. Website records first-party attribution with timestamp and source path.
4. Customer proceeds to enquiry or membership/payment journey.
5. Referral ID is carried as non-clinical metadata into the relevant commercial transaction.
6. A verified completed transaction becomes eligible for commission review.

Final attribution-window rules, overwrite rules and dispute policy must be approved before live commission settlement.

Until then, avoid publishing promises such as “every click is locked to you for X days”.

## 7. Commission ledger

Use one immutable/auditable ledger row per qualifying commercial transaction or eligible renewal.

Minimum fields:

- Ledger row ID
- Partner ID
- Member/customer commercial reference
- Membership code
- Payment/transaction reference
- Cleared amount
- Currency
- Applicable commission rate
- Gross commission
- Adjustment/chargeback
- Approved commission
- Status: Pending, Approved, Held, Paid, Reversed
- Approval timestamp/user
- Payout batch/cycle
- Paid timestamp/reference
- Notes/reason code

Partners must never be able to edit cleared amount, commission rate, approval or payout status.

## 8. Draft payout operating rule

Recommended operating rule for Finance approval:

- Commission becomes reviewable only after customer funds have cleared.
- Approved commissions are batched weekly.
- Target payment is ordinarily within 14 calendar days after cleared funds.
- Payment remains subject to valid attribution, refund/cancellation, chargeback, compliance, payout-account and tax/document checks.
- A disputed or held item can be carried into a later batch.
- Reversed/refunded sales may create a chargeback/adjustment against unpaid or future commission where the final Agreement permits.

The signed Sales Partner Agreement and final Finance policy prevail.

## 9. Level progression

Verified completed memberships in the applicable measurement month:

- Associate: 0-5
- Senior: 6-15
- Elite: 16+
- Chairman: separate leadership qualification and never automatically granted solely for 16+ memberships

Level calculations must use verified transaction data, not self-reported activity.

## 10. Minimum portal information for Phase 2

Approved active partners may eventually see:

- Partner ID
- Referral URL / QR
- Current level
- Verified completed sales count
- Pending commission
- Approved commission
- Paid commission history
- Training status
- Agreement/compliance status
- Approved marketing materials

No patient clinical information should be visible in the Sales Partner portal.
