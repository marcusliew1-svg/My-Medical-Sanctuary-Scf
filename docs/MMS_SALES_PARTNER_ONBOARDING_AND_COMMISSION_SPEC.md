# MMS Sales Partner Onboarding & Commission Operating Specification

Status: internal implementation specification. This is not the final legal Sales Partner Agreement or Finance payout policy.

## 1. Objective

Create one controlled Sales Partner lifecycle from application through activation, referral attribution, verified sales, commission approval and payout without mixing partner commercial data with member clinical records.

## 2. Partner lifecycle

Canonical stages:

1. Applicant
2. Under Review
3. Approved
4. Agreement Pending
5. Training
6. Active
7. Suspended
8. Inactive
9. Rejected

Only `Active` partners who remain selling-enabled may use the referral link as an authorised active representative.

## 3. Partner ID

Format: `MMSP-1001`, `MMSP-1002`, etc.

Rules:
- Allocate only after approval and KYC/due-diligence controls permit issuance.
- Allocation must happen in a transactional system of record; never infer the next ID from browser state, CRM counts or highest-existing-ID logic.
- Partner ID is permanent and must not be recycled.
- A suspended/inactive partner retains the historical ID for auditability.
- Referral URL may use `?ref=MMSP-1001` only after activation.
- QR code must resolve to the same controlled referral URL.

## 4. Activation gate

An applicant can become `Active` only when the complete activation checklist is satisfied:

- Application approval complete.
- KYC/due diligence complete.
- Current controlled Sales Partner Agreement accepted with auditable evidence.
- Required core training complete with module-level evidence.
- Controlled Sales Partner assessment passed with at least 80% overall and 100% on No Medical Claims controls.
- Current certification issued.
- Permanent Partner ID/Partner Code issued.
- CRM/commercial access enabled.
- Compliance acknowledgement completed.

Activation is a controlled status transition, not a free-text field.

## 5. Core training checklist

Training records completion date/version for each controlled module:

1. MMS brand and positioning.
2. Membership tiers and approved package explanations.
3. Ling: approved use, limitations and escalation to humans/qualified professionals.
4. Treatment/service explanations: what can be said and what must be escalated.
5. Medical claims: no diagnosis, prescription or guaranteed outcomes by Sales Partners.
6. Commercial claims: no unapproved income, investment, return or recruitment-chain claims.
7. Referral and lead attribution.
8. Privacy/PDPA and prohibited handling of clinical information.
9. Payment, cancellation/refund and commission eligibility basics.
10. Escalation, complaints and compliance incidents.

Training status:
- Not Started
- In Progress
- Completed
- Refresh Required

A material policy revision must be able to set `Refresh Required` without deleting prior completion history.

## 6. Partner levels

Associate, Senior and Elite progression thresholds remain effective-dated commercial-policy configuration. They must not be hard-coded into public pages, the Partner Hub or calculation logic until formally approved.

Chairman is a separate leadership qualification and is never automatically awarded solely from a monthly transaction threshold.

Level calculations must use verified transaction data, not self-declared activity.

## 7. Commission policy data model

Commission percentages and eligible renewal residual rates remain approved, effective-dated Finance policy data.

Each qualifying transaction must permanently retain:
- Commission rule version.
- Rule effective date context.
- Partner level used at eligibility.
- Applicable rate under that version.
- Eligible revenue.
- Gross commission.
- Adjustment and approved commission amounts.

Do not hard-code unresolved commission rates in website copy, APIs or dashboard logic.

Renewal residual commission must not be generated until the package is fully utilised, a genuine renewal occurs, and the approved residual rule is in force.

## 8. Commission ledger

Use one immutable/auditable commission transaction per qualifying sale or eligible renewal.

Minimum fields:
- Commission transaction ID
- Partner ID
- Application/payment/membership references
- Member/customer commercial reference (non-clinical)
- Membership code: ASCEND / EVOLVE / ETERNA / PINNACLE
- Payment transaction reference
- Eligible revenue and currency
- Commission rule version
- Partner level at eligibility
- Applicable commission rate
- Gross commission
- Adjustment/chargeback amount
- Approved commission
- Status
- Eligibility/approval/payout audit metadata
- Payout batch/reference
- Paid date
- Reversal/clawback data where applicable

Statuses:
- Pending Eligibility
- Eligible
- Held
- Approved
- Paid
- Reversed

