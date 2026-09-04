# T5 Production Readiness and Content Lock

Status: **PASS WITH BLOCKERS** for the preparation phase. **NO-GO for Production.**

This is an evidence-based launch manifest for the locked Preview baseline. It is not approval to merge, promote, enable a feature, change infrastructure, or publish unverified content.

## 1. Baseline

| Item | Locked value |
| --- | --- |
| Repository | `marcusliew1-svg/My-Medical-Sanctuary-Scf` |
| Branch | `mms/integration-next16-foundation` |
| Pre-T5 SHA | `7ce84b89d97b7b1db0527143af4663844a2a8b85` |
| Framework | Next.js 16.3.4, React 19.2.8, Node 24 |
| Test baseline | 173/173 passing |
| Route baseline | 163 normalized manifest entries; 188 expanded routes |
| CI baseline | GitHub CI passing |
| Deployment baseline | Vercel Preview passing; Production untouched |
| Pull request | #31, draft/open/unmerged |

Known T4 limitations carried into T5: medical-team identities and facilities are unverified; photography is provisional; translated clinical depth is partial; booking has no approved persistence destination; Production AI is disabled; authenticated, commerce, and internal tools are gated; and the final MMS domain is not locked.

## 2. Decision Rules

Content statuses used below are `READY`, `NEEDS CONTENT REVIEW`, `NEEDS MEDICAL REVIEW`, `NEEDS LEGAL/COMPLIANCE REVIEW`, `NEEDS REAL DATA`, `NEEDS REAL ASSET`, `PLACEHOLDER`, and `NOT FOR LAUNCH`.

- `READY` means the current page is technically coherent and conservatively worded. It does not grant medical, legal, commercial, licensing, or brand approval.
- Any item requiring an external owner remains blocked until that owner supplies dated, attributable approval.
- Absence of an invented claim is a pass. Missing real facts are never filled by inference.
- Production release requires every applicable P0 to be closed and evidenced. T5 itself must not perform that release.

## 3. Public Content Inventory

| Route or template | Status | Lock decision / owner |
| --- | --- | --- |
| `/` | NEEDS CONTENT REVIEW, NEEDS REAL ASSET | Narrative is conservative; Brand/Medical approve final copy and photography. |
| `/about-mms`, `/why-mms`, `/our-philosophy` | NEEDS CONTENT REVIEW | Brand and Medical approve positioning; medical-team subsection remains a placeholder. |
| `/about-mms#medical-team` | PLACEHOLDER, NEEDS REAL ASSET | No identities are invented. Clinical Governance/HR must supply verified profiles and licensed image rights, or hide the section and nav entry. |
| `/health-journey`, `/health-discovery`, `/health-screening`, `/preventive-care` | NEEDS MEDICAL REVIEW | Educational framing is cautious; Medical and Compliance approve services, availability, and claims. |
| `/health-concerns` plus 22 concern detail routes | NEEDS MEDICAL REVIEW, NEEDS EVIDENCE REVIEW | Keep education indexing gates off until the source register and every article are approved. |
| `/treatments` plus 18 treatment detail routes and `/treatments/research` | NEEDS MEDICAL REVIEW, NEEDS EVIDENCE REVIEW, NEEDS AVAILABILITY CHECK | Do not infer offered services from educational coverage. |
| `/longevity-medicine`, `/weight-management`, `/iv-therapy` | NEEDS MEDICAL REVIEW, NEEDS AVAILABILITY CHECK | Medical, Regulatory, and Operations approve each public service implication. |
| `/memberships`, `/how-it-works` | NEEDS CONTENT REVIEW, NEEDS COMMERCIAL REVIEW | Tier names and relationship model exist; inclusions, duration, renewal, pricing, and service levels are not locked. |
| `/membership` | READY redirect | Intentional alias to `/memberships`. |
| `/health-intelligence` and three public tools | NEEDS REAL DATA, NEEDS MEDICAL/LEGAL REVIEW | Safe as a clearly labelled development/demo experience only; not ready as live market intelligence. |
| `/medicine-intelligence` | NEEDS CONTENT REVIEW | Supporting education page; align terminology with the governed Health Intelligence status model. |
| `/ling` | NEEDS MEDICAL REVIEW | Static education/navigation role is bounded; Production AI stays disabled. |
| `/clinics` | NEEDS REAL ASSET, NEEDS LEGAL/COMPLIANCE REVIEW | All three locations are explicitly planned. No address, licence, opening date, or operational service may be inferred. |
| `/international-medicine-access`, `/malaysia-thailand-care` | NEEDS MEDICAL/LEGAL REVIEW, NEEDS AVAILABILITY CHECK | Coordination copy is cautious; destinations, providers, pathways, and availability require owner approval. |
| `/medical-tourism` | READY redirect | Intentional alias to `/malaysia-thailand-care`. |
| `/online-doctor` | NEEDS LEGAL/COMPLIANCE REVIEW, NEEDS AVAILABILITY CHECK | Verify telehealth jurisdiction, privacy, operating workflow, and Google Meet claim before launch. |
| `/corporate-executive-wellness`, `/professional-alliance-programme` | NEEDS COMMERCIAL/LEGAL REVIEW | Verify offers, eligibility, referral boundaries, and contracting model. |
| `/corporate-wellness` | READY redirect | Intentional alias. |
| `/scf-lab-roadmap` | NEEDS LEGAL/COMPLIANCE REVIEW | Future roadmap only; keep future/approval qualifiers. |
| `/insights`, `/media-room`, `/faq` | NEEDS CONTENT REVIEW | No unsupported social proof found; editorial owner must approve publication set. |
| `/education`, `/knowledge-hub`, `/health-articles` | READY redirect | Intentional aliases to `/insights`. |
| `/contact`, `/book-appointment` | TECHNICALLY SAFE BUT NOT OPERATIONAL | Valid submissions truthfully return 503 because no approved persistence exists. P0 before public conversion launch. |
| `/privacy-policy`, `/privacy-pdpa`, `/terms`, `/terms-of-use`, `/privacy-disclaimer` | NEEDS LEGAL/COMPLIANCE REVIEW | Current pages are boundary summaries, not complete launch policies. |
| `/ms`, `/zh`, `/th` and 24 translated section routes | PARTIAL WITH ENGLISH FALLBACK | Native and medical review required. Do not market as fully translated. |
| `/partner-login` and recovery/callback routes | NOT FOR LAUNCH | Gate stays off until live Supabase and approval-flow E2E evidence exists. |
| `/join-mms`, `/careers`, `/membership-checkout` | NOT FOR LAUNCH | Applications/checkout are disabled or non-operational. |
| `/login`, `/register`, `/onboarding`, `/my-sanctuary` | NOT FOR LAUNCH | Explicit demonstration patient portal, gated off in Production. |
| `/prototype/**`, `/partner-hub/**`, `/operations/**`, `/internal/**` | NOT FOR LAUNCH | Protected development/operator surfaces, not public launch content. |

