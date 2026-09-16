# T6.9 — Approval Closure Pack

**T6.9 RESULT: PASS WITH BLOCKERS.** Overall recommendation: **NO-GO**.

Baseline: `b0ffec92b687c1e1180f69a9fdf8880f373691ff` on `mms/integration-next16-foundation`. T6.9 prepares human approval and credential-collection artifacts only. It does not authorize or execute Production activation.

## How to use this pack

1. Each owner completes the applicable pack without entering secrets into Git, tickets, chat or email.
2. Each decision records the approved value, evidence reference, approver name and professional capacity, approval date, expiry/review date and constraints.
3. Secrets are entered only into the approved write-only secret store by an authorized operator. The pack records the variable name, scope, custodian, fingerprint/last four characters where safe, rotation date and evidence ID—not the value.
4. Security and Release Management verify the completed tracker. A `READY FOR APPROVAL` row becomes `APPROVED` only with its evidence and signature. `APPROVED` is still not permission to activate a gate.
5. Production writes require a separate, explicit change-window approval against the exact write manifest below, followed by read-back, E2E and rollback evidence.

## Owner packs

| Pack | Primary accountable roles | File |
| --- | --- | --- |
| Entity / Legal | Business owner, Company Secretary, Privacy owner/DPO, qualified counsel | [01-entity-legal.md](01-entity-legal.md) |
| Final domain | Business owner, Brand, IT/DNS owner, Legal, Security | [02-final-domain.md](02-final-domain.md) |
| SMTP / Email | IT, Security, Privacy, Brand, business owner | [03-smtp-email.md](03-smtp-email.md) |
| Medical / Licensing | Medical Director, Regulatory, qualified counsel, Operations | [04-medical-licensing.md](04-medical-licensing.md) |
| Booking / CRM | CRM owner, Security, Operations, Clinic Manager role, Privacy | [05-booking-crm.md](05-booking-crm.md) |
| Patient / Partner Auth | Auth owner, Security, Identity administrator, business approvers | [06-patient-partner-auth.md](06-patient-partner-auth.md) |
| Commercial database | DBA, Security, application owner, Privacy | [07-commercial-database.md](07-commercial-database.md) |
| Operations | Operations, Clinic Manager role, Support, Security, Privacy, Medical, SRE | [08-operations.md](08-operations.md) |

## Consolidated approval tracker

All rows start **BLOCKED** unless explicitly marked **READY FOR APPROVAL**. “Owner” means an accountable role; it does not invent a person.

