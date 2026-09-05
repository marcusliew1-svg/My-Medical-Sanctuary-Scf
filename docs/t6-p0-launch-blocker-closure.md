# T6 P0 Launch Blocker Closure

Status: **PASS WITH BLOCKERS** for Preview preparation. **NO-GO for Production.**

T6 starts from `e56be0e0f4a046f4e06bdde19c4017b74112b2b9` on `mms/integration-next16-foundation`. It closes only risks supported by repository evidence. It does not supply missing owner, legal, medical, licensing, domain, clinician, or asset approval.

## A. P0 Register Before T6

| P0 at T5 | Starting state |
| --- | --- |
| Complete legal/privacy/company identity and cookie position | OPEN: public pages were short boundary summaries; verified entity/controller and counsel approval absent. |
| Booking persistence | OPEN: validated requests always returned truthful HTTP 503 and were not stored. |
| Final Production domain/canonical | OPEN: `https://www.scf.center` remained explicitly temporary. |
| Medical/licensing/availability approval | OPEN: no dated owner/Medical/Legal approval matrix existed. |
| Conditional launch features, clinicians and assets | OPEN IF INCLUDED: no live E2E, identities, credentials, or rights evidence existed. |

## B. P0s Closed

| Closure | Evidence | Owner basis |
| --- | --- | --- |
| Unverified medical-entity structured-data claim removed | Root layout now emits neutral `WebSite` JSON-LD. `MedicalOrganization`, specialties, facilities, addresses and licences are not emitted. T6 tests inspect the source and built page. | Technical closure based on the verified absence of legal/licensing evidence; future medical entity schema still requires owner, Medical and Legal approval. |
| Cookie behavior is no longer undisclosed in the public legal structure | `/cookie-notice` documents the existing first-party `mms_partner_ref` cookie, 30-day maximum, safe UTM/ref parameters and absent third-party analytics. It explicitly blocks launch on unresolved legal fields. | Technical facts come directly from `proxy.ts`, referral validation and the T5 analytics audit. Legal approval remains open. |
| Conditional Day-1 P0 scope is explicit | Ling AI, Health Intelligence real data, Partner Hub, checkout, applications and My Sanctuary are `KEEP GATED`; none is needed for Day 1. | T6 scope decision plus existing default-off gates. This is not permission to enable them. |

These closures remove false or ambiguous publication states. They do not close the four core Production P0s below.

## C. P0s Still Open

| Open P0 | Missing evidence | Required owner |
| --- | --- | --- |
| Final legal/entity publication approval | Controller/contracting entity, registration details, address, privacy contact, processing basis, retention, recipients/processors, transfers, rights/complaints, effective dates, governing law, IP/liability/commercial terms and dated counsel approval. | Company owner and qualified legal/privacy counsel |
| Operational booking persistence | Written approval of Zoho Leads destination, confirmed field API names/picklist values, retention and operating queue; approved Preview credentials; real create/read/reconcile/failure E2E; distributed abuse control; release authorization. | Owner, Privacy/Legal, CRM owner, Operations and Security |
| Final Production domain/canonical | Exact final HTTPS origin and approval from Brand, Legal and IT; domain ownership/TLS and redirect plan. | Owner, Brand, Legal and IT |
| Medical/licensing/availability lock | Dated route-by-route claims matrix; operating entity/provider/facility/service licensing evidence; Medical and Legal sign-off. | Medical Director, Regulatory/Legal and Operations |

## D. Closure Evidence Rules

A P0 is closed only by attributable evidence: owner-supplied facts, dated professional approval, an approved system configuration plus E2E evidence, or removal/exclusion of the risky claim/feature. A passing unit test alone does not approve law, medicine, licensing, identity, content rights, or an external system.

## E. Booking Persistence Result

Approved Production architecture is **not yet evidenced**. Existing repository documents identify Zoho CRM Leads as the intended future server-to-server destination, so T6 prepares that adapter without asserting external approval.

- New gate: `MMS_BOOKING_PERSISTENCE_ENABLED`, default `false`.
- Hard boundary: `VERCEL_ENV=production` refuses persistence even if the gate is set.
- Readiness also requires `MMS_CRM_DEBUG` not to be `true` and the existing Zoho OAuth names to be configured.
- Mapping uses only standard Zoho fields already used by this repository: `First_Name`, `Last_Name`, `Email`, `Phone`, `Mobile`, `Country`, `Lead_Source`, `Data_Source` and `Description`.
- Existing Wave 5 body limit, same-origin check, rate limiting, honeypot, strict validation, canonical enums, consent/version/timestamp and server-derived referral attribution are preserved.
- Successful adapter writes return HTTP 201 with `status: persisted` and a non-CRM public reference. Failed writes return a truthful generic HTTP 502; disabled/unconfigured states retain truthful HTTP 503.
- No diagnosis, prescription, laboratory result, medical record, upload, or new clinical field is accepted.
- The adapter succeeds against an injected Preview test writer. No real Zoho write was attempted because approved credentials and mapping evidence were not supplied.

Result: **PREVIEW IMPLEMENTATION READY; PRODUCTION P0 OPEN.**

## F. Legal and Entity Result

The Privacy/PDPA, Terms and medical disclaimer pages now separate verified current website behavior from unresolved launch fields. A Cookie Notice route is present. Missing legal identity and counsel decisions are shown as publication blockers rather than filled with guesses. The unverified medical-entity JSON-LD is removed.

Result: **STRUCTURE CLOSED; ENTITY/COUNSEL APPROVAL P0 OPEN.**

