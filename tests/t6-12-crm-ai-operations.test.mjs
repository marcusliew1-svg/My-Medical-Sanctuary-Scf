import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { createRequire } from "node:module";

const root = process.cwd();
const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("typescript");

function read(relativePath) {
  return fs.readFileSync(path.resolve(root, relativePath), "utf8");
}

function loadTsModule(relativePath, cache = moduleCache) {
  const absolutePath = path.resolve(root, relativePath);
  if (cache.has(absolutePath)) return cache.get(absolutePath).exports;
  const outputText = ts.transpileModule(read(relativePath), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: absolutePath,
  }).outputText;
  const module = { exports: {} };
  cache.set(absolutePath, module);
  function localRequire(specifier) {
    if (specifier.startsWith("@/")) return loadTsModule(path.join("src", `${specifier.slice(2)}.ts`), cache);
    return nodeRequire(specifier);
  }
  const context = vm.createContext({ module, exports: module.exports, require: localRequire, process, setTimeout, clearTimeout, URL, URLSearchParams, fetch, Response, Headers });
  vm.runInContext(`(function (exports, require, module) { ${outputText}\n})(module.exports, require, module);`, context);
  return module.exports;
}

const moduleCache = new Map();
const domain = loadTsModule("src/lib/crmDomain.ts");
const idempotency = loadTsModule("src/lib/crmIdempotency.ts");
const adapterModule = loadTsModule("src/lib/crmZohoAdapter.ts");
const zohoConfiguration = loadTsModule("src/lib/zohoCommercialConfiguration.ts");
const zoho = loadTsModule("src/lib/zohoCrm.ts");
const queue = loadTsModule("src/lib/clinicManagerQueue.ts");
const ai = loadTsModule("src/lib/aiOperations.ts");
const management = loadTsModule("src/lib/managementIntelligence.ts");
const features = loadTsModule("src/lib/featureGates.ts");
const syntheticFieldMapping = Object.fromEntries(
  zohoConfiguration.zohoCommercialCanonicalFields.map((field) => [field, `T6_${field}`]),
);

function lead(overrides = {}) {
  return {
    crmLeadId: "SYN-LEAD-001",
    name: "Synthetic Preview Enquiry",
    email: "synthetic.preview@example.invalid",
    mobile: "+60 11 0000 0000",
    country: "Malaysia",
    preferredLocation: "Kuala Lumpur",
    preferredLanguage: "en",
    source: "Preview synthetic test",
    campaign: "T6.12",
    utmSource: "preview",
    referralCode: "SYNTH-REF",
    partnerId: "SYNTH-PARTNER-001",
    landingPage: "/book-appointment",
    broadInterestCategory: "General programme information",
    programmeInterest: "Preventive health information",
    preferredContactChannel: "email",
    preferredContactTime: "weekday morning",
    leadStatus: "New Enquiry",
    assignedClinicManager: "Clinic Manager queue",
    nextAction: "Acknowledge enquiry",
    nextActionDue: "2026-09-17T01:00:00.000Z",
    contactConsentTimestamp: "2026-09-17T00:00:00.000Z",
    contactConsentVersion: "SYNTHETIC-T6.12-v1",
    marketingConsent: false,
    sourceConsentEvidence: "Synthetic Preview fixture",
    doNotContact: false,
    ...overrides,
  };
}

function transport(overrides = {}) {
  const calls = { find: 0, create: 0, update: 0, records: [] };
  return {
    calls,
    value: {
      async findDuplicates() { calls.find += 1; return { recordIds: [], matchedByEmail: false, matchedByPhone: false }; },
      async create(_moduleName, record) { calls.create += 1; calls.records.push(record); return "9000000000001"; },
      async update(_moduleName, _recordId, record) { calls.update += 1; calls.records.push(record); },
      ...overrides,
    },
  };
}

test("T6.12 canonical CRM lifecycle and prohibited clinical fields are explicit", () => {
  assert.deepEqual(Array.from(domain.crmLeadLifecycle), [
    "New Enquiry", "Contact Attempted", "Contacted", "Qualified", "Consultation Requested",
    "Consultation Scheduled", "Consultation Completed", "Programme Proposed", "Decision Pending", "Converted", "Not Proceeding",
  ]);
  for (const field of ["diagnosis", "medicalHistory", "medication", "labValues", "clinicalImages", "doctorNotes", "treatmentSuitability"])
    assert.equal(domain.crmProhibitedClinicalFields.includes(field), true);
  assert.match(domain.validateCrmAdministrativeLead({ ...lead(), doctorNotes: "not allowed" })[0], /not permitted/);
});

