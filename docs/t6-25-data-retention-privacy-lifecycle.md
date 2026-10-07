# T6.25 — Data Retention, Privacy Lifecycle & Records Disposal Controls

**Status:** IMPLEMENTED IN CODE / PREVIEW VALIDATION REQUIRED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Create a controlled retention and records-disposal framework that supports privacy governance without inventing statutory retention periods or enabling automated Production deletion before legal/privacy/clinical approval.

## Controls introduced

- six retention classes;
- privacy lifecycle state model;
- legal-hold override rules;
- data-minimisation rules;
- disposal-evidence checklist;
- disposal eligibility guard requiring:
  - approved retention authority;
  - confirmed-clear legal hold;
  - authority/evidence reference;
  - linked-record review;
  - disposal method;
- protected internal privacy-retention policy endpoint;
- working-draft Data Retention, Privacy Lifecycle & Records Disposal Runbook;
- T6.25 CI regression gate.

## Explicit evidence boundary

T6.25 does **not** approve or claim:
- any statutory retention period;
- a named privacy/DPO role;
- Production purge jobs or TTLs;
- automatic Auth/CRM deletion;
- clinical-record destruction policy;
- universal applicability of deletion/erasure rights.

The existing public privacy page already identifies approved retention periods and controller/privacy-contact details as launch blockers. T6.25 preserves that boundary.

## Validation required before merge

- T6.25 tests PASS;
- all prior security/governance/observability/incident/continuity suites PASS;
- Production dependency audit remains 0 vulnerabilities;
- dev/build baseline remains bounded;
- TypeScript/lint/build PASS;
- Vercel Preview READY;
- Production/main remain untouched;
- no clinical activation.
