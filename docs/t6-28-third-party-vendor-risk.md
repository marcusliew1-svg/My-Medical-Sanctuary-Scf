# T6.28 — Third-Party/Vendor Risk, Supplier Assurance & Dependency Governance

**Status:** IMPLEMENTED IN CODE + PREVIEW DATABASE / FULL PREVIEW VALIDATION REQUIRED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Create a unified assurance layer for material third parties across technology, cloud, SaaS, CRM, payments, data processing, AI, clinical supply, diagnostics and professional services without treating technical configuration as governance approval.

## Controls introduced

- generic `mms_governance.third_party_assessments` register;
- LOW / MODERATE / HIGH / CRITICAL risk tiers;
- NONE / BUSINESS / PERSONAL / SENSITIVE / CLINICAL data-access classes;
- vendor lifecycle statuses from PROPOSED through TERMINATED;
- due-diligence and approval evidence required before APPROVED/CONDITIONAL;
- CRITICAL approval additionally requires continuity evidence and exit plan;
- SENSITIVE/CLINICAL access additionally requires privacy/data-processing terms evidence;
- protected internal third-party-risk policy endpoint;
- working-draft Third-Party Risk, Supplier Assurance & Dependency Governance Runbook;
- T6.28 transactional database QA;
- T6.28 CI regression gate.

## Existing registers preserved

- `suppliers` remains the domain-specific clinical/product supplier register;
- `diagnostic_partners` remains the domain-specific diagnostics register;
- the new generic register provides cross-cutting vendor assurance and does not replace either.

## Preview database evidence

Applied to dedicated MMS Preview project `mms-preview-auth`.

- migration `mms_third_party_assurance`: PASS;
- synthetic transactional QA: PASS and rolled back;
- post-QA third-party record count: **0**;
- forced RLS enabled;
- direct `public`, `anon` and `authenticated` grants revoked;
- no named vendor approval created.

Supabase security advisor after migration:
- expected governance-table `rls_enabled_no_policy` informational notices remain intentional under the current fail-closed server-only model;
- existing leaked-password-protection warning remains unresolved and is unrelated to T6.28.

## Explicit boundaries

T6.28 does **not**:
- approve Supabase, Vercel, Zoho, Stripe, or any other named vendor;
- verify any contract/DPA/SOC/ISO/BCP evidence that has not been supplied;
- approve the connected iPivot Zoho tenant for MMS;
- activate any Production integration;
- approve any clinical supplier or diagnostic partner;
- activate a clinical service.

## Validation required before merge

- T6.28 tests PASS;
- all prior security/governance/reliability/access/release suites PASS;
- Production dependency audit remains 0 vulnerabilities;
- dev/build baseline remains bounded;
- TypeScript/lint/build PASS;
- matching Vercel Preview READY;
- Production/main remain untouched.