| ID | Pack / decision | Status | Owner | Closure evidence | Blocking impact |
| --- | --- | --- | --- | --- | --- |
| LEG-01 | Final registered legal entity identity | **BLOCKED** | Business owner + Company Secretary + counsel | Incorporation extract; exact legal name, entity type and registration number; signed confirmation | Legal, privacy, licensing and launch |
| LEG-02 | Registered and business addresses | **BLOCKED** | Company Secretary + counsel + Operations | Registry evidence and approved publication/contact rules | Legal pages and notices |
| LEG-03 | Controller and privacy contact | **BLOCKED** | Privacy owner/DPO + counsel | Controller decision, monitored mailbox ownership, rights SOP | Privacy notice and patient processing |
| LEG-04 | Jurisdiction and governing terms | **BLOCKED** | Qualified counsel | Dated advice and approved clauses | Terms and dispute handling |
| LEG-05 | Retention/deletion schedule | **BLOCKED** | Privacy owner/DPO + record owners + counsel | System/category schedule, legal basis, deletion exceptions and audit method | All personal-data processing |
| LEG-06 | Processors, recipients and cross-border handling | **BLOCKED** | Privacy + Security + counsel | Vendor/subprocessor register, locations, DPA/transfer mechanism and disclosure rules | Auth, CRM, email, hosting and support |
| LEG-07 | Complaints, deletion, withdrawal and consent model | **BLOCKED** | Privacy + counsel + Operations + Marketing | Approved SOPs, forms, response times, consent records and withdrawal behavior | Legal pages, marketing and patient communications |
| DOM-01 | One final Production host | **BLOCKED** | Business owner + Brand + IT + Legal | Exact HTTPS origin, ownership, TLS, DNS and signed decision | Canonical, Auth, email and launch |
| DOM-02 | Public-origin propagation plan | **BLOCKED** | Application owner + SEO/Brand + Security | Read-back plan covering canonical, sitemap, robots, hreflang/x-default, OG and JSON-LD | Search and origin integrity |
| DOM-03 | Supabase Auth URLs and direct callbacks | **BLOCKED** | Auth owner + Security + IT | Exact Site URL/allow-list/templates and delivered signup/recovery E2E | Patient/Partner Auth |
| SMTP-01 | Dedicated transactional provider | **BLOCKED** | IT + Security + Privacy + business owner | Vendor approval, DPA, support, limits, secret custodian and rollback | Production Auth email |
| SMTP-02 | Permanent sender domain/address | **BLOCKED** | Brand + Legal + IT | Approved sender, monitored mailbox/reply handling and final-domain relationship | Production Auth email |
| SMTP-03 | SPF/DKIM/DMARC | **BLOCKED** | DNS owner + Security | Exact provider records, propagation and alignment reports | Deliverability and anti-spoofing |
| SMTP-04 | Bounce/complaint/rate operations | **BLOCKED** | Email operations + Privacy + Security | Suppression, complaint, alerting, retention and rate-limit SOP | Delivery safety |
| SMTP-05 | Delivered signup/recovery evidence | **BLOCKED** | Auth owner + QA + Security | Fresh delivered links, direct callbacks, confirmation/reset/password assertions | Auth launch attestation |
| MED-01 | Operating entity and clinic licensing | **BLOCKED** | Medical Director + Regulatory + counsel | Entity/facility licences, scope, jurisdiction and validity dates | Clinical/service claims |
| MED-02 | Telemedicine status | **BLOCKED** | Medical Director + Regulatory + counsel | Jurisdiction-specific legal/licensing opinion and approved workflow | `/online-doctor` |
| MED-03 | Clinician roster and public claims | **BLOCKED** | Medical Director + HR/Credentialing + counsel | Credential checks, consent to publish and route-level claim matrix | Clinician/service representation |
| MED-04 | Pre-opening marketing scope | **BLOCKED** | Medical Director + Regulatory + Legal/Marketing | Signed allow/hold/remove services matrix by route and language | Public site release |
| BOOK-01 | Production Zoho tenant and OAuth credential set | **BLOCKED** | CRM owner + Security | Tenant/region/org proof, scoped OAuth grant, custodian and rotation evidence | Booking persistence |
| BOOK-02 | CRM owner/module/field/picklist mapping | **BLOCKED** | CRM owner + Operations + Privacy | Owner ID, module API name, approved mappings and picklist read-back | Correct routing and minimization |
| BOOK-03 | Dedupe/idempotency and retry/failure policy | **BLOCKED** | CRM owner + Engineering + Privacy | Approved keys/windows, retry limits, dead-letter/reconciliation and duplicate drill | Lost/duplicate enquiry prevention |
| BOOK-04 | Clinic Manager charter and SLA | **READY FOR APPROVAL** | Operations + Clinic Manager role + Privacy/Security/Medical | Signed role charter, named primary/backup, hours/calendar, approved SLA and escalation paths | Day-1 handoff |
| BOOK-05 | Delivered Production booking E2E | **BLOCKED** | QA + CRM owner + Clinic Manager role | Approved synthetic create/read/assign/reconcile/failure/rollback evidence | Booking activation |
| AUTH-01 | Production Patient URL and publishable key | **BLOCKED** | Auth owner + Security | Correct project-ref proof, key fingerprint, Production-only scope and isolation E2E | My Sanctuary |
| AUTH-02 | Production Partner URL and publishable key | **BLOCKED** | Auth owner + Security | Correct project-ref proof, key fingerprint, scope split and isolation E2E | Partner Hub |
| AUTH-03 | Cross-scoped Partner URL correction | **BLOCKED** | Release manager + Auth owner + Security | Before/after scoped inventory proving Preview preserved and Production corrected | Environment isolation |
| AUTH-04 | Trusted metadata approval workflow | **BLOCKED** | Business approvers + Identity admin + Security | Four-eyes tickets and app-metadata-only positive/negative tests | Authorization integrity |
| AUTH-05 | Suspension/revocation and audit | **BLOCKED** | Identity admin + Security + Operations | Session revocation drill, claim-change audit and emergency path | Access termination |
| DB-01 | Production pooler credential and schema | **BLOCKED** | DBA + Security | Production-ref host fingerprint, least-privilege role, secret custody and `mms_commercial` schema proof | Commercial surfaces |
| DB-02 | Migration, grants and RLS validation | **BLOCKED** | DBA + application owner + Security | Migration manifest, grants matrix, RLS/advisor and wrong-tenant tests | Data isolation |
| DB-03 | Backup/restore and E2E | **BLOCKED** | DBA + Operations + QA | Backup policy, restore drill, RPO/RTO approval and application E2E | Recoverability and activation |
| OPS-01 | Clinic Manager operational charter | **READY FOR APPROVAL** | Operations + Clinic Manager role | Signed charter with non-clinical boundary and named primary/backup | Booking/support handoff |
| OPS-02 | Proposed SLA package | **READY FOR APPROVAL** | Operations + Privacy/Security + Medical as applicable | Signed SLA, hours/calendar, clocks, exclusions, reporting and escalation | Operational readiness |
| OPS-03 | Incident and privacy incident owners | **BLOCKED** | Security + Privacy + business owner | Named primary/backup, severity matrix, contact route and tabletop | Incident response |
| OPS-04 | Patient and Partner support owners | **BLOCKED** | Operations + Support + business owner | Named primary/backup, queue access, SOP and escalation drill | User support |
| OPS-05 | Monitoring and rollback owners | **BLOCKED** | SRE/Operations + Release manager + Security | Named owners, alerts/drains, test pages, retention and rollback drill | Detection and recovery |