## 4. Placeholder Manifest

Input `placeholder` attributes used as field hints are not content placeholders. Test fixtures inside protected internal tools are not public content.

| File / route | Placeholder | Risk | Owner/source | Action |
| --- | --- | --- | --- | --- |
| `src/app/about-mms/page.tsx` - `/about-mms#medical-team` | "Pending verification", "Pending approval", "Asset required" | Trust and licensing | Clinical Governance, HR, each clinician | Supply verified identity, role, credentials, registration, biography source, consent, and image rights; otherwise hide at launch. |
| `src/data/locations.ts`, `src/components/PublicExperience.tsx` - `/clinics` and homepage | Three planned facilities reuse generic visual assets; alt text explicitly says visual placeholder | Facility misrepresentation | Operations, Legal/Regulatory, Brand | Retain planned labels; replace with approved real facility/render assets and provenance. |
| `src/app/api/ling/route.ts` - `/ling` | `education-routing-placeholder` | Product capability overstatement | Medical Safety, Product | Keep Production AI off; approve clinical policy, prompt set, monitoring, escalation, and model behavior before enablement. |
| `src/app/login/page.tsx`, `src/app/register/page.tsx`, `src/app/my-sanctuary/page.tsx` | Demo sanctuary/account copy | User confusion | Product/Operations | Keep gated and out of launch. |
| `src/app/careers/page.tsx`, `src/app/join-mms/page.tsx` | Applications opening soon | Dead conversion | HR/Commercial Operations | Keep gated/disabled until an approved destination and E2E evidence exist. |
| `src/components/CommerceRecruitmentForms.tsx` - `/membership-checkout` | Online payment opening soon | Commercial promise | Finance/Commercial/Legal | Keep both Stripe gates off until prices, fulfilment, refunds, tax, terms, and webhook operations are approved. |
| `src/components/PublicMedicineIntelligence.tsx` - public tools | Demo preview and fictional search examples | Medicine-data misunderstanding | Health Intelligence Governance | Keep demo label and no-price fallback; publish only verified, dated, sourced real data. |
| `public/*` - multiple public routes | Provisional/generated-looking photography with no repository rights ledger | Copyright and authenticity | Brand/Legal | Obtain source/owner/licence/releases or replace. |