test("Preview E2E 1/3 creates a new synthetic CRM enquiry", async () => {
  const fake = transport();
  const adapter = new adapterModule.CrmZohoAdapter({ transport: fake.value, fieldMapping: syntheticFieldMapping, retryBaseDelayMs: 0, sleep: async () => {} });
  const result = await adapter.upsert({ lead: lead(), sourceRequestId: "synthetic-request-1", assignedOwnerId: "7001", nextAction: "Acknowledge" });
  assert.equal(result.action, "created");
  assert.equal(fake.calls.create, 1);
  assert.equal(fake.calls.records[0].T6_assignedOwner.id, "7001");
  assert.equal(fake.calls.records[0].T6_nextAction, "Acknowledge");
});

test("Preview E2E 2/4 dedupes and updates an existing CRM enquiry", async () => {
  const fake = transport({
    async findDuplicates() { return { recordIds: ["9000000000009"], matchedByEmail: true, matchedByPhone: false }; },
  });
  const adapter = new adapterModule.CrmZohoAdapter({ transport: fake.value, fieldMapping: syntheticFieldMapping, retryBaseDelayMs: 0, sleep: async () => {} });
  const result = await adapter.upsert({ lead: lead(), sourceRequestId: "synthetic-request-2" });
  assert.equal(result.action, "updated");
  assert.equal(fake.calls.create, 0);
  assert.equal(fake.calls.update, 1);
});

test("Preview E2E 5/6 maps assignment, referral attribution and next action", () => {
  const key = idempotency.crmIdempotencyKey({ source: "Preview", sourceRequestId: "map-1", email: lead().email });
  const record = adapterModule.mapAdministrativeLeadToZoho({
    lead: lead(), sourceRequestId: "map-1", assignedOwnerId: "7001", nextAction: "Contact", nextActionDue: "2026-09-17T02:00:00.000Z",
  }, key, syntheticFieldMapping);
  assert.equal(record.T6_assignedOwner.id, "7001");
  assert.equal(record.T6_partnerId, "SYNTH-PARTNER-001");
  assert.equal(record.T6_referralCode, "SYNTH-REF");
  assert.equal(record.T6_nextAction, "Contact");
});

test("replayed requests do not create duplicate leads", async () => {
  const fake = transport();
  const store = new idempotency.SyntheticCrmIdempotencyStore();
  const adapter = new adapterModule.CrmZohoAdapter({ transport: fake.value, fieldMapping: syntheticFieldMapping, idempotencyStore: store, retryBaseDelayMs: 0, sleep: async () => {} });
  await adapter.upsert({ lead: lead(), sourceRequestId: "same-request" });
  const replay = await adapter.upsert({ lead: lead(), sourceRequestId: "same-request" });
  assert.equal(replay.action, "replayed");
  assert.equal(fake.calls.create, 1);
});

test("Preview E2E 7/10 calculates SLA flags and produces a minimal Clinic Manager queue item", () => {
  const configuration = queue.clinicManagerSlaConfiguration({});
  assert.equal(configuration.policyStatus, "proposed");
  assert.equal(queue.calculateSlaStatus("2026-09-17T01:00:00.000Z", "2026-09-17T00:50:00.000Z", 15), "Due Soon");
  const item = queue.buildClinicManagerQueueItem(lead(), {
    createdAt: "2026-09-17T00:00:00.000Z", now: "2026-09-17T01:30:00.000Z",
  }, configuration);
  assert.equal(item.queueState, "Follow-Up Due");
  assert.equal(item.slaStatus, "Overdue");
  assert.equal("email" in item, false);
  assert.equal("mobile" in item, false);
});

test("Preview E2E 8 classifies a permanent CRM failure without retry", async () => {
  let attempts = 0;
  const fake = transport({
    async create() { attempts += 1; throw new zoho.ZohoCrmError("bad mapping", "permanent", 400, "INVALID_DATA"); },
  });
  const adapter = new adapterModule.CrmZohoAdapter({ transport: fake.value, fieldMapping: syntheticFieldMapping, retryBaseDelayMs: 0, sleep: async () => {} });
  await assert.rejects(() => adapter.upsert({ lead: lead(), sourceRequestId: "permanent" }), /bad mapping/);
  assert.equal(attempts, 1);
});

