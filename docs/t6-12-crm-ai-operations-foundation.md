# T6.12 CRM + AI Operations Foundation

## Result and boundary

T6.12 is a development and synthetic-Preview foundation. It adds no public or API route, performs no deployment, configures no credential and writes no real record. The controlled public informational Production deployment remains unchanged.

All five T6.12 gates default off:

| Capability | Gate | Preview condition | Production condition |
|---|---|---|---|
| CRM persistence | `MMS_CRM_PERSISTENCE_ENABLED` | Explicit `true` plus `MMS_SYNTHETIC_DATA_ONLY=true` | Off; informational preflight rejects `true` |
| Clinic Manager queue | `MMS_CLINIC_MANAGER_QUEUE_ENABLED` | Explicit `true` plus synthetic-only | Off; informational preflight rejects `true` |
| AI Operations Assistant | `MMS_AI_OPERATIONS_ASSISTANT_ENABLED` | Explicit `true` plus synthetic-only | Off; informational preflight rejects `true` |
| Ling public concierge | `MMS_LING_PUBLIC_CONCIERGE_ENABLED` | Explicit `true` plus synthetic-only | Off; informational preflight rejects `true` |
| Management Intelligence | `MMS_MANAGEMENT_INTELLIGENCE_ENABLED` | Explicit `true` plus synthetic-only | Off; informational preflight rejects `true` |

`MMS_SYNTHETIC_DATA_ONLY` is itself forbidden by the controlled informational Production preflight. These gates do not bypass the existing booking, operator, commercial database, Patient, Partner, Ling or Health Intelligence gates.

## CRM operating model

Canonical commercial lifecycle:

`New Enquiry -> Contact Attempted -> Contacted -> Qualified -> Consultation Requested -> Consultation Scheduled -> Consultation Completed -> Programme Proposed -> Decision Pending -> Converted -> Not Proceeding`

Administrative terminal/holding states are `Duplicate`, `Spam`, `Unreachable`, `Follow Up Later` and `Do Not Contact`. Transition validation is forward-only, with a controlled return from `Follow Up Later` to `Contact Attempted`. `Not Proceeding`, `Do Not Contact`, `Spam` and `Duplicate` require a reason.

Qualification is administrative/commercial. It never means medically suitable, diagnosed, prescribed or clinically approved.

Every accepted transition produces a timestamp, actor, previous state, new state, reason, suggestion source and human-application marker. AI advice cannot produce a transition unless a human operator applies it.

## CRM data model

| Category | Minimum fields |
|---|---|
| Identity/contact | CRM lead ID, name, email, mobile, country, preferred location, preferred language |
| Attribution | source, campaign, UTM source/medium/campaign, referral code, Partner ID, landing page |
| Interest | broad interest, programme interest, treatment-information interest, contact channel/time |
| Workflow | lead status, Clinic Manager, commercial owner, next action/due, last contact, consultation status, conversion status, reason lost |
| Compliance/admin | contact-consent timestamp/version, separate marketing consent, source evidence, do-not-contact |

At least one contact method and evidence of contact consent are required. CRM input rejects these fields explicitly: diagnosis, medical history, medication, lab values, clinical images, doctor notes, treatment suitability, prescription and medical results. The Zoho mapper is a safe allow-list and cannot forward arbitrary source fields.

## Zoho adapter

The adapter supports create, pre-create email/mobile dedupe, update, owner assignment, source, Partner/referral attribution, next action and due date. Each source request gets a stable SHA-256 idempotency key derived from source, source request ID and normalized contact fingerprint. Replays return the recorded lead ID; creates ask Zoho to duplicate-check the idempotency key, email and mobile.

HTTP 408/409/425/429, 5xx and defined transient Zoho codes receive capped exponential retry (maximum five attempts). Validation/auth/mapping failures are permanent and do not retry. Structured adapter events contain event name, idempotency key, record ID and outcome only; they exclude contact data, OAuth values and arbitrary CRM payloads.

The included in-memory idempotency store is for isolated synthetic tests only. A durable store and atomic reservation are required before any distributed Preview/Production persistence approval. No Zoho credential, tenant, organization ID, owner ID or field/picklist decision is supplied in T6.12.

## Clinic Manager queue

