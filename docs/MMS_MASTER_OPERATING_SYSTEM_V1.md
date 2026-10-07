# MMS Master Operating System v1.0

**Document ID:** MMS-GOV-FRM-001  
**Version:** 1.0-WD  
**Status:** WORKING DRAFT — IMPLEMENTATION FOUNDATION  
**Owner:** Management  
**Clinical authority:** Medical Director (pending formal appointment/approval)  
**Legal / privacy / regulatory approval:** Pending jurisdiction-specific review

## Purpose

This document is the canonical architecture for the MMS Operating System. It converts the agreed operating model into controlled domains, registers, decision rights, safety boundaries, and system-enforceable dependencies.

It does **not** authorize any clinical service, Production activation, regulated activity, medical claim, or patient-facing clinical functionality. Clinical, legal, privacy and regulatory items remain draft until properly approved.

## Operating principles

1. Medical judgement comes first.
2. Automate the administration. Humanise the care.
3. The clinical system is the source of clinical truth.
4. Commercial systems contain commercial/administrative data only.
5. Every material item has one accountable owner, one approval authority and one review date.
6. DRAFT, SUSPENDED and RETIRED items must never be treated as operationally active.
7. Code complete is not the same as approved to operate.
8. Every material risk maps to one or more controls and every critical control has evidence.
9. A failure in a critical dependency stops downstream activity.
10. Production activation is capability-by-capability and requires explicit approval.

## Six operating pillars

### 1. Commercial
Enquiries, CRM, Clinic Manager operations, attribution, Partners, conversion and commercial reporting.

### 2. Patient Experience
My Sanctuary, appointments, support, notifications, account administration and patient-facing non-clinical documents.

### 3. Clinical
Clinical assessment, diagnosis, treatment suitability, consent, treatment, medication, diagnostics, monitoring, follow-up and adverse-event management.

### 4. Quality & Governance
Risk, controls, incidents, complaints, audits, CAPA, assurance, committee decisions and policy governance.

### 5. Technology & AI
Identity, access, integration, security, release control, business continuity, AI Operations, Ling and approved clinical AI.

### 6. Corporate & Finance
Legal entities, finance, payments, refunds, commissions, procurement, contracts, insurance, HR and regulatory obligations.

## Source-of-truth map

| Information | Authoritative source |
| --- | --- |
| Commercial lead lifecycle | MMS commercial platform / CRM architecture |
| Zoho lead record | Zoho CRM |
| Partner attribution | MMS commercial database |
| Commission approval/payment | Finance record |
| Identity / authentication | Auth platform |
| Patient administrative account | My Sanctuary |
| Clinical diagnosis / notes / medication | Clinical system / EHR |
| Diagnostic result | Original verified diagnostic record |
| Clinical service availability | Clinical Service Register |
| Protocol version | Clinical Protocol Register |
| Clinician credential | Clinician Credential Register |
| Clinician privilege | Clinical Privilege Register |
| Facility approval | Facility Register |
| Supplier / product approval | Supplier and Product Registers |
| Governance decision | Decision Register |
| Approved public claim | Approved Claims Library |
| Ling answer source | Approved Ling Content Library |
| AI permission | AI Use Case Register |

When systems disagree, the authoritative source wins.

## Master status vocabulary

- DRAFT — being designed
- REVIEW — awaiting formal review
- APPROVED — formally accepted but not necessarily operating
- ACTIVE — currently operational
- RESTRICTED — operating under defined limits
- SUSPENDED — temporarily unavailable
- RETIRED — permanently withdrawn

## Controlled document lifecycle

WORKING DRAFT → REVIEW → APPROVED → EFFECTIVE → SUPERSEDED → RETIRED

Every controlled document must have: document ID, title, owner, approver, version, status, effective date, review date and confidentiality classification.

## Core master registers

The MMS governance database contains structured records for:

- Documents
- Decisions
- Risks
- Controls
- Risk-to-control links
- CAPA actions
- Clinical services
- Facilities
- Clinician credentials
- Clinician privileges
- Suppliers
- Products
- Diagnostic partners
- AI use cases
- Launch capabilities
- Change requests
- Audits
- Incidents
- Training records

No patient clinical record belongs in the governance schema.

## Clinical service governance

Clinical service status:

PROPOSED → CLINICAL_REVIEW → REGULATORY_REVIEW → OPERATIONAL_REVIEW → APPROVED → ACTIVE → SUSPENDED → RETIRED

Public exposure is independently controlled:

HIDDEN / INTERNAL_ONLY / PLANNED_PUBLIC / PUBLIC_AVAILABLE / REFERRAL_ONLY

A service may be operational only when all required dependencies remain valid, including:

- legal / regulatory permissibility
- Clinical Service ACTIVE
- protocol APPROVED
- facility APPROVED
- clinician credential valid
- required privilege ACTIVE
- required competency current
- staffing minimum met
- product / diagnostic partner approved where relevant
- emergency readiness GREEN
- current consent documentation

If a critical dependency fails, the service must become RESTRICTED or SUSPENDED.

## Clinical workflow

Clinical Intake → Assessment → Review → Suitability → Consent → Treatment / Programme → Monitoring → Follow-Up → Ongoing Review

Suitability states:

NOT_ASSESSED / ASSESSMENT_IN_PROGRESS / ADDITIONAL_INFORMATION_REQUIRED / SUITABLE / SUITABLE_WITH_CONDITIONS / DEFERRED / NOT_SUITABLE

Only authorized clinical roles may change clinical suitability.

## Commercial workflow

Discover → Enquire → Contact → Qualify → Consultation → Review → Proposal → Decision → Onboard → Continue

CRM lifecycle:

NEW_ENQUIRY → CONTACT_ATTEMPTED → CONTACTED → QUALIFIED → CONSULTATION_REQUESTED → CONSULTATION_SCHEDULED → CONSULTATION_COMPLETED → PROGRAMME_PROPOSED → DECISION_PENDING → CONVERTED → NOT_PROCEEDING

Exception states:

DUPLICATE / SPAM / UNREACHABLE / FOLLOW_UP_LATER / DO_NOT_CONTACT

Qualified means commercial/administrative readiness, never medical suitability.

## Clinic Manager rule

Every active commercial item must have:

**Owner + Current Status + Next Action + Due Time**

Clinic Managers coordinate administration and do not diagnose, prescribe, interpret medical results or determine treatment suitability.

## Partner model

Partner-visible states:

SUBMITTED → ACCEPTED → CONTACTED → CONSULTATION_REQUESTED → CONSULTATION_SCHEDULED → CONVERTED → NOT_PROCEEDING

Partners never receive patient clinical information. Attribution overrides require authorization, reason, timestamp and audit evidence.

## Commission lifecycle

ESTIMATED → QUALIFIED → ELIGIBLE → HELD → APPROVED → PAID → REVERSED

Finance controls APPROVED, PAID and REVERSED.

A CRM conversion alone is never sufficient for payment.

## Consent model

Keep separate:

- contact/enquiry consent
- marketing consent
- account / My Sanctuary consent
- cookie / analytics preferences
- clinical consent
- special-purpose clinical consent where required

Do Not Contact suppresses relevant outreach immediately.

## Clinical documentation

Clinical notes use:

DRAFT → SIGNED → AMENDED

Material clinical history is never silently overwritten or backdated. Late entries are identified as late entries. Commercial staff cannot edit clinical records.

## Diagnostics and result review

ORDERED → COLLECTED → RECEIVED → VERIFIED → CLINICIAN_REVIEW → ACTION → COMMUNICATION → FOLLOW_UP → CLOSED

Critical-result workflows require positive clinician acknowledgement and escalation until responsibility is confirmed.

## Medication governance

Medication History → Reconciliation → Clinical Review → Prescription → Verification → Dispensing/Administration → Monitoring → Review/Stop

Only appropriately privileged clinicians prescribe. Medication changes preserve history.

## Treatment administration safety

Check-In → Patient Verification → Pre-Treatment Check → Time-Out → Administration → Monitoring → Discharge → Follow-Up

For higher-risk treatments, the time-out verifies patient, service, protocol, consent, product, batch, dose, route, clinician and emergency readiness.

## Adverse events and clinical incidents

Detect → Stabilize → Escalate → Record → Grade → Assess → Report → Investigate → CAPA → Follow-Up → Close

The Medical Director may immediately suspend a clinical service for safety reasons.

## CAPA lifecycle

OPEN → IN_PROGRESS → IMPLEMENTED → EFFECTIVENESS_REVIEW → CLOSED

A CAPA is not closed merely because an action was performed; effectiveness must be checked.

## Credentialing and privileging

Credentialing confirms professional qualification. Privileging determines what MMS permits inside MMS.

Apply → Verify → Review → Privilege → Activate → Monitor → Renew / Restrict / Suspend

System access is not clinical privilege.

## Competency

NOT_TRAINED → TRAINING → SUPERVISED_PRACTICE → COMPETENT → COMPETENT_WITH_CONDITIONS → EXPIRED / SUSPENDED

The control chain is:

Credential Valid → Training Complete → Competency Demonstrated → Privilege Approved → System Permission Enabled

## Facilities

Facility lifecycle:

PROPOSED → FIT_OUT → INSPECTION → APPROVED → ACTIVE → RESTRICTED → SUSPENDED → CLOSED

Facility capability levels:

1. Consultation
2. Monitored outpatient
3. Advanced procedure
4. Hospital-integrated specialist

