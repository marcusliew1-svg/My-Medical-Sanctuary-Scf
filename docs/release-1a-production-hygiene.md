# MMS Release 1A Production Hygiene

Release 1A is a technical hygiene layer. It does not redesign public pages, change DNS, enable live Zoho writes, enable production commercial database flows, enable Stripe fulfilment, or enable production Ling AI.

## Canonical Site Configuration

Authoritative configuration lives in `src/lib/siteConfig.ts`.

- Temporary production canonical URL: `https://www.scf.center`
- Used by: root metadata, OpenGraph metadata, `sitemap.xml`, `robots.txt`, and JSON-LD.
- Future MMS domain migration should update `NEXT_PUBLIC_SITE_URL` / `MMS_SITE_URL`, not hard-code individual pages.

## Production Feature Gates

Production route availability is enforced by `src/proxy.ts` through `src/lib/featureGates.ts`.

Default-off production surfaces:

- `MMS_PROTOTYPE_ENABLED`: `/prototype`
- `MMS_PARTNER_HUB_ENABLED`: `/partner-hub`, `/api/partner-hub`, `/api/internal/partner-hub`
- `MMS_PATIENT_PORTAL_ENABLED`: `/login`, `/register`, `/onboarding`, `/my-sanctuary`
- `MMS_MEMBERSHIP_CHECKOUT_ENABLED`: `/membership-checkout`
- `MMS_PRODUCTION_LING_AI_ENABLED`: production AI responses for Ling; the current educational placeholder remains non-AI.

Vercel Preview and local development may expose approved development surfaces unless explicitly disabled with the corresponding `false` flag. Production requires an explicit `true` flag.

## Security Headers

Configured in `next.config.mjs`:

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - Enforces HTTPS on supported browsers after first secure visit.
- `X-Content-Type-Options: nosniff`
  - Reduces MIME-sniffing risk.
- `X-Frame-Options: DENY`
  - Prevents clickjacking through framing.
- `Referrer-Policy: strict-origin-when-cross-origin`
  - Preserves useful same-origin referral data while limiting cross-origin leakage.
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
  - Keeps browser capabilities off unless explicitly designed later.

Content Security Policy is intentionally deferred. A proper CSP needs a separate integration pass for Next.js font/runtime behavior, Vercel image optimization, future Zoho embeds/forms, Stripe Checkout, analytics, and future Ling/portal scripts.

## Booking Endpoint Abuse Protection

`/api/booking` now includes:

- Maximum request body check.
- Server-side validation for name, mobile, email, country/location and interest.
- Consent version enforcement.
- Honeypot field support through `website`.
- In-memory rate limiting per forwarded client IP.

The rate limiter is suitable as a first Release 1A abuse-control layer, but should later be replaced or backed by a durable edge/serverless store before high-traffic campaigns.

## Referral Cookie Audit

Implementation: `src/proxy.ts` and `src/lib/referralTracking.ts`.

- Trigger: any route with a valid `?ref=` query value.
- Cookie name: `mms_partner_ref`.
- Value: normalised partner ID only.
- Lifetime: 30 days.
- Scope: `/`.
- Flags: `HttpOnly`, `SameSite=Lax`, `Secure` in production.
- Purpose: preserve attribution for later checkout or commercial workflows.
- Privacy implication: this is marketing/commercial attribution and should be described in privacy/cookie notices before formal launch.

## Deferred Production Items

- Zoho live writes remain disabled.
- Supabase commercial functionality remains controlled by environment gates and Preview-only configuration.
- Stripe fulfilment remains disabled.
- Production Ling AI remains disabled.
- Medicine price engine is not part of Release 1A.
