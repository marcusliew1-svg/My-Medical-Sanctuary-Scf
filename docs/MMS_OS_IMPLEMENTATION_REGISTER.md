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


## T6.24 backup/recovery/continuity checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- four-tier RTO/RPO engineering target framework added;
- application, commercial database, governance data, Auth and Zoho dependencies classified for continuity planning;
- restore-evidence checklist added;
- recovery completion requires integrity verification, reconciliation and zero unresolved discrepancies;
- READ_ONLY, FAIL_CLOSED and MANUAL_RECONCILIATION continuity modes defined;
- protected internal continuity-policy endpoint added;
- working-draft Backup, Recovery & Business Continuity Runbook added;
- T6.24 and full CI: PASS;
- Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Evidence still required before any operational backup/recovery claim:
- actual backup schedule and retention evidence;
- isolated restore execution;
- restore point/reference evidence;
- data-integrity reconciliation results;
- RTO/RPO measurement from an executed exercise;
- named accountable continuity owners;
- approved disaster-declaration/failover authority;
- external DR provider evidence if one is selected.


## T6.25 data-retention/privacy-lifecycle checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- six retention classes defined: TRANSIENT, OPERATIONAL, GOVERNANCE, FINANCIAL, IDENTITY_ACCESS, CLINICAL_RESTRICTED;
- all actual retention periods explicitly remain UNAPPROVED;
- privacy lifecycle states defined from COLLECTED through DISPOSED;
- legal-hold rules added and override ordinary disposal;
- disposal eligibility fails closed unless retention authority is approved, legal hold is confirmed clear, authority evidence exists, linked records are reviewed, and disposal method is specified;
- data-minimisation rules added;
- protected internal privacy-retention policy endpoint added;
- working-draft Data Retention, Privacy Lifecycle & Records Disposal Runbook added;
- T6.25 and full CI: PASS;
- Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Evidence/approval still required:
- verified controller/legal entity and privacy contact;
- jurisdiction-specific retention periods;
- legal/privacy approval of retention schedule;
- named accountable privacy/records owner;
- approved legal-hold authority/release process;
- tested disposal/anonymisation procedures;
- approved clinical-record retention/destruction policy if clinical systems are activated;
- Production automation approval before any purge/TTL/deletion job is enabled.


## T6.26 access-governance/segregation checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- privileged operator roles formally identified as admin and finance;
- auditor role formally treated as exclusive/read-only;
- trusted operator metadata now rejects any auditor role combined with operations, finance or admin;
- privileged-access review requires independent reviewer identity and evidence reference;
- retained privileged access requires documented business justification;
- joiner/mover/leaver principles documented;
- protected internal access-governance policy endpoint added;
- working-draft Access Governance & Segregation of Duties Runbook added;
- existing Finance step-up, short-lived session and same-origin mutation controls preserved;
- T6.26, operator-security and full CI: PASS;
- Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched.

Remaining operational dependencies:
- supported creation of the first trusted MMS operator identity;
- named access reviewer / approver assignment;
- actual privileged-access review evidence;
- formal joiner/mover/leaver operating process;
- approved automated deprovisioning, if later selected;
- branch/environment access administration remains outside this phase.


## T6.27 change/release governance checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- STANDARD, NORMAL and EMERGENCY change classes defined;
- exact source commit SHA required for release evidence;
- target environment must be explicitly identified;
- rollback plan and post-deploy verification plan required;
- Production release requires explicit approval reference;
- release-evidence and rollback-readiness checklists added;
- Preview-vs-Production boundary formalized;
- protected internal release-governance policy endpoint added;
- working-draft Change Management, Release Governance & Rollback Runbook added;
- existing `mms_governance.change_requests` remains canonical;
- fail-closed Production preflight remains unchanged;
- T6.27 and full CI: PASS;
- Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Remaining operational dependencies:
- named change/release approver assignment;
- actual Production approval evidence;
- branch/environment protection administration;
- tested Production rollback/failover evidence;
- formal emergency-change retrospective process;
- Production release remains a separate explicit authorization.


