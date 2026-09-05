# T6.2 Launch Approval Pack

Status: **PASS WITH BLOCKERS** for approval-pack preparation. **NO-GO for Production.**

Prepared from integration recovery point `02ee0f64b05f257425636cec2f52ed5054304b5f` on 2026-09-05. This pack is a collection instrument, not an approval. Blank fields and `MISSING` / `NOT REVIEWED` statuses must not be interpreted as consent, verification, licensing, or launch authorization.

## 1. P0 Summary

| Production P0 | Current state | Closure evidence required | Decision owner |
| --- | --- | --- | --- |
| Legal/entity approval | BLOCKED | Completed entity facts plus dated, versioned counsel approval of all launch legal documents | Founder/Owner and qualified Legal/Privacy counsel |
| Zoho booking E2E | BLOCKED | Approved Preview configuration and controlled create/read/reconcile/retry/failure evidence | Founder/Owner, CRM owner, Privacy/Legal, Operations, Security |
| Final Production domain | BLOCKED | Exact approved HTTPS origin and www/redirect/callback policy | Founder/Owner, Brand, Legal, Domain/IT |
| Medical/licensing approval | BLOCKED | Dated, versioned topic and location sign-off with documentary operating/licensing evidence | Medical Director, Regulatory/Legal, Licensing/Operations |

Vercel Preview availability is closed. It does not close any of the four P0s above.

## 2. Legal And Entity Facts

Allowed status: `MISSING`, `SUPPLIED`, `VERIFIED`, `APPROVED`. Only `APPROVED` is launch-locked.

| Fact | Current value | Source | Owner | Status | Evidence required | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Public legal company name | Not provided | Existing pages identify only the MMS brand | Founder/Owner + Legal | MISSING | Incorporation record and written approval of exact public form | Enter exact legal name and attach approval. |
| Company registration number | Not provided | No approved repository value | Founder/Owner + Legal | MISSING | Registration record and decision whether it must be public | Supply approved number or approved omission decision. |
| Registered/business address | Not provided | No approved repository value | Founder/Owner + Legal | MISSING | Documentary address and publication requirement | Supply approved address or approved omission decision. |
| Privacy-controller legal entity | Not provided | `/privacy-pdpa`, `/privacy-policy` identify this as unresolved | Privacy/Legal | MISSING | Controller determination and legal-name evidence | Name the controller and approve its presentation. |
| Privacy contact email | Not provided | Privacy pages contain no approved contact | Privacy/Legal | MISSING | Monitored mailbox, responsible owner, retention/escalation process | Approve address and operating owner. |
| Terms contracting entity | Not provided | `/terms`, `/terms-of-use` are interim boundaries | Legal | MISSING | Contracting-entity determination | Supply and approve exact entity. |
| Cookie Notice entity | Not provided | `/cookie-notice` documents behavior only | Privacy/Legal | MISSING | Accountable-entity determination | Supply and approve exact entity. |
| Copyright owner | Not provided | Footer/public pages do not evidence a legal owner | Founder/Owner + Legal | MISSING | IP ownership/licence evidence and approved notice | Supply exact owner and notice year/policy. |
| Medical disclaimer approving entity | Not provided | `/privacy-disclaimer` contains conservative draft boundaries | Medical Director + Legal | MISSING | Identified approving entity and authority | Supply entity and approval authority. |
| Counsel/reviewer name | Not provided | No attributable approval record | Legal | MISSING | Reviewer identity | Enter name; do not publish unless authorized. |
| Counsel/reviewer role | Not provided | No attributable approval record | Legal | MISSING | Role, organization and authority | Enter reviewer capacity. |
| Approval date | Not provided | No dated approval record | Legal | MISSING | Signed/traceable date | Record `YYYY-MM-DD`. |
| Approved version/scope | Not provided | Current integration content is not counsel-approved | Legal + Technical | MISSING | Commit SHA, document paths and approved exceptions | Record exact SHA and paths covered. |

Legal approval reference: ____________________  Approval date: __________  Approved SHA/version: ____________________

## 3. Legal Document Review

