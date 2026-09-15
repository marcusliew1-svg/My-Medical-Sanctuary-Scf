# T6.6 P0 Blocker Remediation — Stage A

Status: **Stage A implemented; NO-GO for Production.** Baseline: T6.5 PASS WITH BLOCKERS at `556aa58c521660995d83c4ea808f4e0affd151c7` on `mms/integration-next16-foundation`.

This stage contains read-only Production inspection, repository safeguards, truthful public copy, tests, and operator checklists. It makes no Vercel, Supabase, DNS, Production-user, Production-record, feature-gate, iPivot, `main`, or PR #31 change.

## Stage A outcome

| P0 | Stage A classification | Reduction achieved | Remaining authority/evidence |
| --- | --- | --- | --- |
| Legal/privacy/entity readiness | PARTIALLY CLOSED | Interim legal routes and aliases are explicitly non-indexable; a Production build now requires a legal-approval attestation. | Verified entity/controller facts, full notices/terms, qualified counsel review, named owner, approval date and version. |
| Final domain/canonical/Auth callbacks | PARTIALLY CLOSED | Production builds reject missing/mismatched/non-HTTPS URLs, the temporary canonical, Vercel deployment hosts, and missing domain approval. Exact callback contracts are recorded below. | Owner-approved final origin, domain/TLS evidence, redirect plan, and approved Production configuration plus E2E. |
| Booking persistence and Day-1 handoff | PARTIALLY CLOSED | Production is now possible only with both the persistence gate and an independent approval gate; credentials/debug state are preflight-checked. | Destination/mapping/retention approval, duplicate policy, queue ownership/SLA, real Preview and release-candidate E2E, monitoring and rollback drill. |
| Production email/SMTP readiness | BLOCKED | Patient or Partner Auth cannot pass Production preflight without an SMTP E2E approval attestation. | Approved sender/domain, provider, credentials, DNS authentication, templates, deliverability/rate limits, bounce/complaint process, and delivered-link E2E. |
| Production Partner/Patient/commercial DB wiring | PARTIALLY CLOSED | Production preflight rejects Preview/iPivot refs and validates dependencies between gates, identity configuration, SMTP evidence and commercial DB configuration. | Production-scoped values, connection tests, migrations/manifest evidence, identities, RLS/session/revocation E2E and owner approval. |
| `/online-doctor` licensing-safe representation | PARTIALLY CLOSED | English and regional pages now say the pathway is planned and unavailable, contain no provider/platform/booking claim, and are non-indexable. Ling CTAs say “Online doctor status.” | Native-language, Medical, Legal and Regulatory review; operating entity, clinician, jurisdiction, clinical workflow and platform approval before enabling a service. |

`CLOSED` is intentionally not assigned where technical controls cannot establish a legal, operational, clinical or external-service fact.

## Production write approval register

No item in this section has been executed.

### 1. Final origin and canonical variables

- **Current setting:** T6.5 found the repository and deployment relying on the explicitly temporary `https://www.scf.center`; the final MMS Production origin was not owner-approved.
- **Proposed change:** after Brand/Legal/IT approval, set Vercel Production-only `NEXT_PUBLIC_SITE_URL` and `MMS_SITE_URL` to the same exact origin and set `MMS_PRODUCTION_CANONICAL_APPROVED=true` with linked dated evidence.
- **Exact value/scope:** value is **not yet determinable**; it must be the owner-approved `https://<FINAL_MMS_HOST>` origin with no path. Scope: Production only. Never use a `vercel.app` hostname.
- **Risk:** wrong canonical or origin breaks SEO, same-origin mutations and Auth journeys; premature attestation could bypass governance.
- **Rollback:** restore the prior Production deployment and its environment snapshot; keep all launch gates off.
- **Preview impact:** none when variables are Production-scoped. Preview retains its branch-specific origin.

### 2. Supabase Production Auth URLs and templates

