# T6.40 — Privacy Rights Requests & Human Review

**Status:** IMPLEMENTED IN CODE + PREVIEW DATABASE / FULL PREVIEW VALIDATION REQUIRED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Implement the privacy-rights request workflow deliberately left unimplemented in T6.25, while preserving jurisdiction-specific applicability, identity verification, legal-hold, retention and human-review boundaries.

## Controls introduced

- `mms_governance.privacy_rights_requests` register;
- workflow categories for access, correction, deletion/erasure, withdrawal, objection, restriction, portability, complaint and other;
- identity-verification evidence before substantive review/action;
- jurisdiction/applicability assessment before fulfilment or denial;
- completion evidence requirements;
- denial/limitation reason requirement;
- deletion/erasure fulfilment requires confirmed-clear legal hold and retention assessment;
- immutable `mms_governance.privacy_rights_request_actions` evidence history;
- material actions require immutable evidence linkage;
- protected internal privacy-rights policy endpoint;
- working-draft Privacy Rights Requests & Human Review Runbook;
- transactional QA 030;
- T6.40 CI regression gate.

## Preview database evidence

Applied only to dedicated MMS Preview project `mms-preview-auth`.

- schema execution: PASS;
- transactional QA 030: PASS / rolled back;
- retained synthetic privacy-rights requests: **0**;
- substantive review without identity/applicability evidence rejection: PASS;
- deletion fulfilment without clear legal hold/retention assessment rejection: PASS;
- immutable action mutation rejection: PASS;
- forced RLS enabled;
- direct public/anon/authenticated grants revoked.

Supabase security advisor:
- expected governance-table `rls_enabled_no_policy` INFO remains intentional under the fail-closed server-only model;
- existing leaked-password-protection warning remains unresolved and unrelated to T6.40.

## Explicit boundaries

T6.40 does **not**:
- assert that any privacy right applies universally;
- set statutory response deadlines;
- verify MMS controller identity;
- appoint a privacy officer/DPO;
- create any real privacy request;
- enable Production self-service;
- automate disclosure, correction, export, deletion or clinical-record modification.

## Validation required before merge

- T6.40 tests PASS;
- all prior T6 suites PASS;
- Production dependency audit remains 0 vulnerabilities;
- dev/build baseline remains bounded;
- TypeScript/lint/build PASS;
- matching Vercel Preview READY;
- Production/main remain untouched.
