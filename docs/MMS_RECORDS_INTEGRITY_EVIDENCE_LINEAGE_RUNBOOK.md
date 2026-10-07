# MMS Records Integrity, Evidence Lineage & Tamper-Evidence Runbook

**Document ID:** MMS-GOV-RUN-EVI-001  
**Status:** WORKING DRAFT

## Scope

This runbook governs metadata used to prove what evidence existed, where it came from, what governed record it supports, and whether the bytes later retrieved are the same bytes originally captured.

T6.35 does not digitally sign evidence, configure an external timestamp authority, migrate Production evidence, or prove legal/regulatory authenticity.

## Immutable evidence-artifact register

The `mms_governance.evidence_artifacts` register is append-only. UPDATE and DELETE are rejected.

If evidence metadata is wrong or evidence is superseded, a new artifact must be created. Historical artifacts remain part of the evidentiary trail.

## Required lineage

Each artifact records:
- unique evidence ID;
- evidence type;
- governed subject type/reference;
- originating source system/reference;
- durable storage location;
- SHA-256 digest;
- capture role and timestamp;
- optional verifier role, timestamp and verification method;
- confidentiality classification.

## Digest meaning

A SHA-256 digest can demonstrate that retrieved bytes match previously digested bytes. It does **not** by itself establish:
- truthfulness;
- authorship;
- identity of the signer;
- legal admissibility;
- regulatory acceptance;
- completeness of the source system.

Those conclusions require separate evidence and authority.

## Governance audit linkage

Existing `governance_audit_events` remain immutable. T6.35 adds an optional foreign-key link from an audit event to an immutable evidence artifact, allowing material governance actions to point to stronger evidence lineage without changing the audit-event lifecycle.

## Sensitive-data boundary

The evidence register stores metadata and references. Detailed patient/clinical content, passwords, access tokens, credentials and other unnecessary sensitive payloads must not be copied into the register.

## Verification

Where verification is claimed, the record must identify verifier role, verification timestamp and method. Verification is not inferred merely because an artifact exists.

## Production boundary

T6.35 does not migrate Production evidence, alter Production storage, activate digital signing, or change clinical-service availability.
