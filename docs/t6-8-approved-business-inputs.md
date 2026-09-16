# T6.8 — Approved Business Inputs and Approval Register Update

**T6.8 RESULT: PASS WITH BLOCKERS.** Overall recommendation: **NO-GO**.

Baseline: T6.7 commit `ca3b6c027f7800e4abe3e1e7ad635ff1d337950c` on `mms/integration-next16-foundation`. This record updates the approval register only. It is not authorization to write Production configuration, enable a feature gate, publish legal copy, or activate a service.

## Approved input ledger

| Input | Approved business position | Effect on readiness |
| --- | --- | --- |
| Final MMS Production domain | **Unresolved.** No domain is selected or implied. | All final-domain-dependent canonical, Auth, email, DNS and public-origin changes remain **BLOCKED**. |
| Legal entity | A new Malaysian entity will be incorporated under the MMS / My Medical Sanctuary name. | Incorporation intent is known, but the exact legal name, company number, entity type, registered address and incorporation details remain **BLOCKED** until registry evidence and counsel approval exist. |
| Production contact/sender candidate | `info@scf.center` is the current intended address and is **PROVISIONAL**. | The candidate may inform planning, but it is not the permanent Production sender and does not authorize SMTP or DNS changes. Production email remains **BLOCKED**. |
| Day-1 booking and patient-support owner | Accountable role: **Clinic Manager**. Use the role, not a named individual, until staffing is finalized. | The first-line operating-owner package is **READY FOR APPROVAL**. Booking launch remains **BLOCKED** by persistence, CRM, staffing/coverage and end-to-end evidence. |

No company detail, domain, named employee, SMTP provider, DNS record or approval date may be inferred from these inputs.

## Updated authoritative approval register

This register supersedes the T6.7 state column only where an approved input above applies. `READY FOR APPROVAL` means a bounded proposal has enough business definition for an accountable human to approve; it does not mean approved, configured, tested or launch-ready.

| # | Decision required | T6.8 status | Updated state / exact remaining dependency |
| --- | --- | --- | --- |
| 1 | Final Production domain | **BLOCKED** | Business confirms it remains unresolved. Supply one owner-approved HTTPS origin, ownership/TLS evidence and Legal/Brand/IT approval. |
| 2 | Legal entity | **BLOCKED** | Malaysian incorporation under the MMS / My Medical Sanctuary name is planned. Exact registered legal name, company number, entity type and incorporation extract remain pending. |
| 3 | Registered address | **BLOCKED** | Pending incorporation and registry evidence; do not invent or publish an address. |
| 4 | Privacy contact/controller | **BLOCKED** | `Clinic Manager` is a first-line operational role, not the legal controller or automatically the privacy owner. Controller identity, monitored privacy contact and rights-request SOP remain pending. |
| 5 | Governing law/jurisdiction | **BLOCKED** | Counsel-approved law, venue and dispute path remain pending. |
| 6 | Privacy Policy approval | **BLOCKED** | Final entity/controller facts, versioned notice and dated approvals remain pending. |
| 7 | Terms approval | **BLOCKED** | Final entity facts, commercial alignment, versioned terms and dated approvals remain pending. |
| 8 | Cookie/marketing consent | **BLOCKED** | Approved classification, inventory, legal basis, consent behavior and retention remain pending if tracking/marketing enters scope. |
| 9 | Medical-content approval | **BLOCKED** | Versioned route/claims matrix and Medical/Legal/Regulatory sign-off remain pending. |
| 10 | Licensing/clinic/telemedicine status | **BLOCKED** | Incorporation intent is not licence evidence. Facility/provider/jurisdiction evidence and approved workflows remain pending. |
| 11 | Production SMTP provider | **BLOCKED** | Dedicated provider, DPA, credentials owner, limits and support model remain pending. Supabase's built-in service is not a Production solution. |
| 12 | Production sender address/domain | **BLOCKED** | `info@scf.center` is a provisional candidate only. Permanent sender/domain, mailbox ownership, reply handling and final-domain alignment remain pending. |
| 13 | SPF/DKIM/DMARC | **BLOCKED** | No approved final sending domain or verified DNS/alignment evidence exists. |
| 14 | Supabase Auth URLs/callbacks | **BLOCKED** | Final origin remains unresolved; Site URL, exact allow-list and direct token-hash CTAs cannot be finalized. Delivered Production signup/recovery evidence is also pending. |
| 15 | Patient Supabase Production credentials | **BLOCKED** | Production URL/key scope, owner, rotation and isolated E2E remain pending; My Sanctuary stays gated. |
| 16 | Partner Supabase Production credentials | **BLOCKED** | Wrong-ref/cross-scoped current URL must not be corrected without approval; correct Production key, isolation and E2E remain pending. |
| 17 | Commercial Production DB credential | **BLOCKED** | Production pooler secret, `mms_commercial` schema, migration/grant/RLS/backup evidence and E2E remain pending. |
| 18 | Zoho Production credentials | **BLOCKED** | Approved tenant OAuth credentials, region/org/owner/module/picklist evidence and rotation owner remain pending. |
| 19 | Booking operating owner/SLA | **READY FOR APPROVAL** | Clinic Manager role and provisional responsibilities are defined. Final named staffing, backup/coverage, operating hours, business calendar, escalation contacts, approved SLA, reconciliation/dedupe/retry SOP and failure drill remain pending. |
| 20 | Trusted metadata provisioning | **BLOCKED** | Four-eyes provisioning, suspension/revocation owners, tickets, audit evidence and session-revocation drill remain pending. |
| 21 | Incident/support ownership | **READY FOR APPROVAL** | Clinic Manager is the proposed Day-1 first-line booking/patient-support owner and escalator. Named backup/on-call and the Security, Privacy and Medical escalation owners/pathways still require approval. |
| 22 | Monitoring/alert ownership | **BLOCKED** | Clinic Manager may consume operational booking/email/Auth alerts and own SLA reporting, but technical alert owners, destinations, thresholds, retention and test pages remain pending. |

