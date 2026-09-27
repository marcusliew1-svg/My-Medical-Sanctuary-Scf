import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { createRequire } from "node:module";
import { productionReadinessErrors } from "../scripts/production-preflight.mjs";

const root = process.cwd();
const req = createRequire(import.meta.url);
const ts = req("typescript");
const read = (file) => fs.readFileSync(path.resolve(root, file), "utf8");
function load(file, cache = new Map()) { const absolute = path.resolve(root, file); if (cache.has(absolute)) return cache.get(absolute).exports; const js = ts.transpileModule(read(file), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, fileName: absolute }).outputText; const mod = { exports: {} }; cache.set(absolute, mod); const local = (id) => id.startsWith("@/") ? load(path.join("src", `${id.slice(2)}.ts`), cache) : req(id); vm.runInNewContext(`(function(exports,require,module){${js}\n})`, { require: local })(mod.exports, local, mod); return mod.exports; }

const safeProduction = {
  VERCEL_ENV: "production",
  NEXT_PUBLIC_SITE_URL: "https://mms.example.com",
  MMS_SITE_URL: "https://mms.example.com",
  MMS_PRODUCTION_CANONICAL_APPROVED: "true",
  MMS_PRODUCTION_LEGAL_APPROVED: "true",
};

test("T6.6 Production build fails closed on missing approval and temporary canonical", () => {
  const errors = productionReadinessErrors({ VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL: "https://www.scf.center", MMS_SITE_URL: "https://www.scf.center" });
  assert.ok(errors.some((error) => error.includes("temporary scf.center")));
  assert.ok(errors.some((error) => error.includes("CANONICAL_APPROVED")));
  assert.ok(errors.some((error) => error.includes("LEGAL_APPROVED")));
  assert.equal(productionReadinessErrors({ VERCEL_ENV: "preview" }).length, 0);
  assert.equal(productionReadinessErrors(safeProduction).length, 0);
});

test("T6.6 Production preflight rejects Preview/iPivot wiring and unsafe test modes", () => {
  const errors = productionReadinessErrors({ ...safeProduction, MMS_PATIENT_SUPABASE_URL: "https://tfwnlmmdrkkfrtmawpma.supabase.co", MMS_COMMERCIAL_DATABASE_URL: "postgres://x@db.saqnpgrfkblmymubkvvz.supabase.co/x", MMS_PROTOTYPE_ENABLED: "true" });
  assert.ok(errors.some((error) => error.includes("MMS Preview")));
  assert.ok(errors.some((error) => error.includes("iPivot staging")));
  assert.ok(errors.some((error) => error.includes("forbidden in Production")));
});

test("T6.6 enabled identity surfaces require isolated wiring, database and SMTP evidence", () => {
  const errors = productionReadinessErrors({ ...safeProduction, MMS_PATIENT_PORTAL_ENABLED: "true", MMS_PARTNER_HUB_ENABLED: "true" });
  for (const token of ["MMS_PATIENT_SUPABASE_URL", "MMS_PARTNER_SUPABASE_URL", "commercial database", "SMTP E2E"])
    assert.ok(errors.some((error) => error.includes(token)));
});

test("T6.6 booking uses independent Production approval and remains configuration-bound", () => {
  const persistence = load("src/lib/bookingPersistence.ts");
  const configuration = load("src/lib/zohoCommercialConfiguration.ts");
  const mapping = Object.fromEntries(configuration.zohoCommercialCanonicalFields.map((field) => [field, `Tenant_${field}`]));
  const configured = {
    VERCEL_ENV: "production", MMS_BOOKING_PERSISTENCE_ENABLED: "true", MMS_CRM_DEBUG: "false",
    ZOHO_CLIENT_ID: "id", ZOHO_CLIENT_SECRET: "secret", ZOHO_REFRESH_TOKEN: "refresh", ZOHO_DC: "com",
    ZOHO_LEADS_MODULE_API_NAME: "Tenant_Leads", ZOHO_ORGANIZATION_ID: "1000000001", ZOHO_CRM_OWNER_ID: "2000000001",
    ZOHO_DAY_ONE_COMMERCIAL_CRM_APPROVED: "true", ZOHO_LEADS_FIELD_MAPPING_APPROVED: "true",
    ZOHO_LEADS_FIELD_MAPPING_JSON: JSON.stringify(mapping), ZOHO_LEAD_SOURCE_TAXONOMY_JSON: '["Website Discovery Form"]',
    ZOHO_LEAD_STATUS_PICKLIST_JSON: '["New Enquiry"]', ZOHO_LOSS_REASON_PICKLIST_JSON: '["Synthetic test complete"]',
    ZOHO_DEDUPE_FIELDS_JSON: '["Tenant_idempotencyKey","Tenant_email","Tenant_mobile"]',
  };
  assert.equal(persistence.bookingPersistenceAvailability(configured).reason, "production_refused");
  assert.equal(persistence.bookingPersistenceAvailability({ ...configured, MMS_BOOKING_PRODUCTION_APPROVED: "true" }).ready, true);
});

test("T6.6 legal placeholders and online-doctor surfaces are non-indexable", () => {
  for (const file of ["src/app/privacy-pdpa/page.tsx", "src/app/terms/page.tsx", "src/app/cookie-notice/page.tsx", "src/app/privacy-disclaimer/page.tsx", "src/app/online-doctor/page.tsx"])
    assert.match(read(file), /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
  assert.match(read("src/components/LocalizedRegionalExperience.tsx"), /section === "online-doctor"[\s\S]*index: false/);
});

test("T6.6 online-doctor copy makes no live provider, platform or booking representation", () => {
  const source = read("src/app/online-doctor/page.tsx");
  assert.match(source, /planned pathway/i);
  assert.match(source, /not currently available/i);
  assert.doesNotMatch(source, /Google Meet|Request a session|Request Online Doctor Session|Meet an MMS doctor/);
});

test("T6.6 runbook records direct Auth callback contracts without ConfirmationURL", () => {
  const runbook = read("docs/t6-6-p0-blocker-remediation.md");
  assert.match(runbook, /token_hash=\{\{ \.TokenHash \}\}&type=signup/);
  assert.match(runbook, /token_hash=\{\{ \.TokenHash \}\}&type=recovery/);
  assert.doesNotMatch(runbook, /\.ConfirmationURL/);
  for (const heading of ["Current setting", "Proposed change", "Risk", "Rollback", "Preview impact"])
    assert.match(runbook, new RegExp(heading));
});
