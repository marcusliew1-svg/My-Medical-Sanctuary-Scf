# Pack 06 — Patient / Partner Auth

Owner group: Auth owner, Security, Identity administrator, Patient eligibility owner, Partner commercial approver and Release manager. Current state: **BLOCKED**. All gates remain off.

Production Supabase project: `ywbqfkhrshmpilgzytpl`. Preview ref `tfwnlmmdrkkfrtmawpma` must never resolve in Production configuration. Publishable keys may be used by the server-side application integration as designed; secret/service-role credentials must never enter public variables or the browser.

## Wiring checklist

| Item | Current state | Required value/evidence | Owner |
| --- | --- | --- | --- |
| `MMS_PATIENT_SUPABASE_URL` | Missing | `https://ywbqfkhrshmpilgzytpl.supabase.co`, Production-only, after approval | Auth owner + Security |
| `MMS_PATIENT_SUPABASE_PUBLISHABLE_KEY` | Missing | Publishable key issued by the same Production project; fingerprint and provenance | Auth owner + Security |
| `MMS_PARTNER_SUPABASE_URL` | Wrong-ref/cross-scoped | Preserve Preview branch value; replace only Production scope with `https://ywbqfkhrshmpilgzytpl.supabase.co` | Release manager + Auth owner |
| `MMS_PARTNER_SUPABASE_PUBLISHABLE_KEY` | Missing | Publishable key issued by the same Production project; fingerprint and provenance | Auth owner + Security |
| Scope isolation | Unproven | Masked before/after inventory proving Production/Preview separation and negative forbidden-ref tests | Release manager + Security |
| Auth URL/templates/SMTP | Not Production-ready | Close domain and SMTP packs and run delivered Patient/Partner flows as separately approved | Auth owner + QA |

## Trusted metadata workflow

Authorization uses server-controlled `app_metadata` only. Never authorize from `user_metadata`.

| Workflow step | Patient | Partner | Evidence required |
| --- | --- | --- | --- |
| Request | Eligibility/onboarding case | Approved commercial Partner case | Immutable case/ticket ID |
| First approval | Patient eligibility owner | Commercial Partner approver | Identity, basis, scope and timestamp |
| Second approval | Independent business reviewer | Independent commercial reviewer | Four-eyes evidence |
| Provisioner | Identity administrator or approved server-side service | Identity administrator | Server-only Admin credential; actor audit |
| Claim | `app_metadata.account_type = "patient"` | `app_metadata.partner_id = <APPROVED_PERMANENT_ID>` | Old/new values, subject and authoritative record |
| Session handling | Revoke before sensitive claim removal/change | Revoke both Supabase and application sessions | Revocation result and negative access test |
| Suspension | Mark ineligible through authoritative workflow and prevent new sessions | Denied commercial stage plus immediate revocation | Reason, approvers and timestamps |
| Emergency | Security revokes sessions/access; retrospective review | Security revokes sessions/access; retrospective review | Incident ID and follow-up approval |

JWT app claims may be stale until refresh. Sensitive access requires the existing server revalidation and revocable application sessions.

## Audit evidence minimum

Case ID, Supabase subject, Patient/Partner authoritative ID where applicable, old/new app metadata, eligibility/commercial evidence, both approvers, provisioner actor, timestamp, reason, environment/project ref, session-revocation result and positive/negative access tests.

## Gate and rollback boundary

Keep `MMS_PATIENT_PORTAL_ENABLED`, `MMS_PATIENT_REGISTRATION_ENABLED` and `MMS_PARTNER_HUB_ENABLED` absent or `false`. Configuration collection does not authorize activation. Rollback removes/rotates Production credentials, restores scoped entries, revokes sessions/claims from the audit record and keeps gates off.

## Approval form

Decision: `[ ] APPROVE CONFIG/E2E PREPARATION  [ ] REJECT  [ ] RETURN FOR CHANGES`  
Patient key fingerprint/evidence ID: `<REQUIRED>`  
Partner key fingerprint/evidence ID: `<REQUIRED>`  
Metadata/revocation drill IDs: `<REQUIRED>`  
Approver names/capacities and dates: `<REQUIRED>`