### What the new inputs unblock

- **READY FOR APPROVAL:** the Clinic Manager first-line operating charter, booking/patient-support responsibilities, urgent-clinical boundary and proposed service-level package.
- **Planning input only:** `info@scf.center` as a provisional contact/sender candidate. It is not ready for Production configuration.
- **Clarified but still BLOCKED:** legal/entity work now has a known incorporation path, but no publishable registered facts.
- **Explicitly unchanged:** final domain, Auth URLs, canonical origin, SMTP activation, sender authentication, database wiring, Zoho wiring and every Production feature gate.

## Clinic Manager provisional Day-1 charter

The **Clinic Manager** role is the provisional operational owner for booking enquiries and patient support. Until staffing is finalized, no named person is asserted.

### Responsibilities ready for approval

- monitor the new booking/enquiry queue;
- acknowledge valid enquiries;
- assign each valid enquiry to the appropriate clinic/doctor workflow;
- escalate failed persistence, email or Auth issues through the approved technical incident path;
- monitor unresolved patient-support requests;
- own operational SLA reporting; and
- escalate privacy or medical issues to the appropriate responsible person.

### Authority boundary

The Clinic Manager has **no clinical decision authority** under this record. The role must not diagnose, triage clinically, prescribe, recommend treatment, determine clinical urgency, or substitute for a licensed clinician or approved emergency pathway. Privacy and medical matters are escalated to their separately approved accountable owners.

### Proposed service levels — not approved policy

| Service | PROPOSED target | Approval gaps |
| --- | --- | --- |
| Booking/enquiry acknowledgement | Within **1 business hour during operating hours** | Final operating hours, business calendar, clock start/stop, exclusions, backup coverage and approver. |
| Unresolved booking failure escalation | Within **30 minutes once detected** | Detection source, paging destination, technical owner, severity definition, backup and evidence retention. |
| Patient account-access issue | **Same business day** | Business calendar, identity-verification SOP, security escalation and closure definition. |
| Urgent clinical issue | Do **not** manage through the website support workflow; direct to an approved clinical/emergency pathway. | Jurisdiction-specific approved pathway, public wording, clinical owner, training and escalation verification. |

Every target in this table is **PROPOSED**, not final approved policy. Approval requires Operations, Privacy/Security and Medical/Legal sign-off as applicable, plus named primary/backup staffing and a tabletop/failure drill.

## Portable SMTP/sender plan

`info@scf.center` must not be hard-coded into application logic or treated as the permanent sender. Preserve sender portability as follows:

1. Keep the sender address and sender name in the Production SMTP/Auth provider configuration or its approved secret/configuration system, separate from templates and application code.
2. Keep SMTP host, port, username and secret provider-specific and replaceable; do not reuse Preview credentials.
3. Before any activation, approve the provider, mailbox ownership, reply handling and the sending domain; verify SPF, DKIM and DMARC alignment and disable link tracking that could rewrite Auth links.
4. When the final MMS domain is approved, snapshot the prior configuration, verify the new mailbox and DNS, update sender configuration and approved contact copy, then rerun delivered signup/recovery and reply-path tests.
5. Roll back by restoring the exported SMTP/Auth configuration or disabling custom SMTP; keep Auth and registration gates off until delivery and direct callback integrity pass.

No SMTP value is changed by T6.8. Sender display name, provider, credentials and permanent address remain unresolved.

## Six P0 classifications