test("Preview E2E 9 retries a transient CRM failure and succeeds", async () => {
  let attempts = 0;
  const fake = transport({
    async create() {
      attempts += 1;
      if (attempts < 3) throw new zoho.ZohoCrmError("busy", "transient", 503, "SERVICE_UNAVAILABLE");
      return "9000000000010";
    },
  });
  const adapter = new adapterModule.CrmZohoAdapter({ transport: fake.value, fieldMapping: syntheticFieldMapping, retryBaseDelayMs: 0, sleep: async () => {} });
  const result = await adapter.upsert({ lead: lead(), sourceRequestId: "transient" });
  assert.equal(result.crmLeadId, "9000000000010");
  assert.equal(attempts, 3);
});

test("Preview E2E 11/12 creates advisory summary and follow-up draft", () => {
  const summary = ai.summarizeAdministrativeEnquiry(lead(), "2026-09-17T00:00:00.000Z");
  const draft = ai.draftAdministrativeFollowUp(lead(), "2026-09-17T00:00:00.000Z");
  assert.equal(summary.advisory, true);
  assert.equal(draft.requiresHumanApproval, true);
  assert.doesNotMatch(summary.text, /synthetic\.preview@example|0000 0000/);
  assert.match(draft.text, /does not provide medical advice/);
});

test("Preview E2E 14 produces a non-clinical management brief", () => {
  const snapshot = management.buildManagementPipelineSnapshot({
    observations: [{ lead: lead({ leadStatus: "Converted" }), createdAt: "2026-09-17T00:00:00.000Z", firstResponseAt: "2026-09-17T00:20:00.000Z" }],
    failures: { crmFailures: 1 }, now: "2026-09-17T02:00:00.000Z",
  });
  const brief = management.generateManagementBrief(snapshot);
  assert.equal(snapshot.partnerReferrals, 1);
  assert.equal(snapshot.conversionRate, 100);
  assert.equal(brief.requiresHumanReview, true);
  assert.doesNotMatch(JSON.stringify(brief), /diagnos|prescri|lab result|clinical assessment/i);
});

test("Preview E2E 15/16 preserves Partner attribution and strict ownership isolation", () => {
  assert.equal(domain.partnerLeadView(lead(), "SYNTH-PARTNER-002"), null);
  const own = domain.partnerLeadView(lead(), "SYNTH-PARTNER-001");
  assert.equal(own.partnerId, "SYNTH-PARTNER-001");
  for (const prohibited of ["email", "mobile", "doctorNotes", "medicalHistory", "treatmentSuitability"])
    assert.equal(prohibited in own, false);
});

test("all new gates default off and Preview requires the synthetic-only switch", () => {
  for (const feature of ["crmPersistence", "clinicManagerQueue", "aiOperationsAssistant", "lingPublicConcierge", "managementIntelligence"])
    assert.equal(features.isMmsFeatureEnabled(feature, { VERCEL_ENV: "production" }), false);
  assert.equal(features.isMmsFeatureEnabled("crmPersistence", { VERCEL_ENV: "preview", MMS_CRM_PERSISTENCE_ENABLED: "true" }), false);
  assert.equal(features.isMmsFeatureEnabled("crmPersistence", { VERCEL_ENV: "preview", MMS_CRM_PERSISTENCE_ENABLED: "true", MMS_SYNTHETIC_DATA_ONLY: "true" }), true);
});

test("controlled informational Production preflight explicitly forbids every T6.12 gate", () => {
  const preflight = read("scripts/production-preflight.mjs");
  for (const name of [
    "MMS_CRM_PERSISTENCE_ENABLED", "MMS_CLINIC_MANAGER_QUEUE_ENABLED", "MMS_AI_OPERATIONS_ASSISTANT_ENABLED",
    "MMS_LING_PUBLIC_CONCIERGE_ENABLED", "MMS_MANAGEMENT_INTELLIGENCE_ENABLED", "MMS_SYNTHETIC_DATA_ONLY",
  ]) assert.match(preflight, new RegExp(name));
});

test("AI advice cannot silently mutate authoritative CRM state", () => {
  assert.throws(() => domain.createCrmTransitionAudit({
    leadId: "SYN-LEAD-001", previousState: "New Enquiry", newState: "Contact Attempted",
    actor: { actorId: "mms-ai", actorType: "system" }, suggestionSource: "ai_advisory", appliedByHuman: false,
  }), /cannot silently mutate/);
  const audit = domain.createCrmTransitionAudit({
    leadId: "SYN-LEAD-001", previousState: "New Enquiry", newState: "Contact Attempted",
    actor: { actorId: "operator-synthetic", actorType: "operator" }, suggestionSource: "ai_advisory", appliedByHuman: true,
  });
  assert.equal(audit.appliedByHuman, true);
});
