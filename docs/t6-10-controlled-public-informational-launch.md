# T6.10 — Controlled Public Informational Launch

**CONTROLLED PUBLIC LAUNCH: NOT READY**

Assessment date: 2026-09-16. Scope: `mms/integration-next16-foundation`. This is a release-boundary and approval pack, not a deployment authorization. No deployment, DNS change, Supabase write or Production configuration write was performed.

The application now has a distinct, fail-closed `informational` Production launch mode. It permits the already-designated temporary origin only after explicit controlled-launch approval and rejects the build if any authenticated, booking, commercial, AI, real-patient-data, application or internal feature gate is enabled. Full-launch checks remain unchanged.

The release is not ready today because the live `www.scf.center` deployment emits the Vercel deployment hostname in Open Graph, robots and sitemap metadata; route-level Medical/Legal/Regulatory and native-language approvals are absent; asset rights are not evidenced; and the contact/booking experience still invites submission while persistence is deliberately off.

## Safe public route candidates

“Candidate” means technically appropriate for the informational release after the approvals and content changes in this pack. It does not mean the current copy is medically, legally or commercially approved.

| Route or family | Controlled-launch disposition | Required boundary |
| --- | --- | --- |
| `/`, `/about-mms`, `/why-mms`, `/our-philosophy`, `/how-it-works` | Candidate | Publish only approved corporate and service-description claims; do not imply an operating clinic or available clinical service. |
| `/health-journey`, `/health-discovery`, `/health-screening`, `/preventive-care`, `/longevity-medicine`, `/weight-management`, `/iv-therapy` | Candidate after route-level review | Informational education only; Medical/Legal/Regulatory approvers must approve, revise or hold each route. No suitability, outcome or availability promise. |
| `/education`, `/faq`, `/health-articles`, `/knowledge-hub`, `/media-room`, `/health-intelligence`, `/health-intelligence/generic-medicines`, `/health-intelligence/medication-cost-review`, `/health-intelligence/medicine-prices`, `/international-medicine-access`, `/medicine-intelligence`, `/insights` | Candidate after route-level review | Static information only. No patient data, real-data feature, live prices, availability, prescribing or medical advice. |
| `/clinics`, `/scf-lab-roadmap`, `/malaysia-thailand-care` | Candidate after review | Every facility and service stays expressly planned. No opening, licence, clinician, booking or operating claim. |
| `/ms`, `/zh`, `/th` and their existing informational sections | Candidate after native and medical review | Retain partial-language disclosure and English fallback; do not represent the experience as a complete translation. |
| `/online-doctor` | Candidate status page only | Must remain noindex and clearly “planned / not currently available”; no consultation, clinician, platform, booking or jurisdiction claim. |
| `/privacy-pdpa`, `/privacy-policy`, `/terms`, `/terms-of-use`, `/cookie-notice`, `/privacy-disclaimer` | Candidate interim notices only | Keep noindex and visibly interim/draft. Do not identify an invented entity/controller or represent unfinished terms as final. Publication still needs explicit Legal/Privacy approval. |

`/health-concerns/**`, `/treatments/**`, membership/programme pages and detailed medical education are **held**, not automatically included. They can move into the candidate set only through a versioned route/claims matrix with Medical, Legal and Regulatory approval.

## Routes and features that remain gated

| Surface | Controlled-launch state |
| --- | --- |
| Patient registration, patient Auth APIs, recovery and My Sanctuary | OFF; Production route/API gate returns unavailable/404. |
| Partner login/Auth, Partner Hub, partner operations and QA bootstrap | OFF; no Production Partner identity or data access. |
| Booking and Zoho persistence | OFF; `/api/booking` is proxy-gated. No lead or enquiry write. |
| Commercial database and internal commercial/commission operations | OFF; no Production pooler or commercial writes. |
| Membership checkout, checkout APIs, Stripe fulfilment and webhook | OFF; page and write-capable APIs are proxy-gated. |
| Live online-doctor consultation | OFF; status page only. |
| Production Ling AI and prototype | OFF. Static informational copy does not authorize AI interaction. |
| Real Health Intelligence patient/live data and internal HI tools | OFF. |
| Careers and Sales Partner application submission | OFF; both submission APIs are proxy-gated. Their pages must not invite a usable application until separately approved. |
| Operator/internal routes | OFF. |
| Medical/health education indexing flags | OFF unless separately approved after route review. |

All controlled-launch disabled gates are enumerated in `CONTROLLED_PUBLIC_DISABLED_GATES`. In Production informational mode, any one set to the exact value `true` fails the build. Existing dependency checks, Preview/iPivot reference rejection, patient/Partner Auth controls, commercial DB controls, booking controls and full-launch legal/domain checks remain intact.

## Public claim and experience blockers

