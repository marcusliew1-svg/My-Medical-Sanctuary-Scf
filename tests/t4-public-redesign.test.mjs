import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), "utf8");

test("T4 homepage preserves the approved patient narrative", () => {
  const home = read("src/app/page.tsx");
  const publicExperience = read("src/components/PublicExperience.tsx");
  for (const phrase of [
    "Your health deserves a longer view",
    "What would you like to understand better?",
    "Medical judgement comes first.",
    "One MMS. Three specialised centres.",
    "Healthcare is global. Prices aren't.",
  ]) assert.match(`${home}\n${publicExperience}`, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(home, /data-public-home-shell/);
});

test("T4 health journeys are intent-first and clinically bounded", () => {
  const index = read("src/app/health-concerns/page.tsx");
  const detail = read("src/app/health-concerns/[slug]/page.tsx");
  assert.match(index, /EditorialIndex/);
  assert.match(detail, /ClinicalBoundary/);
  assert.match(detail, /professional judgement|doctor-led/i);
});

test("T4 programmes present relationship depth without public pricing", () => {
  const memberships = read("src/app/memberships/page.tsx");
  const membershipData = read("src/data/memberships.ts");
  assert.match(memberships, /not a price list/i);
  assert.doesNotMatch(memberships, /RM\s*[\d,]+|price:\s*["'`]/i);
  for (const tier of ["Ascend", "Evolve", "Eterna", "Pinnacle"]) assert.match(membershipData, new RegExp(tier));
});

test("T4 treatment pages keep evidence, uncertainty and suitability visible", () => {
  const index = read("src/app/treatments/page.tsx");
  const detail = read("src/app/treatments/[slug]/page.tsx");
  for (const phrase of ["Evidence", "Suitability", "Uncertainty"]) assert.match(`${index}\n${detail}`, new RegExp(phrase, "i"));
  assert.match(detail, /ClinicalBoundary/);
  assert.doesNotMatch(`${index}\n${detail}`, /guaranteed|miracle|cures?\b/i);
});

test("T4 Health Intelligence communicates verification boundaries", () => {
  const page = read("src/app/health-intelligence/page.tsx");
  const client = read("src/components/PublicMedicineIntelligence.tsx");
  for (const phrase of ["Healthcare is global. Prices aren't.", "No fabricated prices", "In development"]) {
    assert.match(`${page}\n${client}`, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("T4 locations and international pages avoid operational promises", () => {
  const clinics = read("src/app/clinics/page.tsx");
  const international = read("src/app/international-medicine-access/page.tsx");
  assert.match(clinics, /LocationFeature/);
  assert.match(`${clinics}\n${international}`, /planned|subject to|availability/i);
  assert.doesNotMatch(`${clinics}\n${international}`, /guaranteed access|guaranteed availability/i);
});

test("T4 About uses verifiable medical-team placeholders", () => {
  const about = read("src/app/about-mms/page.tsx");
  assert.match(about, /Pending verification/);
  assert.match(about, /qualifications, registrations, roles and photography are approved/);
  assert.doesNotMatch(about, /Dr\.\s+[A-Z][a-z]+/);
});

test("T4 Ling states permitted and prohibited roles", () => {
  const ling = read("src/app/ling/page.tsx");
  for (const phrase of ["Explain", "Organise", "Navigate", "Prepare", "Diagnose or prescribe", "Determine suitability", "Direct medicine changes", "Override judgement"]) {
    assert.match(ling, new RegExp(phrase));
  }
  assert.match(ling, /Production AI remains disabled/);
});

test("T4 public design remains accessible and restrained", () => {
  const css = read("src/app/globals.css");
  const mobile = read("src/components/MobileNav.tsx");
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /--mms-focus:/);
  assert.match(mobile, /role="dialog"/);
  assert.match(mobile, /aria-modal="true"/);
  assert.doesNotMatch(css, /ambient-orb|particle|shimmer/i);
});

test("T4 public visuals do not cross into protected consoles", () => {
  const protectedRoots = ["src/app/operations", "src/app/internal", "src/app/partner-hub", "src/components/operations"];
  const forbidden = /PublicEditorialModules|PublicVisualPrimitives|PublicExperience|publicDesign/;
  for (const relativeRoot of protectedRoots) {
    const absoluteRoot = path.resolve(root, relativeRoot);
    if (!fs.existsSync(absoluteRoot)) continue;
    for (const entry of fs.readdirSync(absoluteRoot, { recursive: true, withFileTypes: true })) {
      if (!entry.isFile() || !/\.(?:ts|tsx)$/.test(entry.name)) continue;
      assert.doesNotMatch(fs.readFileSync(path.join(entry.parentPath, entry.name), "utf8"), forbidden);
    }
  }
});