## Exact remaining P0s

| P0 | Status | Exact closure condition |
| --- | --- | --- |
| Legal/privacy/entity readiness | **BLOCKED** | Close LEG-01 through LEG-07 and publish only the returned approved facts/policies. |
| Final domain/canonical/Auth callback readiness | **BLOCKED** | Close DOM-01 through DOM-03; perform approved write/read-back and delivered Auth E2E. |
| Booking persistence and Day-1 handoff | **BLOCKED** | Close BOOK-01 through BOOK-05. BOOK-04 is only ready for human approval. |
| Production email/SMTP readiness | **BLOCKED** | Close SMTP-01 through SMTP-05 and only then attest SMTP E2E. |
| Production Partner/Patient/commercial DB wiring | **BLOCKED** | Close AUTH-01 through AUTH-05 and DB-01 through DB-03, with gates still off pending separate activation. |
| `/online-doctor` licensing-safe representation | **READY FOR APPROVAL** for the existing hold only | Keep unavailable/noindex. Activation remains blocked until MED-01 through MED-04 explicitly clear it. |

No P0 is closed.

## Exact credential and configuration inventory still required

Secret values must not be committed. `Config` values are readable settings; `Secret` values must use the approved write-only store.

| System | Exact item | Type | Required scope/state |
| --- | --- | --- | --- |
| Vercel | `MMS_SITE_URL` | Config | Production only; exact approved HTTPS origin |
| Vercel | `NEXT_PUBLIC_SITE_URL` | Public Config | Production only; same exact approved origin |
| Vercel | `MMS_PRODUCTION_CANONICAL_APPROVED` | Approval Config | Production only; `true` only after signed domain evidence |
| Vercel | `MMS_PRODUCTION_LEGAL_APPROVED` | Approval Config | Production only; `true` only after signed entity/privacy/terms evidence |
| Vercel | `MMS_PRODUCTION_SMTP_E2E_APPROVED` | Approval Config | Production only; `true` only after delivered signup/recovery evidence |
| Supabase Auth | SMTP host, port, username, password | Secret/configuration | Production project `ywbqfkhrshmpilgzytpl`; dedicated approved provider |
| Supabase Auth | sender address and sender name | Config | Approved permanent sender; `info@scf.center` remains provisional |
| Vercel | `MMS_PATIENT_SUPABASE_URL` | Config | Production only; `https://ywbqfkhrshmpilgzytpl.supabase.co` after approval |
| Vercel | `MMS_PATIENT_SUPABASE_PUBLISHABLE_KEY` | Public credential | Production only; publishable key from the same Production project |
| Vercel | `MMS_PARTNER_SUPABASE_URL` | Config | Production entry only corrected to `https://ywbqfkhrshmpilgzytpl.supabase.co`; preserve Preview entry |
| Vercel | `MMS_PARTNER_SUPABASE_PUBLISHABLE_KEY` | Public credential | Production only; publishable key from the same Production project |
| Vercel | `MMS_COMMERCIAL_DATABASE_URL` | Secret | Production only; approved least-privilege Production pooler URL |
| Vercel | `MMS_COMMERCIAL_DATABASE_SCHEMA` | Config | Production only; exact value `mms_commercial` |
| Vercel | `ZOHO_CLIENT_ID` | Secret/configuration | Production only; approved MMS Production tenant OAuth client |
| Vercel | `ZOHO_CLIENT_SECRET` | Secret | Production only; approved secret store |
| Vercel | `ZOHO_REFRESH_TOKEN` | Secret | Production only; scoped grant and rotation owner |
| Vercel | `ZOHO_DC` | Config | Production only; approved tenant region, not assumed |
| Vercel | `ZOHO_ORGANIZATION_ID` | Config/sensitive identifier | Production only; verified tenant value |
| Vercel | `ZOHO_CRM_OWNER_ID` | Config/sensitive identifier | Production only; verified queue/owner value |
| Vercel | `ZOHO_LEADS_MODULE_API_NAME` | Config | Production only; approved API name, not assumed |
| Vercel | `MMS_DEFAULT_LEAD_SOURCE` | Config | Production only; approved picklist value, not assumed |
| Vercel | `MMS_CRM_DEBUG` | Config | Production only; exact value `false` before E2E |

