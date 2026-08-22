# Partner Hub Legacy Reconciliation

This note reconciles the original Partner Hub Phase 1 work in PR #2 with the current MMS commercial architecture. PR #2 must not be merged directly into current production branches.

## Superseded by the modern transactional commercial stack

The following PR #2 concepts are now implemented more safely in the dedicated MMS commercial PostgreSQL workflow and should not be copied back as in-memory or caller-driven logic:

- atomic lead registration and duplicate/ownership handling;
- Partner certification and commercial eligibility gating;
- application, payment, membership and commission state transitions;
- commission eligibility calculation and effective-dated rule selection;
- zero commission on cancelled/refunded memberships and full reversal/recovery where required;
- immutable commercial workflow and commission event history;
- database-backed concurrency and idempotency controls.

The database remains the source of truth for these rules. Zoho is an operational mirror, not the authoritative transaction store.

## Preserved legacy controls

### MMS-only Zoho organisation boundary

Implemented in `src/lib/mmsZohoBoundary.ts`.

Any future live Zoho write adapter must call the boundary immediately before writing. Live writes fail closed unless the MMS Zoho organisation identifier and server-side credentials are configured and `MMS_CRM_DEBUG=false`. This prevents an MMS Partner Hub process from being treated as ready for writes when it could target an unintended Zoho tenant.

### Partner Hub production-readiness gate

Implemented in `src/lib/partnerHubReadiness.ts`.

The environment-level gate checks the current architecture rather than PR #2's obsolete configuration names: Partner Hub feature gate, standalone MMS Supabase Auth configuration, dedicated commercial database runtime configuration, internal service token, explicit MMS Zoho organisation boundary and Zoho live-write boundary.

Environment readiness is necessary but not sufficient for launch. Production activation still additionally requires:

1. The standalone MMS Supabase project is fully migrated and verified.
2. Partner authorization is derived only from server-controlled `app_metadata.partner_id`.
3. The dedicated MMS commercial database passes the structural/security probe, including all required migrations.
4. Demo/QA bootstrap access is disabled in production.
5. Zoho field mapping and the actual MMS organisation identifier are independently verified before debug mode is disabled.
6. Payment verification has an approved source of truth; browser-provided payment evidence is never treated as verified.
7. Cancellation/refund handling produces zero commission and reverses/recovers already-paid commission as required.
8. No clinical or patient medical data is stored in the Partner Hub commercial database.
9. Preview smoke tests pass before any production feature gate is enabled.

## Identity boundary

Partner identity and internal operator identity remain separate authorization domains:

- Partner Hub: Supabase user + server-controlled `app_metadata.partner_id`.
- Operations / Finance: Supabase user + server-controlled `app_metadata.operator_id` and `app_metadata.operator_roles`, with step-up for sensitive Finance actions.

Having one Supabase account does not automatically grant both permissions.

## PR #2 retirement rule

The two remaining PR #2 controls have now been represented in the modern Partner-auth branch. Keep PR #2 open only until these new controls pass branch CI/review. After that, PR #2 can be closed without merging.