- **Current setting:** Supabase project `ywbqfkhrshmpilgzytpl` is ACTIVE_HEALTHY. T6.5 found its Site URL set to localhost, redirect list empty, and Production templates unverified.
- **Proposed change:** set Site URL to the approved final origin; allow only the exact patient callback and any separately reviewed Partner callback; use direct token-hash application callbacks in confirmation and recovery templates.
- **Exact value/scope:** Supabase Production/main project `ywbqfkhrshmpilgzytpl` only:
  - Site URL: `https://<FINAL_MMS_HOST>`
  - patient allow-list: `https://<FINAL_MMS_HOST>/api/patient-auth/callback`
  - confirmation href: `https://<FINAL_MMS_HOST>/api/patient-auth/callback?token_hash={{ .TokenHash }}&type=signup`
  - recovery href: `https://<FINAL_MMS_HOST>/api/patient-auth/callback?token_hash={{ .TokenHash }}&type=recovery`
  - Partner callback, if Day 1 is approved: `https://<FINAL_MMS_HOST>/api/partner-auth/callback`
  The host cannot be made exact until the final-origin decision is supplied. Templates must link directly to the application callback and must not depend on a Supabase-hosted verification hop.
- **Risk:** incorrect host, path or type causes invalid/expired link failures or redirects users to the wrong trust domain.
- **Rollback:** restore the exported Auth URL/template snapshot; keep Patient and Partner gates off.
- **Preview impact:** none. Do not edit Preview branch `tfwnlmmdrkkfrtmawpma`; its stable Preview callback remains separately configured.

### 3. Production SMTP

- **Current setting:** custom SMTP disabled in Production at T6.5; delivered Production signup/recovery evidence absent.
- **Proposed change:** configure an owner-approved transactional provider/sender, verify SPF/DKIM/DMARC and sender identity, then run fresh signup and recovery delivered-link tests before setting `MMS_PRODUCTION_SMTP_E2E_APPROVED=true`.
- **Exact value/scope:** Production Supabase project `ywbqfkhrshmpilgzytpl` only. Host, port, username, password, sender address and sender name are **not supplied** and must not be guessed or recorded in this repository.
- **Risk:** loss of Auth access, spam placement, spoofing, provider throttling, secret exposure, or messages from an unapproved entity.
- **Rollback:** disable custom SMTP or restore the provider snapshot; revoke replaced credentials; keep Auth feature gates off.
- **Preview impact:** none unless the same provider credential is intentionally shared, which is not recommended.

### 4. Vercel Production Supabase and commercial database wiring

- **Current setting:** T6.5 found `MMS_PARTNER_SUPABASE_URL` cross-scoped to Production and Preview; required Production Patient/Partner keys and commercial DB variables absent; related gates absent and therefore secure-off.
- **Proposed change:** replace the cross-scoped value with independently scoped entries, wire Production to MMS Production/main only, and enable no feature until its E2E and owner approval are complete.
- **Exact value/scope:** Vercel project `prj_WMv0MvWOeseW1QoX4hqT2REJ7OIV`, Production only:
  - `MMS_PATIENT_SUPABASE_URL=https://ywbqfkhrshmpilgzytpl.supabase.co`
  - `MMS_PARTNER_SUPABASE_URL=https://ywbqfkhrshmpilgzytpl.supabase.co`
  - publishable-key variables: values from Production/main `ywbqfkhrshmpilgzytpl`, treated server-side by this app
  - `MMS_COMMERCIAL_DATABASE_SCHEMA=mms_commercial`
  - `MMS_COMMERCIAL_DATABASE_URL`: Production/main pooler connection secret for `ywbqfkhrshmpilgzytpl`; exact secret is intentionally unavailable here
  - keep `MMS_PATIENT_PORTAL_ENABLED=false`, `MMS_PATIENT_REGISTRATION_ENABLED=false`, `MMS_PARTNER_HUB_ENABLED=false`, and `MMS_COMMERCIAL_DATABASE_ENABLED=false` until separately approved
- **Risk:** cross-environment data access, trust-domain mixing, unintended user exposure, failed sessions, or writes to the wrong database.
- **Rollback:** restore the versioned Vercel environment snapshot and prior deployment; revoke rotated keys; leave gates false.
- **Preview impact:** Preview must retain branch-specific values for `tfwnlmmdrkkfrtmawpma`; deleting a cross-scoped variable without first preserving its Preview-only replacement would break Preview.

### 5. Booking persistence

