# T6.11 — Controlled Public Launch Finalization

**T6.11 CONTROLLED PUBLIC LAUNCH: READY WITH CONDITIONS**

Assessment date: 2026-09-17. Branch: `mms/integration-next16-foundation`. Pre-change SHA: `948dfe265b06a484e9519cc555247302eaf9db42`.

The branch is technically prepared for a deliberately minimal informational release at `https://www.scf.center`. It is not a full MMS launch. The only remaining executable prerequisite is an approved, bounded Production environment change followed by separate deployment authorization. No deployment, DNS change, Supabase Auth write or Production record change was performed.

## Exact informational Production values

```text
MMS_PRODUCTION_LAUNCH_MODE=informational
MMS_CONTROLLED_PUBLIC_LAUNCH_APPROVED=true
MMS_SITE_URL=https://www.scf.center
NEXT_PUBLIC_SITE_URL=https://www.scf.center
```

Do not set `MMS_PRODUCTION_CANONICAL_APPROVED`, `MMS_PRODUCTION_LEGAL_APPROVED` or `MMS_PRODUCTION_SMTP_E2E_APPROVED`. The origin is interim, the legal pages are explicitly non-final, and Auth/SMTP remains outside the launch.

## Public route allow-list

The informational proxy permits exactly:

```text
/
/contact
/book-appointment
/online-doctor
/privacy-disclaimer
/privacy-pdpa
/privacy-policy
/cookie-notice
/terms
/terms-of-use
```

The homepage is the only indexable sitemap route. Contact/booking, online-doctor and interim legal routes are noindex. The controlled header, mobile navigation and footer link only within this allow-list.

## Held routes

The following are compiled but return a controlled `404` with `X-Robots-Tag: noindex, nofollow` in Production informational mode:

- About, Why MMS, philosophy and how-it-works pages until corporate/service wording is approved.
- All Health Intelligence routes until the informational wording and taxonomy are approved.
- All education, articles, insights, FAQ, knowledge-hub and media routes until Medical/Evidence review is complete.
- `/health-concerns/**`, `/treatments/**`, programme, membership, longevity, screening, weight, IV and other detailed medical/commercial pages.
- Clinics, planned facilities, laboratory roadmap, regional/cross-border care and medical-tourism pages until availability/licensing claims and assets are approved.
- `/ms`, `/zh`, `/th` and every localized section until native-language and Medical/Legal review is evidenced.
- Careers, Join MMS and Sales Partner application pages.
- Ling pages and prototypes.

Compilation is not approval. Moving a route into the allow-list requires a separate versioned content/claims/asset decision.

## Permanently gated operational surfaces for this release

- Patient registration, recovery, login, onboarding and My Sanctuary.
- Partner Auth, Partner Hub and Partner QA bootstrap.
- Booking API, booking persistence and Zoho CRM.
- Commercial database, operator console and internal commercial/commission routes.
- Checkout, Stripe webhook and fulfilment.
- Careers and Sales Partner submission APIs.
- Production Ling AI, prototype routes and real/internal Health Intelligence data.
- Every public and internal API route; the informational allow-list contains no API.

The Production preflight still fails if any protected gate is `true`. Read-only `vercel env ls production` evidence showed only `MMS_PARTNER_SUPABASE_URL`; therefore all named operational flags are absent in Production.

## Contact and booking state

`/contact` and `/book-appointment` render the same noindex, non-submitting status page. It states that MMS is not accepting website enquiries or bookings and that no form, persistence, CRM handoff, monitored support channel or alternate mailbox is operational. It asks visitors not to send personal or medical information and directs urgent issues away from the website. No fake-success path exists.

## Online-doctor state

`/online-doctor` remains public but noindex. It states that consultations are planned and not currently available, accepts no booking, names no available clinician, names no consultation platform, and makes no licensing or jurisdiction claim.

## Interim legal publication state

The six legal routes render a shared asset-free interim page in controlled mode. Each says it is a draft/non-final notice and does not invent an entity, registration number, controller, address, jurisdiction, effective date or counsel approval. The pages remain noindex. Final legal/entity readiness remains a blocker for a full launch, but is not represented as complete here.

## Asset-rights state

All repository photography, Ling imagery and logo binaries remain unapproved because no source/licence/release ledger exists. Controlled mode references none of them: the home, contact, online-doctor and legal surfaces use text/CSS only, the chrome uses text marks, metadata omits the provisional icon and social image, and direct public-asset paths fall outside the allow-list. Assets remain held rather than treated as approved.

## Multilingual state

All MS/ZH/TH routes are held. The controlled sitemap emits no hreflang links to them. No native-language or medical approval is inferred.

## Canonical and SEO evidence

The informational build is configured only with `https://www.scf.center` and verifies:

- homepage canonical: `https://www.scf.center/`;
- Open Graph URL: `https://www.scf.center`;
- JSON-LD `WebSite.url`: `https://www.scf.center`;
- robots sitemap: `https://www.scf.center/sitemap.xml`;
- sitemap: one URL, `https://www.scf.center/`, with no held hreflang alternates;
- no `vercel.app`, `localhost` or Preview ref in generated homepage, robots or sitemap output.