## T6.28 third-party/vendor-risk checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- generic `mms_governance.third_party_assessments` register added for technology, cloud, SaaS, CRM, payments, data processors, AI providers, clinical suppliers, diagnostic partners and professional services;
- LOW, MODERATE, HIGH and CRITICAL risk tiers defined;
- NONE, BUSINESS, PERSONAL, SENSITIVE and CLINICAL data-access classes defined;
- APPROVED/CONDITIONAL status requires due-diligence reference, approval reference and assessment timestamp;
- CRITICAL approval additionally requires continuity evidence and exit plan;
- SENSITIVE/CLINICAL approval additionally requires privacy/data-processing terms evidence;
- forced RLS enabled and direct public/anon/authenticated grants revoked;
- existing `suppliers` and `diagnostic_partners` registers remain domain-specific and unchanged;
- protected internal third-party-risk policy endpoint added;
- working-draft Third-Party Risk, Supplier Assurance & Dependency Governance Runbook added;
- Preview migration: PASS;
- transactional QA 019: PASS / rollback confirmed;
- retained third-party rows after QA: 0;
- T6.28 and full CI: PASS;
- Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no named vendor or clinical service activated.

Remaining operational dependencies:
- named third-party owners and assessors;
- real due-diligence evidence for each material vendor;
- approved contracts/privacy terms where applicable;
- verified security/quality/regulatory evidence;
- subprocessor/dependency registers where applicable;
- continuity and exit evidence for critical vendors;
- periodic reassessment schedule and accountable owner;
- dedicated MMS Zoho tenant remains unresolved;
- pre-existing Supabase leaked-password-protection warning remains unresolved.


## T6.29 audit/control-assurance checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- audit lifecycle formalized from PLANNED through COMPLETE with controlled cancellation;
- audit completion requires report reference, overall rating and completion timestamp;
- control-effectiveness conclusions require evidence reference, test timestamp and documented test method;
- NOT_TESTED remains the default until real testing evidence exists;
- absence of observed failure is explicitly not treated as proof of effectiveness;
- audit evidence checklist and finding/remediation linkage expectations added;
- testing-independence principle documented;
- protected internal audit-assurance policy endpoint added;
- working-draft Audit, Control Testing & Assurance Evidence Runbook added;
- existing audits, controls, CAPA, risks and immutable governance-audit-event records remain canonical;
- no new database migration required;
- initial typecheck issue identified by CI/Vercel and corrected before integration;
- T6.29 and full CI: PASS;
- matching Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Remaining operational dependencies:
- named audit/control-testing owners and independent reviewers;
- real test plans, samples and evidence references;
- scheduled audit programme;
- actual control-test execution;
- CAPA/risk linkage for future material findings;
- external certification or regulator-facing conclusions require independent evidence and authority.


## T6.30 training/competency/attestation checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- existing `mms_governance.training_records` hardened with competency evidence reference, policy-attestation reference, verification timestamp and refresh-required state;
- COMPETENT / COMPETENT_WITH_CONDITIONS now require competency method, assessor role, completion timestamp, evidence reference, verification timestamp and no outstanding refresh requirement;
- expiry date must be later than completion when both are present;
- generic training lifecycle and current-competency evaluator added;
- attendance alone explicitly cannot establish competency;
- policy acknowledgement remains distinct from skills assessment;
- clinical competency remains separate from clinical privilege/licensure/Medical Director authority;
- existing Sales Partner 10-module training engine remains separate and unchanged;
- protected internal training/competency policy endpoint added;
- working-draft Training, Competency & Policy Attestation Runbook added;
- Preview migration: PASS;
- transactional QA 020: PASS / rollback confirmed;
- retained synthetic training rows: 0;
- initial strict-TypeScript lifecycle inference issue detected and corrected before integration;
- T6.30 and full CI: PASS;
- matching Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Remaining operational dependencies:
- role-by-role training matrix;
- named accountable training owners and assessors;
- approved module content/versioning;
- real competency assessment evidence;
- policy acknowledgement programme;
- refresher/expiry schedules;
- joiner/mover/leaver linkage to training requirements;
- clinical workforce competency remains subject to separate credential/privilege/Medical Director governance.