Each service specifies its minimum facility level.

## Supplier and product governance

Supplier lifecycle:

PROPOSED → REVIEW → APPROVED → CONDITIONAL → SUSPENDED → DISQUALIFIED

Product lifecycle:

PROPOSED → QUALITY_REVIEW → CLINICAL_REVIEW → APPROVED → ACTIVE → QUARANTINED → SUSPENDED → RETIRED

High-risk products require patient-level batch/lot traceability in the clinical system.

## Diagnostics partner governance

External labs and imaging providers require qualification, secure result matching, critical-result escalation, corrected-result history and performance monitoring.

## Referrals and complex care

A referral is not closed simply because it was sent. Responsibility must be explicit.

Complex patients require one accountable Lead Clinician. MDT decisions are recorded, assigned and followed through.

## Patient rights, complaints and ethics

MMS governance includes:

- Patient Rights Charter
- complaint classification and investigation
- clinical independence
- truthful claims
- conflict disclosure
- no exploitation of vulnerable patients
- separation of research from ordinary care
- whistleblowing / speak-up protection

## Privacy and data governance

Commercial systems are prohibited from storing diagnosis, detailed medical history, medications, lab results, prescriptions, doctor notes, treatment suitability reasoning or clinical images.

All systems follow minimum-necessary access, role-based permission, auditability, controlled exports, account offboarding, retention policy and legal hold.

Exact retention periods require jurisdiction-specific approval.

## AI governance

Every AI use case must have an approved register entry.

AI may assist with summarization, drafting, navigation, administrative prioritization and approved knowledge retrieval.

AI may not autonomously diagnose, prescribe, determine treatment suitability, decide clinical urgency, approve commissions/refunds, alter trusted authorization, or become the sole authority for material clinical decisions.

Ling may answer only from approved public / patient information and must hand off when approved content is unavailable.

## Risk framework

Risk domains:

- Clinical
- Regulatory / Legal
- Privacy / Data
- Technology / Cybersecurity
- Commercial / Operational
- Financial
- Reputational

Each risk records owner, inherent likelihood/impact, controls, residual likelihood/impact, risk response, actions and review date.

Clinical safety, privacy/security and regulatory breach have very low risk appetite.

## Control library

Control types:

- Preventive
- Detective
- Corrective

Each control records owner, operator, frequency, evidence, automation level, system, test method, linked risks and effectiveness.

Effectiveness states:

EFFECTIVE / NEEDS_IMPROVEMENT / INEFFECTIVE / NOT_TESTED

## Assurance model

First line: operational and clinical teams own and perform controls.

Second line: Quality, Compliance, Privacy and Clinical Governance define standards, monitor and challenge.

Third line: independent assurance such as audit, cybersecurity testing, legal/regulatory review and external specialist review.

Quarterly assurance reporting should answer:

1. Are controls designed correctly?
2. Are they actually working?
3. What remains outside risk appetite?

## Access governance

REQUEST → APPROVE → PROVISION → REVIEW → REVOKE

Least privilege applies. Role changes trigger access reassessment. Departures revoke active sessions and privileges while preserving historical audit identity.

## Launch governance

Capability states:

RED → AMBER → GREEN → LIVE → SUSPENDED

GREEN means ready for an approval decision. LIVE requires explicit authorization.

Each Production activation requires:

- technical evidence
- operational owner
- privacy/security review
- monitoring
- rollback
- support SOP
- live E2E plan
- explicit approver

## Change control

PROPOSED → IMPACT_ASSESSMENT → APPROVED → IMPLEMENTED → VERIFIED → CLOSED

Material changes include clinical protocols, services, suppliers, products, facilities, AI models, Production architecture, consent, medical claims and key financial controls.

## Management cadence

Daily: operational exceptions, enquiries, SLAs, failures and serious clinical concerns.

Weekly: funnel, Partners, support, system health, staffing and blockers.

Monthly: clinical governance, quality, finance controls, risk, CAPA, suppliers, products and credentialing.

Quarterly: enterprise risk and assurance.

Annually: full strategy, service, policy, quality, risk, privacy, cybersecurity, AI, finance and continuity review.

## Management dashboard

The owner-level view should be six domains:

1. Commercial Performance
2. Patient Operations
3. Clinical Safety
4. Quality & Risk
5. Technology & AI
6. Finance & Corporate

The dashboard prioritizes exceptions: RED items, overdue actions, suspensions, unowned work, ineffective controls and decisions required.

## Implementation rule

This framework is implemented through:

**Controlled Documents → Structured Registers → Roles/Permissions → System Controls → Evidence → Audit → CAPA → Assurance**

This version establishes the architecture and structured database foundation only. It does not itself activate regulated clinical services or Production capabilities.
