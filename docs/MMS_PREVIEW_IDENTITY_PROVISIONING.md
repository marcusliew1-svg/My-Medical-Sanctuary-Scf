# MMS Preview Identity Provisioning

Use synthetic, non-clinical accounts only. These identities exist to validate authorization boundaries in Vercel Preview after the standalone MMS database/Auth environment is configured.

## Trust-domain rules

- Partner authorization comes only from Supabase `app_metadata.partner_id`.
- Internal operator authorization comes only from Supabase `app_metadata.operator_id` and `app_metadata.operator_roles`.
- `user_metadata` is never an authorization source.
- A Partner account must not gain Operations/Finance access merely because it is a valid Supabase user.
- An operator account must not gain Partner Hub access merely because it is a valid Supabase user.
- Do not use real customer, patient or clinical identities/data for these tests.

## Minimum Preview test identities

### 1. Partner — authorised

Server-controlled app metadata:

```json
{
  "partner_id": "<synthetic approved MMS Partner ID>"
}
```

Expected access:

- Partner Hub routes for that Partner only.
- Partner-scoped leads/applications/commercial status only.

Expected denial:

- `/operations` and internal Finance/operator surfaces.
- Data belonging to any other Partner ID.

### 2. Authenticated user — no MMS authorization metadata

Server-controlled app metadata contains neither Partner nor operator authorization fields.

Expected access:

- Public website only.

Expected denial:

- Partner Hub protected content.
- Operations/Finance protected content.

### 3. Operations operator

```json
{
  "operator_id": "<synthetic operator ID>",
  "operator_roles": ["operations"]
}
```

Expected access:

- Operations views permitted to the operations role.

Expected denial:

- Finance-only actions.
- Partner Hub merely by virtue of operator status.

### 4. Finance operator

```json
{
  "operator_id": "<synthetic operator ID>",
  "operator_roles": ["finance"]
}
```

Expected access:

- Finance views/actions allowed to Finance.

Additional requirement:

- Approval, payout, reversal and other Finance-sensitive mutations require recent password step-up.

### 5. Administrator

```json
{
  "operator_id": "<synthetic operator ID>",
  "operator_roles": ["admin"]
}
```

Expected access:

- Administrator-permitted Operations/Finance capabilities according to route policy.

Admin status must not bypass:

- backing Supabase identity revalidation;
- same-origin mutation controls;
- Finance step-up requirements where enforced by the application;
- immutable audit attribution.

### 6. Auditor

```json
{
  "operator_id": "<synthetic operator ID>",
  "operator_roles": ["auditor"]
}
```

Expected access:

- Read-only operational/Finance projections intended for audit.

Expected denial:

- All commercial mutations.

## Negative authorization tests

Run all of these before release:

1. Put a Partner ID only in `user_metadata`: Partner Hub must deny access.
2. Put operator roles only in `user_metadata`: Operations must deny access.
3. Remove `partner_id` from an active Partner account: the next protected request must fail closed.
4. Remove/change operator roles from an active operator: subsequent protected requests must reflect the new server-owned metadata and fail closed where authorization was removed.
5. Give a Partner account no operator metadata and request `/operations`: deny.
6. Give an operator account no Partner metadata and request protected Partner Hub data: deny.
7. Auditor attempts every mutation endpoint: deny.
8. Finance attempts a sensitive mutation without recent step-up: deny.
9. Finance completes password step-up as the same Supabase identity: protected action is permitted only within the configured step-up window.
10. Logout: backing Supabase session is revoked/cleared as implemented and application cookies no longer authorize protected requests.

## Synthetic commercial workflow identity usage

Use the authorised synthetic Partner to create the test commercial record. Use Operations/Finance identities to process it through the lifecycle. Keep all names, emails, phone numbers and payment references synthetic/non-clinical.

The target flow is:

Partner lead → application → payment submission → Finance verification → membership preparation → activation → commission eligibility → approval → payout → cancellation/refund → reversal/clawback.

Do not enter medical history, diagnosis, treatment suitability, laboratory information or other clinical/patient data into the commercial workflow.
