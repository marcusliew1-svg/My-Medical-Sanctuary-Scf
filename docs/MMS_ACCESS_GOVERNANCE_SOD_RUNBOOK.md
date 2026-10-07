# MMS Access Governance & Segregation of Duties Runbook

**Document ID:** MMS-SEC-RUN-AG-001  
**Status:** WORKING DRAFT

## Core principles

MMS operator access must be individually attributable, least-privilege, short-lived where applicable, and derived only from trusted server-controlled app metadata.

The supported operator roles remain `operations`, `finance`, `admin`, and `auditor`.

## Auditor independence

The `auditor` role is read-only and must not coexist with `operations`, `finance`, or `admin`. T6.26 now enforces that rule when trusted operator metadata is parsed. A mixed auditor/mutation-capable role set fails closed.

## Privileged roles

`admin` and `finance` are treated as privileged roles for periodic access review. Existing finance-sensitive mutation routes continue to require recent step-up authentication.

T6.26 does not invent a new approval workflow for role assignment. Until a dedicated entitlement-management workflow exists, privileged role changes require independently documented human approval outside the application.

## Access review evidence

A privileged-access review should record:
1. subject operator identity;
2. reviewer identity;
3. current roles;
4. business justification;
5. retain/reduce/revoke/escalate decision;
6. evidence reference;
7. review timestamp;
8. any remediation required.

Self-review/self-approval is not acceptable for privileged access.

## Joiner / mover / leaver principles

- Joiner: grant only the minimum approved role set after identity verification.
- Mover: reassess all existing roles; do not simply add new privileges.
- Leaver: revoke operator identity and trusted app metadata promptly.
- Dormant/stale access: remove unless current business need is evidenced.

## Shared/service credentials

Shared API tokens, database credentials, application secrets and service accounts are not substitutes for named human operator access and must not be represented as such in access-review records.

## Current evidence boundary

T6.26 does not create a trusted Preview operator, assign a reviewer, modify Production role assignments, configure automatic deprovisioning, or change Supabase Auth users. Those remain separate operational actions requiring supported tooling and accountable approval.
