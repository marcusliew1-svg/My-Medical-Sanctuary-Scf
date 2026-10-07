# T6.19 — Governance Ownership & Controlled Document Review Workflow

**Status:** IMPLEMENTED IN CODE / PREVIEW VALIDATION REQUIRED  
**Scope:** Preview only. Production/main remain untouched.

## Objective

Close the next machine-controllable governance gap identified by the MMS OS implementation register: accountable document ownership and evidence-backed review/approval workflow.

T6.19 does **not** invent people, approvals or authority. No named owner, reviewer or approver is fabricated.

## Controls introduced

1. Governance documents gain explicit `owner_id`, `reviewer_id`, `approver_id`, `approval_reference`, `review_requested_at`, `approved_at` and `retired_at` fields.
2. `WORKING_DRAFT -> REVIEW` requires a named owner and named reviewer.
3. `REVIEW -> APPROVED` requires a named owner, named reviewer, named approver, approver role and approval evidence reference.
4. `APPROVED -> EFFECTIVE` is the only route to EFFECTIVE and retains the same approval evidence.
5. Direct `WORKING_DRAFT -> APPROVED/EFFECTIVE` shortcuts are rejected.
6. Database checks fail closed if REVIEW/APPROVED/EFFECTIVE records lack required identities/evidence.
7. Existing audit-event capture remains mandatory for mutations.
8. Production capability gates and clinical activation remain outside this workflow.

## Permitted lifecycle

`WORKING_DRAFT -> REVIEW -> APPROVED -> EFFECTIVE -> SUPERSEDED -> RETIRED`

Controlled return paths:
- `REVIEW -> WORKING_DRAFT`
- `APPROVED -> REVIEW`

Retirement is allowed from non-retired states when an authorized operator records the reason.

## Human evidence boundary

T6.19 creates the mechanism only. A document must remain `WORKING_DRAFT` until real accountable identities are supplied. It must not move to `APPROVED` or `EFFECTIVE` unless the approval evidence reference points to genuine human approval evidence.

## Preview validation

Required before T6.19 is considered Preview-complete:

- apply migration `0032_mms_governance_document_review_workflow.sql` to dedicated MMS Preview branch only;
- verify all existing documents remain valid and unchanged in `WORKING_DRAFT`;
- confirm zero fabricated owner/reviewer/approver identities were inserted;
- run T6.19 regression tests;
- confirm Vercel Preview build is READY;
- confirm Production/main remain untouched.

## Production boundary

This phase grants no Production authority, changes no Production gate, activates no clinical service and does not itself approve any governance document.
