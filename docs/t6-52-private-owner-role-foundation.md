# T6.52 — Private Owner Role Foundation

This checkpoint adds the `owner` operator identity role to existing role parsing and session validation. It is **exclusive**: it cannot be combined with admin, operations, finance or auditor.

The new role is intentionally **not** treated as an implicit operational administrator. Existing operator API permissions remain unchanged. The purpose is to establish a separate identity class for future owner-only views, not to provision or activate accounts.

## Target web-based hierarchy
- Private Level 0: UBO oversight, dedicated owner-only portal and non-operational governance actions (not yet built).
- Level 1: delegated executive administrator responsible for routine business operations (not yet provisioned).
- Existing operations/finance/auditor roles: continue under existing policy.

## Follow-up requirements before any live assignment
Build protected owner-only routes and server-side identity masking; review all staff-facing email exposures and exported reports; implement safe delegation and revocation; perform real login/UAT; verify Supabase Auth trusted app metadata through an authorized administrative operation. Do not promise invisibility from identity-provider or privileged infrastructure administrators.

Production and clinical data remain untouched. No users or metadata were changed. Production launch is still NO-GO.