Repository-wide search found no Lorem Ipsum, invented `Dr. X`/doctor name, fake testimonial, rating, patient-count statistic, success percentage, unsupported award, press-logo wall, or partner-logo wall on the public surface.

## 5. Medical Claims Review

The copy frequently uses appropriate cautions such as assessment first, evidence varies, no guarantee, and clinician review. Those safeguards must be preserved. The following is a review queue, not an allegation that each statement is false.

| Routes/templates | Topics | Classification | Required check |
| --- | --- | --- | --- |
| Home, About, Memberships, Longevity | longevity, personalised medicine, preventive outcomes | NEEDS MEDICAL REVIEW | Define non-promissory meaning; verify offered pathways and Malaysian advertising compliance. |
| Health concern detail template | hormones/HRT, metabolic and kidney outcomes, cancer screening, regenerative procedures | NEEDS MEDICAL and EVIDENCE REVIEW | Validate every indication, red flag, evidence label, link, and update date against the source register. |
| Treatment detail template | NAD+, PRP/PRGF, HBOT, IV therapy, red light, shockwave, colon cleansing, peptides, hormone therapy, stem cells/MSC, exosomes, NK/NKT, CAR-T, advanced diagnostics | NEEDS MEDICAL, EVIDENCE, AVAILABILITY, and LEGAL/REGULATORY REVIEW | Confirm evidence, indication, product/procedure status, clinician credentials, facility licence, and whether MMS actually offers it. Educational presence must not imply availability. |
| Health screening and discovery | advanced diagnostics and cancer screening | NEEDS MEDICAL and AVAILABILITY REVIEW | Confirm appropriate-use language and available tests; never promise detection. |
| Locations | dialysis, renal, ACC, laboratory | NEEDS AVAILABILITY and LEGAL/REGULATORY REVIEW | Preserve planned/future qualifiers until facility and service approvals are evidenced. |
| International pages | medicine access, cross-border continuity | NEEDS LEGAL/REGULATORY and AVAILABILITY REVIEW | Confirm jurisdictions, providers, prescribing/import boundaries, privacy transfers, and operational pathway. |
| Ling prompts and answers | fatigue, weight, hormone, PRP, cancer screening, urgent symptoms | NEEDS MEDICAL REVIEW | Validate routing, escalation, omissions, and refusal behavior; no autonomous judgement. |

Low-risk content: statements that clearly describe general education, explicitly require professional review, reject guaranteed outcomes, and do not claim availability. Final approval still belongs to Medical/Compliance.

## 6. Location Status Lock

| Location | Public wording | Implied/current status | Risk decision |
| --- | --- | --- | --- |
| MMS Bangsar | "future" wellness and longevity flagship | Planned | Acceptable only with visible `Planned`; do not add address/opening/booking claims without evidence. |
| MMS SS2 | renal and dialysis centre; "intended to communicate" reliability and support | Planned | High-sensitivity service. Requires explicit planned label wherever named and regulatory/licensing review before operational language. |
| MMS Johor | "future" advanced medical / ACC / laboratory hub, subject to regulatory, licensing, funding, technical, and professional requirements | Planned | Current qualifiers are strong; retain all until approvals exist. |

`/clinics` explicitly says all three centres are planned and not open or accepting appointments. The homepage says planned services are not operational. No current content verifies an operational clinic, dialysis service, or laboratory.

## 7. Medical Team Lock

No publishable clinician profile exists. The About page intentionally withholds names and states that qualifications, registrations, roles, and photography await approval. For every future profile, Clinical Governance/HR must provide: legal/public name, approved role/title, current registration and jurisdiction, specialty wording, source-verified biography, conflicts/affiliations where required, portrait ownership and likeness consent, and dated publication approval. Until then, retain the explicit placeholder or hide the section and `Medical Team` navigation entry.

## 8. Photography and Asset Manifest

No source, owner, licence, model release, or consent ledger was found in the repository. Therefore no major visual is classified as `APPROVED REAL ASSET` by this audit.

