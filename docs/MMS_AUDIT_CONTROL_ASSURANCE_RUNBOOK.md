# MMS Audit, Control Testing & Assurance Evidence Runbook

**Document ID:** MMS-GOV-RUN-AUD-001  
**Status:** WORKING DRAFT

## Scope

This runbook governs internal audits, control testing, assurance evidence, findings and linkage into CAPA/risk management.

T6.29 does not itself complete an audit, certify compliance, mark a control effective, close a CAPA, or assert external certification.

## Audit lifecycle

`PLANNED -> IN_PROGRESS -> REPORTING -> COMPLETE`

Cancellation is permitted only from PLANNED or IN_PROGRESS. A completed audit must have a report reference, overall rating, and completion timestamp.

## Control testing

A control remains `NOT_TESTED` until actual evidence exists.

- **EFFECTIVE** — evidence demonstrates the control operated as intended for the tested scope and period.
- **NEEDS_IMPROVEMENT** — evidence demonstrates a weakness but some residual effectiveness remains.
- **INEFFECTIVE** — evidence demonstrates the control failed or cannot be relied upon.
- **NOT_TESTED** — no supported effectiveness conclusion has been reached.

The absence of an observed failure is not sufficient evidence of effectiveness.

## Evidence standard

Audit/control evidence should be:
1. attributable;
2. dated;
3. scoped;
4. reproducible or independently reviewable where practicable;
5. retained at a stable evidence reference;
6. free from unsupported conclusions.

## Findings and remediation

Material findings should be linked to one or more of:
- CAPA;
- risk treatment;
- change request;
- incident;
- accepted-risk decision with evidence.

A finding should not disappear merely because an audit is closed.

## Independence

Where practicable, the person testing a control should not be the sole person responsible for operating that same control. Independence expectations increase with risk and control criticality.

## Existing governance model

MMS already has:
- `mms_governance.audits`;
- `mms_governance.controls`;
- `mms_governance.capa_actions`;
- `mms_governance.risks`;
- immutable `mms_governance.governance_audit_events`.

T6.29 uses these existing records rather than creating a competing assurance database.

## Production boundary

T6.29 does not run a Production audit, alter Production configuration, grant a certification, or activate any clinical capability.
