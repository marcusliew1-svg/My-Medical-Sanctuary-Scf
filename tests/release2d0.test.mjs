import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.resolve(root, relative), "utf8");

const pilot = read("docs/health-intelligence-pilot-medicines.md");
const matrix = read("docs/health-intelligence-source-matrix-my-th-sg.md");
const legal = read("docs/health-intelligence-source-legal-review.md");
const qualityGates = read("docs/health-intelligence-pilot-quality-gates.md");
const ingestion = read("src/lib/healthIntelligence/ingestion.ts");
const env = read("env.example");

test("Release 2D.0 retains the approved 23-medicine pilot and an empty exact-brand cohort", () => {
  assert.match(pilot, /Target cohort:\s*23/);
  const numberedRows = pilot.match(/^\|\s*(?:[1-9]|1\d|2[0-3])\s*\|/gm) || [];
  assert.equal(numberedRows.length, 23);
  assert.match(pilot, /No products admitted in Release 2D\.0/);
  assert.match(pilot, /same-brand, same-manufacturer, same-form, same-strength and same-pack/i);
});

test("Release 2D.0 keeps Singapore price gaps missing and prohibits estimates", () => {
  assert.match(matrix, /no verified public price source/i);
  assert.match(qualityGates, /No verified public price available/);
  assert.match(qualityGates, /no estimated value/i);
  assert.match(matrix, /All same-brand Group A candidates\s*\|\s*defer/i);
});

test("Release 2D.0 source governance permits HSA design while blocking unresolved automation", () => {
  assert.match(legal, /HSA.*suitable for Release 2D\.1 connector design/i);
  assert.match(legal, /MyPriMe.*legal_review_required/i);
  assert.match(legal, /Thai NDI.*legal_review_required/i);
  assert.match(legal, /commercial pharmacy sources/i);
  assert.match(legal, /Manual candidate only pending legal review/i);
  assert.match(ingestion, /if \(source\.status !== "approved"\) reasons\.push\("source_not_approved"\)/);
  assert.match(ingestion, /source_connector_activation_not_approved/);
});

test("real Health Intelligence data remains explicitly default-off", () => {
  assert.match(env, /MMS_HEALTH_INTELLIGENCE_REAL_DATA_ENABLED=false/);
  assert.match(
    ingestion,
    /process\.env\.MMS_HEALTH_INTELLIGENCE_REAL_DATA_ENABLED === "true"/,
  );
});