The existing live deployment is still wrong until the new build is separately authorized and deployed; its metadata currently points to the Vercel hostname.

## Wrong-scope Partner environment correction

Current read-only evidence: `MMS_PARTNER_SUPABASE_URL` is the only listed Production variable, is scoped to Preview and Production, and its Production assignment points to Preview ref `tfwnlmmdrkkfrtmawpma`.

Approved operation to execute before building/deploying:

```powershell
npx vercel env rm MMS_PARTNER_SUPABASE_URL production --yes
```

This removes only the Production assignment. It preserves the Preview assignment/value, does not add a Production Partner URL, and does not enable Partner Hub.

Rollback of that environment-scope operation, only if explicitly required, is:

```powershell
npx vercel env add MMS_PARTNER_SUPABASE_URL production
```

Enter the securely captured prior value at the prompt; never put it in source, the report, command history or logs. Restoring it intentionally recreates the known wrong scope and therefore requires separate approval. The safer deployment rollback leaves this correction in place because Partner Hub remains off.

## Operational gate audit

Keep all of these absent or exactly `false`:

```text
MMS_PATIENT_PORTAL_ENABLED
MMS_PATIENT_REGISTRATION_ENABLED
MMS_PARTNER_HUB_ENABLED
MMS_COMMERCIAL_DATABASE_ENABLED
MMS_BOOKING_PERSISTENCE_ENABLED
MMS_BOOKING_PRODUCTION_APPROVED
MMS_MEMBERSHIP_CHECKOUT_ENABLED
MMS_STRIPE_CHECKOUT_ENABLED
MMS_STRIPE_FULFILMENT_ENABLED
MMS_PRODUCTION_LING_AI_ENABLED
MMS_HEALTH_INTELLIGENCE_REAL_DATA_ENABLED
MMS_CAREERS_APPLICATIONS_ENABLED
MMS_SALES_PARTNER_APPLICATIONS_ENABLED
MMS_OPERATOR_ACCESS_ENABLED
MMS_HEALTH_INTELLIGENCE_INTERNAL_ENABLED
MMS_PROTOTYPE_ENABLED
MMS_PARTNER_HUB_QA_BOOTSTRAP_ENABLED
MMS_HEALTH_INTELLIGENCE_DEMO_MODE
MMS_HEALTH_EDUCATION_INDEXABLE
MMS_MEDICAL_EDUCATION_INDEXABLE
```

## Security findings

- Informational mode exposes no API route, Auth route, account route, internal route or operational submission route.
- Held requests receive `404`, `no-store` and `X-Robots-Tag: noindex, nofollow`.
- Auth, patient, Partner, internal and operator routes are absent from the controlled sitemap.
- No Preview Supabase URL or secret is embedded in controlled public output.
- No clinical-data read or write path is enabled.
- Full-launch, Auth, SMTP, commercial DB and booking approvals were not weakened.

## Verification

- T6.11 controlled-launch suite: **PASS**.
- T6.3 and T6.6–T6.10 retained suites: **PASS**.
- Full retained suite: **PASS**.
- Typecheck: **PASS**.
- Lint: **PASS with zero errors; six pre-existing Partner Hub hook warnings**.
- Production informational build: **PASS**.
- Dependency audit: **zero vulnerabilities**.
- Runtime controlled-route, metadata, robots, sitemap, leak and asset checks: **PASS**.
- Route count: **180 normalized / 205 expanded before and after; zero additions and zero removals**.

## Recommendation

**AUTHORIZE WITH CONDITIONS.** Before any deployment, explicitly approve the four Production values, the removal of only the Production Partner-URL scope, this ten-route allow-list, and the exact commit SHA. Then perform the bounded procedure below. This is not authorization to enable any other route or feature.

### Bounded Production deployment procedure

1. Record the current Production deployment ID/URL and export a secret-safe environment name/scope snapshot. Securely capture the prior Partner URL value for rollback without printing it.
2. Remove only `MMS_PARTNER_SUPABASE_URL` from Production scope using the command above; confirm its Preview scope remains.
3. Add the four exact informational values to Production scope using `npx vercel env add <NAME> production`; enter each approved value interactively.
4. Run `npx vercel env ls production`. Confirm the four values exist and every operational gate above is absent/false. Confirm no Preview/iPivot URL has Production scope.
5. Check out the approved SHA with a clean tree. Run the T6.11 suite, full suite, typecheck, lint, audit and `npx vercel build --prod`.
6. Inspect the prebuilt output locally for the exact canonical/SEO and route-gate evidence above.
7. Deploy only that prebuilt output with `npx vercel deploy --prebuilt --prod --yes`.
8. Smoke-test the ten allowed routes, representative held/Auth/API routes, metadata, robots and sitemap. Record results and the deployment ID.

### Rollback procedure

1. Run `npx vercel rollback <previous-deployment-id-or-url> --yes`.
2. Remove or restore the four informational variables to the captured pre-change state.
3. Keep all operational gates absent/false.
4. Prefer leaving the wrong-scope Partner URL removed. Restore it only under the separate rollback approval described above.
5. Re-run homepage, metadata, route-gate and Auth/API denial checks and record the rollback deployment state.

Do not deploy automatically. Stop after T6.11 and wait for explicit deployment approval.
