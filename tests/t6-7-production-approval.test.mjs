import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.resolve(root, file), "utf8");
const pack = read("docs/t6-7-production-configuration-approval.md");

test("T6.7 approval register covers all 22 required decisions", () => {
  for (let id = 1; id <= 22; id += 1) assert.match(pack, new RegExp(`\\| ${id} \\|`));
  for (const column of ["Decision required", "Current state", "Proposed state", "Owner", "Evidence", "Launch block", "Codex", "Human approval", "Rollback"])
    assert.match(pack, new RegExp(column));
});

test("T6.7 records every requested Production variable without exposing values", () => {
  for (const name of ["MMS_SITE_URL", "NEXT_PUBLIC_SITE_URL", "MMS_PRODUCTION_CANONICAL_APPROVED", "MMS_PATIENT_SUPABASE_URL", "MMS_PATIENT_SUPABASE_PUBLISHABLE_KEY", "MMS_PATIENT_PORTAL_ENABLED", "MMS_PATIENT_REGISTRATION_ENABLED", "MMS_PARTNER_SUPABASE_URL", "MMS_PARTNER_SUPABASE_PUBLISHABLE_KEY", "MMS_PARTNER_HUB_ENABLED", "MMS_COMMERCIAL_DATABASE_URL", "MMS_COMMERCIAL_DATABASE_SCHEMA", "MMS_COMMERCIAL_DATABASE_ENABLED", "MMS_BOOKING_PRODUCTION_APPROVED", "MMS_BOOKING_PERSISTENCE_ENABLED", "MMS_CRM_DEBUG", "ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN"])
    assert.match(pack, new RegExp(name));
  assert.doesNotMatch(pack, /sb_secret_[A-Za-z0-9]+|service_role\s*=|postgres(?:ql)?:\/\/[^<\s]+:[^@\s]+@/i);
});

test("T6.7 preserves direct token-hash callback contracts", () => {
  assert.match(pack, /token_hash=\{\{ \.TokenHash \}\}&type=signup/);
  assert.match(pack, /token_hash=\{\{ \.TokenHash \}\}&type=recovery/);
  assert.match(pack, /must not use the default confirmation URL variable/i);
});

test("T6.7 change sets cover groups A through H and require rollback and validation", () => {
  for (const group of ["A\. Domain/canonical", "B\. Supabase Auth", "C\. SMTP", "D\. Patient Auth", "E\. Partner Auth", "F\. Commercial database", "G\. Zoho/booking", "H\. Monitoring/operations"])
    assert.match(pack, new RegExp(group));
  for (const field of ["System", "Setting", "Current", "Proposed", "Scope", "Dependency", "Risk", "Rollback", "Validation"])
    assert.match(pack, new RegExp(field));
});

test("T6.7 trusted metadata workflow authorizes only app metadata", () => {
  assert.match(pack, /app_metadata\.partner_id/);
  assert.match(pack, /app_metadata\.account_type = "patient"/);
  assert.match(pack, /Never authorize from `user_metadata`/);
  for (const action of ["Approver", "Provisioner", "Suspension", "Revocation", "Audit evidence", "Emergency revocation"])
    assert.match(pack, new RegExp(action));
});

test("T6.7 remains an approval-only no-go pack", () => {
  assert.match(pack, /T6\.7 RESULT: PASS WITH BLOCKERS/);
  assert.match(pack, /Overall recommendation: \*\*NO-GO\*\*/);
  assert.match(pack, /No Production write was executed/);
  assert.match(pack, /Partner Hub.*KEEP GATED/);
  assert.match(pack, /My Sanctuary.*KEEP GATED/);
});