| T6.5/T6.6 P0 | T6.8 classification | Reason |
| --- | --- | --- |
| Legal/privacy/entity readiness | **BLOCKED** | Incorporation plan is known, but registered entity facts, controller, address, law and approved policies do not yet exist. |
| Final domain/canonical/Auth callback readiness | **BLOCKED** | Final MMS Production domain is explicitly unresolved. |
| Booking persistence and Day-1 handoff | **BLOCKED** | Clinic Manager operating package is ready for approval, but Zoho/persistence, dedupe/retry/reconciliation, staffing/coverage, final SLA and E2E remain absent. |
| Production email/SMTP readiness | **BLOCKED** | `info@scf.center` is provisional; provider, permanent domain/sender, DNS alignment and delivered Production tests remain absent. |
| Production Partner/Patient/commercial DB wiring | **BLOCKED** | T6.7 wrong/missing Production credentials and isolation/E2E gaps are unchanged. |
| `/online-doctor` licensing-safe public representation | **READY FOR APPROVAL** | Existing fail-closed, unavailable/noindex representation is unchanged; dated Medical/Legal/Regulatory and language approval remains required. |

No P0 is closed. `READY FOR APPROVAL` is not permission to enable or publish.

## Updated launch matrix

| Discipline | State | T6.8 gate |
| --- | --- | --- |
| Legal | **RED — BLOCKED** | Incorporation and exact registered facts/counsel approval pending |
| Privacy | **RED — BLOCKED** | Controller/contact, final notice, rights, retention and transfers pending |
| Medical content | **RED — BLOCKED** | Dated route/claims matrix pending |
| Licensing | **RED — BLOCKED** | Incorporation intent is not operating/licence evidence |
| Domain/canonical | **RED — BLOCKED** | Final Production origin unresolved |
| Booking | **RED — BLOCKED** | Operating charter ready for approval; persistence/CRM/E2E and final coverage/SLA pending |
| CRM | **RED — BLOCKED** | Production Zoho tenant/configuration and E2E pending |
| Production email | **RED — BLOCKED** | Provisional sender only; provider/domain/DNS/delivery pending |
| Partner Hub | **RED — KEEP GATED** | Wrong-ref/cross-scoped URL and missing key/DB/provisioning E2E |
| My Sanctuary | **RED — KEEP GATED** | Patient credentials/provisioning/SMTP E2E pending |
| Security | **AMBER — READY FOR APPROVAL IN PART** | Code guards retained; Production secrets, owners and incident drill pending |
| Monitoring | **RED — BLOCKED** | Operational consumer proposed; technical owners/alerts/drains/tests pending |
| Operations | **AMBER — READY FOR APPROVAL IN PART** | Clinic Manager charter/SLA proposal defined; staffing, backup, pathways and approval pending |
| `/online-doctor` representation | **AMBER — READY FOR APPROVAL** | Keep unavailable/noindex pending dated sign-off |

## Production writes still requiring explicit approval

All T6.7 change sets A–H remain write-blocked. In particular:

- do not set `MMS_SITE_URL`, `NEXT_PUBLIC_SITE_URL` or canonical approval until the final domain exists;
- do not change Supabase Production Site URL, redirect allow-list or Auth templates until the final domain and exact callbacks are approved;
- do not configure `info@scf.center`, SMTP credentials, sender authentication or DNS from this provisional input;
- do not correct or add Patient, Partner, commercial database or Zoho Production credentials;
- do not set any Production approval or feature gate to `true`; and
- do not publish final legal, privacy, licensing or clinical representations before their evidence and approvals exist.

## Gating recommendation

- **Partner Hub:** **NO-GO / KEEP GATED**.
- **My Sanctuary and patient registration:** **NO-GO / KEEP GATED**.
- **Booking persistence:** **NO-GO / KEEP GATED**; submit the Clinic Manager charter and SLA proposal for approval while technical remediation continues.
- **Overall MMS Production launch:** **NO-GO**.

## Safety confirmation

- No Production configuration or deployment changed.
- No Production feature gate was enabled.
- No Production user or record was created or changed.
- No domain or legal-company fact was guessed.
- DNS, `main`, PR #31, MMS Production, iPivot Production and iPivot staging were untouched.

## Verification

- T6.3 retained suite: **34/34 passed**.
- T6.6 regression suite: **7/7 passed**.
- T6.7 approval-pack suite: **6/6 passed**.
- T6.8 business-input suite: **6/6 passed**.
- Full retained suite: **245/245 passed**.
- TypeScript: passed with no errors.
- ESLint: zero errors and the same six pre-existing gated Partner Hub `react-hooks/set-state-in-effect` warnings.
- Next.js 16.3.4 production build: passed; **197** static pages generated.
- Dependency audit: runtime and full audits both report **0 vulnerabilities**.
- Route comparison: **180 normalized / 205 expanded before; 180 / 205 after; zero additions and zero removals**. T6.8 changes only documentation, its regression test and the test command.
