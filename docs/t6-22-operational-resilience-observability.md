# T6.22 — Operational Resilience & Observability

**Status:** IMPLEMENTED IN CODE / PREVIEW VALIDATION REQUIRED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Create a minimal, fail-closed operational health surface without introducing a third-party observability vendor, exposing infrastructure secrets, or implying Production activation.

## Controls introduced

1. Public liveness endpoint: `GET /api/status`
   - returns only `status` and service identity;
   - returns `Cache-Control: no-store`;
   - issues or propagates a bounded `X-Request-Id`;
   - exposes no environment, database, Zoho, feature-gate or credential detail.

2. Authenticated internal readiness endpoint: `GET /api/internal/operations/readiness`
   - protected by the existing internal bearer-token control;
   - aggregates commercial database configuration and structural probe state;
   - reports Zoho Day One configuration only as configured/blocked plus blocker count;
   - reports feature flags by name and configured-on state;
   - never returns credentials, tokens, database URLs, SQL text, Zoho secret values or raw blocker strings that may become sensitive.

3. Structured operational logging
   - JSON line format;
   - request-correlation IDs;
   - bounded payload depth and string length;
   - automatic redaction of keys matching authorization/cookie/secret/token/password/credential/connection/database URL patterns.

4. CI regression gate for T6.22.

## Readiness semantics

The public status endpoint is intentionally a **liveness** check, not a declaration that commercial, clinical, CRM or operator functionality is approved.

The internal readiness endpoint returns:
- `ready` only when the MMS commercial database configuration and structural probe are both ready;
- otherwise `degraded` with HTTP 503;
- Zoho configuration remains an independent reported dependency and does not override the existing T6.18 tenant-identity safeguards.

No clinical service is made active by this phase.

## Validation required before merge

- T6.22 regression tests PASS;
- existing CI suites PASS;
- TypeScript/lint/build PASS;
- Vercel Preview READY;
- public `/api/status` returns no secret/configuration detail;
- internal readiness remains bearer protected;
- Production/main remain untouched.
