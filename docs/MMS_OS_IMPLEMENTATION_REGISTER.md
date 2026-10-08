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


## T6.34 policy-exception/risk-acceptance checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- `mms_governance.policy_exceptions` register added;
- supported types include policy exception, control waiver, risk acceptance, temporary deviation and emergency exception;
- APPROVED / APPROVED_WITH_CONDITIONS require approval reference, approver role, effective timestamp, expiry timestamp and evidence reference;
- HIGH / CRITICAL exceptions additionally require compensating controls;
- expiry must be later than effective time;
- closure requires closure evidence and timestamp;
- expired exceptions cannot be treated as continuing approval;
- emergency exceptions compress timing only and do not remove evidence/ownership/expiry requirements;
- protected internal policy-exception endpoint added;
- working-draft Policy Exceptions, Waivers & Risk Acceptance Runbook added;
- Preview schema execution: PASS;
- transactional QA 024: PASS / rollback confirmed;
- retained synthetic exception rows: 0;
- T6.34 and full CI: PASS;
- matching Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Remaining operational dependencies:
- named exception/risk-acceptance authority;
- approved risk-acceptance thresholds and approval matrix;
- real exception evidence and compensating-control monitoring;
- exception expiry/review operating process;
- formal retrospective review for emergency exceptions;
- external legal/regulatory/privacy/security/clinical requirements remain non-waivable unless the competent authority permits otherwise.


## T6.35 records-integrity/evidence-lineage checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- immutable `mms_governance.evidence_artifacts` register added;
- artifact metadata includes evidence type, governed subject, source system/reference, storage location, SHA-256 digest, capture role/time, optional verifier role/time/method and confidentiality;
- evidence artifact UPDATE/DELETE is rejected by immutable-governance trigger;
- SHA-256 digest must be lowercase 64-character hexadecimal;
- immutable `governance_audit_events` can optionally link to an immutable evidence artifact by foreign key;
- corrections/superseding evidence must be appended as new artifacts rather than overwriting history;
- digest semantics documented as byte-level integrity only, not truth/authorship/legal/regulatory proof;
- protected internal evidence-integrity policy endpoint added;
- working-draft Records Integrity, Evidence Lineage & Tamper-Evidence Runbook added;
- Preview schema execution: PASS;
- transactional QA 025: PASS / rollback confirmed;
- retained synthetic evidence artifacts: 0;
- T6.35 and full CI: PASS;
- matching Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Remaining operational dependencies:
- approved evidence storage location(s) and retention;
- real capture/verification roles;
- actual artifact-generation workflow;
- digital signing / trusted timestamping only if separately selected and approved;
- legal/regulatory admissibility or authenticity conclusions require appropriate external authority;
- pre-existing Supabase leaked-password-protection warning remains unresolved.


## T6.36 metrics/KPI-KRI/control-performance checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- `mms_governance.metric_definitions` register added;
- metric types support KPI, KRI, control effectiveness, SLA, SLO, quality, compliance and other indicators;
- metric definition requires stable calculation method, source system, unit, direction, frequency and accountable owner role;
- non-informational APPROVED/ACTIVE metrics require explicit GREEN/AMBER/RED threshold definitions and approval evidence;
- `mms_governance.metric_observations` append-only register added;
- assessed GREEN/AMBER/RED observations require immutable evidence-artifact linkage;
- corrections/restatements require new observations rather than overwriting history;
- existing operations/dashboard counters remain operational indicators and are not silently promoted to approved KPIs;
- protected internal metric-governance policy endpoint added;
- working-draft Metrics, KPI/KRI & Control-Performance Monitoring Runbook added;
- Preview schema execution: PASS;
- transactional QA 026: PASS / rollback confirmed;
- retained synthetic metric definitions: 0;
- retained synthetic metric observations: 0;
- T6.36 and full CI: PASS;
- matching Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Remaining operational dependencies:
- approved KPI/KRI catalogue and ownership;
- real calculation definitions and source-system lineage;
- approved traffic-light thresholds;
- data-quality controls and reconciliation;
- actual observation/evidence-generation process;
- management review of material trends;
- Production metric collection, scheduling and alerting require separate authorization;
- metric status does not replace control testing, legal/regulatory review, clinical approval or Production-release authority.


