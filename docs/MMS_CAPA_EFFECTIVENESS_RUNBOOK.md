# MMS CAPA, Remediation & Effectiveness Assurance Runbook

**Document ID:** MMS-QMS-RUN-CAPA-001  
**Status:** WORKING DRAFT

## Scope

This runbook governs corrective and preventive action (CAPA), remediation implementation, effectiveness review and closure evidence.

T6.39 does not close an existing CAPA, create an effectiveness conclusion for a real finding, or close the originating incident, complaint, audit finding, risk or supplier issue.

## Canonical register

The existing `mms_governance.capa_actions` register remains canonical. T6.39 strengthens its evidence requirements rather than creating a competing remediation tracker.

## Lifecycle

`OPEN -> IN_PROGRESS -> IMPLEMENTED -> EFFECTIVENESS_REVIEW -> CLOSED`

If an effectiveness review shows that remediation is not effective, the CAPA returns to active remediation rather than being silently closed.

## Implementation gate

IMPLEMENTED requires:
- root-cause or causal-analysis reference;
- implementation timestamp;
- implementation evidence reference.

Completing an action item is not itself proof that the underlying problem was corrected.

## Effectiveness gate

EFFECTIVENESS_REVIEW requires:
- effectiveness evidence;
- effectiveness result;
- verifier role;
- verification timestamp.

The immutable `capa_effectiveness_reviews` register preserves review history, including failed or limited outcomes.

## Closure gate

CLOSED requires:
- effectiveness result = `EFFECTIVE`;
- effectiveness evidence;
- verifier role/time;
- closure evidence;
- closure timestamp.

`PARTIALLY_EFFECTIVE` and `INEFFECTIVE` outcomes cannot be used to satisfy closure.

## Linked records

CAPA closure does not automatically close its source record. Incidents, complaints, audit findings, risks, supplier issues and other originating records retain their own closure criteria.

## Current Preview boundary

The existing `CAPA-T618-ZOHO-TENANT` record remains `IN_PROGRESS`. T6.39 does not fabricate implementation evidence or effectiveness results for it.

## Production boundary

No Production remediation workflow, automated CAPA closure, regulatory submission or clinical capability is activated by this phase.
