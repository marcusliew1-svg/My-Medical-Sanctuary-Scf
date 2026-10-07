# T6.21 — Dev / Build Toolchain Hardening

**Status:** IMPLEMENTED IN CODE / PREVIEW VALIDATION REQUIRED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Reduce the remaining development/build audit exposure identified after T6.20 without weakening the Production dependency gate or forcing unrelated application changes.

## Changes

- Tailwind CSS: 3.4.x -> 4.3.3.
- Tailwind PostCSS integration moved to `@tailwindcss/postcss`.
- Legacy MMS Tailwind theme config remains loaded via `@config "../../tailwind.config.js"`.
- `autoprefixer` removed because the Tailwind 4 PostCSS pipeline no longer requires the prior standalone plugin.
- Patched `brace-expansion` lines are enforced with scoped npm overrides:
  - pre-2.x -> 1.1.21
  - 4/5.x -> 5.0.12
- A dev/build audit baseline script fails on any unexpected vulnerable package or if the tracked residual grows above five findings.

## Sandbox validation

The migration was tested in an isolated sandbox before repository implementation.

Results:
- aggregate audit reduced from **10 findings (8 high, 2 moderate)** to **5 high**;
- all Tailwind 3, Chokidar and PostCSS parser findings removed;
- Production dependency audit remains **0 vulnerabilities**;
- Next 16 baseline tests: PASS;
- T6.20 tests: PASS;
- TypeScript: PASS;
- lint: PASS;
- full Next.js build: PASS.

## Residual dev/build findings

The five remaining high findings are all in the current Next.js ESLint tooling chain:

- `eslint-config-next`
- `@next/eslint-plugin-next`
- `fast-glob`
- `micromatch`
- `braces`

The installed `braces` 3.0.3 release is currently the latest 3.x release available to this dependency chain and is the vulnerable transitive root. T6.21 does not downgrade `eslint-config-next`, remove Next-specific lint coverage, or substitute an unreviewed fork simply to force the aggregate audit to zero.

These residual findings remain visible and bounded by CI. They are not reclassified as Production-runtime findings.

## Validation required before merge

- regenerate `package-lock.json` natively from the T6.21 package manifest;
- run Production security audit;
- run dev/build audit baseline;
- run all existing CI regression suites;
- run T6.21 regression tests;
- typecheck, lint and full build;
- confirm Vercel Preview READY;
- inspect key public pages for obvious styling regressions;
- Production/main remain untouched.