| Asset group | Routes/components | Current classification | Replacement recommendation |
| --- | --- | --- | --- |
| `mms-about-hero.png`, `mms-health-screening-hero.png` | Home/About/screening/legal and other heroes | PROVISIONAL, NEEDS RIGHTS CONFIRMATION | Approved real consultation/discovery photography with releases. |
| `mms-concierge-lounge.png`, `mms-doctor-couple-consult.png`, `mms-doctor-results-review.png` | Home, memberships, international, insights | PROVISIONAL, NEEDS RIGHTS CONFIRMATION | Real MMS care team, consultation, and continuity environments. |
| `mms-diagnostics-screening.png`, `mms-medicine-access-consult.png` | Locations, treatments, Health Intelligence | PROVISIONAL, NEEDS RIGHTS CONFIRMATION | Real approved diagnostic/international review settings without implying unavailable equipment/services. |
| `ling-*.png` | Ling and patient/demo surfaces | PROVISIONAL, NEEDS RIGHTS CONFIRMATION | Approved Ling identity pack and documented generation/usage rights. `ling-guide.png` and `ling-mms-guide.png` are byte-identical; remove one only in a later asset-cleanup change after reference review. |
| `mms-*.webp` editorial art | Membership/medicine/service visuals | PROVISIONAL, NEEDS RIGHTS CONFIRMATION | Keep only with a provenance record; otherwise replace with approved branded visuals. |
| `mms-logo-*.png`, `scf-logo-new.png` | Global chrome/brand | NEEDS RIGHTS CONFIRMATION | Brand owner confirms final marks, relationship between MMS/SCF, and permitted use. |

Complete public asset index: `ling-concierge.png`, `ling-continuity.png`, `ling-guide.png`, `ling-knowledge.png`, `ling-mms-guide.png`, `ling-regional.png`, `mms-about-hero.png`, `mms-concierge-lounge.png`, `mms-diagnostics-screening.png`, `mms-doctor-couple-consult.png`, `mms-doctor-results-review.png`, `mms-health-screening-hero.png`, `mms-logo-full.png`, `mms-logo-lockup.png`, `mms-logo-mark.png`, `mms-medicine-access-consult.png`, `mms-medicine-intelligence.webp`, `mms-membership-journey.webp`, `mms-service-collage.webp`, and `scf-logo-new.png`. All inherit the classification of their group above; no rights approval is inferred.

Priority real-photography brief: homepage hero, consultations, named medical team, each facility, diagnostic environments, and international patient coordination. Do not source random web images.

## 9. Social Proof Audit

No public testimonial, patient quote, star rating, case study, number treated, outcome percentage, unsupported award, press-logo wall, or partner-logo wall was detected. Status: `READY` on the evidence reviewed. Any future social proof requires source records, consent, date/context, non-misleading presentation, and Medical/Legal approval; otherwise hide it.

## 10. Programme Commercial Review

Ascend, Evolve, Eterna, and Pinnacle are presented as relationship pathways, not a price list. Public pricing is absent, which is correct while unapproved. Before launch, Commercial, Operations, Medical, Finance, and Legal must lock: eligibility, inclusions/exclusions, physician involvement, HRM scope, check-in/monitoring cadence, duration, priority-access meaning, capacity, service credits, price/tax, payment/refund/cancellation, renewal, and fulfilment. Phrases including quarterly coordination, priority coordination, dedicated HRM, priority appointments, and bespoke planning are promises requiring operational confirmation.

## 11. Health Intelligence Public Safety

- PASS: preserves "Price is not the same as access."
- PASS: rejects prescribing, medicine switching, purchase/import instructions, fabricated prices, and equivalence based on price alone.
- PASS: empty real-data state is honest; demo data is explicitly labelled and Production refuses synthetic mode.
- BLOCKER: no governed real dataset is approved for public publication.
- REVIEW: public labels currently include `Verified identity`, `Demo preview`, `Potential direct generic match`, and `Professional review required`. Align the complete public taxonomy with the requested `Verified Exact`, `Close`, `Indicative`, and `Not Comparable` language before real-data launch. Do not change backend matching logic in T5.
- REQUIREMENT: every record needs product identity, country, price basis/currency, observation date, source, verification status, comparability/uncertainty, and expiry/re-review behavior.

## 12. Ling Content Lock

Current public copy describes Ling as an explainer, organiser, navigator, concierge, and question-preparation aid. It explicitly says Ling cannot diagnose/prescribe, determine suitability, direct medicine changes, or override professional judgement. Starter prompts route fatigue, knee/PRP, weight, and cancer-screening questions toward bounded education and clinician handoff. No autonomous judgement claim was found.

Production AI remains disabled. Enabling it requires medical review of the complete prompt/response policy, urgent escalation, medication safety, evaluation set, model/provider data handling, logging/retention, incident response, monitoring, and human escalation. The static placeholder must not be marketed as a live clinical AI service.

## 13. Multilingual Launch Status

