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
  const localRequire = (specifier) => {
    if (specifier === "server-only") return {};
    if (specifier.startsWith("@/")) {
      const candidate = path.join("src", `${specifier.slice(2)}.ts`);
      return loadTsModule(candidate);
    }
    return nodeRequire(specifier);
  };
  const context = vm.createContext({ module, exports: module.exports, require: localRequire, process, URL, Date, setTimeout, clearTimeout });
  vm.runInContext(`(function(exports, require, module){${output}\n})(module.exports, require, module);`, context);
  return module.exports;
}

const ai = loadTsModule("src/lib/aiOperations.ts");
const domain = loadTsModule("src/lib/crmDomain.ts");
const management = loadTsModule("src/lib/managementIntelligence.ts");
const ling = loadTsModule("src/lib/lingConcierge.ts");
const corpus = loadTsModule("src/data/lingApprovedPreviewCorpus.ts");
const runtime = loadTsModule("src/lib/crmPreviewRuntime.ts");

function lead(overrides = {}) {
  return {
    crmLeadId: "MMSE-synthetic001", name: "Synthetic Preview Person", email: "synthetic@example.invalid",
    source: "Synthetic Preview", partnerId: "SYNTH-PARTNER-001", referralCode: "SYNTH-REF-001",
    broadInterestCategory: "General information", preferredContactChannel: "email", leadStatus: "New Enquiry",
    nextAction: "Acknowledge enquiry", nextActionDue: "2026-09-27T01:00:00.000Z",
    contactConsentTimestamp: "2026-09-27T00:00:00.000Z", contactConsentVersion: "SYNTH-T6.13-v1",
    marketingConsent: false, sourceConsentEvidence: "Synthetic Preview fixture", doNotContact: false, ...overrides,
  };
}

test("durable schema is synthetic-only, idempotent, retry-aware and audit-immutable", () => {
  const migration = read("database/migrations/0025_mms_crm_operations_preview_pilot.sql");
  const grants = read("database/provision/006_mms_crm_operations_preview_grants.sql");
  for (const table of ["crm_idempotency_reservations", "crm_enquiries", "crm_sync_state", "crm_queue_state", "crm_audit_events"])
    assert.match(migration, new RegExp(`create table if not exists mms_commercial\\.${table}`));
  assert.match(migration, /data_classification = 'Synthetic Preview'/);
  assert.match(migration, /unique \(scope,key_hash\)/);
  assert.match(migration, /Retry Due/);
  assert.match(migration, /crm_audit_events_immutable/);
  assert.match(grants, /revoke update,delete on table mms_commercial\.crm_audit_events/);
});

