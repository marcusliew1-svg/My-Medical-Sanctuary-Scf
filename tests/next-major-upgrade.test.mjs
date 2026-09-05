import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.resolve(repoRoot, relativePath), "utf8");
}

test("T1 pins the supported Next 16 active line with matching React and lint tooling", () => {
  const pkg = JSON.parse(read("package.json"));

  assert.equal(pkg.dependencies.next, "^16.3.4");
  assert.equal(pkg.devDependencies["eslint-config-next"], "^16.3.4");
  assert.equal(pkg.dependencies.react, "^19.2.8");
  assert.equal(pkg.dependencies["react-dom"], "^19.2.8");
  assert.equal(pkg.devDependencies.eslint, "^9.39.5");
  assert.equal(pkg.scripts.lint, "eslint src");
});

test("T1 preserves default-off proxy gates and referral cookie hardening", () => {
  const proxy = read("src/proxy.ts");
  const gates = read("src/lib/featureGates.ts");

  assert.match(proxy, /export function proxy/);
  assert.match(proxy, /unavailableFeatureForPath/);
  assert.match(proxy, /status:\s*404/);
  assert.match(proxy, /httpOnly:\s*true/);
  assert.match(proxy, /sameSite:\s*"lax"/);
  assert.match(proxy, /secure:\s*process\.env\.NODE_ENV === "production"/);
  for (const route of [
    "/prototype",
    "/partner-hub",
    "/login",
    "/register",
    "/onboarding",
    "/my-sanctuary",
    "/membership-checkout",
    "/internal/health-intelligence",
  ]) {
    assert.match(gates, new RegExp(route.replaceAll("/", "\\/")));
  }
});

test("T1 uses asynchronous request APIs on framework-owned page props", () => {
  const internalPage = read("src/app/internal/health-intelligence/page.tsx");
  const joinPage = read("src/app/join-mms/page.tsx");
  const treatmentPage = read("src/app/treatments/[slug]/page.tsx");
  const concernPage = read("src/app/health-concerns/[slug]/page.tsx");
  const prototypePatientPage = read("src/app/prototype/patients/[id]/page.tsx");

  assert.match(internalPage, /await cookies\(\)/);
  assert.match(internalPage, /searchParams\?: Promise</);
  assert.match(joinPage, /searchParams\?: Promise</);
  assert.match(treatmentPage, /params: Promise</);
  assert.match(concernPage, /params: Promise</);
  assert.match(prototypePatientPage, /params: Promise</);
});

test("T1 preserves canonical metadata and public Health Intelligence redaction", () => {
  const siteConfig = read("src/lib/siteConfig.ts");
  const layout = read("src/app/layout.tsx");
  const publicApi = read("src/app/api/health-intelligence/public/route.ts");

  assert.match(siteConfig, /https:\/\/www\.scf\.center/);
  assert.match(layout, /metadataBase:\s*new URL\(siteUrl\)/);
  assert.match(publicApi, /publicHealthIntelligenceReadModel/);
  assert.doesNotMatch(publicApi, /reviewerNotes|commercialNotes|internalEvidence/);
});

test("T1 preserves reviewer authorization and protected mutation checks", () => {
  const internalAuth = read("src/lib/healthIntelligence/auth.ts");
  const internalPage = read("src/app/internal/health-intelligence/page.tsx");
  const reviewRoute = read("src/app/api/internal/health-intelligence/route.ts");

  assert.match(internalAuth, /timingSafeEqual/);
  assert.match(internalPage, /verifyHealthIntelligenceReviewerSession/);
  assert.match(reviewRoute, /healthIntelligenceRequestAuthorized/);
  assert.match(reviewRoute, /status: "unauthorized" \}, 401/);
});
