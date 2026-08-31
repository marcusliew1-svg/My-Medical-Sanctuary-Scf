import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const repoRoot = process.cwd();
const nodeRequire = createRequire(import.meta.url);

function loadTsModule(relativePath, cache = new Map()) {
  const absolutePath = path.resolve(repoRoot, relativePath);
  if (cache.has(absolutePath)) return cache.get(absolutePath).exports;
  const source = fs.readFileSync(absolutePath, "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }, fileName: absolutePath });
  const module = { exports: {} };
  cache.set(absolutePath, module);
  function localRequire(specifier) {
    if (specifier.startsWith("@/")) {
      const base = path.join(repoRoot, "src", specifier.slice(2));
      const candidate = fs.existsSync(`${base}.ts`) ? `${base}.ts` : `${base}.tsx`;
      return loadTsModule(path.relative(repoRoot, candidate), cache);
    }
    return nodeRequire(specifier);
  }
  vm.runInNewContext(`(function(exports,require,module,process,URL){${outputText}\n})`, { require: localRequire }, { filename: absolutePath })(module.exports, localRequire, module, process, URL);
  return module.exports;
}

const migration = fs.readFileSync(path.resolve(repoRoot, "database/migrations/0021_mms_health_intelligence_foundation.sql"), "utf8");

test("Release 2A migration contains normalized identity, provenance, history, FX, review and audit concepts", () => {
  for (const table of ["health_intelligence_markets","active_ingredients","brands","manufacturers","dosage_forms","routes_of_administration","release_types","medicine_products","medicine_product_ingredients","market_registrations","price_observations","price_sources","generic_relationships","match_reviews","regulatory_notes","verification_events","fx_rates","health_intelligence_audit_events"]) {
    assert.match(migration, new RegExp(`create table if not exists mms_commercial\\.${table}`));
  }
  assert.match(migration, /price_observations_history_idx/);
  assert.match(migration, /price_observation_evidence_is_immutable/);
  assert.match(migration, /health_intelligence_price_publication_eligibility/);
});

test("seven stable ISO markets are seeded without asserting a cheapest market", () => {
  for (const country of ["'MY'","'TH'","'SG'","'ID'","'AU'","'US'","'AE'"]) assert.match(migration, new RegExp(country));
  assert.doesNotMatch(migration.toLowerCase(), /cheapest_market|always cheapest/);
});

test("deterministic matching distinguishes exact, close, pack, strength and hard exceptions", () => {
  const { demoProducts } = loadTsModule("src/lib/healthIntelligence/demoData.ts");
  const { matchMedicineProducts } = loadTsModule("src/lib/healthIntelligence/matching.ts");
  const product = (id) => demoProducts.find((item) => item.id === id);
  assert.equal(matchMedicineProducts(product("demo-product-a-my"), product("demo-product-a-th")).classification, "exact_match");
  assert.equal(matchMedicineProducts(product("demo-product-a-my"), product("demo-product-b")).classification, "close_equivalent");
  assert.equal(matchMedicineProducts(product("demo-product-e"), product("demo-product-e-large")).classification, "close_equivalent");
  assert.equal(matchMedicineProducts(product("demo-product-c"), product("demo-product-c-candidate")).classification, "review_required_due_to_exception");
  assert.equal(matchMedicineProducts(product("demo-product-d"), product("demo-product-d-biosimilar")).classification, "review_required_due_to_exception");
  const differentStrength = structuredClone(product("demo-product-a-th"));
  differentStrength.ingredients[0].strengthValue = 20;
  assert.equal(matchMedicineProducts(product("demo-product-a-my"), differentStrength).classification, "not_comparable");
});

test("verification workflow is explicit and rejects invalid shortcuts", () => {
  const { canTransitionRecord, assertRecordTransition } = loadTsModule("src/lib/healthIntelligence/verification.ts");
  assert.equal(canTransitionRecord("collected", "pending_review"), true);
  assert.equal(canTransitionRecord("pending_review", "verified"), true);
  assert.equal(canTransitionRecord("verified", "published"), true);
  assert.equal(canTransitionRecord("pending_review", "rejected"), true);
  assert.equal(canTransitionRecord("published", "needs_reverification"), true);
  assert.throws(() => assertRecordTransition("collected", "published"), /Invalid Health Intelligence transition/);
});

test("central publication eligibility blocks unverified, missing provenance, missing basis and all demo data", () => {
  const { pricePublicationEligibility } = loadTsModule("src/lib/healthIntelligence/verification.ts");
  const { demoPriceObservations, demoSources } = loadTsModule("src/lib/healthIntelligence/demoData.ts");
  const demo = pricePublicationEligibility({ observation: demoPriceObservations[0], source: demoSources[0], productIdentityVerified: true, now: new Date("2026-08-25") });
  assert.equal(demo.eligible, false);
  assert.ok(demo.reasons.includes("demo_data_never_public"));
  const live = structuredClone(demoPriceObservations[0]);
  live.dataStatus = "live";
  assert.equal(pricePublicationEligibility({ observation: live, source: { ...demoSources[0], dataStatus: "live", trustLevel: "medium", sourceStatus: "approved" }, productIdentityVerified: true, now: new Date("2026-08-25") }).eligible, true);
  assert.ok(pricePublicationEligibility({ observation: { ...live, comparisonBasis: undefined }, source: demoSources[0], productIdentityVerified: true }).reasons.includes("comparison_basis_missing"));
  assert.ok(pricePublicationEligibility({ observation: { ...live, sourceId: undefined }, source: undefined, productIdentityVerified: true }).reasons.includes("active_source_missing"));
});

test("raw tables and reviewer history are fail-closed to anon and authenticated", () => {
  assert.match(migration, /revoke all on table mms_commercial\.%I from public, anon, authenticated/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /verification_events_immutable/);
  assert.match(migration, /health_intelligence_audit_events_immutable/);
});

test("internal route is production-default-off and Preview requires explicit enablement", () => {
  const { unavailableFeatureForPath } = loadTsModule("src/lib/featureGates.ts");
  const prior = { ...process.env };
  try {
    process.env = { ...prior, VERCEL_ENV: "production", MMS_HEALTH_INTELLIGENCE_INTERNAL_ENABLED: "" };
    assert.equal(unavailableFeatureForPath("/internal/health-intelligence"), "healthIntelligenceInternal");
    process.env = { ...prior, VERCEL_ENV: "preview", MMS_HEALTH_INTELLIGENCE_INTERNAL_ENABLED: "" };
    assert.equal(unavailableFeatureForPath("/internal/health-intelligence"), "healthIntelligenceInternal");
    process.env.MMS_HEALTH_INTELLIGENCE_INTERNAL_ENABLED = "true";
    assert.equal(unavailableFeatureForPath("/internal/health-intelligence"), null);
  } finally { process.env = prior; }
});

test("reviewer API requires authorization, same-origin mutation protection and audit writes", () => {
  const api = fs.readFileSync(path.resolve(repoRoot, "src/app/api/internal/health-intelligence/route.ts"), "utf8");
  const auth = fs.readFileSync(path.resolve(repoRoot, "src/lib/healthIntelligence/auth.ts"), "utf8");
  const store = fs.readFileSync(path.resolve(repoRoot, "src/lib/healthIntelligence/store.ts"), "utf8");
  assert.match(api, /healthIntelligenceRequestAuthorized/);
  assert.match(api, /healthIntelligenceMutationOriginAllowed/);
  assert.match(auth, /httpOnly|REVIEWER_COOKIE/);
  assert.match(auth, /isProductionDeployment/);
  assert.match(store, /verification_events/);
  assert.match(store, /health_intelligence_audit_events/);
  assert.match(store, /Demo Health Intelligence records can never be published/);
});
