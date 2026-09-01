# MMS Technical Track T1: Next.js Major Upgrade

## Decision

Selected target: Next.js 16.3.4 (Active LTS), React 19.2.8.

Next.js 15.5.25 was evaluated first because it has the smaller migration surface and remains in Maintenance LTS. It was rejected as the final target because its bundled PostCSS dependency remained within active high-severity advisory ranges in both the full and production-only npm audits. Next.js 16.3.4 produces zero npm audit findings and is compatible with the configured Node 24 runtime.

## Framework changes

- Upgraded Next.js and `eslint-config-next` from 14.2.35 to 16.3.4.
- Upgraded React and React DOM from 18.3.1 to 19.2.8, with matching type packages.
- Replaced removed `next lint` command with the supported ESLint flat-config CLI.
- Retained ESLint 9.39.5 because the plugin versions bundled by `eslint-config-next` 16.3.4 do not yet declare ESLint 10 compatibility.
- Renamed `src/middleware.ts` to `src/proxy.ts` and renamed its export without changing gate or referral-cookie behavior.
- Migrated framework-owned `cookies`, `params`, and `searchParams` APIs to asynchronous access.
- Accepted Next.js 16's generated TypeScript configuration updates and explicit route types.
- Set the Turbopack root explicitly to this repository so unrelated parent lockfiles are not considered.

## Preserved behavior

- Default-off production feature gates and 404 behavior.
- Referral-cookie value policy, 30-day lifetime, `HttpOnly`, `SameSite=Lax`, production `Secure`, and site-wide path.
- Central canonical host (`https://www.scf.center`), metadata, robots, sitemap, OpenGraph, and schema behavior.
- Health Intelligence public redaction, internal authentication, mutation authorization, and demo/real separation.
- Existing security headers, request validation, abuse controls, and integration feature flags.
- Route inventory: 137 unique route entries before and after the upgrade.

## Validation notes

- The Next.js build progress count changed from 149 to 147 generated static pages, while the normalized route inventory remained identical. This is a framework accounting difference, not a removed route.
- The warm final local build completed in 35.68 seconds. Next.js 16 no longer prints the same per-route first-load bundle table as the previous build, so a direct textual bundle-size comparison is unavailable.
- ESLint reports six existing Partner Hub async loading effects and one internal navigation call as warnings under newly enabled rules. They are not upgrade errors and remain visible for a later Partner Hub-focused refactor.

## Rollback

Abandon this isolated branch or revert its T1 commit. No database, production environment, DNS, or production deployment changes are part of this track.
