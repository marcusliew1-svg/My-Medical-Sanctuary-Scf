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

Only `Active` partners may use an MMS Partner ID/referral link as an authorised active representative.

## 3. Partner ID

Format: `MMSP-1001`, `MMSP-1002`, etc.

Rules:
- Allocate only after approval.
- Allocation must happen in a transactional system of record; never infer the next ID from browser state or a public API response.
- Partner ID is permanent and should not be recycled.
- A suspended/inactive partner retains the historical ID for auditability.
- Referral URL may use `?ref=MMSP-1001`.
- QR code must resolve to the same controlled referral URL.

## 4. Activation gate

An approved applicant can become `Active` only when all four conditions are true:

- Approval completed.
- Sales Partner Agreement completed.
- Core training completed.
- Compliance acknowledgement completed.

Recommended system behaviour: activation is a controlled status transition, not a free-text field.

## 5. Core training checklist

Training should record completion date/version for each module:

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

A material policy revision should be able to set `Refresh Required` without deleting prior completion history.

## 6. Partner levels

Operating level framework based on verified completed memberships in the applicable month:

- Associate: 0-5 memberships/month.
- Senior: 6-15 memberships/month.
- Elite: 16+ memberships/month.
- Chairman: separate leadership qualification; never auto-awarded solely from the 16+ rule.

Level should be computed from verified transactions, not self-declared activity.

## 7. Commission policy data model

Current commercial framework recorded for implementation preparation:

- Base commission: 10%.
- Upgraded base tier: 15%.
- Personal-target tier: 18%.
- Group-target tier: 23%.
- Eligible following-year renewal residual: 2%, subject to utilisation/renewal and approved policy conditions.

These rates must remain policy/configuration data rather than scattered hard-coded calculations across pages.

Payout timing is NOT finalised. Do not publish T+7/T+14/twice-monthly as fact until Finance approves the formal payout cycle.

## 8. Commission ledger

Use one immutable/auditable ledger row per qualifying transaction or renewal.

Minimum fields:
- Partner ID
- Member/customer reference (non-clinical)
- Membership code: ASCEND / EVOLVE / ETERNA / PINNACLE
- Transaction/payment reference
- Payment cleared date
- Cleared amount
- Applicable commission rule/rate
- Gross commission
- Adjustment/chargeback amount
- Approved commission
- Payout status
- Payout cycle/reference
- Paid date
- Approval/audit metadata
- Notes/reason code

Payout statuses:
- Pending
- Approved
- Held
- Paid
- Reversed

Never store clinical notes in the commission ledger.

## 9. Eligibility sequence

Recommended transaction state machine:

Referral captured -> membership purchased -> payment verified -> refund/cancellation window/policy check -> attribution check -> compliance check -> commission calculated -> approved -> payout scheduled -> paid.

Rules:
- Browser redirect is not proof of payment.
- Stripe webhook/verified payment event should be the payment source of truth when Stripe is used.
- Duplicate transaction references must not create duplicate commission.
- Refunds/chargebacks after approval must create an adjustment/reversal trail, not silently edit history.
- Manual adjustments require operator identity, date and reason.

## 10. Referral attribution

Recommended rules:
- Accept a valid Partner ID in `ref` when a visitor arrives through an authorised partner link.
- Normalise to uppercase and validate the `MMSP-####` format.
- Persist referral attribution only through the approved commercial/CRM path.
- Do not expose member health information to the referring partner.
- Define Finance/Operations rules for attribution conflicts, direct MMS leads, expired referrals and reassignment before go-live.

## 11. Zoho target architecture

Long term: dedicated `Sales Partners` module plus related commission/referral records.

Sales Partner master fields should include:
- Partner ID
- Name/contact details
- Territory
- Lifecycle stage
- Partner level
- Referrer/Sponsor Partner ID
- Agreement status/date/version
- Training status/date/version
- Compliance status/date/version
- Activation date
- Suspension/inactive reason
- Bank/tax payout profile reference (restricted access)

Current Zoho One Trial limitation prevents the preferred custom module, so temporary Leads intake must remain clearly temporary.

## 12. Portal boundaries

Future approved Partner Portal may show:
- Partner ID
- referral link/QR
- lead/prospect attribution status
- completed membership sales
- pending/approved/paid commission
- payout history
- training/compliance status
- approved marketing assets and notices

It must not show member clinical records, health questionnaires, clinician notes, diagnoses, laboratory data or treatment details beyond the minimum commercial membership reference required for attribution.

## 13. Administrative controls

Recommended role separation:
- Sales/Operations: application review and commercial attribution.
- Compliance: compliance approval, suspension and incident controls.
- Finance: commission approval, payout and adjustment/reversal.
- System administrator: configuration/permissions only; should not be the sole approver for commercial payouts.

## 14. Go-live blockers

Do not enable public partner submission/activation/commission promises until:
- Zoho or another approved system of record accepts the application reliably.
- Sales Partner Agreement is approved.
- Final commission qualification rules are approved.
- Finance approves payout cycle/timing.
- Refund/cancellation interaction with commission is approved.
- Training content and versioning are ready.
- Privacy/PDPA wording is approved.
- Referral attribution conflict rules are approved.
- Shared/platform rate limiting is in place.

## 15. Implementation sequence

1. Intake persistence to Zoho/approved system.
2. Approval workflow.
3. Transaction-safe Partner ID allocation.
4. Agreement + training + compliance status capture.
5. Activation transition.
6. Referral link/QR capture.
7. Stripe/payment-to-membership transaction record.
8. Commission ledger calculation.
9. Finance approval/payout workflow.
10. Partner Portal read-only views.

The helper logic in `src/lib/salesPartnerPolicy.ts` provides the initial typed rules for lifecycle, activation, Partner ID format, level calculation and commission arithmetic. Persistence and ID allocation must remain server-side and transactional.