# MMS Incident Response & Service Reliability Runbook

**Document ID:** MMS-OPS-RUN-IR-001  
**Status:** WORKING DRAFT  
**Scope:** Operational response framework only. It does not appoint named responders, determine statutory reporting, or grant clinical authority.

## Incident priorities

**P1 — Critical:** loss of a core service/control, serious access-control failure, material data-integrity risk, or failure that can create unsafe/incorrect operational state. Target acknowledgement: 15 minutes. Target containment: 60 minutes.

**P2 — Major:** major degradation, repeated failed/duplicate transactions, significant CRM or workflow disruption, or control failure with bounded impact. Target acknowledgement: 30 minutes. Target containment: 4 hours.

**P3 — Moderate:** limited degradation with a safe workaround and no evidence of widespread integrity failure. Target acknowledgement: 4 hours. Target containment: 24 hours.

**P4 — Minor:** low-impact operational defect or isolated issue with no meaningful integrity/safety consequence. Target acknowledgement: 24 hours. Target containment: 72 hours.

**CLINICAL_SAFETY:** potential or actual clinical-safety event. Operational target mirrors P1, but clinical assessment, escalation, patient management and statutory reporting must follow the separately approved clinical-governance process.

## Required lifecycle

Incidents use: `OPEN -> CONTAINED / INVESTIGATING -> RECOVERED -> REVIEW -> CLOSED`.

Closure must not be used as a substitute for containment. P1/P2/CLINICAL_SAFETY incidents require an external-reporting assessment before closure. Closure also requires a documented root cause.

## First-response actions

1. Confirm the affected capability and preserve request IDs/timestamps.
2. Stop or isolate unsafe, duplicate, lossy or misleading mutation paths.
3. Do not assume an action succeeded unless the system explicitly confirmed success.
4. Preserve evidence before retrying or manually correcting records.
5. Determine whether data-integrity reconciliation is required.
6. Record containment and recovery timestamps.
7. Assess whether CAPA is required.
8. Assess external reporting requirements using the appropriate legal/privacy/clinical authority; this runbook does not decide them.

## Recovery verification

Recovery requires evidence that the initiating failure has stopped or is safely isolated, affected data is reconciled, duplicate/omission risk is checked, monitoring/manual verification is in place, and the incident record is sufficient for review.

## Degraded-service rules

Affected operational features should fail closed where continued operation could create incorrect state, unsafe guidance, duplicate financial/commercial actions, access-control bypass, or loss of audit evidence. The public liveness endpoint must not disclose incident detail.

## External dependencies

External alert routing, on-call software, log drains, paging vendors, SMS providers and named responder rosters remain unconfigured until separately approved. No such vendor or person is implied by this document.
