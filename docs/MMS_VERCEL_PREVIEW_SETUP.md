# MMS Vercel Preview Setup

Use **Preview scope only** for this phase. Do not add or change Production-scoped secrets while running this checklist.

Never paste database passwords, session secrets, Zoho secrets or private service credentials into chat, source control or public issue/PR comments.

## Stage A — configure values with all access gates off

Add these Preview-scoped values first:

### Commercial database

- `MMS_COMMERCIAL_DATABASE_URL` — server-only standalone MMS PostgreSQL connection/pooler URL for project `mzdvcchausgqmcxnwbsy`.
- `MMS_COMMERCIAL_DATABASE_SCHEMA=mms_commercial`
- `MMS_COMMERCIAL_DATABASE_ENABLED=false`

### Partner Supabase Auth

- `NEXT_PUBLIC_SUPABASE_URL` — standalone MMS project API URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — standalone MMS publishable key only; never use a service-role/secret key here.
- `MMS_PARTNER_HUB_ENABLED=false`
- `MMS_PARTNER_HUB_QA_BOOTSTRAP_ENABLED=false`

### Internal operator Supabase Auth

- `MMS_OPERATOR_SUPABASE_URL` — standalone MMS project API URL.
- `MMS_OPERATOR_SUPABASE_PUBLISHABLE_KEY` — standalone MMS publishable key, server configuration only.
- `MMS_OPERATOR_SESSION_SECRET` — at least 32 random bytes, server-only.
- `MMS_OPERATOR_SESSION_MAX_AGE_SECONDS=900`
- `MMS_OPERATOR_STEP_UP_MAX_AGE_SECONDS=600`
- `MMS_OPERATOR_ACCESS_ENABLED=false`

### Internal service

- `MMS_INTERNAL_API_TOKEN` — high-entropy server-only token used by protected internal commercial diagnostics/service APIs.

If controlled legacy Finance service diagnostics are needed later, configure `MMS_FINANCE_API_TOKEN` separately. Do not share either token with Partner/browser clients.

### Zoho boundary — keep live writes off

For Preview boundary validation only:

- `ZOHO_ORGANIZATION_ID` — configured MMS Zoho target ID.
- `MMS_ZOHO_EXPECTED_ORGANIZATION_ID` — independently approved MMS Zoho organisation ID. It must exactly equal the runtime target before live-write readiness can pass.
- `MMS_CRM_DEBUG=true`

Do **not** disable CRM debug mode merely to make a readiness indicator green. Zoho live-write readiness is separate from Partner Hub core readiness.

## Stage B — deploy fail-closed

After the values above are present, trigger/re-run the relevant Preview deployments while these remain false:

- `MMS_COMMERCIAL_DATABASE_ENABLED=false`
- `MMS_OPERATOR_ACCESS_ENABLED=false`
- `MMS_PARTNER_HUB_ENABLED=false`
- `MMS_PARTNER_HUB_QA_BOOTSTRAP_ENABLED=false`
- `MMS_CRM_DEBUG=true`

Confirm builds are green and no new Preview runtime errors appear.

## Stage C — enable database in Preview only

Set:

- `MMS_COMMERCIAL_DATABASE_ENABLED=true`

Redeploy Preview and run the protected database readiness/smoke diagnostic using the server-side internal token through an approved test path.

Expected structural baseline:

- migrations 0001 through 0021;
- 22 required base tables;
- 17 required functions;
- `idempotency_keys` present;
- `reject_immutable_mutation` present;
- `touch_updated_at` present.

If the application probe disagrees with this verified baseline, stop and inspect the application probe before changing the database.

## Stage D — provision synthetic identities

Use `docs/MMS_PREVIEW_IDENTITY_PROVISIONING.md`.

Provision only synthetic/non-clinical test accounts. Authorization metadata is administrator/server controlled:

Partner:

- `app_metadata.partner_id`

Operator:

- `app_metadata.operator_id`
- `app_metadata.operator_roles`

Do not use `user_metadata` for authorization.

## Stage E — operator Preview test

Set Preview only:

- `MMS_OPERATOR_ACCESS_ENABLED=true`

Test anonymous denial/login, Operations/Finance/Admin/Auditor role boundaries, Finance step-up, metadata revocation and logout. Keep Partner Hub disabled during the initial operator test.

## Stage F — Partner Hub Preview test

After operator tests are stable, set Preview only:

- `MMS_PARTNER_HUB_ENABLED=true`

Keep:

- `MMS_PARTNER_HUB_QA_BOOTSTRAP_ENABLED=false`
- `MMS_CRM_DEBUG=true`

Test anonymous denial/login, user-without-`partner_id` denial, Partner scoping, cross-Partner denial, logout and Partner-vs-operator separation.

## Stage G — synthetic commercial workflow

Run one end-to-end non-clinical workflow:

Partner lead → application → payment submission → Finance verification → membership preparation → activation → commission eligibility → approval → payout → cancellation/refund → reversal/clawback.

Verify immutable event history and check Vercel Preview runtime logs after the flow.

## Stop conditions

Do not continue to production if any of the following occurs:

- database probe mismatch;
- Partner can read another Partner's data;
- Partner metadata grants operator access;
- operator metadata grants Partner access unexpectedly;
- Auditor can mutate;
- Finance-sensitive action succeeds without required step-up;
- cancellation/refund leaves eligible commission or fails required reversal;
- runtime logs expose SQL, credentials, database host details or sensitive commercial data;
- any clinical/patient data enters the commercial workflow.

Production remains unchanged until explicit production release approval is given after all Preview checks pass.