Never store clinical notes in the commission ledger.

## 9. Eligibility sequence

Controlled commercial sequence:

Referral/lead attribution -> application -> payment submitted -> Finance verification -> payment cleared -> application Paid -> membership activation -> attribution/compliance/cancellation checks -> commission eligibility -> Finance approval -> payout -> immutable paid event.

Rules:
- Browser redirect is not proof of payment.
- Stripe webhook/verified gateway event should be the payment source of truth when Stripe is used.
- A Sales Partner may never mark payment cleared.
- Duplicate transaction references must not create duplicate commission.
- Refunds/chargebacks after approval must create an immutable adjustment/reversal trail, not silently edit history.
- Cancelled membership means zero commission; if already paid, record a 100% clawback.
- Partial-refund commission treatment remains manual until an approved versioned Finance formula exists.
- Manual adjustments require operator identity, date and reason.

## 10. Referral and lead attribution

Rules:
- Accept a valid Partner ID in `ref` when a visitor arrives through an authorised partner link.
- Normalise to uppercase and validate the `MMSP-####` format.
- Persist referral attribution only through the approved commercial path.
- Lead registration requires recorded current-version PDPA/marketing consent.
- Duplicate review must clear before a lead progresses normally.
- Lead ownership transfers must append immutable old-owner/new-owner/reason/approver/timestamp events.
- Do not expose member health information to the referring partner.
- Define final attribution-window, conflict, direct-MMS lead and reassignment rules before live commission settlement.

## 11. Zoho target architecture

Long term: dedicated Sales Partners module plus transactional commercial stores for lead, payment, membership and commission records.

Current connected Zoho edition does not support creating the preferred custom Sales Partner module, so temporary Leads intake remains an interim applicant record only.

Permanent Partner IDs, financial records and immutable commission events must not be implemented using CRM Description text as the long-term system of record.

## 12. Partner Hub boundaries

Future approved Partner Hub may show commercial-only information such as:
- Partner ID
- Referral link/QR while Active/selling-enabled
- Current level
- Lead ownership/status
- Commercial membership activation counts/status
- Pending/eligible/held/approved/paid commission summaries
- Payout history
- Training/certification/compliance status
- Approved marketing assets and notices

Suspended or Inactive Partners may retain appropriate read-only commercial history but cannot register new leads or share an active selling referral link.

The Partner Hub must not show clinical records, health questionnaires, clinician notes, diagnoses, laboratory data, medication, imaging, treatment recommendations or medical-utilisation detail.

## 13. Administrative controls

Role separation:
- Sales/Operations: application review and commercial attribution.
- Compliance: compliance approval, suspension and incident controls.
- Finance: payment verification, commission approval, payout and adjustment/reversal.
- System administrator: configuration/permissions only; should not be the sole approver for commercial payouts.

Finance-sensitive mutations use a Finance-specific service credential, separate from ordinary internal Sales Partner tooling.

## 14. Go-live blockers

Do not enable public activation, Partner Hub selling controls or commission settlement until:
- A dedicated MMS transactional commercial store is provisioned.
- Atomic Partner ID allocation is provisioned.
- Partner-scoped authentication/session controls are implemented for the Partner Hub.
- Sales Partner Agreement is approved.
- Final commission qualification/rate rules are approved and versioned.
- Finance approves payout cycle/timing.
- Partial-refund commission treatment is approved.
- Training/assessment content and versioning are ready.
- Privacy/PDPA wording is approved.
- Referral attribution conflict rules are approved.
- Production rate limiting and operational monitoring are in place.

## 15. Implementation sequence

1. Applicant intake persistence.
2. Approval/KYC workflow.
3. Agreement evidence.
4. Training + controlled assessment + certification.
5. Transaction-safe Partner ID allocation.
6. Activation transition and referral link release.
7. Partner Lead Registry with duplicate/ownership history.
8. Application/payment/membership commercial workflow.
9. Finance verification and membership activation.
10. Versioned CommissionTransaction ledger.
11. Finance approval/payout/reversal workflow.
12. Partner Hub commercial-only read model and Partner-scoped authentication.

The typed implementation under `src/lib/` provides the current lifecycle, evidence, commercial, commission and Partner Hub contracts. Persistence and permanent identifiers remain server-side and transactional.
