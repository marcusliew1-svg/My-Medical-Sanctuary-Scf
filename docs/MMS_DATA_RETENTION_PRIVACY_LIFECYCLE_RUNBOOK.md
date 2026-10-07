# MMS Data Retention, Privacy Lifecycle & Records Disposal Runbook

**Document ID:** MMS-PRV-RUN-001  
**Status:** WORKING DRAFT  
**Scope:** Policy-control framework only. It does not set statutory retention periods, appoint a privacy officer, or authorize Production deletion jobs.

## Core principle

MMS should retain records only for a documented purpose and approved period, subject to legal, regulatory, clinical, audit, complaint, investigation and litigation preservation requirements.

No numeric retention period is approved by this runbook. Jurisdiction-specific periods must be supplied and approved through the appropriate legal/privacy/clinical governance process.

## Retention classes

- **TRANSIENT:** short-lived technical/request data that does not need to become a durable business record.
- **OPERATIONAL:** enquiries, CRM/workflow state and operational administration records.
- **GOVERNANCE:** governance decisions, audit evidence, incidents, CAPA, controls and controlled-document history.
- **FINANCIAL:** payment, commission and other financial/commercial records.
- **IDENTITY_ACCESS:** authentication, account, access-control and security evidence.
- **CLINICAL_RESTRICTED:** clinical/patient records only if an approved clinical system is later activated.

All retention periods remain **UNAPPROVED** until formally supplied and evidenced.

## Privacy lifecycle

Records move conceptually through:
`COLLECTED -> ACTIVE_USE -> RESTRICTED / LEGAL_HOLD -> ELIGIBLE_FOR_DISPOSAL -> DISPOSAL_APPROVED -> DISPOSED`.

A record must not move to disposal while its legal-hold state is unknown.

## Legal hold

Legal hold overrides ordinary disposal. Records connected to complaints, investigations, audits, incidents, litigation or regulatory review must be preserved until release is supported by formal evidence.

## Disposal controls

Before deletion or anonymisation:
1. identify category and system of record;
2. reference an approved retention/disposal authority;
3. confirm legal hold is clear;
4. review linked/dependent records;
5. select an appropriate deletion/anonymisation method;
6. attribute the action to an authorised actor;
7. retain non-sensitive disposal evidence where required.

## Data minimisation

General enquiry and CRM workflows must not become a substitute clinical record. Identity documents, medical records, prescriptions, laboratory results and detailed medical history should not be placed into general-purpose fields unless a separately approved workflow requires them.

Secrets, access tokens, passwords and raw credentials are never business records.

## Production automation

T6.25 does not configure purge jobs, database TTLs, object-storage lifecycle rules, Auth user deletion automation, CRM deletion automation or clinical-record destruction. Those actions require approved periods, accountable ownership, tested safeguards and auditable disposal evidence.

## Rights requests

Access, correction, withdrawal, deletion/erasure, objection, restriction and complaint handling remain dependent on the approved privacy notice, verified controller identity, jurisdictional requirements and human review. This runbook does not claim a right applies universally or that deletion must override legal retention obligations.