- **Current setting:** Production persistence gate and approval are false/absent, so requests remain truthfully unavailable. No approved live Zoho E2E exists.
- **Proposed change:** only after the checklist below, configure Production-only Zoho credentials, set `MMS_CRM_DEBUG=false`, then set `MMS_BOOKING_PRODUCTION_APPROVED=true` and `MMS_BOOKING_PERSISTENCE_ENABLED=true` in the release candidate.
- **Exact value/scope:** Vercel Production only; `ZOHO_LEADS_MODULE_API_NAME=Leads`, `MMS_DEFAULT_LEAD_SOURCE=Website Discovery Form`; OAuth values must come from the approved MMS Zoho tenant and remain secret.
- **Risk:** lost/duplicate/misrouted enquiries, excess data capture, unowned queues, privacy/retention failures or false success responses.
- **Rollback:** set both booking gates false and restore the previous deployment; reconcile all references created during the approved test window.
- **Preview impact:** none when Production-scoped; Preview persistence settings remain unchanged.

## Booking Day-1 handoff checklist

All boxes require named owners and dated evidence:

- Privacy/Legal approves purpose, consent, fields, destination, retention, access and deletion.
- CRM owner verifies the MMS tenant, `Leads` module, every field API name and the Lead Source picklist.
- Operations names primary and backup queue owners, service hours, first-response SLA, escalation and outage intake.
- Product/Operations approves duplicate matching and merge/re-contact policy; no automated policy is inferred by code.
- Security approves OAuth scope, secret rotation, audit access, redaction and distributed abuse controls.
- Preview E2E proves create, CRM read-back, referral attribution, duplicate scenario, provider failure and reconciliation.
- Production release-candidate synthetic proves exactly one traceable record and is deleted or retained under the approved test policy.
- Monitoring alerts on persistence failures without logging personal or secret data; rollback is rehearsed.

## Production release-candidate sequence after approval

1. Export redacted snapshots of Vercel environment scope, Supabase Auth URL/template/SMTP settings and feature gates.
2. Apply only the individually approved Production writes above; never copy Preview or iPivot values.
3. Build with `VERCEL_ENV=production`; the repository preflight must pass.
4. Deploy an isolated release candidate without promoting DNS or Production traffic.
5. Run canonical/SEO, Auth signup/recovery, booking reconciliation, Patient/Partner isolation and commercial DB tests applicable to approved Day-1 scope.
6. Keep every unapproved feature gate false. Record exact evidence and obtain separate promotion authorization.

## Current read-only evidence

- Production Supabase `ywbqfkhrshmpilgzytpl`: ACTIVE_HEALTHY, PostgreSQL 17, Tokyo region; security advisor reports no findings.
- Performance advisor reports 22 unused-index informational notices and an Auth connection-allocation informational notice. These are not T6.6 P0s and no database change is justified by them.
- The branch project ref `tfwnlmmdrkkfrtmawpma` is preserved as the authoritative T6.5 Preview identity; no branch mutation was attempted.
- Supabase current guidance confirms Site URL is the default redirect, redirect destinations must be allow-listed, exact Production paths are recommended, and token-hash templates are verified by the application callback.

## Launch matrix after Stage A

| Surface | State | Reason |
| --- | --- | --- |
| Public informational shell excluding unapproved legal publication and online consultation | AMBER | Technically safer, but final entity, domain, medical/legal and operational approvals remain absent. |
| Booking | RED | Guarded and implementation-ready, but no approved live persistence/handoff E2E. |
| Partner Hub | RED / KEEP GATED | Production identity and DB wiring/E2E absent. |
| My Sanctuary | RED / KEEP GATED | Production Patient identity, SMTP and E2E absent. |
| `/online-doctor` informational status page | AMBER | False availability claims removed; native/Medical/Legal/Regulatory approval still required. |
| Online-doctor service | RED / NOT AVAILABLE | No approved entity, clinicians, jurisdictions, clinical workflow or platform. |

Partner Hub recommendation: **KEEP GATED.** My Sanctuary recommendation: **KEEP GATED.** Overall recommendation after Stage A: **NO-GO** until the remaining dependencies and separately approved Production writes are completed and verified.

## Stage A verification

- T6.3 retained suite: **34/34 passed**.
- Full retained-plus-T6.6 suite: **233/233 passed** (226 retained plus 7 new controls).
- TypeScript: passed with no errors.
- ESLint: zero errors and the same six pre-existing `react-hooks/set-state-in-effect` Partner Hub warnings.
- Next.js 16.3.4 production build: passed; 197 static pages generated.
- Dependency audit: runtime and full audits both report **0 vulnerabilities**.
- Route comparison: **180 normalized / 205 expanded before; 180 / 205 after; zero additions and zero removals**.
- Production Supabase security advisor: no findings. Informational performance notices are documented above; no database write was made.
