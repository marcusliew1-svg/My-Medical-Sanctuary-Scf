# Partner Hub Legacy Reconciliation

This note reconciles the original Partner Hub Phase 1 work in PR #2 with the current MMS commercial architecture. PR #2 is closed without merge and must not be revived as a production implementation.

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

Any future live Zoho write adapter must call the boundary immediately before writing. The boundary now requires two independently configured values:

- `ZOHO_ORGANIZATION_ID` — the runtime target organisation;
- `MMS_ZOHO_EXPECTED_ORGANIZATION_ID` — the independently approved MMS organisation identifier.

Live writes fail closed unless those values match exactly, all required server-side Zoho credentials are present and `MMS_CRM_DEBUG=false`. This prevents a configured but incorrect Zoho tenant from being treated as live-write ready. Never populate the expected MMS identifier from browser input or from an iPivot/other-tenant configuration.

### Partner Hub readiness gate

Implemented in `src/lib/partnerHubReadiness.ts`.

Readiness is deliberately split into two states:

- **Partner Hub core readiness** — feature gate, standalone MMS Supabase Auth configuration, dedicated commercial database runtime configuration, internal service token, QA bootstrap disabled and exact approved Zoho organisation boundary;
- **Zoho live-write readiness** — the exact organisation boundary plus complete server credentials and debug mode explicitly disabled.

This allows Partner Hub Preview testing while Zoho remains safely in debug/no-write mode. Zoho live-write readiness is not required merely to test the core Hub.

Environment readiness is necessary but not sufficient for launch. Production activation additionally requires:

1. The standalone MMS Supabase project is fully migrated and verified through 0021.
2. Partner authorization is derived only from server-controlled `app_metadata.partner_id`.
3. The dedicated MMS commercial database passes the structural/security probe using the final 22-table / 17-function baseline.
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

## PR #2 retirement status

PR #2 is closed without merge. Its remaining useful safeguards are represented in the modern Partner-auth branch and should be maintained there rather than recovered from the legacy implementation.