| Locale | Status | Launch decision |
| --- | --- | --- |
| EN | READY subject to route-level reviews above | Primary launch language. |
| MS | PARTIAL WITH ENGLISH FALLBACK; NEEDS NATIVE and MEDICAL REVIEW | Do not market as complete. |
| ZH | PARTIAL WITH ENGLISH FALLBACK; NEEDS NATIVE and MEDICAL REVIEW | Do not market as complete. |
| TH | PARTIAL WITH ENGLISH FALLBACK; NEEDS NATIVE and MEDICAL REVIEW | Do not market as complete. |

Each regional locale includes the root plus Ling, memberships, treatments, health concerns, clinics, medical tourism, online doctor, and contact sections. Current pages disclose that deeper clinical content remains under review and route to English. Approved launch wording: **"Selected content available in Bahasa Malaysia, Simplified Chinese, and Thai."** Legal, consent, urgent-care, medication, and high-risk clinical text must receive native professional and medical review; do not machine-complete it.

## 14. Legal, Footer, and Disclosure Readiness

Current strengths: visible general-information, professional-review, no-outcome, jurisdiction, Ling, Health Intelligence, and planned-location boundaries.

P0 legal review is required because the current privacy and terms pages do not establish a verified legal entity/controller, company/registration details, address, effective/update dates, complete processing purposes and data categories, retention, recipients/processors, cross-border handling, rights procedure/contact, governing law, contractual/commercial terms, intellectual property, liability framework, or complaint route. No complete cookie notice/consent decision is present. The footer also lacks verified company identity and copyright ownership.

`organizationJsonLd()` emits `MedicalOrganization` with `PreventiveMedicine` and `PrimaryCare`. Legal/Regulatory and Medical must verify that entity type and specialties against the operating/licensing position before Production. T5 does not invent a replacement schema.

## 15. Contact and Booking Readiness

Journey: `/contact` and `/book-appointment` submit to `/api/booking`. The API enforces body limits, allowed origin, a honeypot, strict field validation, server-generated consent time, referral-cookie attribution, and a six-attempt/ten-minute in-memory limiter. It builds a CRM-safe payload but intentionally does not persist it. A valid submission returns HTTP 503 with a truthful unavailable message.

Classification: **TECHNICALLY SAFE BUT NOT OPERATIONAL; P0 BLOCKER.** Before launch, approve and configure the CRM/persistence destination, data-processing basis, retention, owner/queue, acknowledgement, failure/retry behavior, alerting, reconciliation, and end-to-end test. Replace the per-instance memory limiter with an approved distributed control or document compensating edge/WAF controls. Contact/booking CTAs must not promise an appointment while capture is unavailable.

Other flows: careers is disabled and non-persistent; Sales Partner application is gated and needs live CRM E2E; membership checkout requires both Stripe gates and complete fulfilment/webhook/commercial approval. All are `NOT FOR LAUNCH` in the current state.

## 16. Partner Auth Readiness

The Partner Hub is default-off in Production. The code keeps partner identity separate from operator identity, uses verified `app_metadata` rather than editable user metadata, establishes short revocable database sessions, and prevents verification alone from granting partner approval. Live Supabase E2E remains pending.

Configuration checklist, to execute only in an approved future release:

- Select and document the dedicated Production Supabase project and data owner.
- Approve Site URL and exact Production/Preview callback and password-recovery redirects.
- Configure and review sender domain, custom SMTP, verification/recovery templates, expiry, and anti-enumeration behavior.
- Apply reviewed migrations through the approved process; verify grants, RLS, indexes, constraints, and rollback/restore.
- Provision partner mapping only from the approved registry into immutable/admin-controlled metadata.
- Test application -> approval -> Partner ID -> identity -> verification -> login end to end, including rejection and revocation.
- Test login, logout, expiry, refresh, password recovery/update, replay, callback errors, origin/CSRF controls, and session revocation.
- Prove tenant isolation and that no clinical data is accepted or exposed.
- Keep `MMS_PARTNER_HUB_ENABLED` and QA bootstrap off until evidence is signed.

## 17. Vercel Launch Manifest

No Vercel setting is changed by T5. The Preview deployment is protected from anonymous access by Vercel authentication; keep protection policy documented. Production promotion must be a separate, human-approved action.