test("durable store uses a transaction and row lock for replay-safe ingestion", () => {
  const store = read("src/lib/crmOperationsStore.ts");
  assert.match(store, /\.transaction\(async \(tx\)/);
  assert.match(store, /on conflict \(scope,key_hash\) do nothing/);
  assert.match(store, /for update/);
  assert.match(store, /Idempotency key was reused with a different request/);
  assert.match(store, /state='Completed'/);
});

test("synthetic enquiry endpoint requires operator mutation security and rejects ordinary identities", () => {
  const route = read("src/app/api/operations/crm/synthetic-enquiries/route.ts");
  assert.match(route, /requireOperatorMutation/);
  assert.match(route, /name\.startsWith\("Synthetic "\)/);
  assert.match(route, /email\.endsWith\("@example\.invalid"\)/);
  assert.match(route, /Synthetic Preview T6\.13/);
});

test("Preview runtime fails closed outside synthetic Vercel Preview", () => {
  assert.equal(runtime.crmPreviewRuntimeReadiness({ VERCEL_ENV: "production", MMS_SYNTHETIC_DATA_ONLY: "true" }).ready, false);
  const ready = runtime.crmPreviewRuntimeReadiness({
    VERCEL_ENV: "preview", MMS_SYNTHETIC_DATA_ONLY: "true", MMS_CRM_PERSISTENCE_ENABLED: "true", MMS_CLINIC_MANAGER_QUEUE_ENABLED: "true",
  });
  assert.equal(ready.ready, true);
});

test("Clinic Manager UI and APIs are authenticated and expose only administrative queue fields", () => {
  const ui = read("src/components/operations/CrmPilotClient.tsx");
  const route = read("src/app/api/operations/crm/queue/route.ts");
  assert.match(route, /requireOperatorRead/);
  for (const action of ["assign", "contact", "next_action", "escalate", "close"]) assert.match(ui, new RegExp(`value=\\"${action}\\"`));
  assert.doesNotMatch(ui, /diagnosis|medicalHistory|doctorNotes|labValues|treatmentSuitability/);
});

test("AI flags missing administrative detail and overdue follow-up without exposing contacts", () => {
  const missing = ai.missingAdministrativeDetails(lead({ email: undefined, mobile: undefined, preferredContactTime: undefined }));
  assert.deepEqual(Array.from(missing), ["email", "mobile", "preferred contact time"]);
  const warning = ai.overdueAdministrativeWarning(lead(), "2026-09-27T02:00:00.000Z");
  assert.equal(warning.requiresHumanApproval, true);
  assert.match(warning.text, /overdue/i);
  assert.doesNotMatch(warning.text, /synthetic@example/);
});

test("AI refuses clinical and emergency work and cannot silently apply a state change", () => {
  assert.equal(ai.refuseUnsafeAiOperationsRequest("Prescribe medication").safetyCategory, "clinical_refusal");
  assert.equal(ai.refuseUnsafeAiOperationsRequest("I have chest pain emergency").safetyCategory, "emergency_refusal");
  assert.throws(() => domain.createCrmTransitionAudit({
    leadId: "MMSE-synthetic001", previousState: "New Enquiry", newState: "Contact Attempted",
    actor: { actorId: "mms-ai", actorType: "system" }, suggestionSource: "ai_advisory", appliedByHuman: false,
  }), /cannot silently mutate/);
});

test("Ling corpus covers approved, unavailable, out-of-scope and clinical-refusal paths", () => {
  assert.ok(corpus.lingApprovedPreviewCorpus.length >= 6);
  assert.ok(corpus.lingApprovedPreviewCorpus.every((record) => record.state === "Approved" && record.approver && record.reviewExpiry));
  const approved = ling.answerLingConcierge({ question: "What is MMS?", topic: "about-mms", locale: "en", records: corpus.lingApprovedPreviewCorpus, now: "2026-09-27" });
  assert.equal(approved.status, "answered");
  assert.match(approved.contentReferences[0], /LING-PREVIEW-ABOUT-001/);
  const unavailable = ling.answerLingConcierge({ question: "Is this available?", topic: "online-doctor", locale: "en", records: corpus.lingApprovedPreviewCorpus, now: "2026-09-27" });
  assert.equal(unavailable.status, "unavailable");
  const outOfScope = ling.answerLingConcierge({ question: "Tell me more", topic: "unknown", locale: "en", records: corpus.lingApprovedPreviewCorpus, now: "2026-09-27" });
  assert.equal(outOfScope.status, "handoff");
  const clinical = ling.answerLingConcierge({ question: "Which treatment do you recommend?", topic: "about-mms", locale: "en", records: corpus.lingApprovedPreviewCorpus });
  assert.equal(clinical.status, "refused");
});

test("management dashboard reports median response time and non-clinical daily brief", () => {
  const snapshot = management.buildManagementPipelineSnapshot({
    observations: [
      { lead: lead(), createdAt: "2026-09-27T00:00:00.000Z", firstResponseAt: "2026-09-27T00:10:00.000Z" },
      { lead: lead({ partnerId: undefined }), createdAt: "2026-09-27T00:00:00.000Z", firstResponseAt: "2026-09-27T00:30:00.000Z" },
      { lead: lead({ leadStatus: "Converted" }), createdAt: "2026-09-27T00:00:00.000Z", firstResponseAt: "2026-09-27T03:00:00.000Z" },
    ], failures: { emailFailures: 1 }, now: "2026-09-27T04:00:00.000Z",
  });
  assert.equal(snapshot.medianResponseMinutes, 30);
  assert.equal("averageResponseMinutes" in snapshot, false);
  const brief = management.generateManagementBrief(snapshot);
  assert.equal(brief.requiresHumanReview, true);
  assert.ok(brief.sourcePerformance.length > 0);
  assert.ok(brief.channelPerformance.length > 0);
  assert.doesNotMatch(JSON.stringify(brief), /diagnosis|prescription|clinical KPI/i);
});

test("Partner attribution is preserved and cross-Partner access is denied", () => {
  assert.equal(domain.partnerLeadView(lead(), "SYNTH-PARTNER-002"), null);
  const own = domain.partnerLeadView(lead(), "SYNTH-PARTNER-001");
  assert.equal(own.partnerId, "SYNTH-PARTNER-001");
  assert.equal("email" in own, false);
  const store = read("src/lib/crmOperationsStore.ts");
  assert.match(store, /where partner_id=\$1/);
  assert.match(store, /public_enquiry_id,lead_status,source,partner_id,referral_code/);
});

test("Production gates remain explicitly off and Preview pilot routes are non-indexed operator routes", () => {
  const preflight = read("scripts/production-preflight.mjs");
  for (const gate of ["MMS_CRM_PERSISTENCE_ENABLED", "MMS_CLINIC_MANAGER_QUEUE_ENABLED", "MMS_AI_OPERATIONS_ASSISTANT_ENABLED", "MMS_LING_PUBLIC_CONCIERGE_ENABLED", "MMS_MANAGEMENT_INTELLIGENCE_ENABLED", "MMS_SYNTHETIC_DATA_ONLY"])
    assert.match(preflight, new RegExp(gate));
  assert.match(read("src/app/operations/layout.tsx"), /robots: \{ index: false, follow: false \}/);
});
