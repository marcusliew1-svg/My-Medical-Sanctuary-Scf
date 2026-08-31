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
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: absolutePath,
  });

  const module = { exports: {} };
  cache.set(absolutePath, module);

  function localRequire(specifier) {
    if (specifier.startsWith("@/")) {
      return loadTsModule(path.join("src", `${specifier.slice(2)}.ts`), cache);
    }
    if (specifier.startsWith(".")) {
      return loadTsModule(path.relative(repoRoot, path.resolve(path.dirname(absolutePath), `${specifier}.ts`)), cache);
    }
    return nodeRequire(specifier);
  }

  vm.runInNewContext(
    `(function (exports, require, module, process, URL) { ${outputText}\n})`,
    { require: localRequire },
    { filename: absolutePath },
  )(module.exports, localRequire, module, process, URL);

  return module.exports;
}

function read(relativePath) {
  return fs.readFileSync(path.resolve(repoRoot, relativePath), "utf8");
}

test("Release 1B public navigation uses the approved institutional hierarchy", () => {
  const { navigation } = loadTsModule("src/lib/content.ts");
  const labels = navigation.map((item) => item.label);

  assert.equal(JSON.stringify(labels), JSON.stringify([
    "Home",
    "Your Health",
    "Care & Treatments",
    "Health Intelligence",
    "Memberships",
    "Medical Team",
    "Locations",
    "International Patients",
    "Insights",
  ]));

  assert.equal(labels.some((label) => /stem|exosome|nad/i.test(label)), false);
  assert.match(read("src/components/Navbar.tsx"), /Book Consultation/);
  assert.match(read("src/components/Navbar.tsx"), /My Sanctuary/);
});

test("homepage foregrounds the Release 1B institution story", () => {
  const homepage = read("src/app/page.tsx");

  assert.match(homepage, /Your health deserves a longer view\./);
  assert.match(homepage, /Preventive Care\. Personalised Longevity\. Physician-guided\./);
  assert.match(homepage, /Assess/);
  assert.match(homepage, /Personalise/);
  assert.match(homepage, /Care/);
  assert.match(homepage, /Continue/);
  assert.match(homepage, /One MMS\. Three specialised centres\./);
});

test("Health Intelligence is an editorial shell, not a live price engine", () => {
  const page = read("src/app/health-intelligence/page.tsx");

  assert.match(page, /Healthcare is global\. Prices aren't\./);
  assert.match(page, /No fabricated prices/);
  assert.match(page, /In development/);
  assert.doesNotMatch(page, /Buy medicine/i);
  assert.doesNotMatch(page, /\b(?:USD|RM|SGD|AUD|IDR|THB)\s?\d/i);
});

test("membership pages do not expose public pricing in Release 1B", () => {
  const membershipPage = read("src/app/memberships/page.tsx");

  assert.match(membershipPage, /not a price list/i);
  assert.doesNotMatch(membershipPage, /From RM/i);
  assert.doesNotMatch(membershipPage, /\/ year/i);
});

test("location model distinguishes planned centres from operational claims", () => {
  const { locationStatusLabels, mmsLocations } = loadTsModule("src/data/locations.ts");

  assert.equal(locationStatusLabels.planned, "Planned");
  assert.equal(locationStatusLabels.opening_soon, "Opening soon");
  assert.equal(locationStatusLabels.operational, "Operational");
  assert.ok(mmsLocations.length >= 3);
  assert.equal(mmsLocations.every((location) => location.status !== "operational"), true);
});

test("public sitemap includes Health Intelligence while Release 1A canonical/gates remain available", () => {
  const { publicSitemapRoutes } = loadTsModule("src/lib/siteRoutes.ts");
  const { unavailableFeatureForPath } = loadTsModule("src/lib/featureGates.ts");
  const { getCanonicalUrl } = loadTsModule("src/lib/siteConfig.ts");

  assert.ok(publicSitemapRoutes.includes("/health-intelligence"));
  assert.equal(getCanonicalUrl("/health-intelligence"), "https://www.scf.center/health-intelligence");

  const previousEnv = { ...process.env };
  process.env = { ...process.env, VERCEL_ENV: "production" };
  try {
    assert.equal(unavailableFeatureForPath("/prototype"), "prototype");
    assert.equal(unavailableFeatureForPath("/my-sanctuary"), "patientPortal");
  } finally {
    process.env = previousEnv;
  }
});