Queue states are `New`, `Awaiting Contact`, `Follow-Up Due`, `Consultation Requested`, `Scheduled`, `Escalated` and `Completed`. A queue row contains only display name, administrative contact channel, source/Partner attribution, owner, next action/due, enquiry age, SLA status and escalation flag. It deliberately omits email, mobile and free-text medical content.

SLA status is `On Time`, `Due Soon` or `Overdue`. Defaults reflect the earlier proposed package: acknowledgement 60 minutes, operational-failure escalation 30 minutes and due-soon threshold 15 minutes. They are environment-configurable. The policy remains `proposed` unless `MMS_CRM_SLA_POLICY_APPROVED=true`; T6.12 does not claim approval.

## AI Operations Assistant

Allowed outputs are an administrative summary, follow-up draft and next-action suggestion. Outputs are marked `advisory`, `requiresHumanApproval` and `generatedBy=mms_ai_operations`. Summaries use structured administrative fields and do not reproduce email, mobile or sensitive free text.

The system boundary refuses diagnosis, prescriptions/dosing, medical-history or result interpretation, treatment recommendation/suitability and urgent clinical requests. Emergency/urgent requests are directed away from the website support workflow to the approved clinical/emergency pathway. AI text cannot mutate CRM state.

## Ling 2.0 and approved content

Ling is modelled as an approved-content concierge, not an unrestricted medical generator. Knowledge states are `Draft`, `Medical Review`, `Legal Review`, `Approved` and `Retired`. Records require content ID, topic, locale, approver, approval date, version, review expiry, source and availability. Public retrieval returns only valid, unexpired `Approved` records in the requested topic/locale and emits an internal source reference.

Missing approved content triggers human handoff. Clinical or emergency questions are refused. A `planned` record always adds that the service is not currently available through MMS. Production Ling remains off.

## Management Intelligence

The aggregate contract includes enquiries today/7 days/30 days, source, channel, Partner referrals, average response time, overdue enquiries, consultation requests, scheduled consultations, conversions/rate, programme interest, lost reasons and CRM/booking/email failures. It contains no clinical KPI.

The daily brief reports current volume, attention items, source performance, failures and administrative priorities. It is advisory, requires human review, contains no individual contact data and does not infer clinical priority.

## Partner attribution and isolation

The CRM record carries authoritative Partner ID and referral code separately from general source/campaign data. The Partner projection is ownership-checked and exposes only CRM lead ID, commercial status, source and that Partner's own attribution. A mismatched Partner receives no record. Contact details and all prohibited clinical categories are excluded.

## Security audit

| Control | T6.12 state |
|---|---|
| PII minimization | Safe field allow-list; queue/management/log views minimize contact data |
| Logging | Structured metadata only; no secrets, tokens, contact values or raw payloads |
| Secrets | No secrets added; live transport still requires server-only existing Zoho variables |
| Access | No new route; future UI/API must retain operator authentication and role checks |
| Rate limiting | Existing public booking endpoint retains its rate limit; no new public endpoint exists |
| Idempotency | Stable request key, contact dedupe, Zoho duplicate fields; durable atomic store still required |
| Roles | Clinic Manager is an operational role only and receives no clinical decision authority |
| Audit | State transitions are explicit; AI suggestions are distinguishable and human-applied |

## Synthetic Preview E2E

The T6.12 suites use only `.invalid` contact data and synthetic role/Partner IDs. They cover all sixteen requested cases: new enquiry, duplicate, create, update, assignment, next action, SLA, permanent failure, transient retry, queue, AI summary, AI follow-up, clinical refusal, management brief, Partner attribution and ownership isolation.

This is executable synthetic capability, not evidence of a live Zoho tenant or deployed Preview integration. Live Preview CRM E2E remains blocked on approved Preview-only credentials, approved Zoho field/picklist mappings, a durable idempotency reservation and an authorised operator surface.

## Approval position

- **CRM:** READY FOR PREVIEW foundation; KEEP GATED for real persistence.
- **AI Operations:** READY FOR PREVIEW synthetic safety validation; KEEP GATED pending model/provider, privacy, prompt and human-review approval.
- **Ling 2.0:** READY FOR NEXT APPROVAL as an architecture; KEEP GATED until an approved knowledge corpus and public-content reviews exist.
- **Management Intelligence:** READY FOR PREVIEW synthetic aggregates; KEEP GATED pending authoritative data sources, access review and metric approval.

Production activation, credentials, real data, external sends and public AI are explicitly outside T6.12.
