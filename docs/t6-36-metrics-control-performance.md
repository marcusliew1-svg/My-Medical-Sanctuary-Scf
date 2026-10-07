# T6.36 — Metrics, KPI/KRI & Control-Performance Monitoring

**Status:** IMPLEMENTED IN CODE + PREVIEW DATABASE / FULL PREVIEW VALIDATION REQUIRED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Create a controlled metrics framework so operational counters, KPI/KRI targets, control-performance indicators and traffic-light states are defined, measured and evidenced explicitly rather than inferred from dashboard appearance.

## Controls introduced

- `mms_governance.metric_definitions` register;
- metric types covering KPI, KRI, control effectiveness, SLA, SLO, quality, compliance and other indicators;
- metric definition, calculation method, source system, unit, direction, frequency and owner fields;
- non-informational APPROVED/ACTIVE metrics require approved GREEN/AMBER/RED threshold definitions;
- `mms_governance.metric_observations` append-only observation register;
- assessed GREEN/AMBER/RED observations require immutable evidence linkage;
- observation corrections/restatements require new rows rather than mutation;
- protected internal metric-governance policy endpoint;
- working-draft Metrics, KPI/KRI & Control-Performance Monitoring Runbook;
- transactional QA 026;
- T6.36 CI regression gate.

## Preview database evidence

Applied only to dedicated MMS Preview project `mms-preview-auth`.

- schema execution: PASS;
- transactional QA 026: PASS / rolled back;
- retained synthetic metric definitions: **0**;
- retained synthetic metric observations: **0**;
- unapproved ACTIVE transition rejection: PASS;
- assessed observation without evidence rejection: PASS;
- immutable observation UPDATE rejection: PASS;
- forced RLS enabled;
- direct public/anon/authenticated grants revoked.

Supabase security advisor:
- expected governance-table `rls_enabled_no_policy` INFO remains intentional under the fail-closed server-only model;
- existing leaked-password-protection warning remains unresolved and unrelated to T6.36.

## Explicit evidence boundary

T6.36 does **not**:
- activate any real metric;
- approve any KPI/KRI target;
- create any real performance observation;
- convert current operations-dashboard counters into approved KPIs;
- reclassify any system/operation as GREEN;
- configure Production monitoring or scheduled metric jobs;
- establish legal, regulatory, clinical or certification compliance.

## Validation required before merge

- T6.36 tests PASS;
- all prior T6 suites PASS;
- Production dependency audit remains 0 vulnerabilities;
- dev/build baseline remains bounded;
- TypeScript/lint/build PASS;
- matching Vercel Preview READY;
- Production/main remain untouched.
