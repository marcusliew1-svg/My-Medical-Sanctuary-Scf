#!/usr/bin/env node
// MMS Preview-only operator provisioning. No public route, no Production access.
// Dry-run by default. Never print API credentials or complete Auth metadata.
const PREVIEW_REF = "tfwnlmmdrkkfrtmawpma";
const EXPECTED_ID = "495e204f-e68c-4a23-96da-fc20644ed900";
const EXPECTED_EMAIL = "marcusliew1@gmail.com";
const OPERATOR_ID = "MMS-ADMIN-001";
const ROLES = ["admin", "operations"];

function fail(reason) { throw new Error(reason); }
export function validateProvisioningContext(env, args) {
  if (env.MMS_SUPABASE_PROJECT_REF !== PREVIEW_REF) fail("Only the explicitly approved MMS Preview project is allowed.");
  if (env.MMS_OPERATOR_TARGET_USER_ID !== EXPECTED_ID) fail("Target user ID mismatch.");
  if (env.MMS_OPERATOR_TARGET_EMAIL?.trim().toLowerCase() !== EXPECTED_EMAIL) fail("Target email mismatch.");
  if (!/^https:\/\/tfwnlmmdrkkfrtmawpma\.supabase\.co\/?$/.test(env.MMS_SUPABASE_URL || "")) fail("Unexpected MMS Preview Auth URL.");
  if (!env.MMS_SUPABASE_SERVICE_ROLE_KEY?.trim()) fail("Local MMS Preview service-role credential is required.");
  const execute = args.includes("--execute");
  if (execute) {
    if (env.MMS_OPERATOR_PROVISIONING_APPROVED !== "true") fail("Recorded approval flag is required.");
    if (!env.MMS_OPERATOR_APPROVER_ID?.trim() || env.MMS_OPERATOR_APPROVER_ID.trim() === OPERATOR_ID)
      fail("A named independent approver is required.");
    if (!env.MMS_OPERATOR_APPROVAL_REFERENCE?.trim()) fail("Approval evidence reference is required.");
  }
  if (args.some(a => a !== "--execute")) fail("Unrecognized command option.");
  return { execute, url: env.MMS_SUPABASE_URL.replace(/\/$/, ""), key: env.MMS_SUPABASE_SERVICE_ROLE_KEY };
}
export function prepareMetadata(current, email, id) {
  if (id !== EXPECTED_ID || email?.trim().toLowerCase() !== EXPECTED_EMAIL) fail("Refusing to provision wrong Auth identity.");
  if (!current || typeof current !== "object" || Array.isArray(current)) fail("Auth app_metadata is malformed.");
  if (current.operator_id && current.operator_id !== OPERATOR_ID) fail("Existing operator ID conflicts.");
  if (current.operator_roles && JSON.stringify(current.operator_roles) !== JSON.stringify(ROLES))
    fail("Existing operator roles conflict; manual review required.");
  return { ...current, operator_id: OPERATOR_ID, operator_roles: ROLES };
}
export async function provision(env, args, requester = fetch) {
  const cfg = validateProvisioningContext(env, args);
  const endpoint = cfg.url + "/auth/v1/admin/users/" + EXPECTED_ID;
  const headers = { apikey: cfg.key, Authorization: "Bearer " + cfg.key, Accept: "application/json" };
  const response = await requester(endpoint, { method: "GET", headers, cache: "no-store" });
  if (!response.ok) fail("Supabase Auth admin read failed with HTTP " + response.status);
  const user = await response.json();
  const updated = prepareMetadata(user.app_metadata || {}, user.email, user.id);
  if (!cfg.execute) return { status: "dry_run", userId: EXPECTED_ID, roles: ROLES };
  const write = await requester(endpoint, {
    method: "PUT", headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ app_metadata: updated }), cache: "no-store"
  });
  if (!write.ok) fail("Supabase Auth admin update failed with HTTP " + write.status);
  const check = await requester(endpoint, { method: "GET", headers, cache: "no-store" });
  if (!check.ok) fail("Post-write Auth verification failed.");
  const verified = await check.json();
  if (verified.id !== EXPECTED_ID || verified.email?.toLowerCase() !== EXPECTED_EMAIL ||
      verified.app_metadata?.operator_id !== OPERATOR_ID ||
      JSON.stringify(verified.app_metadata?.operator_roles) !== JSON.stringify(ROLES))
    fail("Auth post-write verification mismatch; escalation required.");
  return { status: "verified", userId: EXPECTED_ID, roles: ROLES };
}
if (process.argv[1]?.endsWith("t6-49-provision-preview-admin.mjs")) {
  provision(process.env, process.argv.slice(2)).then(v => {
    process.stdout.write(JSON.stringify(v) + "\n");
  }).catch(e => {
    process.stderr.write("MMS Preview provisioning blocked: " + e.message + "\n");
    process.exitCode = 1;
  });
}