| Document/path | Known gaps | Approval owner | Approval date required | Launch impact |
| --- | --- | --- | --- | --- |
| Privacy Policy: `/privacy-policy`, `/privacy-pdpa` | Controller, registration/address decision, contact, lawful bases, purposes, retention, recipients/processors, transfers, rights/complaints, effective date | Privacy/Legal | Yes | P0; cannot launch without approved privacy notice. |
| Terms: `/terms`, `/terms-of-use` | Contracting entity, governing law, eligibility, acceptable use, IP, disclaimers, liability, commercial boundaries, effective date | Legal | Yes | P0; current text explicitly remains interim. |
| Cookie Notice: `/cookie-notice` | Accountable entity, final classification/consent determination, effective date, future-provider policy | Privacy/Legal | Yes | P0 where cookies/attribution operate. |
| Medical Disclaimer: `/privacy-disclaimer` | Approving entity, jurisdictional wording, medical/licensing review, effective date/version | Medical Director + Legal | Yes | P0 for medical and wellness content. |
| International Care Disclaimer: `/international-medicine-access`, `/malaysia-thailand-care`, `/medical-tourism` | Jurisdiction, registration, import/dispensing boundaries, continuity responsibilities, travel-risk wording | Medical Director + Regulatory/Legal | Yes | Blocks included international-care content. |
| Ling Disclaimer: `/ling`, Footer, FAQ, `/api/ling` response | AI role, emergency boundary, data handling, escalation, professional-review wording and Production gate | Medical Director + Privacy/Legal | Yes | Static education can remain only if approved; production AI remains gated. |
| Health Intelligence Disclaimer: `/health-intelligence` and subroutes, public API | Provenance, price/date uncertainty, no substitution/import/access promise, publication and privacy boundaries | Medical Director + Regulatory/Legal | Yes | Real data remains gated; included editorial wording still requires approval. |
| Copyright notice: global Footer/public layout | Legal owner, year/update policy, image/content licences | Founder/Owner + Legal | Yes | Blocks final legal lock and asset publication confidence. |
| JSON-LD entity information: `src/lib/schema.ts` | Intentionally limited to `WebSite`; legal medical-entity facts, facilities, licences and clinicians are unverified | Legal + Technical + Medical where applicable | Yes before adding entity claims | Keep neutral `WebSite` schema until evidence is approved. |

Reviewer: ____________________  Role: ____________________  Date: __________  Approved paths/version: ____________________

## 4. Zoho Booking Preview E2E Pack

### Required Inputs

| Item | Current state | Required approval/evidence | Owner |
| --- | --- | --- | --- |
| Approved Zoho environment/account | Not supplied | Written designation of a non-Production test organization/account | Founder/Owner + CRM owner |
| Target module/object | Intended `Leads`; not operationally approved | Exact module API name and confirmation that controlled test records are permitted | CRM owner |
| Field mapping | Repository adapter uses standard Lead fields; not reconciled to approved target | Export/screenshot of exact field API names, types, required fields and picklist values | CRM owner + Operations |
| Retention policy | Not supplied | Retention/deletion period for enquiries and test records | Privacy/Legal + Operations |
| Consent mapping | Canonical consent/version/timestamp exists in application | Approved target field(s), wording version and proof the timestamp is retained | Privacy/Legal + CRM owner |
| Owner/assignee logic | Not supplied | Default owner or assignment rule and monitored queue | CRM owner + Operations |
| Booking reference behavior | Application returns a non-CRM public reference | Approval of format, support lookup and non-disclosure behavior | Operations + Security |
| Error-handling expectation | Generic 502/503 behavior implemented | Approved user message, retry/escalation process and monitoring owner | Operations + Security |
| Controlled test contact | Not supplied | Written approval for one non-clinical test identity and cleanup/retention instruction | Privacy/Legal + test owner |
| Preview credentials | Required names absent at T6.1 review | Scoped OAuth values entered only in Vercel Preview | CRM owner + Technical |
| Permission/scope | Not approved | Minimum create/read access to the approved Leads target; no unnecessary admin scope | CRM owner + Security |

