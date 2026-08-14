# MMS Partner Hub Data Model v1

## Purpose
The Partner Hub is the commercial operating layer for MMS partners. It must not become a shadow medical-record system.

## Core records

### Partner
- internal partner id
- partner code
- identity and contact details
- onboarding / KYC state
- agreement state
- training and certification state
- commercial tier
- active / suspended state
- created / updated timestamps

### Lead
- lead id
- owning partner id
- prospect name
- permitted contact details
- source / relationship
- non-medical package interest
- sales stage
- active / closed state
- duplicate-match keys
- created / updated timestamps

### Lead Ownership Event
Ownership is event-based, not a mutable field with no history.

Events:
- granted
- transferred
- released

Each event stores the destination partner, reason, approving user where required and timestamp.

### Membership Application
Commercial-only record:
- application id
- lead id
- partner id
- package
- status
- payment reference/status
- cooling-off status
- activation/cancellation/refund status

Do not store screening results, diagnoses, prescriptions, doctor notes or confidential Ling health conversations here.

### Commission Rule Version
Each sale must retain the rule version applicable when qualified. Fields should support:
- effective dates
- package / tier
- base rate
- approved campaign modifiers
- renewal rules
- payout schedule
- cancellation/refund treatment
- approval authority

Unresolved percentages remain configuration, not hard-coded business logic.

### Commission Ledger
Append-only financial events:
- accrual
- approval
- payout
- reversal
- recovery

Cancelled/refunded membership rule:
- commission entitlement = zero
- if unpaid, any accrual is reversed
- if already paid, create full reversal and recovery obligation for the commission attributable to that cancelled/refunded sale

Historical ledger entries are never edited to hide prior events.

## Role separation
Partner:
- own leads, own applications, own commission statements, approved materials

Sales Admin:
- duplicate review, ownership transfer, partner administration

Finance:
- payment verification, commission approval/payout/recovery

Compliance:
- conduct review, material approval, suspension, commission reversal where policy requires

Management:
- rule approval and authorised exceptions

System Admin:
- technical administration only; no general authority to alter commercial outcomes

## CRM boundary
Existing MMS infrastructure requires all Zoho credentials to remain server-side and the active Zoho organisation to be explicitly MMS. Partner Hub adapters must reuse this boundary rather than create a second unmanaged CRM.

Recommended production pattern:
Partner Hub UI -> server APIs -> PartnerHubRepository -> MMS source of truth / Zoho integration

No `NEXT_PUBLIC_ZOHO_*` secrets.

## Production gates
Before live partner use:
1. Real authentication and session management.
2. Role/permission enforcement server-side.
3. Persistent repository adapter.
4. MMS Zoho organisation verification.
5. Duplicate and ownership-lock transaction safety.
6. Immutable/auditable commission ledger.
7. Finance and compliance approval identities.
8. Security logging and data-retention policy.
9. Preview tests with synthetic data before live CRM writes.
