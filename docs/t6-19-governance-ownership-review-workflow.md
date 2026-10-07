# T6.19 — Governance Ownership & Controlled Document Review Workflow

**Status:** PREVIEW DATABASE VALIDATED / APPLICATION BUILD PENDING  
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


## Preview database validation — 2026-10-07

Migration `mms_governance_document_review_workflow` was applied successfully to the dedicated MMS Preview branch `mms-preview-auth` / `tfwnlmmdrkkfrtmawpma`.

Post-migration state:
- governance documents: **32**
- `WORKING_DRAFT`: **32**
- `REVIEW`: **0**
- `APPROVED` / `EFFECTIVE`: **0**
- rows with fabricated named owner/reviewer/approver identities: **0**

The migration therefore changed the control structure without manufacturing governance evidence or changing any existing document status.

Supabase security advisor continues to report RLS-enabled/no-policy informational findings on the governance schema. This is the existing intentional fail-closed design: direct public/anon/authenticated grants remain revoked. The existing leaked-password-protection Auth warning also remains outstanding and is not introduced by T6.19.

Performance advisor reports the two new ownership/reviewer indexes as unused, which is expected immediately after creation and before live operator workflow traffic.