## G. Medical Claims Result

No owner/Medical/Legal-approved wording was supplied in T6. No high-risk claim is promoted to launch-ready. The T5 route/topic matrix remains authoritative and all existing evidence, suitability, uncertainty and professional-review boundaries are preserved. Day-1 medical content remains subject to dated route-level sign-off.

Result: **P0 OPEN.**

## H. Licensing and Location Result

MMS Bangsar, MMS SS2 and MMS Johor remain `planned`. The clinics page continues to state that all three are not open or accepting appointments. The medical disclaimer now repeats that these centres, dialysis services and laboratory capabilities are not represented as open or licensed.

Result: **FALSE-STATUS RISK CONTROLLED; LICENSING/AVAILABILITY P0 OPEN.**

## I. Domain and Canonical Readiness

Final Production domain choice: **BLOCKED - not supplied by owner.** No DNS, Vercel domain or Production environment change is made.

Once approved, one release candidate must set both `NEXT_PUBLIC_SITE_URL` and `MMS_SITE_URL` to the exact same HTTPS origin, then verify canonicals, OpenGraph URLs, sitemap URLs, robots sitemap reference, `WebSite` JSON-LD URL, `en`/`ms`/`zh-CN`/`th` hreflang and `x-default`, referral origin checks, Auth redirects, old-origin permanent redirects, TLS and domain ownership. Do not hard-code the final domain into individual pages.

Result: **TECHNICALLY PREPARED; P0 OPEN.**

## J. Clinician and Asset Readiness

No verified clinician identity, credential, registration, biography source, likeness consent, image provenance or usage-rights record was supplied. The explicit medical-team placeholder remains and all T5 assets retain their provisional/rights-confirmation status. Day 1 must either keep these truthful placeholders or hide the section; it must not publish invented profiles or treat generic imagery as operational evidence.

Result: **KEEP PLACEHOLDERS/HIDE; CONDITIONAL P0 EXCLUDED FROM DAY 1.**

## K. Day-1 Feature Matrix

| Feature | Day-1 class | Conditions |
| --- | --- | --- |
| Booking | LAUNCH | Blocked until real approved Preview persistence E2E, legal basis/retention, operations queue, abuse control and release approval are complete. |
| Ling AI | KEEP GATED | Static bounded Ling education may remain; Production AI stays off. |
| Health Intelligence real data | KEEP GATED | Development/editorial shell only; real-data gate stays off. |
| Partner Hub | KEEP GATED | Live Supabase and application-to-approval-to-login E2E remain pending. |
| Checkout | KEEP GATED | Pricing, terms, Stripe webhook, fulfilment, refunds and operations are unapproved. |
| Applications | KEEP GATED | Sales Partner and careers intake remain excluded until approved CRM/ATS and policy E2E. |
| My Sanctuary | KEEP GATED | Demonstration patient portal is not a Day-1 service. |

`POST-LAUNCH` candidates after separate approval: Ling AI, real Health Intelligence data, Partner Hub, checkout, applications and My Sanctuary. `KEEP GATED` is the controlling Day-1 instruction.

## L. Tests

All 19 Node test suites pass: **192/192 tests**. This includes all 173 pre-T6 tests, 10 T5 production-readiness checks and 9 new T6 checks for Preview booking persistence, truthful failure, fail-closed Production behavior, legal structure, cookie truth, JSON-LD, location status and the Day-1 matrix.

The standalone Ling suites also pass: safety **86/86**, treatment routing **22/22**, assessment routing **22/22** and doctor briefs **22/22**. TypeScript typecheck passes. ESLint completes with zero errors and the same six pre-existing Partner Hub `react-hooks/set-state-in-effect` warnings. The Production build passes and generates 183 static pages.

## M. Audits

`npm audit --omit=dev` and the full `npm audit` both report **0 vulnerabilities**. The built client bundle scan is clean for secret and server-only environment-variable names. No dependency or lockfile change was made, and no secret value appears in this evidence.

## N. Route Inventory

Pre-T6 baseline: 163 normalized manifest entries and 188 expanded routes. T6 intentionally adds one public static route, `/cookie-notice`. The post-build inventory is **164 normalized manifest entries and 189 expanded routes**, with zero removals. Next.js reports 183 generated static pages; this separate framework build count is not the normalized route inventory.

## O. CI

The T6 regression suite is wired into the existing pull-request CI. GitHub Actions build run `33930629316` passed in 1m01s for the pushed T6 implementation commit. The integration branch remains the only push target; PR #31 remains draft/open/unmerged.

## P. Preview

Local Preview-equivalent visual QA covers Privacy/PDPA, Terms, Cookie Notice, the medical disclaimer, Contact and Clinics at 1440x1000, 1280x900, 768x1024 and 390x844. **24/24 checks pass**: HTTP 200, one H1, no console/page errors, no horizontal overflow, no broken images, required truth labels present, `WebSite` schema present and `MedicalOrganization` absent. Booking disabled, controlled-writer success, write failure and Production refusal are covered by the T6 regression suite.

The connected Vercel integration did not create a fresh hosted Preview: its check failed immediately with `Account is blocked.` This is an external account-state blocker, not an application build failure. No deployment was promoted and no Production domain was assigned.

## Q. Final Decision

**NO-GO for Production.** Core P0s remain open because owner/legal/medical/licensing/domain and live CRM evidence were not supplied. T6 has safely reduced ambiguity, prepared a fail-closed Preview booking path, and excluded unready features from Day 1.

**DO NOT MERGE OR DEPLOY TO PRODUCTION.**
