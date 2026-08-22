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

## Legacy controls worth preserving

### MMS-only Zoho organisation boundary

Any future live Zoho write adapter must verify that it is writing to the approved MMS Zoho organisation before leaving debug/mock mode. A missing or mismatched organisation identifier must fail closed. Do not permit an MMS Partner Hub process to write into an iPivot CRM organisation or any other Zoho tenant.

### Partner Hub production-readiness gate

Partner Hub should be considered production-ready only when all of the following are true:

1. The standalone MMS Supabase project is fully migrated and verified.
2. Partner authentication is configured against the standalone MMS Supabase project.
3. Partner authorization is derived only from server-controlled `app_metadata.partner_id`.
4. The dedicated MMS commercial database is enabled and passes the structural/security probe.
5. Demo/QA bootstrap access is disabled in production.
6. Zoho live-write mode remains disabled until the MMS organisation boundary and field mapping are verified.
7. Payment verification has an approved source of truth; browser-provided payment evidence is never treated as verified.
8. Cancellation/refund handling produces zero commission and reverses/recoveries already-paid commission as required.
9. No clinical or patient medical data is stored in the Partner Hub commercial database.
10. Preview smoke tests pass before any production feature gate is enabled.

## Identity boundary

Partner identity and internal operator identity remain separate authorization domains:

- Partner Hub: Supabase user + server-controlled `app_metadata.partner_id`.
- Operations / Finance: Supabase user + server-controlled `app_metadata.operator_id` and `app_metadata.operator_roles`, with step-up for sensitive Finance actions.

Having one Supabase account does not automatically grant both permissions.

## PR #2 retirement rule

Keep PR #2 open only as a historical/reference branch until the Zoho organisation-boundary control and consolidated Partner Hub readiness checks are implemented in the modern stack. Once those two remaining controls are represented and verified, PR #2 can be closed without merging.
