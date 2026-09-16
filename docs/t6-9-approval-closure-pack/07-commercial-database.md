# Pack 07 — Commercial Database

Owner group: DBA, Security, application owner, Privacy, Operations and QA. Current state: **BLOCKED**. The commercial database gate remains off.

## Approval checklist

| Item | Current status | Required value/evidence | Approver |
| --- | --- | --- | --- |
| Production pooler | **BLOCKED** | Production/main pooler host/ref, TLS mode, pooling mode/limits and safe fingerprint | DBA + Security |
| `MMS_COMMERCIAL_DATABASE_URL` | **BLOCKED** | Write-only Production connection secret; no Preview/iPivot ref; custodian and rotation/revocation owner | DBA + Security |
| Least-privilege role | **BLOCKED** | Dedicated application role, no ownership/superuser/bypass-RLS, login/rotation rules | DBA + Security |
| Schema | **BLOCKED** | Exact `mms_commercial`, owner and search-path controls | DBA + application owner |
| Migration manifest | **BLOCKED** | Exact expected migrations, checksums, application order and rollback/forward-fix decision | DBA + application owner |
| Grants | **BLOCKED** | Object/function/sequence grants matrix; deny unrelated schemas and public defaults | DBA + Security |
| RLS | **BLOCKED** | RLS/policy inventory, ownership/tenant predicates, wrong-user/wrong-Partner tests and advisor results | DBA + Security + Privacy |
| Backup | **BLOCKED** | Schedule, retention, encryption, access, monitoring and RPO | DBA + Security + Privacy |
| Restore | **BLOCKED** | Non-Production restore drill, integrity checks, RTO result and responsible roles | DBA + Operations |
| Application E2E | **BLOCKED** | Connection/read/write/transaction/session/revocation/isolation/failure evidence with approved synthetic non-clinical data | QA + application owner + DBA |

Do not record the connection string in this pack. Record secret-store location, safe host/project fingerprint, role name if approved non-secret, rotation date and evidence ID.

## Security assertions

- No Production database credential is exposed through `NEXT_PUBLIC_` or client code.
- Exposed schemas require explicit grants and RLS; authentication alone is not authorization.
- Authorization data remains in server-controlled app metadata and authoritative database records, not `user_metadata`.
- Views and functions receive an explicit security-invoker/definer review; privileged functions are not left publicly executable.
- Backup/restore evidence excludes clinical data and uses approved synthetic/non-sensitive validation.

## Gate and rollback boundary

Keep `MMS_COMMERCIAL_DATABASE_ENABLED` absent or `false`. After pack approval, adding the Production-only secret and schema value plus disabled-gate connectivity/E2E requires separate write approval. Rollback removes/rotates the credential, terminates sessions as required and keeps the gate off.

## Approval form

Decision: `[ ] APPROVE CONFIG/E2E PREPARATION  [ ] REJECT  [ ] RETURN FOR CHANGES`  
Pooler/role evidence ID: `<REQUIRED>`  
Migration/grants/RLS evidence ID: `<REQUIRED>`  
Backup/restore/E2E evidence IDs: `<REQUIRED>`  
Approver names/capacities and dates: `<REQUIRED>`