| Class | Variable names |
| --- | --- |
| PUBLIC | `NEXT_PUBLIC_SITE_URL` |
| SERVER-ONLY configuration | `ZOHO_DC`, `ZOHO_ORGANIZATION_ID`, `ZOHO_CRM_OWNER_ID`, `ZOHO_LEADS_MODULE_API_NAME`, `MMS_DEFAULT_LEAD_SOURCE`, `MMS_SITE_URL`, `MMS_OPERATOR_SUPABASE_URL`, `MMS_OPERATOR_SUPABASE_PUBLISHABLE_KEY`, `MMS_OPERATOR_SESSION_MAX_AGE_SECONDS`, `MMS_OPERATOR_STEP_UP_MAX_AGE_SECONDS`, `MMS_COMMERCIAL_DATABASE_SCHEMA`, `MMS_PARTNER_SUPABASE_URL`, `MMS_PARTNER_SUPABASE_PUBLISHABLE_KEY`, `MMS_PARTNER_SESSION_MAX_AGE_SECONDS`, `MMS_PARTNER_ID_ALLOCATOR`, `STRIPE_PRICE_ASCEND`, `STRIPE_PRICE_EVOLVE`, `STRIPE_PRICE_ETERNA`, `STRIPE_PRICE_PINNACLE`, `MMS_SALES_PARTNER_CRM_MODE`, `MMS_SALES_PARTNER_MODULE_API_NAME`, `MMS_SALES_PARTNER_LEAD_SOURCE`, `MMS_SALES_PARTNER_APPLICANT_TAG`, `MMS_CAREERS_SYSTEM`, `MMS_CAREERS_OWNER_ID` |
| SECRET | `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, `MMS_INTERNAL_API_TOKEN`, `MMS_FINANCE_API_TOKEN`, `MMS_OPERATOR_SESSION_SECRET`, `MMS_COMMERCIAL_DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| FEATURE GATE | `MMS_PROTOTYPE_ENABLED`, `MMS_PATIENT_PORTAL_ENABLED`, `MMS_MEMBERSHIP_CHECKOUT_ENABLED`, `MMS_PRODUCTION_LING_AI_ENABLED`, `MMS_OPERATOR_ACCESS_ENABLED`, `MMS_HEALTH_INTELLIGENCE_INTERNAL_ENABLED`, `MMS_HEALTH_INTELLIGENCE_DEMO_MODE`, `MMS_HEALTH_INTELLIGENCE_REAL_DATA_ENABLED`, `MMS_COMMERCIAL_DATABASE_ENABLED`, `MMS_PARTNER_HUB_ENABLED`, `MMS_PARTNER_HUB_QA_BOOTSTRAP_ENABLED`, `MMS_STRIPE_CHECKOUT_ENABLED`, `MMS_STRIPE_FULFILMENT_ENABLED`, `MMS_SALES_PARTNER_APPLICATIONS_ENABLED`, `MMS_CAREERS_APPLICATIONS_ENABLED`, `MMS_HEALTH_EDUCATION_INDEXABLE`, `MMS_MEDICAL_EDUCATION_INDEXABLE` |
| OPTIONAL/diagnostic | `MMS_CRM_DEBUG` |

Before Production: approve final domain and set both site URL variables consistently; confirm Node 24/build command/root/output; validate redirects, canonical/hreflang/sitemap/robots; keep non-launch gates false; scope secrets per environment; review Preview/Production protection and branch policy; require PR checks and human promotion approval; configure error monitoring, uptime/form synthetic checks, logs, retention/redaction, and analytics only after consent approval; record rollback deployment. Never print values in evidence.

## 18. Supabase Readiness Manifest

No project, schema, migration, policy, Auth setting, or template was touched in T5.

- Select dedicated projects and ownership for operator and partner trust domains; do not reuse a patient/clinical database by convenience.
- Approve Site URL, redirect allow-list, session lifetimes, password/MFA policy, SMTP, and templates.
- Review migrations before execution; inventory schemas/tables/functions/triggers/storage; verify default privileges, grants, and RLS on every exposed relation.
- Confirm anonymous/publishable key access with negative tests. Service-role credentials, if ever required, remain server-only and narrowly used.
- Keep Partner ID mapping admin-controlled and derived from the approved registry; test revocation and orphan/duplicate handling.
- If Storage is adopted, define private buckets, object policies, signed URL duration, malware/content validation, retention, and deletion.
- Establish backup/PITR/restore testing, migration rollback, Security Advisor and Performance Advisor review, audit/log retention, alerting, and incident access.
- Account for current platform changes during implementation: new tables should not be assumed to be API-exposed automatically, and production email delivery/template behavior must be validated with approved SMTP.

## 19. HeyGen Readiness Manifest

No HeyGen asset is generated or enabled in T5. Appropriate future uses are approved, clearly labelled explainers or Ling orientation, never medical authority. Requirements: script Medical/Legal review; named asset owner; presenter/avatar consent and likeness rights; no implication that an avatar is a doctor; no diagnosis, prescription, suitability decision, or outcome claim; visible digital-presenter disclosure; captions/transcript; native and medical review for every language; version/withdrawal control; approved hosting/CDN, poster, lazy loading, compression, and performance budget; accessibility alternative; analytics/consent review; and incident/removal owner.

