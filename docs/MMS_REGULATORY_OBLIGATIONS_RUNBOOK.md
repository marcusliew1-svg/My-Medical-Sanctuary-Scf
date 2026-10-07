# MMS Regulatory Obligations & Compliance Calendar Runbook

**Document ID:** MMS-REG-RUN-ROC-001  
**Status:** WORKING DRAFT

## Scope

This runbook governs how MMS records, reviews, owns, schedules, evidences and escalates regulatory obligations.

T6.32 does not itself determine what laws apply, verify a licence, create a statutory deadline, complete a regulator filing, or configure Production reminder automation.

## Source standard

Every ACTIVE obligation requires:
- jurisdiction;
- competent authority;
- authoritative source reference;
- accountable owner role;
- approval reference;
- applicability rationale.

A general web article, assumption, memory or vendor statement is not sufficient by itself to establish an obligation.

## Lifecycle

`DRAFT -> UNDER_REVIEW -> ACTIVE / NOT_APPLICABLE`

ACTIVE obligations may move back to review, be suspended or retired. NOT_APPLICABLE conclusions remain reviewable and require documented rationale.

## Compliance calendar

Where an authoritative source establishes a date or recurrence, the obligation record may track:
- one-time;
- monthly;
- quarterly;
- semi-annual;
- annual;
- custom;
- event-driven obligations.

A due date must not be invented where no authoritative deadline has been established.

## Completion evidence

Completion is not established merely because a calendar date passed or a reminder was dismissed.

Where an obligation is completed, the record should contain:
- completion timestamp;
- stable filing/report/renewal/notification evidence reference;
- any resulting licence/acknowledgement/reference identifier where applicable.

## Escalation

Due-soon, overdue, blocked or otherwise material obligations must remain visible and be escalated through the accountable compliance/governance process. They must not be silently reset to a future date.

## Change monitoring

Changes to:
- legal entity;
- jurisdiction;
- facility;
- clinical service;
- product;
- supplier;
- data processing;
- payment flow;
- AI use;
- public claims;
- licensing status

should trigger a review of potentially affected obligations.

## Evidence boundary

No Malaysia, Thailand, Singapore or other jurisdiction-specific obligation is seeded or asserted by T6.32. Those records require verified primary-source review and accountable approval.

## Production boundary

T6.32 does not configure regulator integrations, automated filings, reminder emails, calendar jobs, Production licence tracking, or clinical activation.
