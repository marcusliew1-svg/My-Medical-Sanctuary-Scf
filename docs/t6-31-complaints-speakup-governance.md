# T6.31 — Complaints, Concerns & Speak-Up Governance

**Status:** IMPLEMENTED IN CODE + PREVIEW DATABASE / FULL PREVIEW VALIDATION REQUIRED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Create a governed system of record for complaints, concerns and good-faith speak-up cases, with escalation, evidence, non-retaliation and closure controls that integrate with existing incident, CAPA, risk, privacy and clinical governance.

## Controls introduced

- `mms_governance.complaints_and_concerns` register;
- complaint/concern categories including customer, partner, workforce, privacy, security, clinical safety and speak-up;
- severity and confidentiality classification;
- controlled lifecycle from OPEN through CLOSED;
- RESOLVED requires resolution summary, evidence reference and resolution timestamp;
- CLOSED additionally requires closure timestamp and external/regulatory reporting assessment;
- non-retaliation rules;
- conflict-management and evidence-preservation expectations;
- protected internal complaints/speak-up policy endpoint;
- working-draft Complaints, Concerns & Speak-Up Governance Runbook;
- transactional QA 021;
- T6.31 CI regression gate.

## Preview database evidence

Applied to dedicated MMS Preview project `mms-preview-auth`.

- migration `mms_complaints_speakup_governance`: PASS;
- transactional QA 021: PASS / rolled back;
- retained synthetic complaint/speak-up rows: **0**;
- forced RLS enabled;
- direct public/anon/authenticated grants revoked.

Supabase security advisor:
- expected governance-table `rls_enabled_no_policy` INFO remains intentional under the fail-closed server-only model;
- existing leaked-password-protection warning remains unresolved and unrelated to T6.31.

## Explicit boundaries

T6.31 does **not**:
- create or resolve any real complaint;
- create any real speak-up case;
- configure an anonymous hotline;
- appoint an investigator;
- notify a regulator;
- activate Production complaint intake;
- activate any clinical capability.

## Validation required before merge

- T6.31 tests PASS;
- all prior T6 suites PASS;
- Production dependency audit remains 0 vulnerabilities;
- dev/build baseline remains bounded;
- TypeScript/lint/build PASS;
- matching Vercel Preview READY;
- Production/main remain untouched.
