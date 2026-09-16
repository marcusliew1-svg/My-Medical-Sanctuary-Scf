import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const packDir = path.resolve(root, "docs/t6-9-approval-closure-pack");
const read = (file) => fs.readFileSync(path.join(packDir, file), "utf8");
const index = read("README.md");
const files = [
  "01-entity-legal.md",
  "02-final-domain.md",
  "03-smtp-email.md",
  "04-medical-licensing.md",
  "05-booking-crm.md",
  "06-patient-partner-auth.md",
  "07-commercial-database.md",
  "08-operations.md",
];

test("T6.9 contains eight separate owner approval packs and a consolidated tracker", () => {
  for (const file of files) {
    assert.ok(fs.existsSync(path.join(packDir, file)), `${file} must exist`);
    assert.match(index, new RegExp(file.replaceAll(".", "\\.")));
  }
  assert.match(index, /## Consolidated approval tracker/);
  for (const id of ["LEG-01", "DOM-01", "SMTP-01", "MED-01", "BOOK-01", "AUTH-01", "DB-01", "OPS-01"])
    assert.match(index, new RegExp(id));
});

test("entity and legal pack has every counsel-ready field and required checklist column", () => {
  const legal = read("01-entity-legal.md");
  for (const column of ["Field", "Current status", "Value required", "Approver", "Evidence required", "Blocking impact"])
    assert.match(legal, new RegExp(column));
  for (const field of [
    "Final legal entity name", "Registration number", "Registered address", "Business/contact address",
    "Privacy contact", "Data controller identity", "Jurisdiction/governing law", "Retention policy",
    "Processors/recipients", "Cross-border handling", "Complaints process", "Deletion process",
    "Consent withdrawal process", "Marketing consent", "Patient communications consent",
  ]) assert.match(legal, new RegExp(field, "i"));
  assert.match(legal, /pending incorporation/i);
});

test("domain pack derives exact placeholders without choosing a Production host", () => {
  const domain = read("02-final-domain.md");
  for (const token of [
    "MMS_SITE_URL", "NEXT_PUBLIC_SITE_URL", "Canonical", "Sitemap", "Robots", "hreflang", "x-default",
    "Open Graph", "JSON-LD", "Supabase Auth Site URL", "callback allow-list", "type=signup", "type=recovery",
  ]) assert.match(domain, new RegExp(token, "i"));
  assert.match(domain, /https:\/\/<FINAL_MMS_HOST>/);
  assert.match(domain, /does not choose it/i);
  assert.match(domain, /default `\{\{ \.ConfirmationURL \}\}`/);
});

test("SMTP pack keeps provisional sender portable and requires delivery evidence", () => {
  const smtp = read("03-smtp-email.md");
  assert.match(smtp, /`info@scf\.center` is a \*\*provisional candidate only\*\*/i);
  for (const item of ["Transactional provider", "Sender domain", "Sender address/name", "SPF", "DKIM", "DMARC", "Bounce handling", "Complaint handling", "Rate limits", "Signup E2E", "Recovery E2E"])
    assert.match(smtp, new RegExp(item, "i"));
  assert.match(smtp, /separate from application code and templates/i);
});

test("medical and operations packs retain the online-doctor and clinical-authority boundaries", () => {
  const medical = read("04-medical-licensing.md");
  const operations = read("08-operations.md");
  for (const item of ["Operating entity", "Clinic licensing status", "Telemedicine status", "Clinician roster", "Medical-content approver", "Regulatory/legal approver", "Pre-opening marketing"])
    assert.match(medical, new RegExp(item, "i"));
  assert.match(medical, /`\/online-doctor` remains unavailable and noindex/);
  assert.match(operations, /Clinic Manager has no clinical decision authority/i);
  assert.match(operations, /All targets remain \*\*PROPOSED\*\*/);
});

test("booking, auth and database packs enumerate exact credentials while keeping gates off", () => {
  const booking = read("05-booking-crm.md");
  const auth = read("06-patient-partner-auth.md");
  const database = read("07-commercial-database.md");
  for (const name of ["ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN", "ZOHO_ORGANIZATION_ID", "ZOHO_CRM_OWNER_ID", "MMS_CRM_DEBUG"])
    assert.match(booking, new RegExp(name));
  for (const name of ["MMS_PATIENT_SUPABASE_URL", "MMS_PATIENT_SUPABASE_PUBLISHABLE_KEY", "MMS_PARTNER_SUPABASE_URL", "MMS_PARTNER_SUPABASE_PUBLISHABLE_KEY"])
    assert.match(auth, new RegExp(name));
  assert.match(auth, /Never authorize from `user_metadata`/);
  assert.match(database, /MMS_COMMERCIAL_DATABASE_URL/);
  assert.match(database, /exact `mms_commercial`/i);
  assert.match(database, /Keep `MMS_COMMERCIAL_DATABASE_ENABLED` absent or `false`/);
});

test("T6.9 stays approval-only, lists future writes, and remains no-go", () => {
  assert.match(index, /T6\.9 RESULT: PASS WITH BLOCKERS/);
  assert.match(index, /No P0 is closed/);
  assert.match(index, /## Production writes that become executable only after approval/);
  assert.match(index, /Feature-gate activation and Production deployment are deliberately excluded/);
  assert.match(index, /Partner Hub:\*\* \*\*NO-GO \/ KEEP GATED\*\*/);
  assert.match(index, /My Sanctuary and patient registration:\*\* \*\*NO-GO \/ KEEP GATED\*\*/);
  assert.match(index, /Booking persistence:\*\* \*\*NO-GO \/ KEEP GATED\*\*/);
  assert.match(index, /MMS Production launch:\*\* \*\*NO-GO\*\*/);
  assert.match(index, /No Production deployment, configuration write, DNS change or feature-gate activation was performed/);
});

test("T6.9 documents secret-safe collection and never contains credential-looking values", () => {
  const corpus = [index, ...files.map(read)].join("\n");
  assert.match(corpus, /Secrets are entered only into the approved write-only secret store/i);
  assert.doesNotMatch(corpus, /sb_secret_[A-Za-z0-9]+|service_role\s*[=:]\s*[^<\s]+|postgres(?:ql)?:\/\/[^<\s]+:[^@\s]+@/i);
});
