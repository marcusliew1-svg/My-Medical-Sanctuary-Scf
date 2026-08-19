# MMS Transactional Commercial Database Architecture

Status: implementation architecture. This is commercial-system design, not a clinical data model.

## Objective

Provide one transactional system of record for the MMS Sales Partner lifecycle, Partner Lead Registry, commercial application/payment/membership workflow, commission ledger, Partner Hub sessions and controlled Presentation Centre content.

The database must never be used for diagnosis, treatment recommendations, clinical notes, test results, medication, imaging or other patient clinical records.

## Database boundary

Use a dedicated MMS commercial PostgreSQL database/schema. Do not use:

- iPivot infrastructure or databases
- patient/clinical storage
- browser localStorage/sessionStorage as a system of record
- Zoho Description text as a transactional ledger
- public Partner ID parameters as authorization

The current schema is in `database/migrations/0001_mms_commercial_foundation.sql`.

## Core records

### Partner master

`partners`

Stores permanent commercial identity and onboarding state: Partner Code, CRM record reference, lifecycle stage, level, introducer/sponsor, territory, agreement/compliance evidence references, CRM access and selling-enabled state.

Permanent Partner Codes are allocated centrally from a PostgreSQL sequence through `mms_commercial.allocate_partner_code()`. Do not implement highest-number-plus-one allocation.

### Partner audit/training/certification

- `partner_audit_events`
- `partner_training_evidence`
- `partner_assessment_attempts`
- `partner_certifications`

Historical audit events are immutable. Training and certification retain version/timestamp evidence rather than only a current boolean.

### Partner Lead Registry

- `leads`
- `lead_duplicate_decisions`
- `lead_ownership_events`
- `lead_lifecycle_events`
- `idempotency_keys`

Lead ownership and lifecycle events are immutable. `leads.current_partner_id` and `leads.stage` are current projections for efficient reads, but changes must be backed by append-only events in the same transaction.

Lead IDs are generated centrally by the database. Browser callers do not choose the final Lead ID.

Marketing/PDPA consent version and capture timestamp remain attached to the commercial Lead record. At least one normalized contact method is required.

### Applications, payments and memberships

- `applications`
- `payments`
- `payment_verifications`
- `memberships`
- `commercial_workflow_events`

Finance-cleared payment evidence is immutable. Application Paid state and Payment Cleared state should be committed atomically from one Finance-authorized transaction.

Membership activation requires a matching application, matching membership package and persisted Finance-cleared payment.

### Commission ledger

- `commission_rules`
- `commission_transactions`
- `commission_events`

Every qualifying sale or approved renewal creates a distinct Commission Transaction. The transaction permanently retains the Partner ID, Partner level, approved rule version, rate and commercial references used at eligibility.

Commission rule percentages are configuration/policy data. Do not hard-code them across API routes or frontend pages.

Finance approval, payout and reversal changes append immutable events. A paid cancelled transaction records the required clawback rather than rewriting history.

No automatic downline, equaliser or breakaway compensation is part of this schema.

### Partner Hub identity/session support

- `partner_sessions`
- `partner_csrf_tokens`

Store hashes of opaque session identifiers/tokens, not raw secrets. Sessions are individually revocable, have explicit expiry and are bound to a permanent Partner record.

Partner-facing APIs derive Partner identity from a verified server-side session. Partner IDs supplied in URLs or request bodies are never treated as authorization.

CSRF tokens are session-bound and short-lived. Cookie-authenticated mutations also retain same-origin enforcement.

### Controlled Presentation Centre

`presentation_assets`

Only approved, effective-dated, versioned material is exposed. Partner Hub users are consumers of approved material; they do not directly mutate the official asset register.

## Security baseline

All commercial tables have PostgreSQL Row Level Security enabled with no permissive policies in the foundation migration. This intentionally denies direct public/client access by default.

The preferred first implementation is server-to-database only from trusted MMS server routes. If direct PostgREST/Supabase client access is ever introduced, explicit scoped policies must be designed and security-reviewed first.

Finance-sensitive write paths remain separate from ordinary internal Sales Partner controls.

## Store-contract mapping

Existing TypeScript store contracts map to the database as follows:

- `partnerLeadRegistryStore` → Lead Registry tables and immutable Lead events
- `partnerCommerceStore` → applications, payments, payment verification, memberships and workflow events
- `partnerCommissionRuleStore` → commission_rules
- `partnerCommissionStore` → commission_transactions and commission_events
- `partnerHubStore` → read projections across Partner, Leads, memberships and Commission data plus Academy/Presentation records
- `partnerHubSessionProvider` → partner_sessions
- `partnerHubCsrfProvider` → partner_csrf_tokens

These TypeScript contracts remain fail-closed until a dedicated MMS commercial database is provisioned and the adapters are wired.

## Atomic transaction requirements

The database adapter must use transactions for at least:

1. permanent Partner Code allocation + Partner record update + audit event
2. Lead creation + idempotency-key binding
3. Lead ownership projection update + immutable ownership event
4. Lead lifecycle projection update + immutable lifecycle event
5. Finance payment clearance + verification evidence + Application Paid transition + workflow events
6. membership activation + Application Activated transition + workflow events
7. Commission eligibility creation + immutable eligibility event
8. Finance commission approval/payment/reversal + immutable ledger event
9. Partner suspension/inactivation + selling disablement + active-session revocation

Partial success for these operations is not acceptable.

## Deployment sequence

1. Provision a dedicated MMS commercial PostgreSQL database in the chosen environment.
2. Apply `0001_mms_commercial_foundation.sql` to a non-production database first.
3. Run database security/performance checks.
4. Add server-only database credentials.
5. Implement transactional TypeScript adapters behind the existing store contracts.
6. Add integration tests for concurrency, idempotency, duplicate checks, payment clearing, activation, payout and reversal.
7. Keep `MMS_PARTNER_HUB_ENABLED=false` until authentication/session storage, CSRF and commercial stores all pass end-to-end testing.
8. Only then run controlled Partner Hub user acceptance testing.

## Current infrastructure note

Do not connect this schema to the existing iPivot database/project. MMS commercial persistence must remain operationally and logically separate.
