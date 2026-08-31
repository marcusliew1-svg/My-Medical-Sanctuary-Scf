import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const root = process.cwd();
const nodeRequire = createRequire(import.meta.url);
function load(relative, cache = new Map()) {
  const file = path.resolve(root, relative);
  if (cache.has(file)) return cache.get(file).exports;
  const source = fs.readFileSync(file, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: file,
  });
  const mod = { exports: {} };
  cache.set(file, mod);
  const req = (specifier) =>
    specifier.startsWith("@/")
      ? load(path.join("src", `${specifier.slice(2)}.ts`), cache)
      : nodeRequire(specifier);
  vm.runInNewContext(
    `(function(exports,require,module,Buffer,process){${outputText}\n})`,
    { require: req, Buffer, process },
    { filename: file },
  )(mod.exports, req, mod, Buffer, process);
  return mod.exports;
}

const migration = fs.readFileSync(
  path.resolve(root, "database/migrations/0023_mms_health_intelligence_assisted_ingestion.sql"),
  "utf8",
);
const grants = fs.readFileSync(
  path.resolve(root, "database/provision/005_mms_health_intelligence_ingestion_grants.sql"),
  "utf8",
);
const ingestionSource = fs.readFileSync(
  path.resolve(root, "src/lib/healthIntelligence/ingestionStore.ts"),
  "utf8",
);
const connectorSource = fs.readFileSync(
  path.resolve(root, "src/lib/healthIntelligence/connectorFramework.ts"),
  "utf8",
);
const publicSource = fs.readFileSync(
  path.resolve(root, "src/lib/healthIntelligence/publicReadModel.ts"),
  "utf8",
);
const apiSource = fs.readFileSync(
  path.resolve(root, "src/app/api/internal/health-intelligence/ingestion/route.ts"),
  "utf8",
);
const ingestion = load("src/lib/healthIntelligence/ingestion.ts");
const csv = load("src/lib/healthIntelligence/csvImport.ts");
const { demoProducts } = load("src/lib/healthIntelligence/demoData.ts");

const source = {
  id: "source-my",
  country: "MY",
  status: "approved",
  approvedCollectionMethods: ["csv", "api"],
  connectorActivationStatus: "approved",
};
const connector = {
  id: "connector-my",
  sourceId: "source-my",
  connectorKey: "MY-CSV",
  connectorType: "csv",
  displayName: "Controlled CSV",
  market: "MY",
  status: "approved",
  authenticationType: "none",
  environmentSecretNames: [],
  requestRatePerMinute: 10,
  timeoutMs: 1000,
  retryLimit: 2,
  failureLimit: 3,
  backoffMs: 10,
  scheduleMode: "manual",
  restrictions: "approved test only",
  consecutiveFailures: 0,
  dataClass: "demo",
};
const row = {
  observed_product_name: "Northstar A",
  ingredient: "Clarionex",
  manufacturer: "Fictional Meridian Labs",
  strength: "10 mg",
  dosage_form: "tablet",
  route: "oral",
  release_type: "immediate",
  pack: 30,
};

test("migration adds traceable batches, connector governance and immutable row lineage", () => {
  for (const term of [
    "source_connectors",
    "approved_collection_methods",
    "collection_restrictions",
    "ingestion_batch_id",
    "source_item_identifier",
    "original_source_value",
    "original_language",
    "normalization_result",
    "parsing_confidence",
    "product_resolution_result",
    "observation_signature",
    "idempotency_key",
    "observation_import_rows_lineage_immutable",
  ]) assert.match(migration, new RegExp(term));
});

