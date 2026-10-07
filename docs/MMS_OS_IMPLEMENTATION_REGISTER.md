# MMS OS Implementation Register

**Document ID:** MMS-GOV-REG-001  
**Status:** WORKING DRAFT

## Implementation scope

This register tracks the transition from conceptual framework to controlled operating system.

| Workstream | Implementation artifact | Current status | Production authority |
| --- | --- | --- | --- |
| Master governance | MMS-GOV-FRM-001 | Implemented in repo as Working Draft | None |
| Structured governance data | database/migrations/0026_mms_operating_system_governance.sql | Applied successfully to dedicated MMS Preview branch | None |
| Master documents | governance_documents table | Preview live; 1 master document seed | None |
| Decisions | governance_decisions table | Schema ready | None |
| Risks | risks table | Schema ready | None |
| Controls | controls + risk_control_links | Schema ready | None |
| CAPA | capa_actions table | Schema ready | None |
| Clinical services | clinical_services table | Schema ready; no services activated | None |
| Facilities | facilities table | Schema ready; no facility approvals asserted | None |
| Clinician credentials | clinician_credentials table | Schema ready | None |
| Privileges | clinician_privileges table | Schema ready | None |
| Suppliers | suppliers table | Schema ready | None |
| Products | products table | Schema ready | None |
| Diagnostic partners | diagnostic_partners table | Schema ready | None |
| AI use cases | ai_use_cases table | Schema ready | None |
| Launch control | launch_capabilities table | Preview live; 10 capability seeds | None |
| Change control | change_requests table | Schema ready | None |
| Audit | audits table | Schema ready | None |
| Incidents | incidents table | Schema ready | None |
| Training | training_records table | Schema ready | None |

## Explicit boundaries

- No Production deployment is authorized.
- No database migration is applied by this branch.
- No clinical service is marked Active.
- No patient clinical information belongs in the governance schema.
- No Zoho / Supabase / Vercel credential changes are made.
- Existing controlled informational Production site remains untouched.
- Existing Partner and Patient operational gates remain untouched.
- Legal, privacy, Medical Director and jurisdiction-specific approvals remain external blockers.

## Next controlled implementation sequence

1. Preview migration applied successfully to dedicated MMS Preview branch.
2. Transactional QA 017 passed with rollback and forced-RLS/direct-grant assertions.
3. Foreign-key index hardening applied successfully.
4. Seeded governance records contain only framework/capability metadata; no patient-clinical payloads.
5. Build operator-only governance APIs / dashboard behind existing operator auth.
6. Assign named owners in the registers.
7. Move documents from WORKING DRAFT to REVIEW only with human approver evidence.
8. Keep all clinical services non-Active until regulatory, clinical and facility approvals are complete.
9. Keep Production capability activation independent and explicit.

## Acceptance condition

The OS foundation is considered implemented when:

- the controlled framework exists in the repository;
- the governance schema is reviewed and successfully applied to Preview;
- RLS remains forced and direct anonymous/authenticated access is absent;
- synthetic QA proves referential integrity and lifecycle constraints;
- operator-only read/write paths exist for the approved governance roles;
- management can see RED/AMBER/GREEN capability state and overdue governance actions.

Until those checks are complete, status remains **IMPLEMENTED IN CODE / NOT OPERATIONALLY ACTIVATED**.

## Preview execution evidence — 2026-10-07

- Dedicated Preview branch: `mms-preview-auth` / `tfwnlmmdrkkfrtmawpma`.
- Migration `mms_operating_system_governance`: PASS.
- QA `017_mms_operating_system_governance.sql`: PASS.
- Migration `mms_governance_fk_index_hardening`: PASS.
- 20 governance tables present with RLS enabled.
- Seed state: 1 master framework document; 10 launch capability records; zero clinical service records activated.
- Security advisor reports RLS enabled with no policies on governance tables. This is intentional fail-closed behavior at this stage because direct `public`, `anon`, and `authenticated` grants are revoked. Operator access must be added later through an explicitly approved server-side access path.
- Existing Preview Auth leaked-password-protection warning remains unresolved and is outside this migration.
- No Production project, iPivot project, Production deployment, Production gate or Production credential was changed.

## OS completion checkpoint — 2026-10-07

Implemented in Preview:

- baseline enterprise Risk Register: 12 risks across all seven risk domains;
- Control Library: 20 preventive/detective/corrective controls;
- risk-to-control mapping: 23 links;
- AI Use Case Register baseline: AI Operations and Ling, both non-Active;
- controlled document catalogue: 31 Working Draft documents plus the master framework;
- clinical service dependency engine with fail-closed ACTIVE-state guard;
- proposed Malaysia service catalogue: 7 services, all PROPOSED / INTERNAL_ONLY / all downstream exposure disabled;
- planned SS2 facility record: PROPOSED / emergency readiness RED;
- explicit dependency matrix for regulatory, protocol, facility, credential, privilege, competency, staffing, emergency, consent, insurance, product/diagnostics as applicable;
- internal Governance Console UI and operator-authenticated API;
- step-up required for governance mutations;
- mutations create immutable governance audit evidence;
- Production gate activation is not possible from the governance console;
- clinical-service ACTIVE / PUBLIC_AVAILABLE transitions are not possible from the governance console.

Validation:

- QA 017 governance foundation: PASS.
- QA 018 dependency/catalogue checks: PASS.
- Supabase migrations 0026–0031 applied successfully to `mms-preview-auth`.
- Vercel Preview build for branch `mms/os-v1-foundation` reached READY at commit `7ef6697764332f964b85ada92e507e9c9a0c3186`.
- The branch Preview still returns controlled 404 for `/operations/*` because `MMS_OPERATOR_ACCESS_ENABLED` is not available to this new branch scope. This is a configuration blocker, not a code/build failure.
- The connected Vercel account used here returns 403 for environment-variable list/create operations, so branch-scoped Preview variables cannot be completed from this session.
- Supabase Auth currently has 0 users with trusted `operator_id` app metadata. A synthetic operator must be created through supported Supabase Auth admin tooling; direct SQL mutation of `auth.users` is prohibited.

Status: **OS CODE + PREVIEW DATABASE FOUNDATION COMPLETE; LIVE OPERATOR PILOT BLOCKED ONLY BY AUTH/ENVIRONMENT CONFIGURATION AND EXTERNAL APPROVALS.**


## T6.19 governance ownership/review checkpoint — 2026-10-07

Implemented in Preview:
- explicit named owner, reviewer and approver identity fields for controlled governance documents;
- approval evidence reference and lifecycle timestamps;
- sequential document-state guard: `WORKING_DRAFT -> REVIEW -> APPROVED -> EFFECTIVE`;
- direct draft-to-approved/effective shortcuts rejected in application logic;
- database constraints fail closed when REVIEW/APPROVED/EFFECTIVE evidence is incomplete;
- Governance Console inputs added for named review/approval evidence;
- no person, approver or approval evidence was fabricated.

Preview validation:
- migration `mms_governance_document_review_workflow`: PASS;
- 32/32 documents remain `WORKING_DRAFT`;
- 0 documents moved to REVIEW/APPROVED/EFFECTIVE;
- 0 rows contain named owner/reviewer/approver identities;
- Production/main untouched.

Remaining operational dependency:
- real accountable owners/reviewers/approvers must be assigned by management before controlled documents can progress beyond WORKING_DRAFT.


## T6.20 dependency/security checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- Next.js and matching ESLint configuration advanced from 16.3.4 to 16.4.0 within the existing major line;
- critical direct Next.js audit finding removed;
- vulnerable Production transitives `sharp` and `source-map-js` refreshed in the lockfile;
- Production dependency CI gate added: `npm audit --omit=dev --audit-level=high`;
- final Production dependency audit: **0 vulnerabilities**;
- T6.20 regression suite, TypeScript, lint and full build: PASS;
- Vercel Preview: READY;
- temporary lockfile-generation workflow removed before integration.

Remaining:
- aggregate dev/build tooling audit contains 10 findings (2 moderate, 8 high), primarily in Tailwind 3 / ESLint dependency trees;
- Tailwind 4 and broader tooling migration require separate controlled change and visual-regression validation;
- Production/main remain untouched.


## T6.21 dev/build toolchain checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- Tailwind CSS migrated from 3.4.x to 4.3.3;
- PostCSS moved to `@tailwindcss/postcss`;
- existing MMS theme configuration retained through Tailwind 4 `@config`;
- standalone `autoprefixer` removed from the obsolete Tailwind 3 pipeline;
- patched `brace-expansion` dependency lines enforced with npm overrides;
- aggregate dev/build audit reduced from 10 findings to 5 high findings;
- Production dependency audit remains **0 vulnerabilities**;
- dev/build CI guard now rejects unexpected vulnerable packages or regression above the five-item tracked residual;
- T6.20, T6.21, Next 16 baseline, TypeScript, lint and full build: PASS;
- Vercel Preview: READY;
- compiled CSS smoke confirms MMS theme values remain emitted after migration;
- temporary lockfile workflow removed before integration.

Residual:
- five high dev-only findings remain in the current Next.js ESLint dependency chain: `eslint-config-next`, `@next/eslint-plugin-next`, `fast-glob`, `micromatch`, `braces`;
- no patched `braces` release is currently available to that dependency chain in the tested package graph;
- residual remains visible and bounded; it is not treated as Production-runtime exposure;
- Production/main remain untouched.


## T6.22 operational resilience/observability checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- minimal non-secret public liveness endpoint at `/api/status`;
- protected aggregate readiness endpoint at `/api/internal/operations/readiness`;
- existing internal bearer-token control retained for detailed readiness;
- commercial database structural readiness aggregated without exposing connection details;
- Zoho readiness exposed only as configured/blocked plus blocker count;
- feature configuration visibility available only on the protected readiness surface;
- bounded `X-Request-Id` correlation added;
- structured JSON operational logging added with automatic sensitive-key redaction;
- T6.22 regression suite and full CI: PASS;
- Vercel Preview: READY;
- Production dependency audit: 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Next operational dependency:
- external alert routing / log-drain provider selection remains a separate infrastructure decision; T6.22 does not fabricate or silently configure a monitoring vendor.


## T6.23 incident/reliability checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- incident severity policy for P1, P2, P3, P4 and CLINICAL_SAFETY;
- acknowledgement and containment targets by severity;
- explicit lifecycle controls from OPEN through CLOSED;
- closure requires documented root cause;
- P1/P2/CLINICAL_SAFETY closure requires external-reporting assessment;
- fail-closed degraded-service actions documented;
- recovery verification criteria documented;
- machine-readable runbook catalogue added;
- protected internal incident-policy endpoint added;
- working-draft human incident response runbook added;
- existing `mms_governance.incidents` schema reused; no new database migration required;
- T6.23 and full CI: PASS;
- Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Remaining operational dependencies:
- named incident responders/on-call roster require management assignment;
- external alert-routing/log-drain/paging provider requires separate infrastructure approval;
- statutory privacy/regulatory/clinical reporting decisions remain with the appropriate human authority.
