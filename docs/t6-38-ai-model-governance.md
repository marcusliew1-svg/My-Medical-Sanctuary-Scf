# T6.38 — AI/Model Governance, Human Oversight & Validation

**Status:** PASS — PREVIEW VALIDATED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Strengthen the canonical MMS AI use-case register so no AI use case can be approved or activated without identified provider/model/version, controlled system policy, human oversight, privacy review, validation evidence, monitoring, disable/rollback controls and explicit approval evidence.

## Controls introduced

- additive hardening of `mms_governance.ai_use_cases`;
- provider/model/version identification;
- controlled system-policy reference;
- human-oversight evidence;
- privacy-review evidence;
- validation reference and validation timestamp;
- monitoring and disable/rollback references;
- clinical-governance evidence where required;
- immutable `mms_governance.ai_validation_assessments` register;
- validation types for safety, accuracy, refusal boundaries, human oversight, privacy, security, fairness, robustness and grounding;
- protected internal AI-model-governance policy endpoint;
- working-draft AI/Model Governance, Human Oversight & Validation Runbook;
- transactional QA 028;
- T6.38 CI regression gate.

## Preview database evidence

Applied only to dedicated MMS Preview project `mms-preview-auth`.

- schema execution: PASS;
- transactional QA 028: PASS / rolled back;
- retained synthetic AI use cases: **0**;
- retained synthetic AI validations: **0**;
- ACTIVE transition without evidence rejected: PASS;
- immutable validation mutation rejected: PASS;
- existing `AI-OPS-001` and `AI-LING-001` remain in REVIEW;
- neither current use case has a fabricated provider/model/version/approval.

Supabase security advisor:
- expected private-governance `rls_enabled_no_policy` INFO remains intentional under the fail-closed server-only model;
- existing leaked-password-protection warning remains unresolved and unrelated to T6.38.

## Explicit boundaries

T6.38 does **not**:
- activate any AI use case;
- approve any provider/model;
- approve clinical AI;
- enable autonomous decisioning;
- enable AI mutation of authoritative systems;
- enable Production AI;
- weaken existing AI Operations or Ling safety/refusal controls.

## Validation required before merge

- T6.38 tests PASS;
- all prior T6 suites PASS;
- Production dependency audit remains 0 vulnerabilities;
- dev/build baseline remains bounded;
- TypeScript/lint/build PASS;
- matching Vercel Preview READY;
- Production/main remain untouched.


## Final validation — 2026-10-07

Final branch evidence:

- Preview schema execution: PASS;
- transactional QA 028: PASS / rolled back;
- retained synthetic AI use cases: **0**;
- retained synthetic AI validation rows: **0**;
- ACTIVE transition without required evidence rejected: PASS;
- immutable validation mutation rejection: PASS;
- existing AI-OPS-001 and AI-LING-001 remain REVIEW;
- no provider/model/version/approval populated for either real Preview AI use case;
- T6.38 AI/model-governance tests: PASS;
- Production dependency audit: PASS / 0 vulnerabilities;
- dev/build security baseline: PASS;
- all prior T6 suites: PASS;
- TypeScript: PASS;
- lint: PASS;
- full GitHub build: PASS;
- matching Vercel Preview: **READY**.

AI-governance boundaries remain intact:
- no AI use case was activated;
- no provider/model was approved;
- no clinical AI was approved;
- no autonomous decisioning was enabled;
- no authoritative-system mutation was enabled;
- no Production AI capability was enabled;
- existing AI Operations and Ling safety/refusal controls remain unchanged;
- Production/main remain untouched.
