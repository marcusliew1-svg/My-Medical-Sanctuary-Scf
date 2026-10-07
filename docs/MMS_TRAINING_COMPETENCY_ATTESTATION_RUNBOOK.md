# MMS Training, Competency & Policy Attestation Runbook

**Document ID:** MMS-HR-RUN-TCA-001  
**Status:** WORKING DRAFT

## Scope

This runbook governs evidence for role-based training, competency assessment, refresher requirements, policy acknowledgement and expiry.

T6.30 does not itself train a person, certify competence, appoint an assessor, grant clinical privilege, or change Production access.

## Lifecycle

Training records use the existing MMS lifecycle:

`NOT_STARTED -> IN_PROGRESS -> SUPERVISED_PRACTICE / COMPETENT / COMPETENT_WITH_CONDITIONS`

Current competency may later move to `EXPIRED` or `SUSPENDED`, with retraining returning to `IN_PROGRESS`.

## Competency evidence

A person must not be marked COMPETENT or COMPETENT_WITH_CONDITIONS unless there is:
- a documented competency method;
- assessor role;
- completion timestamp;
- stable evidence reference;
- verification timestamp;
- no outstanding refresh-required flag.

Attendance alone is not competency.

## Expiry and refresh

If an expiry date is recorded it must be after completion. Expired or refresh-required training must not be treated as current competency.

Role changes should trigger reassessment of the required training set rather than simply retaining all prior role-based permissions.

## Policy attestation

A policy acknowledgement may be recorded separately from competency evidence. Acknowledgement proves that a controlled policy was presented/accepted; it does not prove practical skill.

## Clinical boundary

Clinical training or competency evidence does not grant:
- professional licensure;
- clinical privileges;
- Medical Director approval;
- service activation;
- jurisdictional authority to practise.

Those remain governed by the separate clinician credential/privilege and clinical-service controls.

## Sales Partner boundary

The existing controlled Sales Partner training engine remains separate and unchanged. T6.30 provides the generic workforce/governance layer and does not weaken the Sales Partner 10-module evidence requirements.

## Production boundary

T6.30 does not create workforce identities, grant operator roles, change Production access, or activate any clinical capability.
