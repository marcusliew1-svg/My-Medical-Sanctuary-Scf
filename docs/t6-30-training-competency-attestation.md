# T6.30 — Training, Competency & Policy Attestation Controls

**Status:** IMPLEMENTED IN CODE + PREVIEW DATABASE / FULL PREVIEW VALIDATION REQUIRED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Strengthen the existing MMS `training_records` governance model so competency conclusions require actual assessment evidence, while keeping policy acknowledgement, expiry/refresh state, Sales Partner training, clinical privileges and operator access as distinct controls.

## Controls introduced

- additive hardening of `mms_governance.training_records`;
- stable competency evidence reference;
- policy-attestation reference;
- verification timestamp;
- refresh-required flag;
- database guard preventing COMPETENT / COMPETENT_WITH_CONDITIONS without:
  - competency method;
  - assessor role;
  - completion timestamp;
  - evidence reference;
  - verification timestamp;
  - current refresh state;
- expiry must be later than completion;
- generic training lifecycle and current-competency evaluator;
- competency evidence checklist;
- protected internal training/competency policy endpoint;
- working-draft Training, Competency & Policy Attestation Runbook;
- transactional QA 020;
- T6.30 CI regression gate.

## Existing controls preserved

- existing Sales Partner 10-module training engine remains separate and unchanged;
- clinical credentials and privileges remain separate controls;
- training/competency does not grant clinical authority;
- operator roles/access are not created by training records.

## Preview database evidence

Applied to dedicated MMS Preview project `mms-preview-auth`.

- migration `mms_training_competency_attestation`: PASS;
- transactional QA 020: PASS and rolled back;
- retained synthetic training rows: **0**;
- existing forced-RLS/private governance posture preserved.

Supabase security advisor:
- expected governance-table `rls_enabled_no_policy` informational notices remain intentional under the fail-closed server-only model;
- existing leaked-password-protection warning remains unresolved and unrelated to T6.30.

## Explicit boundaries

T6.30 does **not**:
- mark any real person competent;
- appoint a named assessor;
- complete workforce training;
- grant a clinical privilege or licence;
- create an operator identity or role;
- change Production access;
- activate any clinical capability.

## Validation required before merge

- T6.30 tests PASS;
- all prior T6 suites PASS;
- Production dependency audit remains 0 vulnerabilities;
- dev/build baseline remains bounded;
- TypeScript/lint/build PASS;
- matching Vercel Preview READY;
- Production/main remain untouched.