## 20. Analytics and Consent

No third-party analytics provider or analytics script was found. Health Intelligence telemetry accepts only a small allow-list and currently returns 204 without storing payloads. First-party referral/UTM handling exists for `ref`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and locale; referral attribution uses a first-party cookie.

Before enabling analytics, Legal/Privacy must classify each cookie and event, decide consent/banner requirements by audience/jurisdiction, document provider/processor and cross-border transfer, minimize event payloads, prohibit health/clinical content and direct identifiers, set retention/deletion/access controls, honor withdrawal, update the privacy/cookie notice, and test consent defaults. Do not enable analytics in T5.

## 21. Link and 404 Audit

Local Preview crawl result: `/sitemap.xml` returned 200 with 64 entries. All 64 destinations returned 200 or an intentional 307 alias. The crawl discovered 75 internal links; additional sampled dynamic/gated routes returned expected 200s in Preview. Intentional redirects are `/membership` -> `/memberships`, `/education`, `/knowledge-hub`, and `/health-articles` -> `/insights`, `/corporate-wellness` -> `/corporate-executive-wellness`, and `/medical-tourism` -> `/malaysia-thailand-care`. Protected/non-launch pages may be visible in local/Preview by design but must remain unavailable in Production. No unexplained public dead link or broken image was found. Repeat the crawl against the release-candidate Preview and final domain before promotion.

## 22. Performance Readiness

- Next/Image is used throughout, AVIF/WebP output is configured, fonts use `next/font` with swap, and no third-party analytics script was found.
- There are 28 client-component source files, primarily interactive forms, navigation, Ling, Health Intelligence, and protected consoles. Public content remains largely server rendered.
- Meaningful asset risk: several PNG sources are about 0.8-2.1 MB; `mms-medicine-access-consult.png` is the largest at about 2.13 MB. Several are priority-loaded as heroes. Measure LCP and transferred variants on the release candidate before changing them.
- `ling-guide.png` and `ling-mms-guide.png` are byte-identical. Deduplication is a P3 repository/build hygiene task, not a launch blocker.
- Motion has reduced-motion handling. No performance claim is made without release-candidate field/lab measurement.

## 23. Accessibility Readiness

Automated/code-level status: PASS for one H1 on the ten principal pages at all four target widths, landmarks, labelled public forms, mobile menu dialog semantics, focus trapping/restoration, visible focus token, responsive images, no broken images, no horizontal overflow, and reduced-motion support. Decorative images use empty alt; informative images have text alternatives.

Manual review remains required for keyboard order across every route, screen-reader announcements and form errors, modal/menu behavior, zoom/reflow, color contrast in real browser states, tap targets, language pronunciation, and motion. Any failure is `NEEDS FIX`; do not claim WCAG conformance from this audit alone.

## 24. SEO Readiness

Baseline remains 163 normalized manifest entries and 188 expanded routes with no intentional removal. Central canonical generation, sitemap, robots, localized alternates, and x-default behavior are covered by tests. Health/medical education indexing gates remain off pending review. The sitemap crawl is clean.

Blockers/reviews: lock the final MMS canonical/domain instead of relying on temporary `https://www.scf.center`; validate titles/descriptions and duplicate metadata on the release-candidate build; keep protected/demo/auth routes disallowed/noindex; verify translated metadata with native reviewers; and approve or replace the `MedicalOrganization` JSON-LD and medical specialties. Sitemap `lastModified` currently reflects generation time rather than a content publication record, a P2 limitation.

## 25. Security Readiness

The existing operator, Operations, Commission, enquiry, Partner Auth, multilingual, Health Intelligence, feature-gate, and client-leakage controls remain mandatory. Production defaults keep prototype, patient portal, checkout, Ling AI, operator, internal Health Intelligence, real data, commercial database, Partner Hub/QA bootstrap, Stripe, application intake, and medical/health indexing gates off. No gate is enabled by T5.

Release evidence must include all security suites, same-origin/CSRF and body/rate-limit behavior, tenant and role isolation, session expiry/revocation, secret-name leakage scan, dependency audits, and a final diff/config review. The in-memory public-form limiter is not distributed and needs an approved Production control. Health Intelligence telemetry should receive the same explicit origin/rate-limit/privacy decision before persistence or analytics is added.

## 26. Master Blocker Register

### P0 - must close before any Production release

