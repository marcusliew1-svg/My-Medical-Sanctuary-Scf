# MMS Third-Party Risk, Supplier Assurance & Dependency Governance Runbook

**Document ID:** MMS-TPR-RUN-001  
**Status:** WORKING DRAFT

## Scope

This runbook governs third parties that can materially affect MMS technology, privacy, finance, operations, clinical supply, diagnostics, AI, or service continuity.

T6.28 does not itself approve any named vendor. Existing technical use of a service is not equivalent to completed vendor due diligence or governance approval.

## Risk tiers

**LOW** — low dependency, no meaningful sensitive-data/safety impact.  
**MODERATE** — meaningful business dependency or personal-data exposure with bounded impact.  
**HIGH** — material operational, privacy, security, financial or compliance dependency.  
**CRITICAL** — compromise/failure could materially affect safety, identity, payments, core operations, sensitive data or governed evidence.

## Vendor categories

The generic register supports infrastructure/cloud, SaaS, CRM, payments, data processors, AI/model providers, clinical suppliers, diagnostic partners, professional services and other material dependencies.

Existing `suppliers` and `diagnostic_partners` tables remain the domain-specific registers. The new `third_party_assessments` register is the cross-cutting assurance record and does not replace those domain records.

## Approval evidence

APPROVED or CONDITIONAL status requires:
- due-diligence evidence;
- approval evidence;
- assessment timestamp.

CRITICAL dependencies additionally require continuity evidence and an exit plan.

Any third party with SENSITIVE or CLINICAL data access additionally requires privacy/data-processing terms evidence before approval.

## Assurance topics

Assessment should cover as applicable:
1. legal entity and service scope;
2. jurisdiction/data location;
3. ownership and intended use;
4. security controls;
5. privacy/data processing;
6. regulatory/quality evidence;
7. subprocessors/downstream dependencies;
8. incident notification;
9. continuity/recovery;
10. exit/portability;
11. contract and termination rights;
12. periodic reassessment.

## Current vendor boundary

No named third-party approval is created by T6.28. In particular, repository integrations or connected tools must not be described as governance-approved merely because they are technically configured.

The dedicated MMS Zoho tenant remains unresolved. The connected iPivot Zoho tenant must not be repurposed as an MMS-approved CRM.

## Suspension and exit

Material assurance failure, contract lapse, security/privacy concern, regulatory issue or unacceptable continuity risk can require CONDITIONAL, SUSPENDED, DISQUALIFIED or EXITING status. Exit must preserve data integrity, access revocation, evidence retention, continuity and reconciliation obligations.

## Production boundary

T6.28 does not activate any Production integration, payment flow, clinical supplier, diagnostic partner, data processor or AI provider.
