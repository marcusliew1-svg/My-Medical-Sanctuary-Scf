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

function loadRouting() {
  const compiled = ts.transpileModule(read("src/lib/i18nRouting.ts"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  const context = vm.createContext({ module, exports: module.exports, require: nodeRequire, URLSearchParams });
  vm.runInContext(`(function (exports, require, module) { ${compiled}\n})(module.exports, require, module);`, context);
  return module.exports;
}

const routing = loadRouting();

test("default public route remains English and canonical", () => {
  assert.equal(routing.currentLocaleForPath("/"), "en");
  assert.equal(routing.languageSwitchTarget("/", "en"), "/");
});

test("historical language scope is limited to Malay, Simplified Chinese and Thai", () => {
  assert.deepEqual(Array.from(routing.regionalLocales), ["ms", "zh", "th"]);
  assert.equal(routing.isRegionalLocale("id"), false);
});

test("each supported regional root is deterministic", () => {
  assert.equal(routing.localizedPath("ms"), "/ms");
  assert.equal(routing.localizedPath("zh"), "/zh");
  assert.equal(routing.localizedPath("th"), "/th");
});

test("desktop and mobile navigation expose the same four-language switcher", () => {
  const switcher = read("src/components/LanguageSwitcher.tsx");
  const navbar = read("src/components/Navbar.tsx");
  const mobile = read("src/components/MobileNav.tsx");
  assert.match(switcher, /variant\?: "desktop" \| "mobile"/);
  assert.match(switcher, /localeOptions\.map/);
  assert.match(navbar, /<LanguageSwitcher \/>/);
  assert.match(mobile, /<LanguageSwitcher variant="mobile"/);
});

test("language switching preserves the corresponding translated section", () => {
  assert.equal(routing.languageSwitchTarget("/treatments", "zh"), "/zh/treatments");
  assert.equal(routing.languageSwitchTarget("/ms/contact", "th"), "/th/contact");
  assert.equal(routing.languageSwitchTarget("/th/clinics", "en"), "/clinics");
});

test("missing translations fall back to the selected regional root", () => {
  assert.equal(routing.languageSwitchTarget("/health-intelligence", "ms"), "/ms");
  assert.equal(routing.languageSwitchTarget("/operations", "zh"), "/zh");
  assert.equal(routing.parseRegionalPath("/ms/unknown"), null);
});

test("only safe attribution query keys survive a language change", () => {
  const target = routing.appendSafeAttributionQuery("/zh/contact", "?ref=MMS-P-1&utm_source=mail&token=secret");
  assert.equal(target, "/zh/contact?ref=MMS-P-1&utm_source=mail");
  assert.doesNotMatch(target, /token/);
});

test("regional canonical metadata and reciprocal hreflang derive from central configuration", () => {
  const regional = read("src/components/LocalizedRegionalExperience.tsx");
  assert.match(regional, /canonical:\s*getCanonicalUrl\(pathname\)/);
  assert.match(regional, /Object\.entries\(alternatePaths\(section\)\)/);
  assert.deepEqual(Object.keys(routing.alternatePaths("ling")), ["en", "ms", "zh-CN", "th", "x-default"]);
});

test("sitemap has one route source and adds only intentional regional routes", () => {
  const sitemap = read("src/app/sitemap.ts");
  assert.match(sitemap, /publicSitemapRoutes/);
  assert.match(sitemap, /regionalSitemapPaths/);
  assert.match(sitemap, /alternates:\s*\{ languages:/);
  assert.equal(routing.regionalSitemapPaths.length, 27);
});

test("metadata title composition uses the current central helper", () => {
  const regional = read("src/components/LocalizedRegionalExperience.tsx");
  assert.match(regional, /composeMetadataTitle\(title\)/);
  assert.match(regional, /siteName:\s*siteConfig\.name/);
});

test("regional route params use strict Next 16 asynchronous APIs", () => {
  for (const locale of ["ms", "zh", "th"]) {
    const route = read(`src/app/${locale}/[section]/page.tsx`);
    assert.match(route, /params:\s*Promise<\{ section: string \}>/);
    assert.doesNotMatch(route, /Promise<[^>]+>\s*\|/);
    assert.match(route, /await params/);
    assert.match(route, /generateStaticParams/);
    assert.match(route, /generateMetadata/);
  }
});

test("locale prefixes cannot bypass current production feature gates", () => {
  const gates = read("src/lib/featureGates.ts");
  assert.match(gates, /pathForFeatureEvaluation/);
  assert.match(gates, /isRegionalLocale\(parts\[0\]\)/);
  for (const prefix of ["/prototype", "/partner-hub", "/operations", "/internal/health-intelligence"])
    assert.match(gates, new RegExp(`prefix:\\s*"${prefix.replaceAll("/", "\\/")}"`));
});

test("referral cookie remains first-party, secure in production and site-wide", () => {
  const proxy = read("src/proxy.ts");
  assert.match(proxy, /httpOnly:\s*true/);
  assert.match(proxy, /sameSite:\s*"lax"/);
  assert.match(proxy, /secure:\s*process\.env\.NODE_ENV === "production"/);
  assert.match(proxy, /path:\s*"\/"/);
  assert.match(proxy, /maxAge:\s*60 \* 60 \* 24 \* 30/);
});

test("translated navigation never changes enquiry canonical backend values", () => {
  const form = read("src/components/ContactForm.tsx");
  const regional = read("src/components/LocalizedRegionalExperience.tsx");
  assert.match(form, /interestedIn:\s*String\(formData\.get\("mainInterest"\)/);
  assert.match(form, /consentVersion:\s*"MMS-WEB-2026-08-v1"/);
  assert.match(form, /name="website"/);
  assert.doesNotMatch(regional, /<ContactForm/);
});

test("booking abuse protection remains intact", () => {
  const booking = read("src/app/api/booking/route.ts");
  assert.match(booking, /checkInMemoryRateLimit/);
  assert.match(booking, /form\.website/);
  assert.match(booking, /consentVersion === "MMS-WEB-2026-08-v1"/);
});

test("Health Intelligence and internal consoles remain English-only", () => {
  assert.equal(routing.regionalSections.includes("health-intelligence"), false);
  assert.equal(routing.regionalSections.includes("operations"), false);
  assert.equal(routing.regionalSections.includes("internal"), false);
  assert.equal(routing.languageSwitchTarget("/health-intelligence", "th"), "/th");
});

test("regional copy declares partial status and medically reviewed English fallback", () => {
  const regional = read("src/components/LocalizedRegionalExperience.tsx");
  assert.match(regional, /data-locale-status="partial"/);
  assert.match(regional, /phaseNotice/);
  assert.match(regional, /englishHref/);
  assert.doesNotMatch(regional, /stem.cell|exosome|CAR-T|peptide|cancer treatment/i);
});

test("no locale rewrite or duplicate internal route tree is introduced", () => {
  const proxy = read("src/proxy.ts");
  assert.doesNotMatch(proxy, /rewrite\(/);
  for (const locale of ["ms", "zh", "th"]) {
    assert.equal(fs.existsSync(path.resolve(root, `src/app/${locale}/operations`)), false);
    assert.equal(fs.existsSync(path.resolve(root, `src/app/${locale}/internal`)), false);
  }
});
