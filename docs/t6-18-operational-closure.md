# T6.18 — MMS Operational Closure & Live Preview Pilot

**Status:** PASS WITH BLOCKERS  
**Scope:** Preview only. Production/main/iPivot code and infrastructure are not authorized for modification.

## Objectives

1. Integrate the MMS OS governance foundation into the existing integration branch.
2. Confirm the Governance Console is reachable on the configured MMS Preview branch.
3. Close the Zoho tenant-discovery gap without inventing field/API names.
4. Prepare tenant-compatible CRM mapping.
5. Preserve operator-auth and Production safety boundaries.

## Completed

### MMS OS integration
- PR #50 was marked ready and merged into `mms/integration-next16-foundation`.
- Merge commit: `59068679de5146247bfc89037e74148503624f6a`.
- Vercel Preview deployment for that merge reached READY.
- `/operations/governance` returns 200 on the integration Preview branch.
- Governance Console remains noindex and behind the existing operator feature boundary.
- Production/main remain untouched.

### Zoho tenant discovery
The connected Zoho CRM organization was queried before configuring MMS credentials/mapping.

Result:
- Connected organization: **iPivot Sdn Bhd**
- Therefore this connector is **not an approved MMS tenant**.
- T6.18 must not connect MMS commercial flows to this organization.
- A separate dedicated MMS Zoho organization/connection is required.

A single synthetic Preview QA lead was created, updated, read back, and immediately deleted during connectivity verification before the organization identity was known. It contained no real patient, clinical, Partner, or commercial lead data. The wrong-tenant event is recorded in the MMS Preview governance incident/CAPA registers.

### Zoho edition capability
The connected organization reports the Free edition.
- Creating additional custom Leads fields returned field-limit errors.
- Creating a custom module returned NOT_SUPPORTED for the current edition.

Accordingly, T6.18 adds support for an explicitly approved **lean mapping** using only tenant-supported fields, while keeping the full MMS commercial record in the MMS commercial database.

A lean Zoho mapping may include only approved supported administrative fields such as:
- `First_Name`
- `Last_Name`
- `Email`
- `Mobile`
- `Country`
- `Lead_Source`
- `Lead_Status`
- optionally `Owner`

Unsupported MMS fields remain in the MMS commercial database and are not forced into unrelated Zoho fields.

### New safety gate
`ZOHO_TENANT_IDENTITY_VERIFIED=true` is now mandatory for Day-1 Zoho readiness.

This flag may only be set after the connected Zoho organization has been verified as the dedicated MMS organization. The currently connected iPivot organization does not satisfy this requirement.

## Post-merge revalidation — 2026-10-07

T6.18 was merged into `mms/integration-next16-foundation` as merge commit `94c936c8e7b571bf654e24328360487bffb92ad6`.

The remaining machine-verifiable blockers were rechecked after merge:

### Supabase operator identity
- Dedicated MMS Supabase project: `MMS` / `ywbqfkhrshmpilgzytpl`.
- Project health: `ACTIVE_HEALTHY`.
- Supported read-only inspection of `auth.users`: **0 users**.
- Therefore no trusted Preview operator identity currently exists.
- Direct SQL insertion/update of `auth.users` remains prohibited.
- The connected Supabase tooling available in this execution context does not expose a supported Auth-admin create/invite action, so T6.18 must not manufacture an operator user by database mutation.

### Vercel Preview environment access
- Vercel team: `ML` / `ml168`.
- MMS project: `my-medical-sanctuary-scf` / `prj_WMv0MvWOeseW1QoX4hqT2REJ7OIV`.
- Re-checking project environment variables for `mms/integration-next16-foundation` returned **403 Forbidden**.
- Therefore missing branch-scoped Preview variables still cannot be safely inspected or changed from this execution context.
- No Production environment variables were read or modified.

### Repository/integration state
- T6.18 PR #51 is merged.
- T6.18 lean Zoho mapping and tenant identity gate are present on the integration branch.
- Production/main remain untouched.
- No clinical service has been activated.

## Remaining blockers

### Operator identity
The MMS Supabase Preview project currently has no trusted operator user with:
```json
{
  "operator_id": "<approved-id>",
  "operator_roles": ["operations"]
}
```

Provisioning must use supported Supabase Auth admin tooling. Direct SQL writes to `auth.users` are prohibited.

### MMS Zoho organization
A dedicated MMS Zoho CRM organization or approved MMS-specific CRM connection is required. Do not reuse the connected iPivot organization for MMS.

Before `ZOHO_TENANT_IDENTITY_VERIFIED=true` is permitted, the connected organization must be positively verified as the dedicated MMS organization and the approved field mapping must be checked against that tenant's actual API metadata.

### Vercel environment management
The current Vercel connector identity returns 403 for project environment-variable list/create operations. Existing integration Preview settings are present and operator routes are reachable, but missing branch/environment values cannot be altered from this session.

### External approvals
Medical Director, legal/privacy, regulatory, licensing, insurance and jurisdiction-specific approvals remain external dependencies and are not fabricated.

## Closure criteria

T6.18 may be upgraded from **PASS WITH BLOCKERS** only when all of the following are evidenced:

1. A first MMS operator is provisioned through supported Supabase Auth administration, with authorization claims stored in trusted app metadata.
2. Operator login is demonstrated against Preview and `/operations/governance` is reachable through the intended authenticated path.
3. A dedicated MMS Zoho organization/connection is available and positively identified.
4. The tenant's actual supported Leads fields/picklists are verified and the approved lean/full mapping is recorded.
5. `ZOHO_TENANT_IDENTITY_VERIFIED=true` is set only for the verified MMS tenant.
6. Required Preview environment values are present for the integration branch through authorized Vercel configuration access.
7. External legal/privacy/Medical Director/regulatory/licensing/insurance approvals required for any corresponding capability are recorded as evidence.
8. Production/main remains unchanged unless a separate Production approval phase explicitly authorizes cutover.

## T6.18 outcome

**PASS WITH BLOCKERS**

Passed:
- OS merged to integration.
- Preview build READY.
- Governance Console route reachable.
- Zoho tenant metadata discovered.
- Wrong tenant detected and blocked.
- Synthetic Zoho connectivity CRUD demonstrated and cleaned up.
- Lean tenant-compatible mapping support implemented.
- Tenant-identity verification gate implemented.
- Post-merge Supabase and Vercel blocker state independently revalidated.
- Production/main untouched.

Blocked:
- supported creation of first MMS operator identity;
- dedicated MMS Zoho organization/connection;
- Preview environment configuration access where new values are needed;
- external human/regulatory approvals.
