# Pack 05 — Booking / CRM

Owner group: CRM owner, Security, Operations, Clinic Manager role, Privacy and QA. Current state: **BLOCKED**. Booking persistence remains off.

## Credential and configuration collection

| Item | Status | Required evidence / handling |
| --- | --- | --- |
| Production Zoho tenant | **BLOCKED** | Tenant identity, approved MMS ownership, region/data location and Production designation |
| `ZOHO_CLIENT_ID` | **BLOCKED** | Production OAuth client ID; record safe fingerprint and custodian, not full value in Git |
| `ZOHO_CLIENT_SECRET` | **BLOCKED** | Write-only Production secret, scope, rotation/revocation owner and evidence ID |
| `ZOHO_REFRESH_TOKEN` | **BLOCKED** | Write-only token with minimum approved scopes, issuing account role, expiry/rotation/revocation evidence |
| `ZOHO_DC` | **BLOCKED** | Exact verified data-centre suffix/region; do not assume `com` |
| `ZOHO_ORGANIZATION_ID` | **BLOCKED** | Verified Production organization ID and read-back evidence |
| `ZOHO_CRM_OWNER_ID` | **BLOCKED** | Verified Day-1 queue/owner ID and backup-routing decision |
| `ZOHO_LEADS_MODULE_API_NAME` | **BLOCKED** | Approved module API name; do not assume `Leads` |
| `MMS_DEFAULT_LEAD_SOURCE` | **BLOCKED** | Exact approved existing picklist value; do not assume `Website Discovery Form` |
| `MMS_CRM_DEBUG` | **BLOCKED** | Exact Production value `false` before testing |

Secrets go directly to the approved Vercel Production Secret scope. Do not expose them to Preview, Development, browser variables, logs or this document.

## Workflow approvals

| Decision | Current status | Required approval/evidence | Owner |
| --- | --- | --- | --- |
| Field mapping and minimization | **BLOCKED** | Source-to-Zoho field matrix, types, required fields, picklists, consent/provenance, and proof that clinical/upload fields are excluded | CRM owner + Privacy + Engineering |
| Dedupe/idempotency | **BLOCKED** | Stable key(s), comparison rules, time window, concurrency behavior, duplicate disposition and audit record | CRM owner + Engineering + Privacy |
| Retry/failure | **BLOCKED** | Retryable/non-retryable classes, capped backoff, timeout, dead-letter/manual queue, alerts and no-sensitive-log rule | Engineering + CRM owner + Security |
| Reconciliation | **BLOCKED** | Source/CRM comparison, owner, cadence, missing/duplicate correction and audit retention | Clinic Manager role + CRM owner |
| Clinic Manager owner | **READY FOR APPROVAL** | Named staffed primary and backup mapped to the approved Clinic Manager role; queue access and training | Operations |
| SLA | **READY FOR APPROVAL** | Final operating hours/calendar, clock definitions, exclusions, escalation destinations and signed targets | Operations + Privacy/Security + Medical as applicable |
| Production E2E | **BLOCKED** | Approved synthetic enquiry create/read/assign/acknowledge/reconcile; duplicate, timeout, failure, alert and rollback evidence | QA + CRM owner + Clinic Manager role |

## Provisional Clinic Manager service package

- Acknowledge a valid booking/enquiry within **1 business hour during operating hours** — **PROPOSED**.
- Escalate an unresolved booking failure within **30 minutes once detected** — **PROPOSED**.
- Handle a patient account-access issue the **same business day** — **PROPOSED**.
- Do not manage urgent clinical issues through website support; direct them to the approved clinical/emergency pathway — pathway still **BLOCKED**.

The Clinic Manager monitors, acknowledges, assigns, escalates technical failures, monitors unresolved support and owns SLA reporting. The role has no clinical decision authority.

## Activation boundary and rollback

Keep `MMS_BOOKING_PRODUCTION_APPROVED` and `MMS_BOOKING_PERSISTENCE_ENABLED` absent or `false`. After this pack closes, credential/configuration writes and gated E2E may be separately authorized; gate activation remains a later release decision. Rollback revokes Zoho credentials, removes Production values, leaves both gates off and reconciles approved synthetic records.

## Approval form

Decision: `[ ] APPROVE CONFIG/E2E PREPARATION  [ ] REJECT  [ ] RETURN FOR CHANGES`  
Credential evidence ID(s): `<REQUIRED; no values>`  
Workflow/SLA/E2E evidence IDs: `<REQUIRED>`  
Approver names/capacities and dates: `<REQUIRED>`

