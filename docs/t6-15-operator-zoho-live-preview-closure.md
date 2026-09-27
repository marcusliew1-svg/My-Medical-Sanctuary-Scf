# T6.15 Operator + Zoho Live Preview Closure

## Decision and boundary

Zoho CRM is the approved Day-1 authoritative destination for MMS commercial leads. MMS operational persistence supports queue execution, audit, idempotency and management aggregation; it does not replace the authoritative Zoho commercial lead record. This decision does not authorize Production credentials, Production fields or Production activation.

All records in this pilot must be clearly synthetic and commercial/administrative. Diagnosis, medical history, prescriptions, medication, laboratory results, doctor notes, treatment suitability, clinical images and other clinical data are prohibited.

## Preview operator provisioning

Provision one synthetic user using the Supabase Dashboard **Authentication > Users > Add user** flow or the server-only `auth.admin.createUser` API. Do not insert into `auth.users` with SQL. Use a secure synthetic address and password kept outside Git, tickets and chat, auto-confirm only when explicitly approved for this Preview test, and set server-controlled metadata to:

```json
{
  "operator_id": "operator-synthetic-t615",
  "operator_roles": ["operations"]
}
```

Do not place either authorization value in `user_metadata`. Do not grant `finance`, `admin`, `auditor`, clinical or Partner roles. After testing, retain or remove the identity according to the approved Preview test-account policy; revoke its sessions before removal.

## Required Preview Zoho configuration

The CRM owner must create or designate a non-Production Zoho organization and enter these values only in the branch-scoped Vercel Preview configuration. Secret values must not be copied into this register or logs.

| Configuration | Required decision/evidence |
| --- | --- |
| `ZOHO_CLIENT_ID` | Preview-only OAuth client with the minimum approved CRM scope |
| `ZOHO_CLIENT_SECRET` | Matching Preview-only secret, stored as a Vercel secret |
| `ZOHO_REFRESH_TOKEN` | Preview-only refresh token, stored as a Vercel secret |
| `ZOHO_DC` | Exact tenant data centre suffix confirmed from the Zoho account |
| `ZOHO_ORGANIZATION_ID` | Exact non-Production organization ID |
| `ZOHO_CRM_OWNER_ID` | Exact approved synthetic/default Clinic Manager owner ID |
| `ZOHO_LEADS_MODULE_API_NAME` | Exact API name returned by the tenant module metadata endpoint |
| `ZOHO_DAY_ONE_COMMERCIAL_CRM_APPROVED=true` | Records the Day-1 business decision for this Preview configuration |
| `ZOHO_LEADS_FIELD_MAPPING_JSON` | Tenant-exported mapping from canonical keys below to exact field API names |
| `ZOHO_LEADS_FIELD_MAPPING_APPROVED=true` | Set only after CRM owner review of the tenant metadata |
| `ZOHO_LEAD_SOURCE_TAXONOMY_JSON` | Approved non-empty JSON string array |
| `ZOHO_LEAD_STATUS_PICKLIST_JSON` | Approved non-empty JSON string array |
| `ZOHO_LOSS_REASON_PICKLIST_JSON` | Approved non-empty JSON string array |
| `ZOHO_DEDUPE_FIELDS_JSON` | Approved non-empty JSON string array of exact tenant API names |

Collection sequence:

1. In the non-Production Zoho tenant, record the DC and organization ID.
2. Use the Zoho CRM module/fields metadata API or an administrator export to obtain the exact Leads module and field API names, data types, mandatory flags, uniqueness settings and picklist values.
3. Designate the synthetic Preview owner and record its Zoho record ID.
4. Review OAuth scopes for read/create/update access to the approved Leads module only; do not grant unrelated administrative access.
5. Obtain client ID, secret and refresh token through the approved Zoho OAuth process and store them directly as branch-scoped Vercel secrets.
6. Enter the non-secret mapping/taxonomy JSON as branch-scoped Preview configuration, approve it, redeploy Preview and run the controlled E2E.