Configuration names only: `MMS_BOOKING_PERSISTENCE_ENABLED`, `MMS_CRM_DEBUG`, `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, `ZOHO_DC`, `ZOHO_ORGANIZATION_ID`, `ZOHO_CRM_OWNER_ID`, `ZOHO_LEADS_MODULE_API_NAME`, `MMS_DEFAULT_LEAD_SOURCE`. Secret values must never enter source control, screenshots, tickets, chat, or test output.

### Approved Field-Mapping Record

| Canonical enquiry value | Approved Zoho field API name | Type/picklist confirmed | Required? | Owner approval |
| --- | --- | --- | --- | --- |
| First/last/full name | ____________________ | __________ | __________ | __________ |
| Email | ____________________ | __________ | __________ | __________ |
| Phone/mobile | ____________________ | __________ | __________ | __________ |
| Country/city | ____________________ | __________ | __________ | __________ |
| Main interest/service | ____________________ | __________ | __________ | __________ |
| Preferred membership | ____________________ | __________ | __________ | __________ |
| Enquiring for | ____________________ | __________ | __________ | __________ |
| Preferred contact/time | ____________________ | __________ | __________ | __________ |
| Consent version/timestamp | ____________________ | __________ | Yes | __________ |
| Referral/UTM attribution | ____________________ | __________ | No | __________ |
| Website source | ____________________ | __________ | Yes | __________ |

No diagnosis, prescription, laboratory result, medical history, upload, or other clinical field may be added to this booking contract.

### Controlled E2E Script

Prerequisites: approvals above complete; Preview only; one approved test contact; persistence gate enabled only for the test window; CRM debug disabled; secrets present and redacted from all output.

1. Record Preview deployment ID/SHA, test owner, start time and approved test-contact reference.
2. Submit the public booking form with valid canonical values, explicit consent and a safe test attribution value.
3. Confirm validation passes, honeypot remains empty and the response is truthful `2xx`/persisted rather than a simulated success.
4. Capture only the application’s non-secret public booking reference.
5. Read the approved Zoho target and prove exactly one matching record exists.
6. Reconcile every approved field, enum/picklist, source and assignee against the mapping table.
7. Confirm consent wording version and server-derived timestamp are stored as approved.
8. Confirm referral/UTM attribution is server-derived and correctly mapped.
9. Confirm no clinical, upload, credential, token, raw exception, or internal identifier field is present.
10. Repeat the approved retry scenario and prove no unintended duplicate record is created.
11. Exercise one controlled writer failure and verify generic safe error handling, no false success and no partial/duplicate record.
12. Record end time, target record reference, reconciliation evidence, cleanup/retention decision and named approvers; restore the Preview gate to disabled unless continued use is separately approved.

E2E result: __________  Date: __________  Preview SHA: ____________________  Non-secret reference: ____________________

CRM reviewer: ____________________  Privacy reviewer: ____________________  Operations reviewer: ____________________

## 5. Final Production Domain Decision

Current temporary canonical: `https://www.scf.center`

| Owner decision | Approved value |
| --- | --- |
| FINAL PRODUCTION DOMAIN | ____________________ |
| FINAL WWW/NON-WWW POLICY | ____________________ |
| CANONICAL BASE | ____________________ |
| REDIRECT POLICY | ____________________ |
| EMAIL/AUTH CALLBACK DOMAIN | ____________________ |
| BOOKING LINK DOMAIN | ____________________ |
| OWNER / APPROVER | ____________________ |
| APPROVAL DATE | ____________________ |
| EVIDENCE REFERENCE | ____________________ |

After approval, prepare and verify centrally: `NEXT_PUBLIC_SITE_URL`, `MMS_SITE_URL`, canonical metadata, sitemap, robots sitemap reference, reciprocal hreflang, `x-default`, JSON-LD, OpenGraph/social URLs, all absolute links, Supabase auth allow-list/callback, recovery URLs, Partner auth callback, booking-email links, Vercel domain configuration, TLS/ownership, DNS records, and permanent redirect behavior. Domain/DNS execution requires a separate authorized release task.