The gate variables `MMS_PATIENT_PORTAL_ENABLED`, `MMS_PATIENT_REGISTRATION_ENABLED`, `MMS_PARTNER_HUB_ENABLED`, `MMS_COMMERCIAL_DATABASE_ENABLED`, `MMS_BOOKING_PRODUCTION_APPROVED` and `MMS_BOOKING_PERSISTENCE_ENABLED` remain absent or `false`. They are not credential-collection targets and must not be enabled by this pack.

## Exact approvals still required

- signed incorporation/legal identity and address confirmation;
- counsel-approved Privacy Policy, Terms, controller/contact, jurisdiction, retention, processor/recipient, transfer, rights and consent package;
- one signed final Production host decision from Business, Brand, IT and Legal;
- SMTP vendor/DPA, permanent sender, DNS authentication, bounce/complaint/rate policy and delivered Auth E2E approval;
- operating entity, clinic licensing, telemedicine, clinician roster, medical-content and pre-opening marketing approvals;
- Zoho tenant/schema/mapping, dedupe/idempotency, retry/reconciliation, Clinic Manager/SLA and delivered booking E2E approvals;
- Patient/Partner project/key/scope, trusted metadata, suspension/revocation and audit approvals;
- commercial database least-privilege, migration/grants/RLS, backup/restore and E2E approvals; and
- named people for all primary/backup incident, privacy, support, monitoring and rollback roles, without changing the approved role model.

## Production writes that become executable only after approval

This is a future write manifest, not current authorization.

| Change set | Exact future write | Preconditions | Rollback |
| --- | --- | --- | --- |
| A — Domain | Add Production-only `MMS_SITE_URL=<APPROVED_ORIGIN>`, `NEXT_PUBLIC_SITE_URL=<APPROVED_ORIGIN>`; later set `MMS_PRODUCTION_CANONICAL_APPROVED=true` after read-back evidence | DOM-01/02 approved; TLS and metadata checks pass | Restore env snapshot and prior deployment; approval flag removed |
| B — Supabase Auth | On `ywbqfkhrshmpilgzytpl`, set Site URL to `<APPROVED_ORIGIN>` and allow-list `<APPROVED_ORIGIN>/api/patient-auth/callback` plus separately approved Partner callback | DOM-01/03 and Auth scope approved | Restore exported Auth configuration |
| B — Auth templates | Set signup href to `<APPROVED_ORIGIN>/api/patient-auth/callback?token_hash={{ .TokenHash }}&type=signup` and recovery href to `<APPROVED_ORIGIN>/api/patient-auth/callback?token_hash={{ .TokenHash }}&type=recovery`; equivalent Partner callbacks only if separately approved | Domain, callback contract and SMTP approved | Restore exported templates; gates stay off |
| C — SMTP | Configure approved custom SMTP host/port/user/secret, sender and sender name on Production Supabase; apply separately approved SPF/DKIM/DMARC through human DNS change | SMTP-01 through SMTP-04 approved | Disable custom SMTP, restore export and revoke replaced secret |
| C — SMTP attestation | Set Production-only `MMS_PRODUCTION_SMTP_E2E_APPROVED=true` | SMTP-05 signed after fresh delivered E2E | Remove flag and keep Auth gates off |
| D — Patient | Add Production-only Patient URL/publishable key | AUTH-01 and DOM/SMTP prerequisites approved | Remove/rotate; Patient gates remain off |
| E — Partner | Split `MMS_PARTNER_SUPABASE_URL` scopes, preserving Preview and correcting only Production; add Production publishable key | AUTH-02/03 approved and scoped snapshot captured | Restore both scoped entries; Partner gate remains off |
| F — Commercial DB | Add Production-only pooler secret and `MMS_COMMERCIAL_DATABASE_SCHEMA=mms_commercial` | DB-01 through DB-03 approved | Remove/rotate secret; DB gate remains off |
| G — Booking/Zoho | Add approved Production Zoho values and `MMS_CRM_DEBUG=false` | BOOK-01 through BOOK-04 approved | Remove/revoke credentials; booking gates remain off |
| H — Legal attestation | Set Production-only `MMS_PRODUCTION_LEGAL_APPROVED=true` | LEG-01 through LEG-07 and final documents signed/published through separate approval | Remove flag and restore interim noindex documents |
| I — Monitoring | Configure approved redacted alerts/drains and destinations | OPS-03 through OPS-05 approved | Disable rules/drains or restore exports |

