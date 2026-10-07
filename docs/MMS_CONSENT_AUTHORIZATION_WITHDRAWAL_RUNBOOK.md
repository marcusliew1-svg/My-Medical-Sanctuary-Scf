# MMS Consent, Authorization & Withdrawal Governance Runbook

**Document ID:** MMS-GOV-RUN-CONS-001  
**Status:** WORKING DRAFT

## Scope

This runbook governs consent/authorization metadata, version traceability, scope, evidence, withdrawal and immutable event history.

T6.41 does not create a real consent, approve a clinical consent form, enable Production consent capture, or declare consent to be the universal legal basis for MMS processing or clinical activity.

## Core principle

Consent must be specific enough to identify what was presented, for what purpose, and when it was granted.

A service reference, enquiry, appointment, payment, CRM record or website interaction must not be interpreted as treatment consent merely because it exists.

## Required traceability

An ACTIVE consent requires:
- subject reference;
- jurisdiction;
- consent type;
- exact consent document reference;
- document version;
- scope/purpose;
- capture method;
- capture role;
- grant timestamp;
- immutable evidence.

## Consent categories

The register can classify:
- treatment;
- data processing;
- marketing;
- communications;
- research;
- image/media;
- third-party sharing;
- other.

These categories do not determine the legal basis by themselves. Applicability remains subject to approved legal/privacy/clinical governance.

## Withdrawal

Withdrawal requires:
- withdrawal evidence/reference;
- timestamp;
- effective scope.

Withdrawal must be operationally propagated only through an approved workflow. It does not automatically erase historical records, override retention/legal-hold obligations, or retroactively invalidate actions already lawfully taken.

## Immutable history

Material consent lifecycle events are stored in append-only `consent_events`. Corrections are represented by new events rather than rewriting prior grant/withdrawal history.

## Clinical boundary

Existing clinical services remain non-active unless separately approved. T6.41 does not make a service clinically available and does not satisfy Medical Director, regulatory, licensing, facility, clinician-privilege, protocol or patient-specific consent requirements.

## Production boundary

No public consent form, e-signature provider, identity-verification integration, consent-preference center, automated withdrawal propagation or clinical consent capture is enabled by this phase.
