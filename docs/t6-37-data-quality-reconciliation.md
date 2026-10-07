# T6.37 — Data Quality, Reconciliation & Source-Trust Governance

**Status:** IMPLEMENTED IN CODE + PREVIEW DATABASE / FULL PREVIEW VALIDATION REQUIRED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Create a formal data-quality and reconciliation layer so governance, KPI/KRI and management reporting can distinguish technically available data from data that is sufficiently trustworthy for the stated purpose.

## Controls introduced

- `mms_governance.data_quality_assessments` append-only register;
- freshness, completeness, duplicate, reconciliation and lineage dimensions;
- statuses: NOT_ASSESSED, PASS, PASS_WITH_LIMITATIONS, FAIL, BLOCKED;
- PASS requires CURRENT freshness, COMPLETE completeness, CLEAR duplicates, RECONCILED/NOT_APPLICABLE reconciliation, COMPLETE lineage and evidence;
- PASS_WITH_LIMITATIONS requires explicit limitations;
- VARIANCE requires a variance summary;
- immutable assessment history;
- protected internal data-quality policy endpoint;
- working-draft Data Quality, Reconciliation & Source-Trust Runbook;
- transactional QA 027;
- T6.37 CI regression gate.

## Existing controls preserved

Existing commercial lead duplicate review and Sales Partner registry reconciliation remain domain-specific and unchanged. T6.37 adds a cross-cutting governance assessment layer and does not replace them.

## Preview database evidence

Applied only to dedicated MMS Preview project `mms-preview-auth`.

- schema execution: PASS;
- transactional QA 027: PASS / rolled back;
- retained synthetic data-quality assessments: **0**;
- stale/incomplete dataset rejected from PASS: PASS;
- immutable assessment mutation rejection: PASS;
- forced RLS enabled;
- direct public/anon/authenticated grants revoked.

Supabase security advisor:
- expected governance-table `rls_enabled_no_policy` INFO remains intentional under the fail-closed server-only model;
- existing leaked-password-protection warning remains unresolved and unrelated to T6.37.

## Explicit evidence boundary

T6.37 does **not**:
- certify any real dataset;
- complete any real reconciliation;
- declare Production data trustworthy;
- alter any source-system value;
- change any KPI/KRI traffic-light result;
- configure automated Production reconciliation;
- establish legal, regulatory, clinical or certification compliance.

## Validation required before merge

- T6.37 tests PASS;
- all prior T6 suites PASS;
- Production dependency audit remains 0 vulnerabilities;
- dev/build baseline remains bounded;
- TypeScript/lint/build PASS;
- matching Vercel Preview READY;
- Production/main remain untouched.
