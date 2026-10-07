# T6.41 — Consent, Authorization & Withdrawal Governance

**Status:** PASS — PREVIEW VALIDATED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Create a controlled consent/authorization framework so MMS can prove what document/version was presented, what scope was granted, when consent changed, and whether withdrawal/revocation evidence exists—without treating enquiries, appointments, payments, CRM records or service references as implicit treatment consent.

## Controls introduced

- `mms_governance.consent_authorizations` register;
- consent categories for treatment, data processing, marketing, communications, research, image/media, third-party sharing and other;
- exact consent document reference and version;
- explicit scope/purpose;
- ACTIVE requires capture method, capture role, grant timestamp and immutable evidence;
- WITHDRAWN requires withdrawal reference, timestamp and effective scope;
- REVOKED requires revocation reference and timestamp;
- expiry ordering constraint;
- immutable `mms_governance.consent_events` history;
- material events such as GRANTED, DECLINED, WITHDRAWN, EXPIRED, REVOKED and SUPERSEDED require immutable evidence linkage;
- protected internal consent-governance policy endpoint;
- working-draft Consent, Authorization & Withdrawal Governance Runbook;
- transactional QA 031;
- T6.41 CI regression gate.

## Preview database evidence

Applied only to dedicated MMS Preview project `mms-preview-auth`.

- schema execution: PASS;
- corrected material-event evidence constraint: PASS;
- transactional QA 031: PASS / rolled back;
- retained synthetic consent authorizations: **0**;
- ACTIVE transition without evidence rejection: PASS;
- material GRANTED event without evidence rejection: PASS;
- WITHDRAWN transition without withdrawal evidence/scope rejection: PASS;
- immutable consent-event mutation rejection: PASS;
- forced RLS enabled;
- direct public/anon/authenticated grants revoked.

Supabase security advisor:
- expected private-governance `rls_enabled_no_policy` INFO remains intentional under the fail-closed server-only model;
- existing leaked-password-protection warning remains unresolved and unrelated to T6.41.

## Explicit boundaries

T6.41 does **not**:
- create any real consent record;
- approve a clinical consent form;
- declare consent to be the universal legal basis;
- infer treatment consent from an appointment, enquiry, payment, CRM record or service reference;
- enable Production consent capture, e-signature, preference centre or automated withdrawal propagation;
- override T6.25 retention/legal-hold requirements;
- activate any clinical capability.

## Validation required before merge

- T6.41 tests PASS;
- all prior T6 suites PASS;
- Production dependency audit remains 0 vulnerabilities;
- dev/build baseline remains bounded;
- TypeScript/lint/build PASS;
- matching Vercel Preview READY;
- Production/main remain untouched.


## Final validation — 2026-10-07

Final branch evidence:

- Preview schema execution: PASS;
- corrected material-event evidence constraint: PASS;
- transactional QA 031: PASS / rolled back;
- retained synthetic consent authorizations: **0**;
- ACTIVE transition without evidence rejection: PASS;
- material GRANTED event without evidence rejection: PASS;
- WITHDRAWN transition without withdrawal evidence/scope rejection: PASS;
- immutable consent-event mutation rejection: PASS;
- T6.41 consent-governance tests: PASS;
- Production dependency audit: PASS / 0 vulnerabilities;
- dev/build security baseline: PASS;
- all prior T6 suites: PASS;
- TypeScript: PASS;
- lint: PASS;
- full GitHub build: PASS;
- matching Vercel Preview: **READY**.

Consent-governance boundaries remain intact:
- no real consent was created;
- no clinical consent document was approved;
- no service/appointment/enquiry/payment/CRM record was treated as implicit consent;
- no Production consent capture/e-signature/preference centre was enabled;
- no automated withdrawal propagation was enabled;
- no legal/clinical basis was fabricated;
- Production/main remain untouched;
- no clinical capability was activated.


## Final validation — 2026-10-07

Final branch evidence:

- Preview schema execution: PASS;
- corrected material-event evidence constraint: PASS;
- transactional QA 031: PASS / rolled back;
- retained synthetic consent authorizations: **0**;
- ACTIVE transition without capture/evidence rejection: PASS;
- material GRANTED event without evidence rejection: PASS;
- WITHDRAWN transition without withdrawal reference/timestamp/scope rejection: PASS;
- immutable consent-event mutation rejection: PASS;
- T6.41 consent-governance tests: PASS;
- Production dependency audit: PASS / 0 vulnerabilities;
- dev/build security baseline: PASS;
- all prior T6 suites: PASS;
- TypeScript: PASS;
- lint: PASS;
- full GitHub build: PASS;
- matching Vercel Preview: **READY**.

Consent-governance boundaries remain intact:
- no real consent was created;
- no clinical consent document was approved;
- no treatment consent was inferred from an appointment, enquiry, payment, CRM record or service reference;
- no universal legal basis was asserted;
- no Production consent capture/e-signature/preference-centre workflow was enabled;
- no automated withdrawal propagation was enabled;
- T6.25 retention/legal-hold controls remain unaffected;
- Production/main remain untouched;
- no clinical capability was activated.
