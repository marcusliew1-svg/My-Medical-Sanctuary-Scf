import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.resolve(root, p), "utf8");

test("MMS OS master framework is controlled and non-activating", () => {
  const doc = read("docs/MMS_MASTER_OPERATING_SYSTEM_V1.md");
  assert.match(doc, /MMS-GOV-FRM-001/);
  assert.match(doc, /WORKING DRAFT/);
  assert.match(doc, /does not authorize any clinical service/i);
  assert.match(doc, /Code complete is not the same as approved to operate/i);
});

test("governance migration creates the complete register foundation", () => {
  const sql = read("database/migrations/0026_mms_operating_system_governance.sql");
  for (const table of [
    "governance_documents","governance_decisions","risks","controls","risk_control_links",
    "capa_actions","facilities","clinical_services","clinician_credentials","clinician_privileges",
    "suppliers","products","diagnostic_partners","ai_use_cases","launch_capabilities",
    "change_requests","audits","incidents","training_records","governance_audit_events",
  ]) assert.match(sql, new RegExp("create table if not exists mms_governance\\." + table));

  assert.match(sql, /force row level security/i);
  assert.match(sql, /revoke all on table/i);
  assert.match(sql, /from public, anon, authenticated/i);
});

test("non-active clinical services cannot be exposed downstream", () => {
  const sql = read("database/migrations/0026_mms_operating_system_governance.sql");
  assert.match(sql, /clinical_status = 'ACTIVE'\s*or \(booking_enabled = false and crm_enabled = false and partner_enabled = false and ling_enabled = false\)/i);
  assert.match(sql, /public_exposure_status <> 'PUBLIC_AVAILABLE'\s*or clinical_status = 'ACTIVE'/i);
});

test("Production capabilities remain individually gated", () => {
  const sql = read("database/migrations/0026_mms_operating_system_governance.sql");
  assert.match(sql, /'zoho_crm'.*'AMBER'.*false/s);
  assert.match(sql, /'booking_persistence'.*'RED'.*false/s);
  assert.match(sql, /'my_sanctuary'.*'RED'.*false/s);
  assert.match(sql, /'partner_hub'.*'RED'.*false/s);
  assert.match(sql, /'online_doctor'.*'RED'.*false/s);
});

test("governance QA protects RLS and immutable evidence", () => {
  const qa = read("database/qa/017_mms_operating_system_governance.sql");
  assert.match(qa, /relforcerowsecurity/);
  assert.match(qa, /unexpected direct governance grants/i);
  assert.match(qa, /immutable decision update unexpectedly succeeded/i);
  assert.match(qa, /rollback;/i);
});

test("implementation register preserves external approval blockers", () => {
  const doc = read("docs/MMS_OS_IMPLEMENTATION_REGISTER.md");
  assert.match(doc, /No Production deployment is authorized/);
  assert.match(doc, /No clinical service is marked Active/);
  assert.match(doc, /Legal, privacy, Medical Director and jurisdiction-specific approvals remain external blockers/);
});
