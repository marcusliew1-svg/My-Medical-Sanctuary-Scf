import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { createRequire } from "node:module";

const root = process.cwd();
const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("typescript");
const cache = new Map();
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), "utf8");

function loadTsModule(relativePath) {
  const absolute = path.resolve(root, relativePath);
  if (cache.has(absolute)) return cache.get(absolute).exports;
  const output = ts.transpileModule(read(relativePath), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }, fileName: absolute,
  }).outputText;
  const module = { exports: {} }; cache.set(absolute, module);
  const localRequire = (specifier) => specifier.startsWith("@/")
    ? loadTsModule(path.join("src", `${specifier.slice(2)}.ts`))
    : nodeRequire(specifier);
  const context = vm.createContext({ module, exports: module.exports, require: localRequire, process, URL, Date, setTimeout, clearTimeout });
  vm.runInContext(`(function(exports, require, module){${output}\n})(module.exports, require, module);`, context);
  return module.exports;
}

const configuration = loadTsModule("src/lib/zohoCommercialConfiguration.ts");
const adapter = loadTsModule("src/lib/crmZohoAdapter.ts");

function completeEnv() {
  const mapping = Object.fromEntries(configuration.zohoCommercialCanonicalFields.map((field) => [field, `Tenant_${field}`]));
  return {
    ZOHO_CLIENT_ID: "synthetic-id", ZOHO_CLIENT_SECRET: "synthetic-secret", ZOHO_REFRESH_TOKEN: "synthetic-refresh",
    ZOHO_DC: "com", ZOHO_LEADS_MODULE_API_NAME: "Tenant_Leads", ZOHO_ORGANIZATION_ID: "1000000001",
    ZOHO_CRM_OWNER_ID: "2000000001", ZOHO_DAY_ONE_COMMERCIAL_CRM_APPROVED: "true",
    ZOHO_LEADS_FIELD_MAPPING_APPROVED: "true", ZOHO_LEADS_FIELD_MAPPING_JSON: JSON.stringify(mapping),
    ZOHO_LEAD_SOURCE_TAXONOMY_JSON: '["Synthetic Preview"]',
    ZOHO_LEAD_STATUS_PICKLIST_JSON: '["New Enquiry","Contacted","Not Proceeding"]',
    ZOHO_LOSS_REASON_PICKLIST_JSON: '["Synthetic test complete"]',
    ZOHO_DEDUPE_FIELDS_JSON: '["Tenant_idempotencyKey","Tenant_email","Tenant_mobile"]',
  };
}

test("Zoho is recorded as the Day-1 commercial authority while Production remains separately gated", () => {
  const register = read("docs/t6-15-operator-zoho-live-preview-closure.md");
  assert.match(register, /authoritative destination for MMS commercial leads/);
  assert.match(register, /does not authorize Production credentials/);
  assert.match(register, /Do not call Zoho until all required configuration passes readiness validation/);
});

test("live Zoho readiness fails closed without every credential, tenant decision, mapping and picklist", () => {
  const result = configuration.zohoDayOneCommercialReadiness({});
  assert.equal(result.ready, false);
  for (const name of ["ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN", "ZOHO_DC", "ZOHO_LEADS_MODULE_API_NAME", "ZOHO_ORGANIZATION_ID", "ZOHO_CRM_OWNER_ID"])
    assert.ok(result.blockers.some((blocker) => blocker.includes(name)));
  assert.ok(result.blockers.some((blocker) => blocker.includes("ZOHO_LEADS_FIELD_MAPPING_JSON")));
});

test("complete tenant-verified Preview configuration is accepted without hard-coded custom API names", () => {
  const result = configuration.zohoDayOneCommercialReadiness(completeEnv());
  assert.equal(result.ready, true);
  assert.equal(result.blockers.length, 0);
  assert.equal(result.fieldMapping.partnerId, "Tenant_partnerId");
  const source = read("src/lib/crmZohoAdapter.ts");
  for (const invented of ["MMS_Partner_ID", "MMS_Referral_Code", "MMS_Next_Action", "MMS_Idempotency_Key"])
    assert.doesNotMatch(source, new RegExp(invented));
});

test("mapping contains the full administrative contract and excludes clinical categories", () => {
  for (const field of ["source", "utmSource", "utmMedium", "utmCampaign", "partnerId", "referralCode", "nextAction", "reasonLost", "contactConsentVersion", "idempotencyKey"])
    assert.ok(configuration.zohoCommercialCanonicalFields.includes(field));
  for (const prohibited of ["diagnosis", "medicalHistory", "prescriptions", "medication", "labResults", "doctorNotes", "treatmentSuitability", "clinicalImages"])
    assert.equal(configuration.zohoCommercialCanonicalFields.includes(prohibited), false);
});

test("operator provisioning register requires supported admin tooling and operations-only app metadata", () => {
  const register = read("docs/t6-15-operator-zoho-live-preview-closure.md");
  assert.match(register, /auth\.admin\.createUser/);
  assert.match(register, /"operator_roles": \["operations"\]/);
  assert.match(register, /Do not insert into `auth\.users` with SQL/);
  assert.match(register, /Do not place either authorization value in `user_metadata`/);
});

test("adapter refuses execution when tenant-approved mapping is missing", async () => {
  const fake = {
    async findDuplicates() { return { recordIds: [], matchedByEmail: false, matchedByPhone: false }; },
    async create() { throw new Error("must not be reached"); },
    async update() { throw new Error("must not be reached"); },
  };
  const crm = new adapter.CrmZohoAdapter({ transport: fake, retryBaseDelayMs: 0, sleep: async () => {} });
  await assert.rejects(() => crm.upsert({
    sourceRequestId: "t615-missing-mapping",
    lead: {
      name: "Synthetic T6.15", email: "synthetic.t615@example.invalid", source: "Synthetic Preview",
      leadStatus: "New Enquiry", contactConsentTimestamp: "2026-09-27T00:00:00.000Z",
      contactConsentVersion: "SYNTH-T6.15-v1", marketingConsent: false,
      sourceConsentEvidence: "Synthetic Preview fixture", doNotContact: false,
    },
  }), /Approved tenant Zoho field mapping is required/);
});


test("T6.46 operations readiness cannot report ready with Zoho blocked", () => {
  const source = read("src/app/api/internal/operations/readiness/route.ts");
  assert.match(source, /const ready = databaseReady && zoho\.ready;/);
  assert.match(source, /status: ready \? "ready" : "degraded"/);
  assert.match(source, /zohoCommercial: \{/);
});