Feature-gate activation and Production deployment are deliberately excluded. After configuration/E2E closure, they require a new release decision and explicit authorization.

## RED / AMBER / GREEN matrix

| Discipline | State | Reason |
| --- | --- | --- |
| Entity / Legal | **RED** | Incorporation facts and counsel package missing |
| Privacy | **RED** | Controller, contact, retention, transfers, rights and consent missing |
| Final domain / canonical | **RED** | No approved Production host |
| SMTP / email | **RED** | Provider, permanent sender, DNS and delivered E2E missing |
| Medical / licensing | **RED** | Operating/licensing/telemedicine/roster/marketing approvals missing |
| Booking / CRM | **RED** | Credentials, mapping, resilience and Production E2E missing |
| Patient Auth | **RED — KEEP GATED** | Production key/scope/workflow/SMTP E2E missing |
| Partner Auth | **RED — KEEP GATED** | Cross-scoped URL and key/workflow/E2E gaps remain |
| Commercial database | **RED — KEEP GATED** | Pooler, least privilege, RLS, restore and E2E missing |
| Operations | **AMBER** | Clinic Manager charter/SLA package ready for approval; named coverage and other owners missing |
| Security controls | **AMBER** | Fail-closed guards retained; Production secrets, drills and monitoring incomplete |
| `/online-doctor` hold | **AMBER** | Safe unavailable/noindex state is ready for sign-off; activation is blocked |
| Overall launch | **RED** | No P0 is closed |

## Recommendations

- **Partner Hub:** **NO-GO / KEEP GATED**.
- **My Sanctuary and patient registration:** **NO-GO / KEEP GATED**.
- **Booking persistence:** **NO-GO / KEEP GATED**.
- **MMS Production launch:** **NO-GO**.

## Safety confirmation

- No Production deployment, configuration write, DNS change or feature-gate activation was performed.
- No Production user, record, synthetic patient, Partner record or clinical data was created.
- `main`, PR #31, MMS Production, iPivot Production and iPivot staging were untouched.
- No legal, licensing, domain, SMTP, credential, person or operational fact was invented.

## Verification

- T6.3 retained suite: **34/34 passed**.
- T6.6 regression suite: **7/7 passed**.
- T6.7 approval-pack suite: **6/6 passed**.
- T6.8 business-input suite: **6/6 passed**.
- T6.9 approval-closure suite: **8/8 passed**.
- Full retained suite: **253/253 passed**.
- TypeScript: passed with no errors.
- ESLint: zero errors and the same six pre-existing gated Partner Hub `react-hooks/set-state-in-effect` warnings.
- Next.js 16.3.4 production build: passed; **197** static pages generated.
- Dependency audit: runtime and full audits both report **0 vulnerabilities**.
- Route comparison: **180 normalized / 205 expanded before; 180 / 205 after; zero additions and zero removals**. T6.9 changes documentation, its regression test and the test command only.