1. **Homepage and corporate routes:** physician-guided, centre, programme and coordinated-care language can imply an operating clinical service. Medical/Legal/Regulatory review must approve or revise each statement.
2. **Treatments, concerns, screening and programme routes:** educational framing can still imply availability, suitability or outcomes. No dated route-level approval matrix exists.
3. **Membership pages:** physician involvement, review cadence, coordination and service-priority language are operational promises and are held pending evidence and approval.
4. **About/team representation:** placeholder or incomplete medical-team content must be hidden or replaced with approved identities, roles, credentials and asset permissions.
5. **Locations and regional-care pages:** planned qualifiers must remain prominent. Facility, laboratory, dialysis, clinician, cross-border and service wording needs evidence-backed approval.
6. **Multilingual routes:** current pages are partial translations. Native-language and medical review is not evidenced; English fallback and partial-coverage disclosure must remain.
7. **Visual assets:** no complete rights/provenance ledger has been approved for public launch assets.
8. **Contact and booking expectation:** `/contact`, `/book-appointment` and CTAs currently invite enquiries while persistence is off. Before public release, either replace them with a non-submitting “not yet accepting enquiries” state or configure a separately approved, monitored manual contact path. Do not expose a form that will only fail.
9. **Applications:** `/careers` and `/join-mms` may describe future role families only if copy makes submissions unavailable; they must stay out of launch navigation or use a non-submitting state while APIs are gated.

## Temporary origin and canonical assessment

Read-only checks on 2026-09-16 established:

- `http://scf.center/` redirects to HTTPS, then the apex redirects to `https://www.scf.center/`.
- `https://www.scf.center/`, `/robots.txt` and `/sitemap.xml` respond successfully over TLS and are served by Vercel.
- The current homepage Open Graph URL, robots sitemap reference and sitemap entries point to `https://my-medical-sanctuary-scf.vercel.app` rather than `https://www.scf.center`.
- No reliable self-canonical was present in the inspected homepage response.

**Finding:** `scf.center` can safely serve as the temporary public origin only with `https://www.scf.center` as the single configured canonical origin. The existing HTTP/apex-to-HTTPS/www redirect topology is suitable. The current deployed metadata is **not** suitable and must be rebuilt with both site-origin variables set exactly to the www origin. Do not configure the apex and www variants independently and do not use the Vercel hostname as canonical.

The final MMS domain remains unresolved. This exception authorizes neither a final-domain decision nor full Production launch. `MMS_PRODUCTION_CANONICAL_APPROVED` remains false/absent unless the final domain is separately approved.

## Exact final change set requiring approval

### A. Code change in this branch

1. Add `MMS_PRODUCTION_LAUNCH_MODE=informational` as a separately approved preflight mode.
2. Require `MMS_CONTROLLED_PUBLIC_LAUNCH_APPROVED=true` for that mode.
3. Hard-fail if any operational/authenticated/commercial/booking/AI/real-data/application/internal gate is true.
4. Permit `https://www.scf.center` only for this controlled informational mode; preserve full-launch final-domain and legal-attestation requirements.
5. Proxy-gate booking, checkout/webhook, careers and Sales Partner submission APIs while their gates are off.

### B. Content and owner approvals before deployment

1. Medical + Legal/Regulatory: approve a versioned publish/revise/hold matrix for every proposed public route and claim. Hold all unapproved treatment, concern, programme and membership routes.
2. Legal/Privacy: approve publication of the visibly interim/noindex legal pages without final entity/controller facts and confirm that no wording presents them as final.
3. Brand/Legal: approve an asset rights/provenance ledger for every launch asset.
4. Native-language + Medical/Legal: approve every published `/ms`, `/zh` and `/th` page, retaining partial-language disclosure.
5. Product + Operations + Legal/Privacy: approve either a non-submitting contact/booking state or a monitored manual contact path. No booking/Zoho persistence is authorized.
6. Medical + Legal/Regulatory: approve `/online-doctor` only in its present unavailable/noindex form.
7. Release owner: approve the exact route allow-list and `MMS_CONTROLLED_PUBLIC_LAUNCH_APPROVED=true` attestation.

### C. Production-only Vercel configuration writes after approval

Set exactly:

```text
MMS_PRODUCTION_LAUNCH_MODE=informational
MMS_CONTROLLED_PUBLIC_LAUNCH_APPROVED=true
MMS_SITE_URL=https://www.scf.center
NEXT_PUBLIC_SITE_URL=https://www.scf.center
```

Keep absent or exactly `false`:

