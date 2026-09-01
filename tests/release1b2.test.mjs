import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.resolve(repoRoot, relativePath), "utf8");
}

function packageJson() {
  return JSON.parse(read("package.json"));
}

test("Release 1B.2 mobile navigation is isolated from page content", () => {
  const mobileNav = read("src/components/MobileNav.tsx");

  assert.match(mobileNav, /role="dialog"/);
  assert.match(mobileNav, /aria-modal="true"/);
  assert.match(mobileNav, /fixed inset-0/);
  assert.match(mobileNav, /document\.body\.style\.overflow = "hidden"/);
  assert.match(mobileNav, /event\.key === "Escape"/);
  assert.match(mobileNav, /Close navigation/);
});

test("Release 1B.2 desktop navigation uses More for secondary destinations", () => {
  const navbar = read("src/components/Navbar.tsx");

  assert.match(navbar, /visibleNavigation/);
  assert.match(navbar, /moreNavigation/);
  assert.match(navbar, /More/);
  assert.match(navbar, /International Patients/);
  assert.match(navbar, /Insights/);
  assert.match(navbar, /Book Consultation/);
  assert.match(navbar, /My Sanctuary/);
});

test("Release 1B.2 CTA token no longer uses the salmon placeholder", () => {
  const tailwind = read("tailwind.config.js");
  const cta = read("src/components/CTAButton.tsx");
  const buttonLink = read("src/components/ButtonLink.tsx");

  assert.match(tailwind, /gold: "#A98A52"/);
  assert.doesNotMatch(tailwind, /#B56F5B/i);
  assert.match(cta, /rgba\(169,138,82,0\.22\)/);
  assert.match(buttonLink, /rgba\(169,138,82,0\.22\)/);
});

test("Release 1B.2 hero system supports controlled visual variation", () => {
  const publicExperience = read("src/components/PublicExperience.tsx");
  const healthIntelligence = read("src/app/health-intelligence/page.tsx");
  const memberships = read("src/app/memberships/page.tsx");
  const clinics = read("src/app/clinics/page.tsx");

  assert.match(publicExperience, /tone\?: "dark" \| "soft" \| "intelligence" \| "location"/);
  assert.match(healthIntelligence, /tone="intelligence"/);
  assert.match(memberships, /tone="soft"/);
  assert.match(clinics, /tone="location"/);
});

test("Release 1B.2 database client removes dynamic createRequire warning source", () => {
  const dbClient = read("src/lib/mmsCommercialDatabaseClient.ts");

  assert.match(dbClient, /import "server-only"/);
  assert.match(dbClient, /import pg from "pg"/);
  assert.doesNotMatch(dbClient, /createRequire/);
  assert.doesNotMatch(dbClient, /process\.cwd\(\).*package\.json/);
});

test("Release 1B.2 dependency patch targets preserve the separately approved framework baseline", () => {
  const pkg = packageJson();

  assert.equal(pkg.dependencies.next, "^16.3.4");
  assert.equal(pkg.devDependencies["eslint-config-next"], "^16.3.4");
  assert.equal(pkg.devDependencies.postcss, "^8.5.26");
});
