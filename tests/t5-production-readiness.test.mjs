import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), "utf8");

test("T5 launch manifest records the locked baseline and no-go decision", () => {
  const manifest = read("docs/t5-production-readiness.md");
  assert.match(manifest, /7ce84b89d97b7b1db0527143af4663844a2a8b85/);
  assert.match(manifest, /163 normalized manifest entries; 188 expanded routes/);
  assert.match(manifest, /NO-GO for Production/);
  assert.match(manifest, /DO NOT MERGE OR DEPLOY TO PRODUCTION/);
});

test("T5 keeps every named location explicitly planned", () => {
  const locations = read("src/data/locations.ts");
  for (const name of ["MMS Bangsar", "MMS SS2", "MMS Johor"]) {
    const start = locations.indexOf(`name: "${name}"`);
    assert.notEqual(start, -1, `${name} is missing`);
    assert.match(locations.slice(start, start + 300), /status: "planned"/);
  }
  assert.match(read("src/app/clinics/page.tsx"), /not represent them as open or accepting appointments/);
});

test("T5 keeps booking truthful until persistence is approved", () => {
  const booking = read("src/app/api/booking/route.ts");
  assert.match(booking, /status: "not_persisted"/);
  assert.match(booking, /status: 503/);
  assert.match(booking, /temporarily unavailable/);
  assert.doesNotMatch(booking, /status: "accepted"[\s\S]{0,300}status: 200/);
});

test("T5 keeps launch-sensitive Production features opt-in", () => {
  const example = read("env.example");
  for (const gate of [
    "MMS_PROTOTYPE_ENABLED",
    "MMS_PATIENT_PORTAL_ENABLED",
    "MMS_MEMBERSHIP_CHECKOUT_ENABLED",
    "MMS_PRODUCTION_LING_AI_ENABLED",
    "MMS_OPERATOR_ACCESS_ENABLED",
    "MMS_HEALTH_INTELLIGENCE_INTERNAL_ENABLED",
    "MMS_HEALTH_INTELLIGENCE_DEMO_MODE",
    "MMS_HEALTH_INTELLIGENCE_REAL_DATA_ENABLED",
    "MMS_COMMERCIAL_DATABASE_ENABLED",
    "MMS_PARTNER_HUB_ENABLED",
    "MMS_PARTNER_HUB_QA_BOOTSTRAP_ENABLED",
    "MMS_STRIPE_CHECKOUT_ENABLED",
    "MMS_STRIPE_FULFILMENT_ENABLED",
    "MMS_SALES_PARTNER_APPLICATIONS_ENABLED",
    "MMS_CAREERS_APPLICATIONS_ENABLED",
    "MMS_HEALTH_EDUCATION_INDEXABLE",
    "MMS_MEDICAL_EDUCATION_INDEXABLE",
  ]) assert.match(example, new RegExp(`^${gate}=false$`, "m"));
});

test("T5 preserves medical-team placeholders without invented clinicians", () => {
  const about = read("src/app/about-mms/page.tsx");
  assert.match(about, /Pending verification/);
  assert.match(about, /qualifications, registrations, roles and photography are approved/);
  assert.doesNotMatch(about, /Dr\.\s+[A-Z][a-z]+/);
});

test("T5 preserves Health Intelligence and Ling safety boundaries", () => {
  const intelligence = `${read("src/app/health-intelligence/page.tsx")}\n${read("src/components/PublicMedicineIntelligence.tsx")}`;
  assert.match(intelligence, /Price is not the same as access/);
  assert.match(intelligence, /does not prescribe, recommend a switch, or provide purchase or[\s\S]*import instructions/);
  const ling = read("src/app/ling/page.tsx");
  for (const phrase of ["Diagnose or prescribe", "Determine suitability", "Direct medicine changes", "Override judgement", "Production AI remains disabled"])
    assert.match(ling, new RegExp(phrase));
});

test("T5 retains partial-language disclosure and English fallback", () => {
  const regional = read("src/components/LocalizedRegionalExperience.tsx");
  assert.match(regional, /data-locale-status="partial"/);
  assert.match(regional, /englishHref/);
  assert.match(read("docs/t5-production-readiness.md"), /Selected content available in Bahasa Malaysia, Simplified Chinese, and Thai/);
});

test("T5 records unresolved legal identity and structured-data review", () => {
  const manifest = read("docs/t5-production-readiness.md");
  assert.match(manifest, /verified legal entity\/controller/);
  assert.match(manifest, /MedicalOrganization/);
  assert.match(manifest, /Legal\/Regulatory and Medical must verify/);
});

test("T5 documents every public asset and the duplicate Ling binary", () => {
  const manifest = read("docs/t5-production-readiness.md");
  const publicAssets = fs.readdirSync(path.resolve(root, "public")).filter((name) => fs.statSync(path.resolve(root, "public", name)).isFile());
  for (const asset of publicAssets) assert.match(manifest, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.deepEqual(
    fs.readFileSync(path.resolve(root, "public/ling-guide.png")),
    fs.readFileSync(path.resolve(root, "public/ling-mms-guide.png")),
  );
});

test("T5 manifest contains all launch disciplines and severity levels", () => {
  const manifest = read("docs/t5-production-readiness.md");
  for (const heading of ["Vercel Launch Manifest", "Supabase Readiness Manifest", "HeyGen Readiness Manifest", "Analytics and Consent", "Accessibility Readiness", "SEO Readiness", "Security Readiness", "Final Go/No-Go Criteria"])
    assert.match(manifest, new RegExp(heading));
  for (const severity of ["P0", "P1", "P2", "P3"]) assert.match(manifest, new RegExp(severity));
});
