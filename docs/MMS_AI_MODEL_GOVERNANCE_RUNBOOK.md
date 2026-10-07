# MMS AI/Model Governance, Human Oversight & Validation Runbook

**Document ID:** MMS-GOV-RUN-AI-001  
**Status:** WORKING DRAFT

## Scope

This runbook governs AI use-case approval, model/provider identification, human oversight, validation evidence, monitoring and reassessment.

T6.38 does not activate an AI use case, approve a model/provider, enable autonomous decisioning, approve clinical AI, or enable Production AI.

## Canonical register

The existing `mms_governance.ai_use_cases` register remains canonical. T6.38 strengthens it rather than creating a second AI inventory.

Current Preview records remain in REVIEW:
- `AI-OPS-001` — AI Operations Assistant;
- `AI-LING-001` — Ling Approved-Content Concierge.

No provider/model/version or approval is fabricated for either record.

## Activation evidence

APPROVED or ACTIVE status requires:
- provider name;
- model identifier and version;
- controlled system-policy reference;
- human review enabled;
- human-oversight evidence;
- privacy-review evidence;
- validation evidence;
- monitoring reference;
- disable/rollback reference;
- approval reference;
- validation timestamp.

Where `clinical_governance_required=true`, explicit clinical-governance evidence is also required.

## Validation history

`mms_governance.ai_validation_assessments` stores append-only validation outcomes for safety, accuracy, refusal boundary, human oversight, privacy, security, bias/fairness, robustness, grounding and other approved scopes.

A PASS only means the specific tested scope passed. It does not establish universal safety, accuracy, clinical fitness, legal compliance or regulatory approval.

## Human oversight

AI must not silently mutate an authoritative record or become the sole basis for:
- diagnosis or treatment;
- clinical suitability;
- legal/regulatory determinations;
- payment/financial decisions;
- identity/access-control decisions;
- other material decisions unless separately governed and expressly approved.

## Change and reassessment

Material changes to provider, model, version, system prompt/policy, data source, intended use or safety controls require reassessment before continued reliance.

## Existing AI safety controls

The existing AI Operations Assistant remains administrative/advisory and requires human approval. Existing Ling safety/refusal and approved-content controls remain intact and are not weakened by T6.38.

## Production boundary

No Production AI feature flag, provider credential, autonomous workflow, clinical decision-support function or public AI capability is activated by this phase.
