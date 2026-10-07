# T6.31 — Complaints, Concerns & Speak-Up Governance

**Status:** PASS — PREVIEW VALIDATED  
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


## Final validation — 2026-10-07

Final branch evidence:

- Preview migration `mms_complaints_speakup_governance`: PASS;
- transactional QA 021: PASS / rolled back;
- retained synthetic complaint/speak-up rows: **0**;
- T6.31 complaints/speak-up tests: PASS;
- Production dependency audit: PASS / 0 vulnerabilities;
- dev/build security baseline: PASS;
- all prior T6 suites: PASS;
- TypeScript: PASS;
- lint: PASS;
- full GitHub build: PASS;
- matching Vercel Preview: **READY**.

Governance boundaries remain intact:
- no real complaint or speak-up case was created;
- no named investigator was appointed;
- no anonymous hotline or intake channel was configured;
- no regulator notification was claimed;
- no Production case intake was activated;
- no clinical capability was activated;
- Production/main remain untouched.
