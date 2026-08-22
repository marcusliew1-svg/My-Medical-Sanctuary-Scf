# MMS Release Runbook

This runbook is the controlled path from the current draft/stacked branches to Preview validation and, only after explicit approval, production release.

## Release invariants

- MMS commercial data must remain isolated from iPivot and from clinical/patient systems.
- The permanent Supabase target is project `mzdvcchausgqmcxnwbsy` under the standalone MMS organisation.
- Do not use the older MMS project under the iPivot organisation for production runtime configuration.
- Production feature gates remain off until their stated release gates pass.
- Partner identity and internal operator identity are separate authorization domains.
- A cancelled/refunded membership has zero eligible commission; paid attributable commission must be reversible/recoverable.
- No production merge, production feature enablement, secret entry or destructive infrastructure deletion is part of this runbook without explicit approval.

## Phase 1 — standalone database completion

1. Read the Supabase migration ledger on `mzdvcchausgqmcxnwbsy`.
2. Confirm whether migration 0002 is already present before executing any DDL.
3. Apply only missing repository migrations in order through 0021.
4. Reconcile the repository migration manifest, including the historical 0015 filename discrepancy if still present.
5. Apply the dedicated MMS commercial runtime-role provisioning.
6. Verify least-privilege grants, RLS policies and required function execution rights.
7. Run the structural probe for required migrations, tables and functions.
8. Run Supabase security advisors; resolve all ERROR/WARN findings before activation.
9. Run performance advisors and classify informational unused-index findings separately from correctness/security issues.

## Phase 2 — Preview environment configuration

Configure Preview only first:

- `MMS_COMMERCIAL_DATABASE_URL` -> standalone MMS database/pooler credential.
- `MMS_COMMERCIAL_DATABASE_SCHEMA=mms_commercial`.
- `MMS_COMMERCIAL_DATABASE_ENABLED=true` for the controlled Preview test only.
- Required internal API/service token configured server-side.
- Partner Supabase Auth URL/publishable configuration points to standalone MMS.
- Operator Supabase Auth server configuration points to standalone MMS.
- `MMS_OPERATOR_ACCESS_ENABLED=false` until operator users/metadata are provisioned and the auth smoke tests are ready.
- `MMS_PARTNER_HUB_ENABLED=false` until Partner users/metadata are provisioned and the Partner smoke tests are ready.
- Zoho live mode remains disabled until the approved MMS organisation ID, server credentials and field mapping are verified.

Production remains fail-closed during all Preview work.

## Phase 3 — identity provisioning

### Partner accounts

Authorization comes only from server-controlled `app_metadata.partner_id`.

A valid Supabase account without an approved Partner ID must not enter protected Partner Hub routes.

### Operator accounts

Authorization comes only from server-controlled:

- `app_metadata.operator_id`
- `app_metadata.operator_roles`

Supported roles are operations, finance, admin and auditor.

Partner metadata must never grant operator access.

Finance-sensitive mutations require recent step-up authentication.

## Phase 4 — Preview smoke tests

### Public and framework

- Home page returns 200.
- Core public routes return expected content.
- Mobile navigation opens/closes and restores focus.
- No unexpected 5xx responses in Preview runtime logs.

### Partner trust boundary

- Anonymous request to protected Partner Hub is denied/redirected.
- Valid Supabase user without `partner_id` is denied.
- Valid approved Partner can access only Partner-scoped commercial data.
- Partner cannot access `/operations` or Finance APIs.

### Operator trust boundary

- Anonymous request to `/operations` is denied/redirected.
- Valid Partner identity does not become an operator.
- Operations role can access permitted operational views only.
- Finance role can access Finance views/actions requiring that role.
- Auditor is read-only.
- Finance step-up is required for approval/payout/reversal actions.
- Logout invalidates the backing Supabase session and clears operator cookies.

### Commercial workflow

Exercise one synthetic/non-clinical commercial record end to end:

1. Register Partner lead.
2. Confirm ownership/duplicate rules.
3. Submit Partner application/commercial application path as applicable.
4. Record payment submission.
5. Finance verifies payment from persisted evidence.
6. Prepare membership.
7. Activate membership.
8. Create eligible commission under the approved effective-dated rule.
9. Hold/release if applicable.
10. Approve commission.
11. Record payout.
12. Cancel/refund membership and verify full attributable reversal/clawback behavior.
13. Confirm immutable audit/workflow/commission event history throughout.

No clinical information should be entered into this test flow.

## Phase 5 — proposed code release order

Technical foundation first:

1. PR #26 — Next.js 15 security baseline.
2. PR #22 — operator security foundation.
3. Retarget PR #23 to `main` after #22 is merged; re-run CI/Preview; then release Operations Console.
4. Retarget PR #24 after #23 is merged; re-run CI/Preview; then release Commission Control Centre.
5. PR #25 — Partner Supabase Auth / Zoho boundary, only after standalone database and Partner Preview tests pass.

Public-site changes remain independent:

- PR #27 multilingual core journey — requires visual and medical-language review.
- PR #28 Ling trust UX / membership clarity — requires visual review.
- PR #29 enquiry hardening — keep persistence off until Zoho and shared rate limiting are ready.

## Phase 6 — production gates

Before any production feature enablement:

- Production code/deployment is green.
- Standalone database probe passes.
- Security advisors are acceptable with no unresolved security errors.
- Runtime role is least privilege.
- Partner/operator role boundaries are tested.
- Production environment points only at standalone MMS infrastructure.
- Feature gates are enabled one capability at a time, followed by smoke tests and runtime-log review.

## Phase 7 — old project retirement

The older MMS Supabase project under the iPivot organisation must remain intact until:

- standalone MMS production cutover is complete;
- production smoke tests pass;
- rollback is no longer required;
- explicit destructive-action approval is given.

Only then should deletion/retirement be considered.
