# T6.20 — Dependency & Security Hardening

**Status:** PASS — PRODUCTION DEPENDENCY RISK REMEDIATED / DEV-TOOLING REMEDIATION SEPARATE  
**Scope:** Preview/integration only. Production/main remain untouched.

## Trigger

The T6.19 Vercel Preview install reported 13 npm audit findings:

- 1 critical
- 10 high
- 2 moderate

The critical finding was on the direct `next` dependency. Remaining findings were concentrated in development/build tooling.

## Controlled remediation

T6.20 upgrades:

- `next`: 16.3.4 -> 16.4.0
- `eslint-config-next`: 16.3.4 -> 16.4.0

This stays within the existing Next.js 16 major line and avoids an unrelated framework migration.

A clean sandbox validation of the 16.4.0 pair passed:

- T6.19 regression tests
- TypeScript
- lint
- full Next.js build

After the same-major upgrade and transitive lock refresh:

- critical: **0**
- production dependency audit (`npm audit --omit=dev`): **0 vulnerabilities**

## Remaining audit findings

The remaining audit findings are confined to dev/build tooling, primarily the Tailwind 3 and ESLint dependency trees. They do not appear in the production dependency audit.

T6.20 does not force a Tailwind 4 migration merely to make the aggregate audit number zero. Tailwind 4 is a major toolchain/CSS migration and must be handled as a separate controlled change with visual-regression coverage.

## New CI control

`npm run security:prod` runs:

`npm audit --omit=dev --audit-level=high`

CI must fail if a future high/critical vulnerability enters the production dependency graph.

## Boundaries

- No Production deployment is authorized.
- Production/main remain untouched.
- No clinical capability or Production gate is activated.
- No security finding is suppressed or relabelled.
- Dev/build findings remain tracked until separately remediated.


## Final validation — 2026-10-07

Final cleaned PR state:

- `npm ci`: PASS
- production dependency security audit: **0 vulnerabilities**
- existing operator/security regression tests: PASS
- existing Next 16 baseline tests, updated for 16.4.0: PASS
- T6.20 dependency-security tests: PASS
- TypeScript: PASS
- lint: PASS
- full GitHub build: PASS
- Vercel Preview: READY

Aggregate development/build audit remains at **10 findings (2 moderate, 8 high)** after production-transitive remediation. These findings remain explicit and are not treated as Production-runtime findings. The remaining Tailwind/ESLint toolchain remediation is deferred to a separate controlled major/tooling upgrade rather than being forced into T6.20.

The temporary lockfile-refresh workflow used to safely regenerate the lockfile was removed before merge.