| Blocker | Closure evidence / owner |
| --- | --- |
| Incomplete legal/privacy/company identity and unresolved cookie/consent position | Final counsel-approved documents, verified entity details, effective dates, privacy contact, footer ownership, and publication approval. |
| Booking/contact submissions do not persist and valid requests return 503 | Approved destination and DPA/basis, successful Production-like E2E, failure/reconciliation monitoring, Operations acceptance. |
| Production launch identity/domain/canonical is not locked | Brand/Legal/IT approval and release-candidate evidence with consistent URLs; DNS change is outside T5. |
| Medical/licensing/availability review is incomplete | Dated approval matrix for every launch route, high-risk topic, programme, location, and JSON-LD claim. |

Conditional P0: if included in launch scope, medical-team profiles, Partner Auth/Hub, patient portal, checkout, live Health Intelligence data, Ling AI, applications, online doctor, or any operating facility/service must complete their specific verification and E2E checklists. Otherwise they remain hidden/gated and are excluded from launch.

### P1 - should close before public launch

- Approve and provenance-track final real photography, logos, likeness releases, and alt text.
- Lock programme inclusions, service levels, commercial terms, capacity, and CTA behavior.
- Complete native and medical review of every published translated page and critical fallback.
- Add distributed/edge abuse protection and live email/delivery/failure testing for public forms.
- Configure privacy-reviewed error monitoring, uptime checks, alert routing, and operational runbooks.
- Resolve online-doctor jurisdiction, privacy, platform, and availability wording or hide the route.
- Align public Health Intelligence status labels before real-data publication.

### P2 - launchable only as a documented limitation

- Market regional languages only as selected/partial content with English fallback.
- Keep medically reviewed education pages non-indexed until separate SEO approval.
- Record sitemap `lastModified` as generation time until editorial publication dates are implemented.
- Keep media/editorial supporting pages modest until a final publication calendar is approved.

### P3 - post-launch improvement

- Deduplicate the identical Ling image files after reference review.
- Continue measured image/source optimization where release-candidate LCP or transfer data supports it.
- Expand editorial provenance and content review automation.

## 27. Safe T5 Changes

T5 adds this document, adds a source-level readiness regression test, exposes it as `npm run test:t5`, and adds T4/T5 checks to CI. There are no runtime, route, content, database, migration, secret, DNS, Production environment, feature-gate, or infrastructure changes.

## 28. Verification and Preview QA

Local post-change evidence:

- 183/183 Node tests passed: all 173 baseline checks plus 10 T5 readiness checks.
- Ling safety runners passed: 86/86 routing safety, 22/22 treatment routing, 22/22 assessment plans, and 22/22 doctor briefs.
- Typecheck passed; lint passed with zero errors and the six unchanged Partner Hub warnings.
- Next.js Production build passed; generated route manifest remains 163 entries and route sources/static parameters are unchanged from the locked 188-expanded-route baseline.
- Client leakage scan of `.next/static` found none of the enumerated server-only/secret names.
- Sitemap/SEO crawl returned 64 entries, zero bad statuses, and zero duplicate-title groups among 200 responses.
- Preview visual automation reviewed ten principal pages at 1440x1000, 1280x900, 768x1024, and 390x844: 40/40 passed with zero page/console errors, broken images, horizontal overflow, missing H1, or failed responses. Manual spot checks covered About/team, Locations, Health Intelligence, and Contact.
- The locked baseline had zero production and zero full dependency vulnerabilities, and T5 makes no dependency or lockfile change. The post-change `npm audit` re-query could not produce fresh data because the npm advisory endpoint returned 503/timeout; rerun it in GitHub CI or before release sign-off.
- Verify the protected Vercel Preview generated from the post-T5 commit. Do not attach a Production domain or promote it.

## 29. Final Go/No-Go Criteria

Current recommendation: **NO-GO for Production; PASS WITH BLOCKERS for T5 preparation.**

Go requires: every applicable P0 closed with named owner and dated evidence; launch-scope matrix frozen; final medical/legal/commercial/asset approvals; booking operational or all conversion CTAs removed/redirected to an approved manual process; non-launch gates demonstrably off; final domain/canonical approved; complete CI/audit/route/SEO/security evidence; Preview sign-off at all target widths; operational monitoring and rollback owner confirmed; and a separate explicit human release authorization.

Rollback for these preparation-only changes: revert the T5 documentation/test commit(s) on the integration branch and rerun CI. No database, Supabase, Vercel environment, DNS, Production deployment, or secret rollback is required because T5 changes none of them. For a future Production release, record the previous known-good Vercel deployment before promotion and use Vercel rollback/redeploy only under the approved incident runbook.

**DO NOT MERGE OR DEPLOY TO PRODUCTION.**