```text
MMS_PATIENT_REGISTRATION_ENABLED
MMS_PATIENT_PORTAL_ENABLED
MMS_PARTNER_HUB_ENABLED
MMS_BOOKING_PRODUCTION_APPROVED
MMS_BOOKING_PERSISTENCE_ENABLED
MMS_COMMERCIAL_DATABASE_ENABLED
MMS_MEMBERSHIP_CHECKOUT_ENABLED
MMS_STRIPE_CHECKOUT_ENABLED
MMS_STRIPE_FULFILMENT_ENABLED
MMS_PRODUCTION_LING_AI_ENABLED
MMS_HEALTH_INTELLIGENCE_REAL_DATA_ENABLED
MMS_CAREERS_APPLICATIONS_ENABLED
MMS_SALES_PARTNER_APPLICATIONS_ENABLED
MMS_OPERATOR_ACCESS_ENABLED
MMS_HEALTH_INTELLIGENCE_INTERNAL_ENABLED
MMS_HEALTH_EDUCATION_INDEXABLE
MMS_MEDICAL_EDUCATION_INDEXABLE
MMS_PROTOTYPE_ENABLED
MMS_PARTNER_HUB_QA_BOOTSTRAP_ENABLED
MMS_HEALTH_INTELLIGENCE_DEMO_MODE
```

Also keep `MMS_PRODUCTION_CANONICAL_APPROVED`, `MMS_PRODUCTION_LEGAL_APPROVED` and `MMS_PRODUCTION_SMTP_E2E_APPROVED` absent/false. They are not bypassed for their protected features; they are simply not prerequisites to publish a specifically approved interim informational shell.

Remove the **Production scope only** from the existing cross-scoped `MMS_PARTNER_SUPABASE_URL`, which currently points at the MMS Preview ref `tfwnlmmdrkkfrtmawpma`. Preserve its Preview scope. Do not replace it with a Production Partner URL for this release; Partner Hub stays off. Snapshot the environment before any write.

No Supabase Auth, SMTP, DNS, database, Zoho, Stripe, user or Production-record write is required or approved for the informational launch.

### D. Separately approved deployment and verification

Only after A–C and the route/content approvals pass:

1. Build and deploy the approved SHA to the existing Vercel Production project.
2. Verify HTTP and apex redirect to `https://www.scf.center` without loops.
3. Verify canonical, Open Graph URL, JSON-LD, robots sitemap reference, sitemap URLs and every hreflang/x-default use `https://www.scf.center`.
4. Verify all gated pages and APIs are unavailable/404 and no submission can persist.
5. Verify every launch route matches the approved allow-list and held routes are unavailable, noindex or removed from navigation as approved.
6. Verify `/online-doctor` remains unavailable/noindex and legal pages remain visibly interim/noindex.
7. Record smoke-test evidence and obtain release-owner sign-off.

Rollback: restore the captured environment snapshot and previous Vercel deployment, set/remove `MMS_CONTROLLED_PUBLIC_LAUNCH_APPROVED` so it is false, and re-run route and metadata checks. All operational gates remain false throughout rollback.

## Readiness matrix

| Area | Status | Basis |
| --- | --- | --- |
| Separate informational preflight boundary | GREEN | Implemented fail-closed; full-launch checks retained. |
| Operational/auth/commercial/booking feature isolation | GREEN | Gates remain off and write-capable public APIs are additionally proxy-gated. |
| DNS and redirect topology | AMBER | Temporary www origin resolves and redirects correctly; no change approved. |
| Canonical/SEO metadata | RED | Current live metadata points to the Vercel deployment hostname. |
| Medical/licensing claims | RED | Dated route-level approval matrix missing. |
| Legal/privacy interim publication | AMBER | Draft/noindex boundary exists; explicit publication approval missing. |
| Multilingual content | RED | Native and medical approval evidence missing. |
| Asset rights/provenance | RED | Approved ledger missing. |
| Contact/booking experience | RED | Submission expectation conflicts with deliberately disabled persistence. |
| `/online-doctor` status representation | AMBER | Fail-closed copy/noindex exists; approval still required. |
| Controlled public launch overall | **NOT READY** | Complete the exact A–C approval/change set, then run D. |

## Verification evidence

- Targeted controlled-launch regression: **7/7 PASS**.
- T6.3 retained suite: **34/34 PASS**.
- T6.6–T6.9 retained suites: **27/27 PASS**.
- Full retained suite: **260/260 PASS**.
- Typecheck: **PASS**.
- Lint: **PASS with 0 errors and 6 pre-existing Partner Hub hook warnings**; this change introduces no warning.
- Next.js 16.3.4 optimized Production build: **PASS**, 197 static pages generated.
- Dependency audit: **0 vulnerabilities**.
- Route comparison: **180 normalized / 205 expanded before; 180 / 205 after; zero route additions and zero route removals**. The new proxy rules change availability only when Production feature gates are off.

## Recommendation

Do not deploy the current branch or current live metadata as the controlled public launch. Approve and complete the bounded content/route work, correct the Production-only origin configuration, remove the Preview Partner URL from Production scope, and then request a separate deployment authorization. Patient registration, My Sanctuary, Partner Hub, booking/Zoho persistence, commercial DB, checkout, applications, live online-doctor, Production Ling AI and real Health Intelligence data remain out of scope and off.
