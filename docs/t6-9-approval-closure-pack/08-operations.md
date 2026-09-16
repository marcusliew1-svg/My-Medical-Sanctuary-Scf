# Pack 08 — Operations

Owner group: Operations, Clinic Manager role, Support, Security, Privacy, Medical, SRE and Release Management. Current state: **PARTIALLY READY FOR APPROVAL**. Person names remain intentionally blank until staffing is finalized.

## Role approval forms

| Role/decision | Provisional model | Required completion | Status |
| --- | --- | --- | --- |
| Clinic Manager charter | Monitor/acknowledge/assign booking enquiries; escalate persistence/email/Auth failures; monitor unresolved patient support; own SLA reporting; escalate privacy/medical issues | Named primary/backup, coverage, queue access, training, authority and signed non-clinical boundary | **READY FOR APPROVAL** |
| Proposed SLA package | 1 business-hour acknowledgement; 30-minute detected failure escalation; same-business-day access issue; urgent clinical issues outside website support | Operating hours/calendar, clock definitions, exclusions, destinations, reporting cadence and signatures | **READY FOR APPROVAL** |
| Incident owner | Role not finalized | Named primary/backup, severity matrix, decision rights, on-call path and tabletop | **BLOCKED** |
| Privacy incident owner | Role not finalized | Named Privacy lead/backup, breach assessment/notification path and tabletop | **BLOCKED** |
| Patient support owner | Clinic Manager is provisional first line | Named primary/backup, identity verification, queue/SLA, privacy/medical escalation and drill | **BLOCKED** |
| Partner support owner | Not supplied | Named primary/backup, commercial/Auth escalation, access and drill | **BLOCKED** |
| Monitoring owner | Clinic Manager may consume booking/email/Auth operational alerts | Named technical owners/backups, alert destinations, thresholds, redaction/retention and test pages | **BLOCKED** |
| Rollback owner | Not supplied | Named release/technical primary/backup, authority, runbooks, credential revocation and rollback drill | **BLOCKED** |

## Clinic Manager charter for signature

The Clinic Manager role:

- monitors the new booking/enquiry queue;
- acknowledges valid enquiries;
- assigns valid enquiries to the appropriate clinic/doctor workflow;
- escalates failed persistence, email or Auth issues;
- monitors unresolved patient-support requests;
- owns operational SLA reporting; and
- escalates privacy or medical issues to the appropriate responsible person.

The Clinic Manager has no clinical decision authority. The role must not diagnose, clinically triage, prescribe, recommend treatment or determine clinical urgency. Urgent clinical issues do not use the website support workflow and must be directed to the separately approved clinical/emergency pathway.

## Proposed SLA form

| Service | Proposed target | Final approved target | Clock/calendar definition | Primary/backup | Escalation | Approver |
| --- | --- | --- | --- | --- | --- | --- |
| Booking/enquiry acknowledgement | Within 1 business hour during operating hours | `<REQUIRED>` | `<REQUIRED>` | `<REQUIRED>` | `<REQUIRED>` | `<REQUIRED>` |
| Unresolved booking failure | Within 30 minutes once detected | `<REQUIRED>` | `<REQUIRED>` | `<REQUIRED>` | `<REQUIRED>` | `<REQUIRED>` |
| Patient account access | Same business day | `<REQUIRED>` | `<REQUIRED>` | `<REQUIRED>` | `<REQUIRED>` | `<REQUIRED>` |
| Urgent clinical issue | Outside website support; approved pathway | `<REQUIRED>` | `N/A` | `<REQUIRED>` | `<APPROVED PATHWAY>` | Medical + Legal |

All targets remain **PROPOSED** until this form is completed and signed.

## Named-owner signature block

Repeat for each role above:

| Field | Completion |
| --- | --- |
| Accountable role | `<REQUIRED>` |
| Primary person | `<REQUIRED; not invented>` |
| Backup person | `<REQUIRED; not invented>` |
| Contact/on-call route | `<REQUIRED; keep sensitive details out of Git>` |
| Authority and exclusions | `<REQUIRED>` |
| Evidence/tabletop ID | `<REQUIRED>` |
| Approver name/capacity | `<REQUIRED>` |
| Effective/review date | `<REQUIRED>` |

Approval of this pack does not enable any Production gate or grant clinical authority.

