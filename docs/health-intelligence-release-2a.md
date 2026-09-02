# MMS Release 2A: Health Intelligence data foundation

## Boundary

This release provides product identity, provenance, price/FX history, matching, verification, audit and an internal reviewer console. It does not provide public medicine search, scraping, patient authentication, prescriptions, uploads, medical records, legal access decisions or live price claims.

## Internal console

`/internal/health-intelligence` is controlled by `MMS_HEALTH_INTELLIGENCE_INTERNAL_ENABLED`. The default is off in every environment. Production remains off unless explicitly approved later. Access uses the existing internal operator credential to issue a short-lived signed HttpOnly session. Mutations require same-origin requests, server-side allowlists and state validation.

`MMS_HEALTH_INTELLIGENCE_DEMO_MODE=true` is accepted only outside Vercel Production. All included records, sources and prices are fictional and visibly labelled. The demo store is operational testing only and may reset between server instances.

## Database rollout

1. Apply `database/migrations/0022_mms_health_intelligence_foundation.sql` to an approved non-production MMS database only, after the applied commercial hardening migration `0021_mms_database_post_provision_hardening.sql`.
2. Apply `database/provision/003_mms_health_intelligence_runtime_grants.sql`.
3. Run `database/qa/012_health_intelligence_transactional.sql`.
4. Run Supabase security/performance advisors and resolve findings before enabling database-backed Preview review.

No Production migration or feature enablement is authorized by this release.

## Security boundaries

- Raw tables deny `public`, `anon` and `authenticated`; RLS is enabled.
- Only the dedicated server role receives explicit reviewed grants.
- There is no public Health Intelligence API.
- Reviewer notes, supplier notes, opportunity scores and audit details remain server/internal only.
- Market/product intelligence is separate from patient and clinical data.

## Known dependency work

The Next.js major upgrade and residual audit findings remain a separately governed follow-up. Release 2A does not perform a framework major upgrade.
