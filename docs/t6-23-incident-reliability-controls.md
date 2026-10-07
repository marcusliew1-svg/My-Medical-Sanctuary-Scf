# T6.23 — Incident Management & Service Reliability Controls

**Status:** IMPLEMENTED IN CODE / PREVIEW VALIDATION REQUIRED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Convert the existing governance incident schema into an enforceable operational response framework without inventing named responders, external alerting vendors, statutory conclusions, or clinical authority.

## Controls introduced

- incident severity framework for P1, P2, P3, P4 and CLINICAL_SAFETY;
- acknowledgement and containment targets by severity;
- explicit lifecycle transitions;
- closure guard requiring documented root cause;
- P1/P2/CLINICAL_SAFETY closure requires external-reporting assessment;
- degraded-service fail-closed rules;
- recovery verification criteria;
- machine-readable runbook catalogue;
- protected internal incident-policy endpoint;
- working-draft human-readable incident response runbook;
- T6.23 CI regression gate.

## Existing schema reused

No new database migration is required. T6.23 reuses the existing `mms_governance.incidents` table introduced by migration 0026, which already contains severity, status, containment/recovery timestamps, root cause, CAPA and external-reporting state.

## Important boundaries

- No named incident commander or responder is fabricated.
- No alerting/paging/log-drain vendor is silently configured.
- No statutory reporting decision is made by software.
- CLINICAL_SAFETY classification does not grant clinical authority or replace Medical Director / approved clinical-governance review.
- Production/main remain untouched.

## Validation required before merge

- T6.23 tests PASS;
- prior security/governance/observability suites PASS;
- TypeScript/lint/build PASS;
- Vercel Preview READY;
- Production dependency audit remains 0 vulnerabilities;
- dev/build baseline remains bounded;
- no Production or clinical activation.
