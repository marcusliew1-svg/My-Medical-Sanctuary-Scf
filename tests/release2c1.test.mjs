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
    `(function(exports,require,module,Buffer){${outputText}\n})`,
    { require: req },
    { filename: file },
  )(mod.exports, req, mod, Buffer);
  return mod.exports;
}
const migration = fs.readFileSync(
  path.resolve(
    root,
    "database/migrations/0022_mms_health_intelligence_data_operations.sql",
  ),
  "utf8",
);
const operations = load("src/lib/healthIntelligence/operations.ts");
const csv = load("src/lib/healthIntelligence/csvImport.ts");
const source = {
  id: "source-1",
  sourceName: "Test source",
  country: "MY",
  sourceType: "licensed_pharmacy",
  organizationProvider: "Test",
  urlReference: "https://example.invalid",
  accessMethod: "manual",
  normalPricingBasis: "retail_cash_price",
  trustLevel: "medium",
  trustReason: "reviewed",
  verificationMethod: "human",
  termsUseNotes: "test",
  geographicScope: ["MY"],
  medicineScope: "test",
  updateFrequency: "30 days",
  status: "approved",
  visibility: "public_type_only",
  dataClass: "real_verified",
};
const observation = {
  id: "obs-1",
  sourceId: "source-1",
  country: "MY",
  originalObservedProductText: "Original medicine wording",
  originalLanguage: "en",
  matchedProductId: "product-1",
  productResolutionState: "confirmed_exact",
  observedBrand: "Brand",
  observedIngredient: "Ingredient",
  observedManufacturer: "Maker",
  observedStrength: "10mg",
  observedDosageForm: "tablet",
  observedReleaseType: "immediate",
  observedPack: "30",
  price: 84,
  currency: "MYR",
  packQuantity: 30,
  basis: "retail_cash_price",
  basisStatus: "basis_verified",
  availability: "available",
  observedAt: "2026-08-18T00:00:00Z",
  sourceReference: "reference",
  notes: "",
  evidence: [],
  workflowStage: "verified",
  freshnessStatus: "fresh",
  anomalyFlags: [],
  collector: "collector-a",
  reviewer: "reviewer-b",
  dataClass: "real_verified",
};

test("source registry models status, trust, visibility and private governance fields", () => {
  for (const term of [
    "candidate",
    "approved",
    "suspended",
    "trust_reason",
    "visibility_level",
    "private_metadata",
    "source_trust_reviews",
  ])
    assert.match(migration, new RegExp(term));
  assert.equal(operations.sourceMaySupportPublication(source), true);
  assert.equal(
    operations.sourceMaySupportPublication({ ...source, status: "suspended" }),
    false,
  );
  assert.equal(
    operations.sourceMaySupportPublication({
      ...source,
      trustLevel: "unknown",
    }),
    false,
  );
});
test("observations retain original text and unresolved product workflow", () => {
  for (const term of [
    "original_observed_product_text",
    "original_language",
    "product_creation_candidates",
    "candidate_review",
    "unresolved",
  ])
    assert.match(migration, new RegExp(term));
  assert.equal(
    operations.operationQueue({
      ...observation,
      productResolutionState: "unresolved",
      workflowStage: "collected",
    }),
    "unresolved_products",
  );
});
test("duplicate and anomaly checks preserve historical observations", () => {
  assert.equal(
    operations.detectLikelyDuplicate(observation, [{ ...observation }]).length,
    1,
  );
  assert.ok(
    operations
      .anomalyFlags({ ...observation, price: 200 }, [observation], 35)
      .includes("price_variance_review"),
  );
  assert.ok(
    operations
      .anomalyFlags({ ...observation, currency: "THB" }, [], 35)
      .includes("currency_inconsistency"),
  );
});
test("publication requires approved source, exact product, basis, human verification and four eyes", () => {
  assert.equal(
    operations.operationalPublicationEligibility(observation, source).eligible,
    true,
  );
  assert.ok(
    operations
      .operationalPublicationEligibility(
        { ...observation, basisStatus: "basis_unverified" },
        source,
      )
      .reasons.includes("basis_unverified"),
  );
  assert.ok(
    operations
      .operationalPublicationEligibility(
        { ...observation, collector: "same", reviewer: "same" },
        source,
      )
      .reasons.includes("four_eyes_review_recommended"),
  );
});
test("roles separate collection, review and publication", () => {
  assert.equal(
    operations.roleCan("health_intelligence_collector", "collect"),
    true,
  );
  assert.equal(
    operations.roleCan("health_intelligence_collector", "publish"),
    false,
  );
  assert.equal(
    operations.roleCan("health_intelligence_reviewer", "review"),
    true,
  );
  assert.equal(
    operations.roleCan("health_intelligence_publisher", "publish"),
    true,
  );
});

test("operations API enforces role capabilities and store enforces workflow prerequisites", () => {
  const route = fs.readFileSync(
    path.resolve(
      root,
      "src/app/api/internal/health-intelligence/operations/route.ts",
    ),
    "utf8",
  );
  const store = fs.readFileSync(
    path.resolve(root, "src/lib/healthIntelligence/operationsStore.ts"),
    "utf8",
  );
  assert.match(route, /healthIntelligenceOperationsRole/);
  assert.match(route, /publication_approved[\s\S]*?publish/);
  assert.match(route, /resolve_observation_identity/);
  assert.match(store, /Invalid workflow transition/);
  assert.match(store, /Exact product identity must be confirmed first/);
  assert.match(store, /Price basis must be verified first/);
  assert.match(store, /Source approval and sufficient trust are required/);
});
test("freshness creates review queues without deleting history", () => {
  assert.equal(
    operations.freshnessStatus("2026-01-01", undefined, new Date("2026-02-01")),
    "review_due",
  );
  assert.equal(
    operations.operationQueue({ ...observation, freshnessStatus: "stale" }),
    "reverification_due",
  );
  assert.match(migration, /operational_price_observations_history_idx/);
});
test("CSV dry run validates rows and never publishes", () => {
  const valid = csv.validateObservationCsv(
    `${csv.IMPORT_HEADERS.join(",")}\nSRC,MY,Medicine,Ingredient,Maker,10mg,tablet,30,84,MYR,retail_cash_price,2026-08-18,REF`,
  );
  assert.equal(valid.valid, true);
  const invalid = csv.validateObservationCsv(
    `${csv.IMPORT_HEADERS.join(",")}\nSRC,XX,=FORMULA,Ingredient,Maker,10mg,tablet,30,-1,USD,,bad,REF`,
  );
  assert.equal(invalid.valid, false);
  assert.match(migration, /import_status text not null default 'dry_run'/);
  assert.doesNotMatch(migration, /import_status[^\n]*published/);
});
test("raw operations and evidence remain unavailable to public roles", () => {
  assert.match(
    migration,
    /revoke all on table mms_commercial\.%I from public,anon,authenticated/,
  );
  assert.match(migration, /observation_evidence_immutable/);
  const publicModel = fs.readFileSync(
    path.resolve(root, "src/lib/healthIntelligence/publicReadModel.ts"),
    "utf8",
  );
  assert.doesNotMatch(
    publicModel,
    /private_metadata|supplier_contact|commercial_terms|observation_evidence/,
  );
});
test("demo, real-unverified and real-verified are explicit storage classes", () => {
  assert.match(migration, /'demo','real_unverified','real_verified'/);
  assert.match(migration, /data_class text not null default 'real_unverified'/);
});