## T6.37 data-quality/reconciliation checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- append-only `mms_governance.data_quality_assessments` register added;
- freshness, completeness, duplicate, reconciliation and lineage dimensions governed explicitly;
- PASS requires CURRENT freshness, COMPLETE completeness, CLEAR duplicates, RECONCILED/NOT_APPLICABLE reconciliation, COMPLETE lineage and evidence linkage;
- PASS_WITH_LIMITATIONS requires explicit limitations;
- reconciliation VARIANCE requires a variance summary;
- assessment history is immutable; reassessment creates a new record;
- metric output and source-data trust remain distinct;
- existing commercial lead duplicate review and Sales Partner registry reconciliation remain domain-specific and unchanged;
- protected internal data-quality policy endpoint added;
- working-draft Data Quality, Reconciliation & Source-Trust Runbook added;
- Preview schema execution: PASS;
- transactional QA 027: PASS / rollback confirmed;
- retained synthetic assessments: 0;
- T6.37 and full CI: PASS;
- matching Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Remaining operational dependencies:
- approved dataset inventory and accountable owners;
- source-by-source freshness/completeness expectations;
- reconciliation procedures and tolerances;
- duplicate/uniqueness controls by data domain;
- real lineage/evidence capture;
- data-quality issue remediation ownership;
- Production data-quality jobs/alerts require separate authorization;
- a data-quality PASS does not replace control testing, legal/regulatory review, clinical approval or Production-release authority.


## T6.38 AI/model-governance checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- canonical `mms_governance.ai_use_cases` register hardened rather than duplicated;
- APPROVED/ACTIVE AI use cases require provider, model identifier/version, controlled system-policy reference, human-review control, human-oversight evidence, privacy-review evidence, validation reference, monitoring reference, disable/rollback reference, approval evidence and validation timestamp;
- clinical-governance-required AI additionally requires explicit clinical-governance evidence;
- immutable `mms_governance.ai_validation_assessments` register added;
- validation types cover safety, accuracy, refusal boundaries, human oversight, privacy, security, fairness, robustness and grounding;
- validation PASS is explicitly limited to the tested scope and does not constitute universal safety, legality, regulatory approval or clinical fitness;
- material provider/model/version/system-policy/intended-use changes require reassessment;
- AI must not silently mutate authoritative systems or become sole basis for clinical/legal/regulatory/financial/access-control decisions without separate governance;
- existing AI Operations Assistant remains administrative/advisory with human approval;
- existing Ling safety/refusal and approved-content controls remain intact;
- Preview schema execution: PASS;
- transactional QA 028: PASS / rollback confirmed;
- retained synthetic AI use cases: 0;
- retained synthetic AI validations: 0;
- AI-OPS-001 and AI-LING-001 remain REVIEW;
- T6.38 and full CI: PASS;
- matching Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical AI or service activated.

Remaining operational dependencies:
- approved AI provider/model/version selection;
- privacy/security/vendor due diligence;
- controlled system prompt/policy approval;
- real validation evidence and accountable assessor roles;
- monitoring thresholds and rollback/disable procedures;
- clinical governance/Medical Director evidence for any clinically governed AI use;
- Production AI feature activation requires separate explicit authorization;
- pre-existing Supabase leaked-password-protection warning remains unresolved.


## T6.39 CAPA/remediation-effectiveness checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- canonical `mms_governance.capa_actions` register hardened rather than replaced;
- IMPLEMENTED now requires root-cause/causal-analysis reference, implementation timestamp and implementation evidence;
- EFFECTIVENESS_REVIEW requires effectiveness evidence, verifier role, verification timestamp and a non-NOT_ASSESSED result;
- CLOSED requires EFFECTIVE outcome, closure evidence and closure timestamp;
- PARTIALLY_EFFECTIVE and INEFFECTIVE outcomes cannot satisfy closure;
- immutable `mms_governance.capa_effectiveness_reviews` history added;
- failed/limited effectiveness results remain visible and require follow-up where applicable;
- CAPA closure does not auto-close the originating incident, complaint, audit finding, risk or supplier issue;
- existing CAPA-T618-ZOHO-TENANT remains IN_PROGRESS with no fabricated evidence;
- protected internal CAPA-effectiveness policy endpoint added;
- working-draft CAPA, Remediation & Effectiveness Assurance Runbook added;
- Preview schema execution: PASS;
- transactional QA 029: PASS / rollback confirmed;
- retained synthetic CAPA rows: 0;
- T6.39 and full CI: PASS;
- matching Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Remaining operational dependencies:
- real root-cause/causal-analysis evidence for open CAPA;
- implementation evidence and accountable remediation owner;
- independent effectiveness-review method/role appropriate to severity;
- follow-up process for ineffective/partially effective remediation;
- source-record closure remains independent;
- dedicated MMS Zoho tenant remains unresolved for CAPA-T618-ZOHO-TENANT;
- pre-existing Supabase leaked-password-protection warning remains unresolved.


