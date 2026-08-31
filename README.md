# My Medical Sanctuary Website

Public website and staged digital-platform foundation for **My Medical Sanctuary (MMS)**.

Tagline: **Preventive Care • Personalised Longevity**

## Release 2C.1 operations foundation

Release 2C.1 adds controlled source onboarding, manual observation capture, unresolved-product queues, basis/source/verification checkpoints, separate publication approval, freshness policies, anomaly flags and CSV dry-run validation for Malaysia, Thailand and Singapore. The seven-market model remains intact. Migration `0022` and its runtime grants are migration-ready but are not applied remotely by this branch.

## Stack

- Next.js 14 App Router
- React
- TypeScript
- Tailwind CSS
- Vercel deployment
- Central canonical site configuration
- Feature-gated unfinished app/platform surfaces
- Zoho-ready booking capture route
- Supabase commercial database foundation, disabled in production unless explicitly enabled
- Stripe checkout placeholders, disabled until fulfilment is approved

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Build

```bash
npm run build
```

## Release 1A Checks

```bash
npm run test:release1a
npm run typecheck
npm run lint
npm run build
```

## Canonical Domain

Temporary production canonical domain:

```text
https://www.scf.center
```

The canonical URL is centralised in `src/lib/siteConfig.ts` and can be changed later with:

```text
NEXT_PUBLIC_SITE_URL
MMS_SITE_URL
```

Do not hard-code a future MMS domain across individual pages.

## Production Feature Gates

The following unfinished surfaces are default-off in Vercel Production and enforced through middleware:

| Feature | Environment variable | Routes |
|---|---|---|
| Synthetic prototype | `MMS_PROTOTYPE_ENABLED` | `/prototype` |
| Partner Hub | `MMS_PARTNER_HUB_ENABLED` | `/partner-hub`, `/api/partner-hub`, `/api/internal/partner-hub` |
| Patient portal | `MMS_PATIENT_PORTAL_ENABLED` | `/login`, `/register`, `/onboarding`, `/my-sanctuary` |
| Membership checkout page | `MMS_MEMBERSHIP_CHECKOUT_ENABLED` | `/membership-checkout` |
| Production Ling AI | `MMS_PRODUCTION_LING_AI_ENABLED` | future production AI behavior only |

Preview/local development may expose approved development surfaces unless explicitly set to `false`. Production requires an explicit `true`.

## Release 1A Documentation

- `docs/release-1a-production-hygiene.md`
- `docs/public-page-migration-inventory-release-1a.md`

## Folder Structure

```text
src/
  app/
    page.tsx
    about-mms/page.tsx
    memberships/page.tsx
    how-it-works/page.tsx
    education/page.tsx
    corporate-executive-wellness/page.tsx
    contact/page.tsx
    privacy-disclaimer/page.tsx
    layout.tsx
    globals.css
  components/
    Navbar.tsx
    FooterV01.tsx
    Hero.tsx
    CTAButton.tsx
    SectionHeader.tsx
    MembershipCard.tsx
    StepCard.tsx
    WellnessAreaCard.tsx
    DisclaimerBox.tsx
    ContactForm.tsx
    EducationCard.tsx
    CorporateCTA.tsx
  data/
    memberships.ts
    wellnessAreas.ts
    steps.ts
    educationPosts.ts
```

## Primary Pages

- `/`
- `/about-mms`
- `/memberships`
- `/how-it-works`
- `/education`
- `/corporate-executive-wellness`
- `/contact`
- `/privacy-disclaimer`

## Zoho Integration Notes

The booking/contact form currently:

- captures required discovery fields
- validates consent server-side
- applies first-pass abuse protection
- returns a Zoho-ready placeholder response
- does not write live Zoho CRM records yet

Future Zoho steps:

1. Confirm Zoho CRM module and field API names.
2. Add server route for secure lead submission.
3. Store consent value, source page and timestamp.
4. Add validation and spam protection.
5. Add success/error analytics events.

Suggested Zoho mapping:

| Form Field | Zoho Field |
|---|---|
| Full name | Full Name |
| Phone | Mobile |
| Email | Email |
| Country / City | Country / City |
| Main interest | Interested Service |
| Preferred membership | Preferred Membership |
| Enquiring for | Enquiry Type |
| Preferred contact time | Preferred Contact Time |
| Consent | Consent to Contact |

## Compliance Notes

Use cautious wording:

- designed to support
- structured wellness journey
- preventive care
- personalised longevity
- HRM coordination
- professional review
- suitability assessment
- discovery discussion

Avoid exaggerated medical claims.
# Release 2A Health Intelligence

The private Health Intelligence data foundation is defined by `database/migrations/0021_mms_health_intelligence_foundation.sql`. The internal reviewer console is `/internal/health-intelligence` and is default-off behind `MMS_HEALTH_INTELLIGENCE_INTERNAL_ENABLED`. See `docs/health-intelligence-release-2a.md` before enabling it. No demo data or raw pricing table is public.
# Release 2C.2 assisted ingestion

Release 2C.2 adds a controlled, internal-only ingestion framework for approved Health Intelligence sources. CSV and future approved API adapters create traceable batches and collected/unverified observation candidates only. Connectors cannot verify product identity, verify a price, or publish data. Real data remains excluded from public reads unless `MMS_HEALTH_INTELLIGENCE_REAL_DATA_ENABLED=true` and the existing publication eligibility controls also pass.

See `docs/health-intelligence-connector-framework.md`, `docs/health-intelligence-csv-ingestion.md`, `docs/health-intelligence-assisted-extraction.md`, and `docs/health-intelligence-ingestion-security.md` before configuring any source.
