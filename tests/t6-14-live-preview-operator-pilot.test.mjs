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
    if (specifier.startsWith("@/")) return loadTsModule(path.join("src", `${specifier.slice(2)}.ts`));
    return nodeRequire(specifier);
  };
  const context = vm.createContext({ module, exports: module.exports, require: localRequire, process, URL, Date, setTimeout, clearTimeout });
  vm.runInContext(`(function(exports, require, module){${output}\n})(module.exports, require, module);`, context);
  return module.exports;
}

const features = loadTsModule("src/lib/featureGates.ts");
const runtime = loadTsModule("src/lib/crmPreviewRuntime.ts");
const ling = loadTsModule("src/lib/lingConcierge.ts");
const corpus = loadTsModule("src/data/lingApprovedPreviewCorpus.ts");

test("T6.14 gates activate only in synthetic Preview and remain production-safe", () => {
  const preview = {
    VERCEL_ENV: "preview",
    MMS_SYNTHETIC_DATA_ONLY: "true",
    MMS_CRM_PERSISTENCE_ENABLED: "true",
    MMS_CLINIC_MANAGER_QUEUE_ENABLED: "true",
    MMS_MANAGEMENT_INTELLIGENCE_ENABLED: "true",
    MMS_AI_OPERATIONS_ASSISTANT_ENABLED: "true",
    MMS_LING_PUBLIC_CONCIERGE_ENABLED: "true",
  };
  assert.equal(runtime.crmPreviewRuntimeReadiness(preview).ready, true);
  for (const name of ["crmPersistence", "clinicManagerQueue", "managementIntelligence", "aiOperationsAssistant", "lingPublicConcierge"])
    assert.equal(features.isMmsFeatureEnabled(name, preview), true);
  assert.equal(features.isMmsFeatureEnabled("crmPersistence", { ...preview, VERCEL_ENV: "production", MMS_CRM_PERSISTENCE_ENABLED: "false" }), false);
  assert.equal(features.isMmsFeatureEnabled("crmPersistence", { ...preview, MMS_SYNTHETIC_DATA_ONLY: "false" }), false);
});

test("retained live QA is synthetic, idempotent, audit-linked and non-clinical", () => {
  const qa = read("database/qa/016_crm_live_preview_e2e.sql");
  assert.match(qa, /Synthetic T6\.14 Preview Operator/);
  assert.match(qa, /t614-live-preview-key/);
  assert.match(qa, /on conflict \(scope,key_hash\) do nothing/);
  for (const event of ["enquiry_created", "assign", "next_action", "contact", "escalate", "close"])
    assert.match(qa, new RegExp(`'${event}'`));
  assert.match(qa, /operator-synthetic-t614/);
  assert.match(qa, /'AI Advisory',true/);
  assert.doesNotMatch(qa, /diagnosis|medical_history|doctor_notes|lab_values|prescription/i);
});

test("operator access keeps trusted metadata, least roles and expiring sessions", () => {
  const identity = read("src/lib/operatorIdentity.ts");
  const security = read("src/lib/operatorSecurity.ts");
  assert.match(identity, /app_metadata\?\.operator_id/);
  assert.match(identity, /app_metadata\?\.operator_roles/);
  assert.match(identity, /Math\.min\(Math\.max\(Math\.floor\(raw\), 300\), 3600\)/);
  assert.match(security, /Operator session has expired/);
  assert.match(security, /Auditor access is read-only/);
  assert.match(security, /roles\.includes\("admin"\)/);
  assert.doesNotMatch(identity, /user_metadata\?\.operator/);
});

test("Ling serves approved journey content and excludes expired or unapproved records", () => {
  const journey = ling.answerLingConcierge({
    question: "What happens in the membership journey?", topic: "membership-journey", locale: "en",
    records: corpus.lingApprovedPreviewCorpus, now: "2026-09-27",
  });
  assert.equal(journey.status, "answered");
  assert.match(journey.contentReferences[0], /LING-PREVIEW-JOURNEY-001/);
  const baseline = corpus.lingApprovedPreviewCorpus[0];
  const excluded = ling.answerLingConcierge({
    question: "Tell me", topic: "excluded", locale: "en", now: "2026-09-27",
    records: [
      { ...baseline, contentId: "EXPIRED", topic: "excluded", reviewExpiry: "2026-09-26" },
      { ...baseline, contentId: "DRAFT", topic: "excluded", state: "Draft" },
    ],
  });
  assert.equal(excluded.status, "handoff");
});

test("Zoho execution remains fail-closed without the complete approved credential set", () => {
  const zoho = read("src/lib/zohoCrm.ts");
  for (const name of ["ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN"])
    assert.match(zoho, new RegExp(name));
  assert.match(zoho, /process\.env\.ZOHO_DC \|\| "com"/);
});