## T6.40 privacy-rights/human-review checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- `mms_governance.privacy_rights_requests` register added;
- workflow categories cover access, correction, deletion/erasure, withdrawal, objection, restriction, portability, complaint and other;
- workflow category does not assert universal legal applicability;
- substantive review/action requires identity-verification evidence and jurisdiction/applicability assessment;
- fulfilled/partially fulfilled/denied requests require decision reference, response reference and completion timestamp;
- denial requires explicit reason;
- deletion/erasure fulfilment requires confirmed-clear legal hold and documented retention assessment;
- immutable `mms_governance.privacy_rights_request_actions` history added;
- material actions require immutable evidence linkage;
- pseudonymous/internal subject reference is preferred over unnecessary personal data;
- T6.25 legal-hold and retention boundaries remain controlling;
- protected internal privacy-rights policy endpoint added;
- working-draft Privacy Rights Requests & Human Review Runbook added;
- Preview schema execution: PASS;
- transactional QA 030: PASS / rollback confirmed;
- retained synthetic privacy-rights requests: 0;
- T6.40 and full CI: PASS;
- matching Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Remaining operational dependencies:
- verified MMS controller identity and privacy contact;
- named accountable privacy owner/DPO if legally required;
- jurisdiction-specific rights/applicability analysis;
- approved identity-verification process;
- system-of-record search/reconciliation procedure;
- approved statutory/operational response timelines;
- Production intake channel and secure response-delivery process;
- deletion/export/correction automation requires separate explicit authorization;
- pre-existing Supabase leaked-password-protection warning remains unresolved.


## T6.41 consent/authorization/withdrawal checkpoint — 2026-10-07

Implemented and validated in Preview/integration:
- `mms_governance.consent_authorizations` register added;
- consent categories include treatment, data processing, marketing, communications, research, image/media, third-party sharing and other;
- exact consent document reference/version and explicit scope are mandatory metadata;
- ACTIVE requires capture method, capture role, grant timestamp and immutable evidence;
- WITHDRAWN requires withdrawal reference, timestamp and effective scope;
- REVOKED requires revocation reference and timestamp;
- material consent lifecycle events require immutable evidence linkage;
- immutable `mms_governance.consent_events` history preserves grant/withdrawal/revocation evidence;
- withdrawal does not automatically erase history or override T6.25 retention/legal-hold controls;
- service/enquiry/appointment/payment/CRM presence is not treated as treatment consent;
- consent is not asserted as the universal legal basis for privacy/clinical/operational activity;
- protected internal consent-governance policy endpoint added;
- working-draft Consent, Authorization & Withdrawal Governance Runbook added;
- Preview schema execution: PASS;
- transactional QA 031: PASS / rollback confirmed;
- retained synthetic consent authorizations: 0;
- T6.41 and full CI: PASS;
- matching Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Remaining operational dependencies:
- approved jurisdiction-specific consent forms and versions;
- clinical/Medical Director review for treatment consent;
- approved capture/identity/signature process;
- real withdrawal propagation procedure;
- consent-to-system mapping by purpose;
- retention/legal-hold handling on withdrawal;
- Production e-signature/preference-centre/capture integrations require separate explicit authorization;
- pre-existing Supabase leaked-password-protection warning remains unresolved.


## T6.42 privacy/security breach-assessment checkpoint — 2026-10-08

Implemented and validated in Preview/integration:
- immutable `mms_governance.privacy_security_assessments` register added;
- every assessment links to an existing incident and jurisdiction;
- assessment tracks affected data classes, estimated affected-subject count, exposure scope and risk to individuals;
- notification applicability is governed separately from incident severity;
- any REQUIRED / NOT_REQUIRED / PENDING_AUTHORITY_REVIEW conclusion requires legal/privacy review reference, decision reference and immutable evidence;
- authority-notification and data-subject-notification states are tracked independently;
- COMPLETED notification states require stable notification references;
- no statutory deadline is created by the framework; authoritative jurisdiction-specific obligations remain governed through T6.32;
- assessment history is immutable and superseding conclusions require new records;
- existing incident lifecycle remains independent;
- protected internal privacy/security assessment policy endpoint added;
- working-draft Privacy/Security Incident Assessment & Notification-Decision Runbook added;
- Preview schema execution: PASS;
- transactional QA 032: PASS / rollback confirmed;
- retained synthetic assessments: 0;
- T6.42 and full CI: PASS;
- matching Vercel Preview: READY;
- Production dependency audit remains 0 vulnerabilities;
- Production/main remain untouched;
- no clinical service activated.

Remaining operational dependencies:
- verified jurisdiction-specific privacy/security breach criteria;
- named legal/privacy review authority;
- authoritative statutory notification timelines;
- approved regulator/data-subject notification procedures;
- real incident facts and evidence;
- Production notification integrations require separate explicit authorization;
- pre-existing Supabase leaked-password-protection warning remains unresolved.