Domain decision status: **BLOCKED - final origin not supplied.**

## 6. Medical Approval Sign-Off

Allowed status: `NOT REVIEWED`, `REVIEW IN PROGRESS`, `APPROVED`, `APPROVED WITH CHANGES`, `NOT APPROVED`. All topics currently remain `NOT REVIEWED` because no attributable approval was supplied.

| Topic | Routes | Claims/scope | Medical reviewer | Regulatory/Legal reviewer | Approval date | Version | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Preventive/longevity claims | `/preventive-care`, `/longevity-medicine`, `/memberships`, `/health-journey` | Prevention, risk, longevity and continuity positioning | ______ | ______ | ______ | ______ | NOT REVIEWED | Review advertising and outcome implications. |
| Healthy ageing | `/longevity-medicine`, `/health-concerns/*`, `/insights` | Ageing, resilience, function and biological-age language | ______ | ______ | ______ | ______ | NOT REVIEWED | Confirm evidence and patient-language boundaries. |
| Metabolic health | `/weight-management`, `/health-concerns/weight-gain-metabolic-health`, `/health-concerns/prediabetes-insulin-resistance`, `/health-concerns/fatty-liver-metabolic-liver-health` | Weight, glucose, liver, metabolic assessment and support | ______ | ______ | ______ | ______ | NOT REVIEWED | No outcome promise permitted. |
| Hormone health | `/treatments/hormone-therapy`, low-testosterone, menopause and thyroid concern routes | Hormone symptoms, testing, suitability and therapy education | ______ | ______ | ______ | ______ | NOT REVIEWED | Review sex-specific and prescribing boundaries. |
| Cancer screening | Cancer-risk concern route, `/treatments/mced`, `/health-screening` | Early-detection, MCED and screening limitations | ______ | ______ | ______ | ______ | NOT REVIEWED | False positive/negative and standard-screening boundaries required. |
| Kidney health | Homepage and any kidney-related educational references | Kidney screening/support wording | ______ | ______ | ______ | ______ | NOT REVIEWED | Confirm actual scope and referral boundary. |
| Dialysis | `/privacy-disclaimer` and any planned-service references | Facility/service availability and licensing | ______ | ______ | ______ | ______ | NOT REVIEWED | Must not imply an operating service. |
| Stem cells / MSC | `/treatments/msc-stem-cell-pathways`, `/treatments/research`, relevant concern pages | Regenerative education, evidence uncertainty, suitability | ______ | ______ | ______ | ______ | NOT REVIEWED | High-risk claims review required. |
| Exosomes | `/treatments/exosome-services`, `/treatments/research`, relevant concern pages | Evidence, investigational context and suitability | ______ | ______ | ______ | ______ | NOT REVIEWED | High-risk claims review required. |
| NK/NKT | `/treatments/nk-cell-therapy`, blood-cancer/CAR-T concern content | Immune-cell treatment education and specialist referral | ______ | ______ | ______ | ______ | NOT REVIEWED | Confirm jurisdiction and distinction from CAR-T. |
| Peptides | `/treatments/peptides`, relevant concern pages | Peptide education, evidence and prescribing | ______ | ______ | ______ | ______ | NOT REVIEWED | Product-specific claims require evidence. |
| IV therapies | `/iv-therapy`, `/treatments/iv-wellness-antioxidant-support` | Supportive wellness, safety and suitability | ______ | ______ | ______ | ______ | NOT REVIEWED | Review contraindication and oversight wording. |
| NAD+ | `/treatments/nad-plus`, `/iv-therapy` | Energy/longevity education and evidence limits | ______ | ______ | ______ | ______ | NOT REVIEWED | No ageing-reversal implication permitted. |
| PRP/PRGF | `/treatments/prp`, `/treatments/prgf` | Autologous procedures, indications and uncertainty | ______ | ______ | ______ | ______ | NOT REVIEWED | Confirm scope and procedure/licensing context. |
| Hyperbaric oxygen | `/treatments/hyperbaric-oxygen` | Indications, evidence, risk and facility requirements | ______ | ______ | ______ | ______ | NOT REVIEWED | Do not imply chamber availability. |
| Red light | `/treatments/red-light-photobiomodulation` | Photobiomodulation education and evidence limits | ______ | ______ | ______ | ______ | NOT REVIEWED | Confirm device/indication language. |
| Shockwave | Any treatment/educational reference found in approved release candidate | Shockwave indication and evidence wording | ______ | ______ | ______ | ______ | NOT REVIEWED | Exact included routes must be confirmed at review. |
| Colon cleansing | `/treatments/colon-cleansing`, relevant concern pages | Claimed support, risk and evidence uncertainty | ______ | ______ | ______ | ______ | NOT REVIEWED | High scrutiny; do not imply detoxification outcomes. |
| Advanced diagnostics | `/health-screening`, `/scf-lab-roadmap`, `/treatments/health-screening-ultrasound`, ECG and MCED routes | Test scope, availability, clinical utility and roadmap wording | ______ | ______ | ______ | ______ | NOT REVIEWED | Separate current services from roadmap. |
| International care claims | `/international-medicine-access`, `/malaysia-thailand-care`, `/medical-tourism`, Health Intelligence medicine routes | Pricing, registration, dispensing, import, travel and continuity claims | ______ | ______ | ______ | ______ | NOT REVIEWED | No access, savings, cheapest-market or suitability promise. |

