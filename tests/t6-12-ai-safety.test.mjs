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

function loadTsModule(relativePath) {
  const absolute = path.resolve(root, relativePath);
  if (cache.has(absolute)) return cache.get(absolute).exports;
  const output = ts.transpileModule(fs.readFileSync(absolute, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, fileName: absolute,
  }).outputText;
  const module = { exports: {} }; cache.set(absolute, module);
  const localRequire = (specifier) => specifier.startsWith("@/") ? loadTsModule(path.join("src", `${specifier.slice(2)}.ts`)) : nodeRequire(specifier);
  const context = vm.createContext({ module, exports: module.exports, require: localRequire, process });
  vm.runInContext(`(function(exports, require, module){${output}\n})(module.exports, require, module);`, context);
  return module.exports;
}

const ai = loadTsModule("src/lib/aiOperations.ts");
const knowledge = loadTsModule("src/lib/approvedKnowledgeBase.ts");
const ling = loadTsModule("src/lib/lingConcierge.ts");

test("Preview E2E 13 AI refuses diagnosis, prescription, results and suitability requests", () => {
  for (const request of [
    "Diagnose these symptoms", "Prescribe a medication", "Interpret my lab results", "Am I suitable for this treatment?",
  ]) {
    const refusal = ai.refuseUnsafeAiOperationsRequest(request, "2026-09-17T00:00:00.000Z");
    assert.ok(refusal, request);
    assert.equal(refusal.kind, "refusal");
    assert.equal(refusal.safetyCategory, "clinical_refusal");
  }
});

test("urgent clinical requests are refused and directed away from website support", () => {
  const refusal = ai.refuseUnsafeAiOperationsRequest("I have chest pain and this is an emergency");
  assert.equal(refusal.safetyCategory, "emergency_refusal");
  assert.match(refusal.text, /approved clinical or emergency pathway/);
});

test("Ling answers only from current Approved content and cites the source record", () => {
  const base = {
    contentId: "KB-SYN-001", topic: "about-mms", locale: "en", body: "MMS is an informational health platform.",
    approver: "Synthetic Review Role", approvalDate: "2026-09-01", version: "1.0", reviewExpiry: "2026-12-31",
    source: "Synthetic T6.12 fixture", availability: "informational",
  };
  const records = [
    { ...base, contentId: "KB-DRAFT", state: "Draft", body: "Unapproved draft must not appear." },
    { ...base, state: "Approved" },
  ];
  assert.equal(knowledge.publicApprovedKnowledge(records, { topic: "about-mms", locale: "en", now: "2026-09-17" }).length, 1);
  const answer = ling.answerLingConcierge({ question: "What is MMS?", topic: "about-mms", locale: "en", records, now: "2026-09-17" });
  assert.equal(answer.status, "answered");
  assert.match(answer.contentReferences[0], /KB-SYN-001 v1\.0/);
  assert.doesNotMatch(answer.answer, /Unapproved draft/);
});

test("Ling states planned services are unavailable and refuses clinical advice", () => {
  const planned = [{
    contentId: "KB-SYN-002", topic: "online-doctor", locale: "en", state: "Approved", body: "Online-doctor is planned.",
    approver: "Synthetic Review Role", approvalDate: "2026-09-01", version: "1.0", reviewExpiry: "2026-12-31",
    source: "Synthetic T6.12 fixture", availability: "planned",
  }];
  const unavailable = ling.answerLingConcierge({ question: "Is online doctor available?", topic: "online-doctor", locale: "en", records: planned, now: "2026-09-17" });
  assert.equal(unavailable.status, "unavailable");
  assert.match(unavailable.answer, /not currently available/);
  const clinical = ling.answerLingConcierge({ question: "Which treatment do you recommend?", topic: "online-doctor", locale: "en", records: planned });
  assert.equal(clinical.status, "refused");
  assert.match(clinical.answer, /cannot diagnose, recommend treatment/);
});

test("AI policies are advisory, non-clinical and human-approved", () => {
  assert.match(ai.aiOperationsSystemPolicy, /commercial and administrative work only/);
  assert.match(ai.aiOperationsSystemPolicy, /must not diagnose, prescribe/);
  assert.match(ai.aiOperationsSystemPolicy, /human operator must review and approve/);
});
