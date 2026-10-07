# T6.27 — Change Management, Release Governance & Rollback Controls

**Status:** PASS — PREVIEW VALIDATED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Formalize how MMS changes move from proposal through impact assessment, approval, implementation, verification and closure, using the existing governance change-request model and fail-closed Production preflight controls.

## Controls introduced

- STANDARD / NORMAL / EMERGENCY change classes;
- exact commit SHA requirement;
- explicit target-environment verification;
- Production approval-reference requirement;
- rollback-plan requirement;
- post-deploy verification-plan requirement;
- release evidence checklist;
- rollback-readiness checklist;
- Preview-versus-Production boundary;
- protected internal release-governance policy endpoint;
- working-draft Change Management, Release Governance & Rollback Runbook;
- T6.27 CI regression gate.

## Existing controls reused

- `mms_governance.change_requests` remains the canonical change record;
- Production preflight remains fail closed;
- existing launch capability and approval gates remain unchanged;
- clinical activation remains a separate governed process.

## Explicit boundary

T6.27 does **not** authorize or perform a Production deployment, change branch protection, assign a named change approver, enable Production feature gates, or activate a clinical service.

## Validation required before merge

- T6.27 tests PASS;
- all prior security/governance/reliability/access suites PASS;
- Production dependency audit remains 0 vulnerabilities;
- dev/build baseline remains bounded;
- TypeScript/lint/build PASS;
- Vercel Preview READY;
- Production/main remain untouched.


## Final validation — 2026-10-07

Final branch evidence:

- T6.27 release-governance tests: PASS;
- Production dependency audit: PASS;
- dev/build security baseline: PASS;
- all prior governance/reliability/access suites: PASS;
- TypeScript: PASS;
- lint: PASS;
- full GitHub build: PASS;
- matching Vercel Preview: **READY**.

Release boundaries remain intact:
- Preview validation does not grant Production authority;
- exact commit SHA, rollback plan and post-deploy verification plan are required;
- Production requires an explicit approval reference;
- no Production deployment was performed;
- no branch protection or Production feature gate was changed;
- no change approver was fabricated;
- no clinical capability was activated.