Medical Director approval reference: ____________________  Date: __________  SHA/version: ____________________

Regulatory/Legal approval reference: ____________________  Date: __________  SHA/version: ____________________

## 7. Location And Licensing Sign-Off

The current public status is `PLANNED` and must remain unchanged without documentary approval.

| Location | Intended public name | Current public status | Actual operating status | Licensing/application status | Permitted public wording | Prohibited wording | Evidence/document | Reviewer | Approval date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Bangsar | MMS Bangsar | PLANNED | MISSING | MISSING | “Planned”; not open or accepting appointments | Open, licensed, operational, available services, appointment availability | __________ | __________ | __________ |
| SS2 | MMS SS2 | PLANNED | MISSING | MISSING | “Planned”; not open or accepting appointments | Open, licensed, operational, available services, appointment availability | __________ | __________ | __________ |
| Johor | MMS Johor | PLANNED | MISSING | MISSING | “Planned”; not open or accepting appointments | Open, licensed, operational, available services, appointment availability | __________ | __________ | __________ |

Licensing/Operations approver: ____________________  Role: ____________________  Date: __________

## 8. Day-1 Feature Confirmation

No selection below changes a feature gate. Technical activation requires a separate authorized task after all dependencies are closed.

| Feature | Current decision | Keep as is | Change requested | Approved for Day 1 | Owner/date |
| --- | --- | --- | --- | --- | --- |
| Booking | LAUNCH CANDIDATE - blocked by Zoho E2E | [ ] | [ ] __________ | [ ] after E2E | __________ |
| Ling AI | KEEP GATED | [ ] | [ ] __________ | [ ] | __________ |
| Health Intelligence real data | KEEP GATED | [ ] | [ ] __________ | [ ] | __________ |
| Partner Hub | KEEP GATED | [ ] | [ ] __________ | [ ] | __________ |
| Checkout | KEEP GATED | [ ] | [ ] __________ | [ ] | __________ |
| Applications | KEEP GATED | [ ] | [ ] __________ | [ ] | __________ |
| My Sanctuary | KEEP GATED | [ ] | [ ] __________ | [ ] | __________ |

## 9. Owner Action List

Allowed action status: `OPEN`, `EVIDENCE RECEIVED`, `VERIFIED`, `CLOSED`.

