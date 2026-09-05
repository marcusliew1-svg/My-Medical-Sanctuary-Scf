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
  const req = (specifier) => {
    if (specifier.startsWith("@/"))
      return load(path.join("src", `${specifier.slice(2)}.ts`), cache);
    return nodeRequire(specifier);
  };
  vm.runInNewContext(
    `(function(exports,require,module){${outputText}\n})`,
    { require: req },
    { filename: file },
  )(mod.exports, req, mod);
  return mod.exports;
}
const publicModelSource = fs.readFileSync(
  path.resolve(root, "src/lib/healthIntelligence/publicReadModel.ts"),
  "utf8",
);
const componentSource = fs.readFileSync(
  path.resolve(root, "src/components/PublicMedicineIntelligence.tsx"),
  "utf8",
);

test("public read model is sanitized and never exposes internal fields", () => {
  for (const field of [
    "reviewNotes",
    "commercialOpportunity",
    "supplierNotes",
    "sourcingStrategy",
    "internalConfidence",
  ])
    assert.doesNotMatch(
      publicModelSource,
      new RegExp(`return[\\s\\S]{0,200}${field}`),
    );
  assert.match(publicModelSource, /pricePublicationEligibility/);
  assert.match(publicModelSource, /demo_preview/);
});

test("public UX requires product confirmation before market comparison", () => {
  assert.match(componentSource, /Is this your medicine\?/);
  assert.match(componentSource, /onConfirm\(selected\)/);
  assert.match(componentSource, /mode === \"prices\" && product/);
});

test("comparison integrity rejects demonstration data and incompatible basis", () => {
  const { comparePublishedPrices } = load(
    "src/lib/healthIntelligence/publicComparison.ts",
  );
  const base = {
    publication: "verified_public",
    comparisonBasis: "retail_cash_price",
    observedLocalPrice: 100,
    normalizedQuantity: 10,
    packQuantity: 10,
  };
  const demo = { ...base, publication: "demo_preview" };
  assert.equal(comparePublishedPrices(base, demo).compatible, false);
  assert.equal(
    comparePublishedPrices(base, { ...base, comparisonBasis: "hospital_price" })
      .compatible,
    false,
  );
  assert.equal(
    comparePublishedPrices(base, { ...base, observedLocalPrice: 80 })
      .observedDifferencePercent,
    -20,
  );
});

test("patient language avoids replacement and savings claims", () => {
  assert.doesNotMatch(
    componentSource,
    /recommended replacement|Guaranteed savings|You save/,
  );
  assert.match(
    componentSource,
    /Professional review required|professional review/,
  );
  assert.match(
    componentSource,
    /Demonstration data — not current market pricing/,
  );
});

test("public API and telemetry are separate from internal reviewer API", () => {
  assert.ok(
    fs.existsSync(
      path.resolve(root, "src/app/api/health-intelligence/public/route.ts"),
    ),
  );
  assert.ok(
    fs.existsSync(
      path.resolve(root, "src/app/api/health-intelligence/telemetry/route.ts"),
    ),
  );
  assert.doesNotMatch(
    fs.readFileSync(
      path.resolve(root, "src/app/api/health-intelligence/public/route.ts"),
      "utf8",
    ),
    /reviewHealthIntelligenceRecord|MMS_INTERNAL_API_TOKEN/,
  );
});