## T6.31 complaints/concerns/speak-up checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- `mms_governance.complaints_and_concerns` register added;
- case types cover customer, partner, workforce, privacy, security, clinical-safety, speak-up and other concerns;
- severity and confidentiality classification added;
- lifecycle controlled from OPEN through CLOSED;
- RESOLVED requires resolution summary, evidence reference and resolution timestamp;
- CLOSED additionally requires closure timestamp and external/regulatory reporting assessment;
- non-retaliation and conflict-management principles documented;
- evidence preservation and complaint-to-incident/CAPA/privacy/clinical escalation expectations documented;
- protected internal complaints/speak-up policy endpoint added;
- working-draft Complaints, Concerns & Speak-Up Governance Runbook added;
- Preview migration: PASS;
- transactional QA 021: PASS / rollback confirmed;
- retained synthetic complaint/speak-up rows: 0;
- T6.31 and full CI: PASS;
- matching Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Remaining operational dependencies:
- approved complaint/speak-up policy and ownership;
- named independent investigators/reviewers;
- approved intake channels and confidentiality process;
- response-time/service standards;
- legal/privacy/clinical/regulatory escalation criteria;
- regulator notification authority and evidence;
- anonymous hotline/channel only if separately selected and approved;
- staff training and non-retaliation operating procedure.


## T6.32 regulatory-obligations/compliance-calendar checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- `mms_governance.regulatory_obligations` register added;
- obligation types cover licence, registration, filing, reporting, notification, renewal, attestation, recordkeeping, inspection and other;
- lifecycle supports DRAFT, UNDER_REVIEW, ACTIVE, NOT_APPLICABLE, SUSPENDED and RETIRED;
- recurrence model supports event-driven, one-time, monthly, quarterly, semi-annual, annual and custom obligations;
- ACTIVE status requires authoritative source reference, accountable owner role, approval reference and applicability rationale;
- completed obligations require completion evidence;
- NOT_APPLICABLE requires documented applicability rationale;
- due-soon / overdue / blocked / escalated state model added;
- protected internal regulatory-obligations policy endpoint added;
- working-draft Regulatory Obligations & Compliance Calendar Runbook added;
- Preview migration: PASS;
- transactional QA 022: PASS / rollback confirmed;
- retained synthetic obligation rows: 0;
- T6.32 and full CI: PASS;
- matching Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Remaining operational dependencies:
- authoritative jurisdiction-by-jurisdiction legal/regulatory source review;
- verified MMS legal entity/facility/service applicability;
- named obligation owners and approvers;
- actual licence/registration/filing/reporting evidence;
- approved due-date and recurrence records from primary sources;
- reminder/escalation operating process;
- Production automation approval before any calendar/reminder job is enabled;
- external legal/privacy/Medical Director/regulatory/licensing/insurance approvals remain separate blockers.


## T6.33 management-review/executive-assurance checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- `mms_governance.management_reviews` register added;
- monthly, quarterly, annual, extraordinary, pre-launch and post-incident review types supported;
- lifecycle controlled from PLANNED through COMPLETE;
- COMPLETE requires evidence-pack reference, minutes reference, action-register reference, non-NOT_ASSESSED assurance conclusion, completion timestamp and approval reference;
- unresolved critical/major issue counters retained explicitly;
- evidence-pack expectations cover risks, controls, incidents, CAPA, complaints, audits, regulatory obligations, training, access, vendors, continuity and launch readiness;
- completed management review does not auto-close underlying governance records;
- protected internal management-review policy endpoint added;
- working-draft Management Review, Governance Reporting & Executive Assurance Runbook added;
- Preview migration: PASS;
- transactional QA 023: PASS / rollback confirmed;
- retained synthetic management-review rows: 0;
- T6.33 and full CI: PASS;
- matching Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Remaining operational dependencies:
- named accountable management-review chair/recorder;
- approved review cadence;
- real evidence packs and minutes;
- actual management decisions/action registers;
- formal risk-acceptance authority;
- executive/board reporting format if separately required;
- Production readiness remains subject to separate release/launch/legal/privacy/clinical/licensing/insurance approval.
