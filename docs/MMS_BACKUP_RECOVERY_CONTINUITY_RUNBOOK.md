# MMS Backup, Recovery & Business Continuity Runbook

**Document ID:** MMS-OPS-RUN-BCP-001  
**Status:** WORKING DRAFT  
**Scope:** Recovery-control framework only. It does not claim that backups, retention schedules, failover, or restore tests are already configured.

## Recovery objectives

The following are engineering targets for design and testing, not approved contractual SLAs:

- **Tier 0 — Safety / identity / transactional control plane:** target RTO 60 minutes, target RPO 15 minutes.
- **Tier 1 — Core operational workflow:** target RTO 4 hours, target RPO 1 hour.
- **Tier 2 — Customer-facing non-transactional service:** target RTO 8 hours, target RPO 24 hours.
- **Tier 3 — Non-critical supporting capability:** target RTO 24 hours, target RPO 24 hours.

## Backup is not recovery

A backup is not considered sufficient evidence of recoverability. For Tier 0 and Tier 1 systems, MMS must be able to demonstrate an isolated restore, integrity verification, reconciliation, and documented unresolved-discrepancy count.

## Minimum restore evidence

Each restore exercise or actual recovery should record:

1. recovery point / backup identifier and timestamp;
2. isolated restore target;
3. schema and object verification;
4. record-count and key-integrity reconciliation;
5. duplicate / missing / replayed transaction checks;
6. authentication and trusted-app-metadata verification using supported tooling;
7. governance/audit evidence consistency;
8. recovery completion timestamp and unresolved discrepancies.

Recovery should not be declared complete while unresolved discrepancies remain.

## Continuity modes

**READ_ONLY:** permitted only when read state is known to be consistent and cannot mislead operators or customers.

**FAIL_CLOSED:** required when mutation integrity, authentication, payment/commission state, safety controls, or audit evidence cannot be trusted.

**MANUAL_RECONCILIATION:** permitted only through an approved human workflow that preserves evidence and does not falsely mark system actions as completed.

## Dependency-specific constraints

- **MMS commercial/governance database:** restore must pass structural and data-integrity checks before mutation traffic resumes.
- **MMS Auth:** do not recover users by direct SQL mutation of `auth.users`; use supported Auth administration tooling and verify trusted app metadata.
- **Zoho CRM:** no live continuity evidence is accepted until a dedicated MMS Zoho tenant is verified.
- **Vercel application:** repository/build recovery does not substitute for environment-variable and downstream dependency recovery.

## Disaster declaration and failover

T6.24 defines no automatic disaster declaration, cross-region database failover, DNS failover, backup schedule, retention policy, or external recovery provider. Those require separate infrastructure decisions and evidence.

## Exercise cadence

A proposed cadence is quarterly for Tier 0/1 restore exercises and at least annually for full business-continuity simulation. This remains a proposed control until management assigns accountable owners and approves the schedule.
