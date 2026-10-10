# T6.47 — MMS Commercial Journey Assurance

Status: **IMPLEMENTED IN FEATURE BRANCH; CI / PREVIEW PENDING**. Production, main, external Zoho records and patient data must not be modified.

## Objective
Verify the complete commercial journey before authorizing any go-live: partner approval, training and certification, lead registration, duplicate review and ownership, application transition, payment verification, membership activation, commission eligibility/approval/payment, cancellation and clawback.

## What is demonstrably present in integration
- Authenticated Partner Hub and commercial-only views.
- Database-backed lead ownership and duplicate review endpoints.
- Operations/Finance role guards on internal commercial mutations.
- Membership cancellation and commission reversal in one SQL transaction.
- Restricted/approved current materials in the Partner Presentation Centre.
- Zoho identity/readiness preflight and commercial readiness fails closed.

## T6.47 work
A cross-workflow regression suite now runs in GitHub CI and checks route role/actor requirements, cancellation/reversal connection, Presentation Centre approval and effective-time conditions, CRM tenant preflight and readiness.

These are **contract/source-level checks**, not a claim that a full live operator transaction has been completed.

## Live Preview evidence
The MMS Preview database contains procedures for lead registration, duplicate review, commission transition and membership cancellation/reversal, as seen in read-only information_schema inspection. This verifies *presence*, not functional execution.

## Actual launch blockers / not yet demonstrated
1. Trusted MMS Supabase operator identities and role claims; no direct auth.users SQL edits.
2. MMS-specific Zoho connection/credentials and field metadata. Zoho account listing shows an existing 'My Medical Sanctuary' organization but current default connected context is iPivot. Never export MMS leads to iPivot.
3. Vercel Preview environment-variable access (403 at last check).
4. Realistic synthetic end-to-end database transaction with authorization and controlled rollback/cleanup, plus user acceptance by Operations and Finance.
5. Independent Medical Director/legal/privacy/regulatory/licensing/insurance approvals where relevant.

## Go/no-go
**NO-GO for public or clinical Production activation.** CI and Preview build success alone do not meet operating acceptance criteria.