| Group | Exact item | Required evidence | Owner | Due date | Status |
| --- | --- | --- | --- | --- | --- |
| Founder/Owner | Confirm contracting/controller/copyright entities | Incorporation/IP records and signed selection of public legal forms | __________ | __________ | OPEN |
| Founder/Owner | Approve Day-1 feature matrix | Completed table in section 8 | __________ | __________ | OPEN |
| Founder/Owner | Approve final Production origin | Completed domain decision sheet | __________ | __________ | OPEN |
| Legal | Approve Privacy, Terms, Cookie and copyright documents | Dated reviewer identity, role, SHA/path scope and decisions for every known gap | __________ | __________ | OPEN |
| Legal | Approve medical, Ling, Health Intelligence and international disclaimers | Dated, versioned approvals coordinated with Medical/Regulatory | __________ | __________ | OPEN |
| Medical | Review all 20 topic groups | Completed section 6 with route scope and disposition for changes | __________ | __________ | OPEN |
| Medical | Confirm medical disclaimer and location/service boundaries | Signed version/path approval | __________ | __________ | OPEN |
| Licensing/Operations | Verify Bangsar, SS2 and Johor facts | Facility/entity/licence/application documents and permitted wording | __________ | __________ | OPEN |
| Licensing/Operations | Define booking operating queue | Named assignee, response SLA, escalation, retry and retention process | __________ | __________ | OPEN |
| Technical/Zoho | Approve Preview test organization and minimum OAuth permissions | Target ID/reference, module schema and security approval; no secrets in this pack | __________ | __________ | OPEN |
| Technical/Zoho | Reconcile booking mapping and run controlled E2E | Completed mapping plus create/read/retry/failure evidence | __________ | __________ | OPEN |
| Domain/IT | Validate domain ownership, TLS and redirect plan | Registrar/Vercel evidence and approved migration plan | __________ | __________ | OPEN |
| Domain/IT | Reconcile callbacks and absolute URLs | Completed checklist for auth, recovery, booking email, SEO and redirects | __________ | __________ | OPEN |

## 10. Go-Live Evidence Index

Store approval evidence outside the public repository if it contains personal, corporate, credential, registration, account, or confidential information. Record a non-secret reference here.

| Evidence ID | Evidence | Responsible owner | Date | Approved SHA/path scope | Secure reference | Status |
| --- | --- | --- | --- | --- | --- | --- |
| LEG-ENTITY | Legal/entity facts and authority | Founder/Owner + Legal | ______ | ______ | ______ | MISSING |
| LEG-DOCS | Legal document approval set | Legal/Privacy | ______ | ______ | ______ | MISSING |
| MED-SIGNOFF | Medical topic matrix | Medical Director | ______ | ______ | ______ | MISSING |
| REG-SIGNOFF | Regulatory advertising/content matrix | Regulatory/Legal | ______ | ______ | ______ | MISSING |
| LOC-LICENCE | Location/service status evidence | Licensing/Operations | ______ | ______ | ______ | MISSING |
| CRM-CONFIG | Approved Preview Zoho target and mapping | CRM owner + Privacy/Security | ______ | ______ | ______ | MISSING |
| CRM-E2E | Controlled Zoho E2E result | Technical/Zoho + Operations | ______ | ______ | ______ | MISSING |
| DOMAIN | Final origin and redirect/callback decision | Owner + Domain/IT | ______ | ______ | ______ | MISSING |
| FEATURE-D1 | Day-1 feature confirmation | Founder/Owner | ______ | ______ | ______ | MISSING |
| PREVIEW | Ready Git-triggered Vercel Preview | Technical owner | 2026-09-05 | `02ee0f6` evidence baseline | Vercel deployment evidence in T6.1 | VERIFIED |

## 11. Unresolved Issues And Gate

1. Legal/entity facts and approvals are missing.
2. Approved Zoho Preview configuration and real E2E evidence are missing.
3. The final Production domain is not decided.
4. Medical, regulatory, location and licensing approvals are missing.

No public code, Production configuration, DNS, Supabase state, migration, secret, or feature gate was changed in T6.2.

**GO / NO-GO: NO-GO.** All four P0s must be `CLOSED` before GO-READY can be considered.

**T6.2 STATUS: PASS WITH BLOCKERS**

**DO NOT START T7. DO NOT MERGE OR DEPLOY TO PRODUCTION.**
