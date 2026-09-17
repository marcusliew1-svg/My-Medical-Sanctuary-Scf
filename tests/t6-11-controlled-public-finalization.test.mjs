import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const launch = read("src/lib/controlledPublicLaunch.ts");
const proxy = read("src/proxy.ts");
const home = read("src/app/page.tsx");
const contact = read("src/app/contact/page.tsx");
const onlineDoctor = read("src/app/online-doctor/page.tsx");
const sitemap = read("src/app/sitemap.ts");
const layout = read("src/app/layout.tsx");
const report = read("docs/t6-11-controlled-public-launch-finalization.md");

test("T6.11 defines a minimal exact informational route allow-list", () => {
  for (const route of [
    '"/"', '"/contact"', '"/book-appointment"', '"/online-doctor"',
    '"/privacy-disclaimer"', '"/privacy-pdpa"', '"/privacy-policy"',
    '"/cookie-notice"', '"/terms"', '"/terms-of-use"',
  ]) assert.match(launch, new RegExp(route.replaceAll("/", "\\/")));
  for (const held of ["/treatments", "/health-concerns", "/health-intelligence", "/clinics", "/ms", "/zh", "/th"])
    assert.doesNotMatch(launch.match(/controlledPublicRouteAllowlist = \[[\s\S]*?\] as const/)?.[0] || "", new RegExp(held));
});

test("T6.11 informational proxy blocks every route outside the allow-list", () => {
  assert.match(proxy, /controlledPublicRouteUnavailable/);
  assert.match(proxy, /status: 404/);
  assert.match(proxy, /X-Robots-Tag/);
  assert.match(proxy, /X-MMS-Launch-Mode/);
});

test("T6.11 controlled homepage makes availability boundaries explicit", () => {
  assert.match(home, /Services are not currently available through this website/);
  for (const boundary of ["Patient registration", "Booking, enquiry and CRM", "Checkout and payment", "Live online-doctor", "Careers and Sales Partner"])
    assert.match(home, new RegExp(boundary));
});

test("T6.11 contact and booking render a truthful non-submitting state", () => {
  assert.match(contact, /not currently accepting website enquiries or bookings/);
  assert.match(contact, /No form submission, booking persistence, CRM handoff/);
  assert.match(contact, /if \(controlledPublicLaunch\)/);
  assert.match(contact, /robots: \{ index: false, follow: false \}/);
});

test("T6.11 online doctor remains unavailable and noindex", () => {
  assert.match(onlineDoctor, /robots: \{ index: false, follow: false \}/);
  assert.match(onlineDoctor, /not currently available through MMS/);
  assert.match(onlineDoctor, /not accepting online-doctor bookings/);
  assert.doesNotMatch(onlineDoctor, /Google Meet|Start consultation|Join consultation/i);
});

test("T6.11 controlled sitemap has only the homepage and no held hreflang alternates", () => {
  assert.match(launch, /controlledPublicIndexableRoutes = \["\/"\]/);
  assert.match(sitemap, /sitemapEntry\(route, now, false\)/);
  assert.match(layout, /canonical: getCanonicalUrl\("\/"\)/);
  assert.match(layout, /images: controlledPublicLaunch/);
});

test("T6.11 controlled legal pages and chrome avoid unapproved public assets", () => {
  for (const file of [
    "src/app/privacy-pdpa/page.tsx", "src/app/terms/page.tsx",
    "src/app/cookie-notice/page.tsx", "src/app/privacy-disclaimer/page.tsx",
  ]) {
    const source = read(file);
    assert.match(source, /ControlledInterimLegalPage/);
    assert.match(source, /isControlledPublicLaunch/);
  }
  assert.match(launch, /return !isControlledPublicRouteAllowed/);
});

test("T6.11 report records the remaining condition and prohibits automatic deployment", () => {
  assert.match(report, /T6\.11 CONTROLLED PUBLIC LAUNCH: READY WITH CONDITIONS/);
  assert.match(report, /vercel env rm MMS_PARTNER_SUPABASE_URL production --yes/);
  assert.match(report, /AUTHORIZE WITH CONDITIONS/);
  assert.match(report, /No deployment, DNS change, Supabase Auth write or Production record change was performed/);
});
