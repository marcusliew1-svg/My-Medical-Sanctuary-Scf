# T6.49 — First MMS Preview Administrator Provisioning

**Status:** CODE IMPLEMENTED, CI/Preview PENDING; USER ROLE NOT ACTIVATED.

## Target
MMS Preview Supabase project `tfwnlmmdrkkfrtmawpma` only; pre-existing, confirmed Auth identity `marcusliew1@gmail.com`, UID `495e204f-e68c-4a23-96da-fc20644ed900`.

Proposed trusted app metadata: `operator_id=MMS-ADMIN-001`, `operator_roles=["admin","operations"]`. Do not replace existing `provider`, `providers`, or other Auth app metadata.

## Safe execution process
The restricted **local-only** script `scripts/t6-49-provision-preview-admin.mjs` uses Supabase Auth Admin endpoints, never direct SQL writes to `auth.users`. No public API route is exposed. It refuses non-preview project URLs, unexpected user IDs/emails and conflicting roles. The default mode fetches the user and prints a non-secret **dry-run** result; it does not write.

Running `--execute` additionally requires documented independent approval, an approval evidence reference, and an authorized local MMS Preview service-role credential. The executing operator must verify the authorized credential scope out of band. It then updates **only** `app_metadata` through Supabase Auth Admin and reads back the result. Do not supply a service-role token in chat, GitHub, screenshot or Vercel public variables.

Required environment variable **names** (values must be set privately in the authorized local execution environment): `MMS_SUPABASE_PROJECT_REF`, `MMS_SUPABASE_URL`, `MMS_SUPABASE_SERVICE_ROLE_KEY`, `MMS_OPERATOR_TARGET_USER_ID`, `MMS_OPERATOR_TARGET_EMAIL`; for execution, `MMS_OPERATOR_PROVISIONING_APPROVED=true`, `MMS_OPERATOR_APPROVER_ID`, `MMS_OPERATOR_APPROVAL_REFERENCE`.

## Required proof before closure
- CI and Vercel Preview success.
- Independent privileged-role approver and written reason/evidence.
- Authorized dry-run and then approved execution; retain only redacted logs.
- Read-only query confirms trusted app metadata for exactly one intended user.
- Real password-based operator login and `/operations` access demonstrate the intended role; Finance-sensitive operations still require step-up and separate policy checks.
- Account billing warning, Preview Vercel environment permissions and dedicated MMS Zoho active connection reviewed separately.

**NO-GO** for Production/clinical activation. This change does not provision an account, set credentials, grant live access or constitute operator UAT.
