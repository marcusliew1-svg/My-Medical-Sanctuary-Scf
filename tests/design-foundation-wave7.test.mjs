import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), "utf8");

test("Wave 7 public header uses the approved hierarchy and preserves controlled destinations", () => {
  const routes = read("src/lib/siteRoutes.ts");
  const navbar = read("src/components/Navbar.tsx");

  for (const label of ["About", "Your Health", "Programmes", "Treatments", "Health Intelligence", "Locations"])
    assert.match(routes, new RegExp(`label: "${label}"`));
  for (const label of ["Medical Team", "International Patients", "Insights", "My Sanctuary", "Contact", "Partner Login"])
    assert.match(routes, new RegExp(`label: "${label}"`));
  assert.match(navbar, /primaryNavigation/);
  assert.match(navbar, /<LanguageSwitcher \/>/);
  assert.match(navbar, /href="\/ling"/);
  assert.match(navbar, /Book Consultation/);
  assert.doesNotMatch(navbar, /max-w-\[90rem\][^\n]+backdrop-blur/);
});

test("Wave 7 mobile navigation traps focus, restores focus and keeps safe links", () => {
  const mobile = read("src/components/MobileNav.tsx");

  assert.match(mobile, /role="dialog"/);
  assert.match(mobile, /aria-modal="true"/);
  assert.match(mobile, /createPortal/);
  assert.match(mobile, /event\.key !== "Tab"/);
  assert.match(mobile, /querySelectorAll<HTMLElement>/);
  assert.match(mobile, /const triggerButton = triggerButtonRef\.current/);
  assert.match(mobile, /triggerButton\?\.focus\(\)/);
  assert.match(mobile, /aria-hidden=\{open\}/);
  assert.match(mobile, /tabIndex=\{open \? -1 : 0\}/);
  assert.match(mobile, /<LanguageSwitcher variant="mobile"/);
  assert.match(mobile, /utilityNavigation/);
});

test("Wave 7 CTA and public layout primitives are centralised", () => {
  const cta = read("src/components/CTAButton.tsx");
  const link = read("src/components/ButtonLink.tsx");
  const design = read("src/lib/publicDesign.ts");
  const primitives = read("src/components/PublicVisualPrimitives.tsx");

  assert.match(cta, /publicButtonClasses/);
  assert.match(link, /publicButtonClasses/);
  assert.match(design, /rounded-md/);
  assert.match(primitives, /PublicSectionShell/);
  assert.match(primitives, /ResponsiveEditorialImage/);
  assert.match(primitives, /priority=\{priority\}/);
});

test("Wave 7 motion and accessibility remain restrained", () => {
  const css = read("src/app/globals.css");
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /--mms-focus:/);
  assert.match(css, /\.public-media:hover img/);
  assert.doesNotMatch(css, /ambient-orb|shimmer|spin-ring|particle/i);
});

test("Wave 7 public styles do not become internal console dependencies", () => {
  const internalRoots = ["src/app/operations", "src/app/internal", "src/app/partner-hub", "src/components/operations"];
  const forbidden = /PublicVisualPrimitives|PublicExperience|publicDesign/;

  for (const relativeRoot of internalRoots) {
    const absoluteRoot = path.resolve(root, relativeRoot);
    if (!fs.existsSync(absoluteRoot)) continue;
    for (const entry of fs.readdirSync(absoluteRoot, { recursive: true, withFileTypes: true })) {
      if (!entry.isFile() || !/\.(?:ts|tsx)$/.test(entry.name)) continue;
      const source = fs.readFileSync(path.join(entry.parentPath, entry.name), "utf8");
      assert.doesNotMatch(source, forbidden, `${path.join(entry.parentPath, entry.name)} imports a public visual dependency`);
    }
  }
});

test("Wave 7 homepage shell, SEO route source and security gates remain present", () => {
  const home = read("src/app/page.tsx");
  const routes = read("src/lib/siteRoutes.ts");
  const layout = read("src/app/layout.tsx");
  const gates = read("src/lib/featureGates.ts");

  for (const component of ["PublicHero", "TrustBar", "ImageFeature", "JourneyStepRail", "LocationFeature", "HealthIntelligenceFeature", "CTASection"])
    assert.match(home, new RegExp(component));
  assert.match(home, /data-public-home-shell/);
  assert.match(routes, /publicSitemapRoutes/);
  assert.match(layout, /metadataBase:\s*new URL\(siteUrl\)/);
  for (const prefix of ["/prototype", "/partner-hub", "/my-sanctuary", "/membership-checkout"])
    assert.match(gates, new RegExp(`prefix:\\s*"${prefix.replaceAll("/", "\\/")}"`));
});
