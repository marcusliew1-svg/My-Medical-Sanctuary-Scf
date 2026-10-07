# T6.35 — Records Integrity, Evidence Lineage & Tamper-Evidence Controls

**Status:** IMPLEMENTED IN CODE + PREVIEW DATABASE / FULL PREVIEW VALIDATION REQUIRED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Add a durable evidence-lineage layer so governance conclusions can reference immutable evidence metadata with stable provenance and byte-level integrity verification.

## Controls introduced

- `mms_governance.evidence_artifacts` append-only register;
- evidence types for documents, screenshots, exports, reports, logs, query results, approvals, test results and other;
- subject and source lineage fields;
- stable storage-location reference;
- lowercase 64-character SHA-256 digest constraint;
- capture role/time;
- optional verifier role/time/method;
- immutable UPDATE/DELETE rejection;
- optional foreign-key link from immutable `governance_audit_events` to evidence artifacts;
- protected internal evidence-integrity policy endpoint;
- working-draft Records Integrity, Evidence Lineage & Tamper-Evidence Runbook;
- transactional QA 025;
- T6.35 CI regression gate.

## Preview database evidence

Applied only to dedicated MMS Preview project `mms-preview-auth`.

- schema execution: PASS;
- transactional QA 025: PASS / rolled back;
- retained synthetic evidence artifacts: **0**;
- immutable update/delete rejection: PASS;
- forced RLS enabled;
- direct public/anon/authenticated grants revoked.

Supabase security advisor:
- expected governance-table `rls_enabled_no_policy` INFO remains intentional under the fail-closed server-only model;
- existing leaked-password-protection warning remains unresolved and unrelated to T6.35.

## Explicit evidence boundary

T6.35 does **not**:
- digitally sign evidence;
- configure an external timestamp authority;
- establish legal admissibility or regulatory authenticity;
- prove authorship merely from a digest;
- migrate Production evidence;
- store patient/clinical payloads in governance metadata;
- activate any clinical capability.

## Validation required before merge

- T6.35 tests PASS;
- all prior T6 suites PASS;
- Production dependency audit remains 0 vulnerabilities;
- dev/build baseline remains bounded;
- TypeScript/lint/build PASS;
- matching Vercel Preview READY;
- Production/main remain untouched.
