# T6.34 — Policy Exceptions, Waivers & Risk Acceptance

**Status:** PASS — PREVIEW VALIDATED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Create a governed, time-bound exception and risk-acceptance framework so temporary deviations cannot become silent permanent bypasses.

## Controls introduced

- `mms_governance.policy_exceptions` register;
- exception types for policy exceptions, control waivers, risk acceptance, temporary deviations and emergency exceptions;
- controlled lifecycle from DRAFT through CLOSED;
- APPROVED / APPROVED_WITH_CONDITIONS requires:
  - approval reference;
  - approver role;
  - effective timestamp;
  - expiry timestamp;
  - evidence reference;
- HIGH/CRITICAL exceptions additionally require compensating controls;
- expiry must be after effective time;
- closure requires closure evidence;
- current-exception evaluator;
- protected internal policy-exception endpoint;
- working-draft Policy Exceptions, Waivers & Risk Acceptance Runbook;
- transactional QA 024;
- T6.34 CI regression gate.

## Preview database evidence

Applied only to dedicated MMS Preview project `mms-preview-auth`.

- schema execution: PASS;
- transactional QA 024: PASS / rolled back;
- retained synthetic exception rows: **0**;
- forced RLS enabled;
- direct public/anon/authenticated grants revoked.

Supabase security advisor:
- expected governance-table `rls_enabled_no_policy` INFO remains intentional under the fail-closed server-only model;
- existing leaked-password-protection warning remains unresolved and unrelated to T6.34.

## Explicit boundaries

T6.34 does **not**:
- approve any real exception;
- accept any real risk;
- waive any real control;
- create a Production override;
- bypass existing security, privacy, regulatory or clinical controls;
- make any otherwise prohibited activity permissible.

## Validation required before merge

- T6.34 tests PASS;
- all prior T6 suites PASS;
- Production dependency audit remains 0 vulnerabilities;
- dev/build baseline remains bounded;
- TypeScript/lint/build PASS;
- matching Vercel Preview READY;
- Production/main remain untouched.


## Final validation — 2026-10-07

Final branch evidence:

- Preview schema execution: PASS;
- transactional QA 024: PASS / rolled back;
- retained synthetic exception rows: **0**;
- T6.34 exception/risk-acceptance tests: PASS;
- Production dependency audit: PASS / 0 vulnerabilities;
- dev/build security baseline: PASS;
- all prior T6 suites: PASS;
- TypeScript: PASS;
- lint: PASS;
- full GitHub build: PASS;
- matching Vercel Preview: **READY**.

Exception-governance boundaries remain intact:
- no real exception was approved;
- no real risk was accepted;
- no real control was waived;
- no Production override or bypass was created;
- no legal, regulatory, privacy, security, licensing or clinical prohibition was waived;
- Production/main remain untouched;
- no clinical capability was activated.
