# T6.32 — Regulatory Obligations, Compliance Calendar & Evidence Tracking

**Status:** IMPLEMENTED IN CODE + PREVIEW DATABASE / FULL PREVIEW VALIDATION REQUIRED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Create a controlled obligations register and compliance-calendar framework without inventing statutory requirements, deadlines, licences, filings or regulator approvals.

## Controls introduced

- `mms_governance.regulatory_obligations` register;
- obligation types for licence, registration, filing, reporting, notification, renewal, attestation, recordkeeping, inspection and other;
- lifecycle from DRAFT / UNDER_REVIEW through ACTIVE, NOT_APPLICABLE, SUSPENDED and RETIRED;
- recurrence model including event-driven, one-time, monthly, quarterly, semi-annual, annual and custom;
- ACTIVE obligations require authoritative source, owner role, approval reference and applicability rationale;
- completed obligations require completion evidence;
- NOT_APPLICABLE requires documented rationale;
- due-soon / overdue / blocked / escalated state model;
- protected internal regulatory-obligations policy endpoint;
- working-draft Regulatory Obligations & Compliance Calendar Runbook;
- transactional QA 022;
- T6.32 CI regression gate.

## Preview database evidence

Applied to dedicated MMS Preview project `mms-preview-auth`.

- migration `mms_regulatory_obligations`: PASS;
- transactional QA 022: PASS / rolled back;
- retained synthetic obligation rows: **0**;
- forced RLS enabled;
- direct public/anon/authenticated grants revoked.

Supabase security advisor:
- expected governance-table `rls_enabled_no_policy` INFO remains intentional under the fail-closed server-only model;
- existing leaked-password-protection warning remains unresolved and unrelated to T6.32.

## Explicit evidence boundary

T6.32 does **not**:
- seed or assert any Malaysia, Thailand, Singapore or other jurisdiction-specific obligation;
- verify any licence;
- create any statutory deadline;
- complete any regulator filing/report;
- configure Production reminder/calendar automation;
- activate any clinical capability.

## Validation required before merge

- T6.32 tests PASS;
- all prior T6 suites PASS;
- Production dependency audit remains 0 vulnerabilities;
- dev/build baseline remains bounded;
- TypeScript/lint/build PASS;
- matching Vercel Preview READY;
- Production/main remain untouched.
