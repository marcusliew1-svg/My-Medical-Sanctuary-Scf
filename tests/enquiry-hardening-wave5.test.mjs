import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { createRequire } from "node:module";

const root = process.cwd();
const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("typescript");

function read(relativePath) {
  return fs.readFileSync(path.resolve(root, relativePath), "utf8");
}

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
  const context = vm.createContext({ module, exports: module.exports, require: localRequire, URL, URLSearchParams, TextDecoder, Request, Headers, process });
  vm.runInContext(`(function (exports, require, module) { ${outputText}\n})(module.exports, require, module);`, context);
  return module.exports;
}

const booking = loadTsModule("src/lib/bookingSubmission.ts");

function valid(overrides = {}) {
  return {
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
    message: "I would like to understand the screening pathway.",
    consentToContact: "true",
    consentVersion: booking.BOOKING_CONSENT_VERSION,
    sourcePath: "/contact",
    sourceQuery: "utm_source=newsletter&locale=en",
    website: "",
    ...overrides,
  };
}

test("valid booking submission produces canonical values", () => {
  const result = booking.validateBookingSubmission(valid());
  assert.equal(result.ok, true);
  assert.equal(result.value.interestedIn, "health_screening");
});

test("invalid email is rejected", () => assert.equal(booking.validateBookingSubmission(valid({ email: "bad" })).ok, false));
test("invalid phone is rejected", () => assert.equal(booking.validateBookingSubmission(valid({ mobileNumber: "call me" })).ok, false));
test("missing consent is rejected", () => assert.equal(booking.validateBookingSubmission(valid({ consentToContact: "false" })).ok, false));

test("honeypot is submitted and quietly handled by the API", () => {
  assert.match(read("src/components/ContactForm.tsx"), /website:\s*String\(formData\.get\("website"\)/);
  assert.match(read("src/app/api/booking/route.ts"), /status:\s*"accepted"[\s\S]*status:\s*202/);
});

test("oversized bodies are checked after reading bytes as well as by header", () => {
  const source = read("src/lib/publicSubmission.ts");
  assert.match(source, /body\.byteLength > MAX_PUBLIC_BODY_BYTES/);
  assert.match(read("src/app/api/booking/route.ts"), /status === 413/);
});

test("rate limit returns 429 after the booking threshold", () => {
  const rate = loadTsModule("src/lib/rateLimit.ts");
  rate.resetInMemoryRateLimitForTests();
  for (let index = 0; index < 6; index += 1) assert.equal(rate.checkInMemoryRateLimit("wave5", { limit: 6, windowMs: 60000, now: 1 }).allowed, true);
  assert.equal(rate.checkInMemoryRateLimit("wave5", { limit: 6, windowMs: 60000, now: 1 }).allowed, false);
  assert.match(read("src/app/api/booking/route.ts"), /status:\s*429/);
});

test("malformed canonical enum is rejected", () => assert.equal(booking.validateBookingSubmission(valid({ interestedIn: "Health Screening" })).ok, false));
test("overlong free text is rejected instead of truncated", () => assert.equal(booking.validateBookingSubmission(valid({ message: "x".repeat(1501) })).ok, false));

test("safe referral value is accepted as campaign context", () => {
  const result = booking.validateBookingSubmission(valid({ sourceQuery: "ref=MMSP-1001&locale=en" }));
  assert.equal(result.ok, true);
  assert.equal(result.campaign.ref, "MMSP-1001");
});

test("invalid referral value is rejected", () => assert.equal(booking.validateBookingSubmission(valid({ sourceQuery: "ref=%3Cscript%3E&locale=en" })).ok, false));

test("approved UTM values are preserved and unknown query keys are rejected", () => {
  const result = booking.validateBookingSubmission(valid({ sourceQuery: "utm_source=member&utm_campaign=screening-2026&locale=en" }));
  assert.equal(result.ok, true);
  assert.equal(result.campaign.utm_campaign, "screening-2026");
  assert.equal(booking.validateBookingSubmission(valid({ sourceQuery: "token=secret" })).ok, false);
});

test("translated handoff retains locale while backend values remain canonical", () => {
  const result = booking.validateBookingSubmission(valid({ preferredLanguage: "ms", sourceQuery: "locale=ms", interestedIn: "membership" }));
  assert.equal(result.ok, true);
  assert.equal(result.value.preferredLanguage, "ms");
  assert.equal(result.value.interestedIn, "membership");
  assert.match(read("src/components/AttributedHandoffLink.tsx"), /searchParams\.set\("locale", locale\)/);
});

test("public errors do not expose raw exceptions or internal configuration", () => {
  const route = read("src/app/api/booking/route.ts");
  assert.doesNotMatch(route, /error\.message|stack|process\.env/);
  assert.doesNotMatch(route, /acceptedFields|mapping:/);
});

test("client submission lock prevents a second in-flight request", () => {
  const form = read("src/components/ContactForm.tsx");
  assert.match(form, /submissionLock\.current/);
  assert.match(form, /disabled=\{isSubmitting\}/);
});

test("consent timestamp and partner identity are server-derived", () => {
  const route = read("src/app/api/booking/route.ts");
  assert.match(route, /new Date\(\)\.toISOString\(\)/);
  assert.match(route, /request\.cookies\.get\(MMS_PARTNER_REFERRAL_COOKIE\)/);
});

test("CRM-safe booking payload excludes clinical and upload fields", () => {
  const fields = Array.from(booking.bookingAllowedFields);
  for (const prohibited of ["diagnosis", "prescription", "labResults", "medicalHistory", "medicalReport", "upload"]) {
    assert.equal(fields.includes(prohibited), false);
  }
});

test("protected internal API and feature-gate boundaries are unaffected", () => {
  const gates = read("src/lib/featureGates.ts");
  const internal = read("src/app/api/internal/health-intelligence/route.ts");
  assert.match(gates, /internal\/health-intelligence/);
  assert.match(internal, /authoriz|access|token/i);
  assert.doesNotMatch(read("src/app/api/booking/route.ts"), /internal\/health-intelligence|mmsCommercialDatabase/i);
});