## Canonical MMS to Zoho field register

No tenant metadata was available when this register was prepared. Consequently, no exact Zoho API name is asserted below. “Standard candidate” means the business concept normally has a standard Zoho Leads field, but its exact API name, type and required status must still be verified from this tenant. Every other row is a missing custom-field decision until verified.

| MMS canonical value | Classification | Exact tenant API name | Approval required |
| --- | --- | --- | --- |
| First and last name | Standard candidate | **UNVERIFIED** | Tenant metadata and required-field rules |
| Email | Standard candidate | **UNVERIFIED** | Tenant metadata; dedupe approval |
| Mobile | Standard candidate | **UNVERIFIED** | Tenant metadata; normalization and dedupe approval |
| Country | Standard candidate | **UNVERIFIED** | Tenant metadata/type |
| Preferred location | Missing custom-field decision | **UNVERIFIED** | Field/type and permitted values |
| Preferred language | Missing custom-field decision | **UNVERIFIED** | Field/type and approved values |
| Source | Standard candidate | **UNVERIFIED** | Lead-source taxonomy/picklist |
| UTM source | Missing custom-field decision | **UNVERIFIED** | Field/type |
| UTM medium | Missing custom-field decision | **UNVERIFIED** | Field/type |
| UTM campaign | Missing custom-field decision | **UNVERIFIED** | Field/type |
| Referral code | Missing custom-field decision | **UNVERIFIED** | Field/type/indexing |
| Partner ID | Missing custom-field decision | **UNVERIFIED** | Field/type/indexing |
| Landing page | Missing custom-field decision | **UNVERIFIED** | Field/type |
| Broad interest category | Missing custom-field decision | **UNVERIFIED** | Picklist requiring approval |
| Programme interest | Missing custom-field decision | **UNVERIFIED** | Picklist requiring approval |
| Preferred contact channel | Missing custom-field decision | **UNVERIFIED** | Picklist requiring approval |
| Assigned owner | Standard candidate | **UNVERIFIED** | Owner record and assignment rule |
| Next action | Missing custom-field decision | **UNVERIFIED** | Field/type or approved task-module design |
| Next action due | Missing custom-field decision | **UNVERIFIED** | Date/time type and timezone rule |
| Commercial lead status | Standard candidate | **UNVERIFIED** | Lifecycle-to-picklist reconciliation |
| Conversion status | Missing custom-field decision | **UNVERIFIED** | Field/type and approved values |
| Reason lost | Missing custom-field decision | **UNVERIFIED** | Loss-reason picklist approval |
| Contact-consent timestamp | Missing custom-field decision | **UNVERIFIED** | Date/time type and retention approval |
| Contact-consent version | Missing custom-field decision | **UNVERIFIED** | Field/type and privacy approval |
| Do not contact | Missing custom-field decision | **UNVERIFIED** | Boolean field and suppression process |
| MMS idempotency key | Missing custom-field decision | **UNVERIFIED** | Unique field and dedupe approval |

The application consumes these exact canonical JSON keys: `firstName`, `lastName`, `email`, `mobile`, `country`, `preferredLocation`, `preferredLanguage`, `source`, `utmSource`, `utmMedium`, `utmCampaign`, `referralCode`, `partnerId`, `landingPage`, `broadInterestCategory`, `programmeInterest`, `preferredContactChannel`, `assignedOwner`, `nextAction`, `nextActionDue`, `leadStatus`, `conversionStatus`, `reasonLost`, `contactConsentTimestamp`, `contactConsentVersion`, `doNotContact`, and `idempotencyKey`.

## Controlled Preview evidence gate

Do not call Zoho until all required configuration passes readiness validation. The controlled E2E must prove create, read-back, exact replay without duplication, update, owner, source/UTM/Partner/referral attribution, next action/due, approved status transition, transient retry, permanent failure classification and secret-safe logs. Cleanup or retention of the synthetic Zoho record requires the CRM owner’s explicit policy.

Production remains separately gated and requires Production-only credentials and approval.
