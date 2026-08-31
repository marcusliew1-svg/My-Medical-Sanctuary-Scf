import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
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

function withEnv(env, fn) {
  const previous = { ...process.env };
  process.env = { ...previous, ...env };
  try {
    return fn();
  } finally {
    process.env = previous;
  }
}

test("canonical URL defaults to the temporary scf.center production domain", () => {
  const { getCanonicalSiteUrl, getCanonicalUrl } = loadTsModule("src/lib/siteConfig.ts");

  withEnv({ NEXT_PUBLIC_SITE_URL: "", MMS_SITE_URL: "" }, () => {
    assert.equal(getCanonicalSiteUrl(), "https://www.scf.center");
    assert.equal(getCanonicalUrl("/contact"), "https://www.scf.center/contact");
  });
});

test("sitemap and robots use the canonical host", () => {
  const sitemap = loadTsModule("src/app/sitemap.ts").default;
  const robots = loadTsModule("src/app/robots.ts").default;

  withEnv({ NEXT_PUBLIC_SITE_URL: "", MMS_SITE_URL: "" }, () => {
    assert.ok(sitemap().every((entry) => entry.url.startsWith("https://www.scf.center")));
    assert.equal(robots().sitemap, "https://www.scf.center/sitemap.xml");
  });
});

test("unfinished production routes are default-off, while preview can expose approved surfaces", () => {
  const { unavailableFeatureForPath } = loadTsModule("src/lib/featureGates.ts");

  withEnv({ VERCEL_ENV: "production" }, () => {
    assert.equal(unavailableFeatureForPath("/prototype"), "prototype");
    assert.equal(unavailableFeatureForPath("/partner-hub/leads"), "partnerHub");
    assert.equal(unavailableFeatureForPath("/login"), "patientPortal");
    assert.equal(unavailableFeatureForPath("/membership-checkout"), "membershipCheckout");
    assert.equal(unavailableFeatureForPath("/contact"), null);
  });

  withEnv({ VERCEL_ENV: "preview" }, () => {
    assert.equal(unavailableFeatureForPath("/prototype"), null);
    assert.equal(unavailableFeatureForPath("/partner-hub/leads"), null);
  });
});

test("explicit production feature flags can enable a gated route deliberately", () => {
  const { unavailableFeatureForPath } = loadTsModule("src/lib/featureGates.ts");

  withEnv({ VERCEL_ENV: "production", MMS_PROTOTYPE_ENABLED: "true" }, () => {
    assert.equal(unavailableFeatureForPath("/prototype/dashboard"), null);
  });
});

test("metadata title composition avoids duplicate brand suffixes", () => {
  const { composeMetadataTitle } = loadTsModule("src/lib/siteConfig.ts");

  assert.equal(composeMetadataTitle("About MMS"), "About MMS | My Medical Sanctuary");
  assert.equal(
    composeMetadataTitle("About MMS | My Medical Sanctuary"),
    "About MMS | My Medical Sanctuary",
  );
});

test("production Ling AI is default-off", () => {
  const { isMmsFeatureEnabled } = loadTsModule("src/lib/featureGates.ts");

  withEnv({ VERCEL_ENV: "production", MMS_PRODUCTION_LING_AI_ENABLED: "" }, () => {
    assert.equal(isMmsFeatureEnabled("productionLingAi"), false);
  });
});

test("security headers are configured in next.config", async () => {
  const config = (await import(pathToFileURL(path.resolve(repoRoot, "next.config.mjs")).href)).default;
  const headers = await config.headers();
  const values = Object.fromEntries(headers[0].headers.map((header) => [header.key, header.value]));

  assert.equal(values["Strict-Transport-Security"], "max-age=63072000; includeSubDomains; preload");
  assert.equal(values["X-Content-Type-Options"], "nosniff");
  assert.equal(values["X-Frame-Options"], "DENY");
  assert.equal(values["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.match(values["Permissions-Policy"], /camera=\(\)/);
});

test("booking abuse protection has honeypot, body-size and rate-limit behavior", () => {
  const bookingRoute = fs.readFileSync(path.resolve(repoRoot, "src/app/api/booking/route.ts"), "utf8");
  const { checkInMemoryRateLimit, resetInMemoryRateLimitForTests } = loadTsModule("src/lib/rateLimit.ts");

  assert.match(bookingRoute, /bodyTooLarge/);
  assert.match(bookingRoute, /honeypot/);
  assert.match(bookingRoute, /rate_limited/);

  resetInMemoryRateLimitForTests();
  for (let index = 0; index < 6; index += 1) {
    assert.equal(checkInMemoryRateLimit("booking:test", { limit: 6, windowMs: 60000, now: 1 }).allowed, true);
  }
  assert.equal(checkInMemoryRateLimit("booking:test", { limit: 6, windowMs: 60000, now: 1 }).allowed, false);
});
