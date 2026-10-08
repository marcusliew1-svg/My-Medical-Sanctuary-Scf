# T6.44 — Presentation Centre Material Lifecycle Gate

**Status:** VERIFIED IN PREVIEW — INTEGRATION MERGE PENDING
**Scope:** MMS Preview/integration only; no Production or clinical activation.

## Verified gap
The first commerce migration stored material approval identity/time and effective dates but did not store the required PENDING / APPROVED / EXPIRED / WITHDRAWN states. The Partner Hub asset query filtered effective dates only. A withdrawn asset could remain visible if its effective dates were still current.

## Change
- Add an explicit constrained `approval_status` to `mms_commercial.presentation_assets`.
- Default all assets, including existing rows, to `PENDING`; do not infer approval from populated legacy fields.
- Add `approval_status = 'APPROVED'` to the server-side partner-visible asset query.
- Keep existing start/end date gates: expired assets cannot surface even if status is stale.
- Do not introduce client-controlled approval or withdrawal operations.

## Verified 2026-10-08
- GitHub CI completed successfully, including the dedicated T6.44 lifecycle regression suite.
- Vercel Preview deployment reached READY at branch commit `ce8a8204822927c0e136e8ae60b8935fbfca4763`.
- MMS Supabase Preview branch `mms-preview-auth` (`tfwnlmmdrkkfrtmawpma`) had the presentation asset table and zero asset rows prior to migration.
- Applied migration `mms_presentation_material_lifecycle_t644` to MMS Preview only, successfully.
- Independently queried the Preview schema: `approval_status` exists, is NOT NULL, defaults to PENDING, and the four-state constraint exists.
- No production database, deployment, patient clinical record or material approvals were touched.
- Transactional inserted-asset positive/negative behavior tests and real operator UAT remain outstanding; do not interpret schema validation as those tests.

## Remaining gap
A separate admin workflow must verify reviewer identity, approval and withdrawal evidence, append-only material-status events, version lineage and authorization before any status is changed to APPROVED. This branch does not claim that workflow is complete.

## Required checks
Preview migration apply and rollback rehearsal, legacy-material visibility negative test, withdrawn/expired negative tests, approved-in-window positive test, TypeScript, lint, CI and READY Vercel Preview. Never merge to Production/main.
