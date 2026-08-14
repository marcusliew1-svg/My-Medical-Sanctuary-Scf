# MMS Partner Hub Data Model v1

## Purpose
The Partner Hub is the commercial operating layer for MMS partners. It must remain separate from patient medical records and clinical workflows.

## Commercial source-of-truth records
- Partner
- Lead
- Lead ownership event
- Membership application
- Payment verification event
- Commission rule version
- Commission ledger entry
- Material approval record
- Compliance event

## Core rules
1. No certification and no active Partner Code means no commission-bearing sales activity.
2. Lead ownership is event-based and auditable; transfers never rewrite history.
3. Partners do not verify their own payments or approve their own commission.
4. A commission is not Qualified until payment is verified, cooling-off is complete, compliance is cleared and the membership remains active.
5. Cancelled or refunded membership = zero commission.
6. If commission was already paid on a cancelled/refunded membership, the full commission attributable to that sale is reversed and becomes recoverable.
7. Commission rule versions are immutable for historical transactions.
8. Patient medical records, clinical notes, diagnoses, prescriptions and private Ling conversations must never be stored in the Partner Hub.

## Authentication boundary
The Partner Hub fails closed unless an authenticated session is available. The current branch includes only an explicit internal demo-session gate controlled by server-side environment variables. `MMS_PARTNER_HUB_DEMO=false` remains the default. Real production authentication must replace demo sessions before live partner access.

## Roles
- partner
- sales_admin
- finance
- compliance
- management
- system_admin

Role permissions are enforced server-side for commercial actions such as lead creation, payment verification and commission reversal.

## Zoho CRM boundary
A server-side Zoho adapter is included for partner lead duplicate search and lead creation. It follows the existing MMS CRM infrastructure runbook:
- secrets remain server-side only;
- `ZOHO_ORGANIZATION_ID` must be explicitly configured for MMS;
- mock mode (`MMS_CRM_DEBUG=true`) performs no live CRM write;
- partner lead source is separately configurable;
- live Zoho writes must not be enabled until MMS credentials and organisation ownership are confirmed.

## APIs currently defined
- `/api/partner-hub/lead-check`
- `/api/partner-hub/lead-register`
- `/api/partner-hub/application-submit`
- `/api/partner-hub/payment-verify`
- `/api/partner-hub/commission-evaluate`
- `/api/partner-hub/cancel-membership`

These APIs currently define and enforce workflow boundaries. Persistent transaction-safe storage is still required before production.

## Production gates still required
1. Real identity provider / MFA / session management.
2. Persistent commercial data store.
3. Transaction-safe duplicate and ownership locking.
4. Production partner certification lookup rather than demo flags.
5. Finance payment-source integration.
6. Immutable persistent commission ledger.
7. Approved commission percentages and rank qualification rules.
8. Production monitoring and audit exports.
9. Successful build/deployment verification.

## Deployment note
A Vercel infrastructure/account failure must not be treated as proof that application code passed or failed. Use actual build logs or CI results for code validation.
