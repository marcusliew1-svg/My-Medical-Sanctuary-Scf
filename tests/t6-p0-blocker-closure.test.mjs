import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { createRequire } from "node:module";

const root = process.cwd();
const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("typescript");
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), "utf8");

function loadTsModule(relativePath, cache = new Map()) {
  const absolutePath = path.resolve(root, relativePath);
  if (cache.has(absolutePath)) return cache.get(absolutePath).exports;
  const outputText = ts.transpileModule(read(relativePath), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: absolutePath,
  }).outputText;
  const module = { exports: {} };
  cache.set(absolutePath, module);
  function localRequire(specifier) {
    if (specifier.startsWith("@/")) return loadTsModule(path.join("src", `${specifier.slice(2)}.ts`), cache);
    return nodeRequire(specifier);
  }
  const context = vm.createContext({ module, exports: module.exports, require: localRequire, URL, URLSearchParams, TextDecoder, Request, Headers, fetch, process });
  vm.runInContext(`(function (exports, require, module) { ${outputText}\n})(module.exports, require, module);`, context);
  return module.exports;
}

const persistence = loadTsModule("src/lib/bookingPersistence.ts");
const booking = loadTsModule("src/lib/bookingSubmission.ts");

const configuredEnv = {
  VERCEL_ENV: "preview",
  MMS_BOOKING_PERSISTENCE_ENABLED: "true",
  MMS_CRM_DEBUG: "false",
  ZOHO_CLIENT_ID: "test-client",
  ZOHO_CLIENT_SECRET: "test-secret",
  ZOHO_REFRESH_TOKEN: "test-refresh",
  ZOHO_LEADS_MODULE_API_NAME: "Leads",
  MMS_DEFAULT_LEAD_SOURCE: "Website Discovery Form",
};

const validSubmission = {
  fullName: "Aisha Rahman",
  mobileNumber: "+60 12-345 6789",
  email: "aisha@example.com",
  country: "Kuala Lumpur, Malaysia",
  preferredLanguage: "en",
  interestedIn: "health_screening",
  preferredMembership: "unsure",
  enquiringFor: "self",
  preferredContactMethod: "not_specified",
  preferredAppointmentDate: "Weekday morning",
  message: "Please contact me about the discovery pathway.",
  consentToContact: true,
  consentVersion: booking.BOOKING_CONSENT_VERSION,
  sourcePath: "/contact",
  sourceQuery: "utm_source=member",
};

test("T6 booking persistence is hard-refused in Vercel Production", () => {
  const result = persistence.bookingPersistenceAvailability({ ...configuredEnv, VERCEL_ENV: "production" });
  assert.equal(result.ready, false);
  assert.equal(result.reason, "production_refused");
  const selfHosted = persistence.bookingPersistenceAvailability({ ...configuredEnv, VERCEL_ENV: "", NODE_ENV: "production" });
  assert.equal(selfHosted.reason, "production_refused");
});

test("T6 booking persistence remains default-off and configuration-bound", () => {
  assert.equal(persistence.bookingPersistenceAvailability({}).reason, "disabled");
  assert.equal(persistence.bookingPersistenceAvailability({ ...configuredEnv, MMS_CRM_DEBUG: "true" }).reason, "debug");
  assert.equal(persistence.bookingPersistenceAvailability({ ...configuredEnv, ZOHO_REFRESH_TOKEN: "" }).reason, "unconfigured");
  assert.equal(persistence.bookingPersistenceAvailability(configuredEnv).ready, true);
  assert.match(read("env.example"), /^MMS_BOOKING_PERSISTENCE_ENABLED=false$/m);
});

test("T6 Preview adapter persists only the validated non-clinical contract", async () => {
  const availability = persistence.bookingPersistenceAvailability(configuredEnv);
  let captured;
  const result = await persistence.persistBookingToZoho(
    validSubmission,
    { utm_source: "member" },
    "MMSP-1001",
    "2026-09-05T00:00:00.000Z",
    availability,
    async (moduleApiName, record) => {
      captured = { moduleApiName, record };
      return "123456789";
    },
  );
  assert.match(result.reference, /^MMS-ENQ-20260905-/);
  assert.equal(captured.moduleApiName, "Leads");
  assert.equal(captured.record.Email, validSubmission.email);
  assert.match(captured.record.Description, /Consent timestamp: 2026-09-05/);
  for (const prohibited of ["Diagnosis", "Prescription", "Lab_Results", "Medical_History", "Upload"])
    assert.equal(Object.hasOwn(captured.record, prohibited), false);
});

test("T6 booking route preserves Wave 5 controls and truthful outcomes", () => {
  const route = read("src/app/api/booking/route.ts");
  for (const token of ["bodyTooLarge", "hasAllowedPublicOrigin", "checkInMemoryRateLimit", "honeypot", "validateBookingSubmission", "consentTimestamp", "MMS_PARTNER_REFERRAL_COOKIE"])
    assert.match(route, new RegExp(token));
  assert.match(route, /status: "persisted"/);
  assert.match(route, /status: 201/);
  assert.match(route, /status: "not_persisted"/);
  assert.match(route, /status: 503/);
  assert.match(route, /could not be saved safely/);
});

test("T6 removes unverified medical-entity structured data", () => {
  const schema = read("src/lib/schema.ts");
  const layout = read("src/app/layout.tsx");
  assert.match(schema, /"@type": "WebSite"/);
  assert.doesNotMatch(schema, /MedicalOrganization|medicalSpecialty|PreventiveMedicine|PrimaryCare/);
  assert.match(layout, /websiteJsonLd/);
});

test("T6 legal structure exposes unresolved owner fields as blockers", () => {
  const privacy = read("src/app/privacy-pdpa/page.tsx");
  const terms = read("src/app/terms/page.tsx");
  const cookies = read("src/app/cookie-notice/page.tsx");
  assert.match(privacy, /Publication blocker/);
  assert.match(privacy, /data-controller\/legal-entity/);
  assert.match(terms, /interim website boundaries, not final legal terms/);
  assert.match(cookies, /mms_partner_ref/);
  assert.match(cookies, /up to 30 days/);
  assert.match(cookies, /No third-party analytics provider is enabled/);
});

test("T6 preserves planned location and licensing boundaries", () => {
  const locations = read("src/data/locations.ts");
  assert.equal((locations.match(/status: "planned"/g) || []).length, 3);
  assert.match(read("src/app/clinics/page.tsx"), /not represent them as open or accepting appointments/);
  assert.match(read("src/app/privacy-disclaimer/page.tsx"), /as open, licensed or accepting appointments/);
});

test("T6 Day-1 matrix keeps every unready feature gated", () => {
  const manifest = read("docs/t6-p0-launch-blocker-closure.md");
  assert.match(manifest, /\| Booking \| LAUNCH \|/);
  for (const feature of ["Ling AI", "Health Intelligence real data", "Partner Hub", "Checkout", "Applications", "My Sanctuary"])
    assert.match(manifest, new RegExp(`\\| ${feature.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\| KEEP GATED \\|`));
  assert.match(manifest, /NO-GO for Production/);
  assert.match(manifest, /DO NOT MERGE OR DEPLOY TO PRODUCTION/);
});

test("T6 adds Cookie Notice to legal navigation and sitemap", () => {
  const routes = read("src/lib/siteRoutes.ts");
  assert.match(routes, /cookieNotice: "\/cookie-notice"/);
  assert.match(routes, /label: "Cookie Notice"/);
  assert.match(routes, /routes\.cookieNotice/);
});