test("valid, invalid and partial CSV batches are previewable without publication", () => {
  const validRow = "SRC,MY,Northstar A,Clarionex,Maker,10mg,tablet,30,84,MYR,retail_cash_price,2026-08-18,REF";
  const invalidRow = "SRC,XX,=FORMULA,Clarionex,Maker,10mg,tablet,30,-1,USD,,bad,REF";
  const valid = csv.validateObservationCsv(`${csv.IMPORT_HEADERS.join(",")}\n${validRow}`);
  const invalid = csv.validateObservationCsv(`${csv.IMPORT_HEADERS.join(",")}\n${invalidRow}`);
  const partial = csv.validateObservationCsv(`${csv.IMPORT_HEADERS.join(",")}\n${validRow}\n${invalidRow}`);
  assert.equal(valid.valid, true);
  assert.equal(invalid.valid, false);
  assert.equal(partial.rows.length, 2);
  assert.equal(partial.rows.filter((item) => item.errors.length).length, 1);
  assert.match(ingestionSource, /status: accepted \? "ready" : "failed"/);
  assert.doesNotMatch(ingestionSource, /workflowStage:\s*["']verified["']/);
});

test("CSV commit requires confirmation and imports collected unverified observations", () => {
  assert.match(ingestionSource, /Explicit import confirmation is required/);
  assert.match(ingestionSource, /basisStatus: "basis_unverified"/);
  assert.match(ingestionSource, /Imported as unverified candidate/);
  assert.match(ingestionSource, /ingestionBatchId: batch\.id/);
  assert.match(ingestionSource, /ingestionRowId: row\.id/);
  assert.match(ingestionSource, /observationSignature: row\.fingerprint/);
});

test("batch fingerprints and idempotency are stable but date-sensitive", () => {
  const first = ingestion.stableFingerprint(["source", "item", "2026-08-01", 84]);
  const replay = ingestion.stableFingerprint(["source", "item", "2026-08-01", 84]);
  const later = ingestion.stableFingerprint(["source", "item", "2026-09-01", 84]);
  assert.equal(first, replay);
  assert.notEqual(first, later);
  assert.match(ingestionSource, /idempotentReplay: true/);
});

test("approved-source connector gate allows approved methods and blocks unsafe states", () => {
  assert.equal(ingestion.connectorMayRun(connector, source).allowed, true);
  assert.ok(
    ingestion.connectorMayRun(connector, { ...source, status: "candidate" }).reasons.includes("source_not_approved"),
  );
  assert.ok(
    ingestion.connectorMayRun({ ...connector, consecutiveFailures: 3 }, source).reasons.includes("connector_failure_limit_reached"),
  );
  assert.ok(
    ingestion.connectorMayRun(connector, { ...source, approvedCollectionMethods: ["manual"] }).reasons.includes("collection_method_not_approved"),
  );
});

test("API connector keeps auth server-side and enforces pagination, timeout, retry and rate control", () => {
  assert.match(connectorSource, /process\.env\[name\]/);
  assert.match(connectorSource, /AbortController/);
  assert.match(connectorSource, /retryLimit/);
  assert.match(connectorSource, /backoffMs \* 2 \*\* attempt/);
  assert.match(connectorSource, /requestRatePerMinute/);
  assert.match(connectorSource, /maximumPages/);
  assert.doesNotMatch(connectorSource, /NEXT_PUBLIC_/);
});

test("deterministic matcher returns exact, ambiguous, unmatched and safety outcomes", () => {
  assert.equal(ingestion.proposeProductMatches(row, [demoProducts[0]]).outcome, "exact_candidate");
  assert.equal(ingestion.proposeProductMatches(row, [demoProducts[0], demoProducts[1]]).outcome, "ambiguous_candidates");
  assert.equal(
    ingestion.proposeProductMatches(
      { ...row, route: "", release_type: "" },
      [demoProducts[0]],
    ).outcome,
    "likely_candidate",
  );
  assert.equal(ingestion.proposeProductMatches({ ...row, ingredient: "Unknown" }, demoProducts).outcome, "no_match");
  const biologic = {
    observed_product_name: "Lumera D",
    ingredient: "Lumera-Bio",
    manufacturer: "Fictional Biologic Works",
    strength: "40 mg/mL",
    dosage_form: "prefilled-syringe",
    route: "subcutaneous",
    release_type: "not-applicable",
    pack: 30,
  };
  assert.equal(ingestion.proposeProductMatches(biologic, [demoProducts[5]]).outcome, "safety_exception");
});

test("assisted parsing preserves original text and labels suggestions with confidence", () => {
  const parsed = ingestion.assistedParseProductText("  ยาตัวอย่าง  10mg pack 30  ");
  assert.equal(parsed.originalText, "  ยาตัวอย่าง  10mg pack 30  ");
  assert.equal(parsed.fields.strength.suggested, "10 mg");
  assert.equal(parsed.fields.strength.confidence, "medium");
  assert.equal(parsed.fields.pack.suggested, "30");
});

test("public output is gated and omits ingestion internals", () => {
  assert.match(publicSource, /realHealthIntelligenceDataEnabled/);
  assert.match(publicSource, /product\.dataStatus !== "demo" && !realDataEnabled/);
  for (const privateField of ["ingestionBatchId", "ingestionRowId", "rowStatus", "environmentSecretNames", "collectionRestrictions", "privateMetadata"])
    assert.doesNotMatch(publicSource, new RegExp(privateField));
  assert.match(grants, /revoke all on table mms_commercial\.source_connectors from public,\s*anon,\s*authenticated/);
});

test("collector cannot publish and connector governance is admin-only", () => {
  const operations = load("src/lib/healthIntelligence/operations.ts");
  assert.equal(operations.roleCan("health_intelligence_collector", "publish"), false);
  assert.match(apiSource, /if \(role !== "admin"\) throw new Error\("Admin role required\."\)/);
  assert.match(apiSource, /healthIntelligenceMutationOriginAllowed/);
});

test("demo and real data remain separate and real data defaults off", () => {
  const env = fs.readFileSync(path.resolve(root, "env.example"), "utf8");
  assert.match(env, /MMS_HEALTH_INTELLIGENCE_REAL_DATA_ENABLED=false/);
  assert.match(migration, /'demo','real_unverified'/);
  assert.match(ingestionSource, /dataClass: "demo"/);
});
