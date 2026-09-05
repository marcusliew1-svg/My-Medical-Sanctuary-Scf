import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const root = process.cwd();
const nodeRequire = createRequire(import.meta.url);

function read(relativePath) {
  return fs.readFileSync(path.resolve(root, relativePath), "utf8");
}

function createTsLoader(fetchImpl = globalThis.fetch) {
  const cache = new Map();
  function loadTsModule(relativePath) {
    const absolutePath = path.resolve(root, relativePath);
    if (cache.has(absolutePath)) return cache.get(absolutePath).exports;
    const outputText = ts.transpileModule(read(relativePath), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
      fileName: absolutePath,
    }).outputText;
    const module = { exports: {} };
    cache.set(absolutePath, module);
    function localRequire(specifier) {
      if (specifier === "server-only") return {};
      if (specifier === "@/lib/salesPartnerPolicy") {
        return { normalisePartnerId: (value) => /^MMSP-[0-9]{4,}$/.test(String(value || "").toUpperCase()) ? String(value).toUpperCase() : null };
      }
      if (specifier.startsWith("@/")) return loadTsModule(path.join("src", `${specifier.slice(2)}.ts`));
      return nodeRequire(specifier);
    }
    vm.runInNewContext(`(function(exports,require,module,process,fetch,URL){${outputText}\n})`, { require: localRequire })(module.exports, localRequire, module, process, fetchImpl, URL);
    return module.exports;
  }
  return loadTsModule;
}

function withEnv(values, run) {
  const previous = { ...process.env };
  process.env = { ...previous, ...values };
  try { return run(); } finally { process.env = previous; }
}

test("Partner Hub and auth entry routes fail closed when disabled", () => {
  const load = createTsLoader();
  const gates = load("src/lib/featureGates.ts");
  withEnv({ VERCEL_ENV: "production", MMS_PARTNER_HUB_ENABLED: "false" }, () => {
    for (const route of ["/partner-hub", "/partner-login", "/partner-password-recovery", "/partner-password-update", "/api/partner-auth/login"]) {
      assert.equal(gates.unavailableFeatureForPath(route), "partnerHub");
    }
  });
});

test("unauthenticated Partner pages are redirected by the server layout", () => {
  const layout = read("src/app/partner-hub/layout.tsx");
  assert.match(layout, /await cookies\(\)/);
  assert.match(layout, /authenticatePartnerHubTokens/);
  assert.match(layout, /redirect\(`\/partner-login/);
});

test("successful login requires Supabase identity and database session issuance", () => {
  const route = read("src/app/api/partner-auth/login/route.ts");
  assert.match(route, /signInPartnerIdentity/);
  assert.match(route, /partnerMetadataFromUser/);
  assert.match(route, /issuePartnerHubSession/);
  assert.match(route, /MMS_PARTNER_SESSION_COOKIE/);
  assert.match(route, /MMS_PARTNER_ACCESS_TOKEN_COOKIE/);
});

test("invalid login uses a generic response without account enumeration", () => {
  const route = read("src/app/api/partner-auth/login/route.ts");
  const page = read("src/app/partner-login/page.tsx");
  assert.match(route, /invalid_credentials/);
  assert.match(page, /sign-in details were not accepted/);
  assert.doesNotMatch(page, /account does not exist|email is registered/i);
});

test("Partner identity is derived only from app_metadata", () => {
  const load = createTsLoader();
  const identity = load("src/lib/partnerIdentity.ts");
  assert.deepEqual(
    JSON.parse(JSON.stringify(identity.partnerMetadataFromUser({ id: "user-123", app_metadata: { partner_id: "mmsp-1001" } }))),
    { partnerId: "MMSP-1001", subject: "user-123" },
  );
  assert.equal(identity.partnerMetadataFromUser({ id: "user-123", user_metadata: { partner_id: "MMSP-1001" } }), null);
});

test("client Partner ID tampering is not accepted by login", () => {
  const route = read("src/app/api/partner-auth/login/route.ts");
  assert.doesNotMatch(route, /form\.partnerId|form\.partnerCode|searchParams.*partner/i);
  assert.match(route, /metadata\.partnerId/);
});

test("suspended and inactive workflow stages cannot create or retain a Partner session", () => {
  const issuer = read("src/lib/partnerHubSessionIssuer.ts");
  const verifier = read("src/lib/partnerHubSessionPostgres.ts");
  assert.match(issuer, /p\.stage in \('Approved','Agreement Pending','Training','Active'\)/);
  assert.doesNotMatch(issuer, /p\.stage in \([^)]*'(Applicant|Under Review|Suspended|Inactive|Rejected)'/);
  assert.match(verifier, /\["Approved", "Agreement Pending", "Training", "Active"\]\.includes\(row\.partner_stage\)/);
});

test("operator metadata does not imply Partner access", () => {
  const load = createTsLoader();
  const identity = load("src/lib/partnerIdentity.ts");
  assert.equal(identity.partnerMetadataFromUser({ id: "operator-1", app_metadata: { operator_id: "MMS-OP-1", operator_roles: ["admin"] } }), null);
});

test("Partner metadata does not imply Operator access", () => {
  const partner = read("src/lib/partnerIdentity.ts");
  const operator = read("src/lib/operatorIdentity.ts");
  assert.doesNotMatch(partner, /operator_id|operator_roles/);
  assert.match(operator, /app_metadata\?\.operator_id/);
  assert.doesNotMatch(operator, /partner_id/);
});

test("logout revokes both identity layers and clears only Partner cookies", () => {
  const route = read("src/app/api/partner-hub/logout/route.ts");
  assert.match(route, /partnerHubSessionProvider\(\)\.revoke/);
  assert.match(route, /signOutPartnerIdentity/);
  assert.match(route, /MMS_PARTNER_SESSION_COOKIE, MMS_PARTNER_ACCESS_TOKEN_COOKIE/);
  assert.doesNotMatch(route, /MMS_OPERATOR_SESSION_COOKIE|MMS_PARTNER_REFERRAL_COOKIE/);
});

test("password reset requests return a generic response", () => {
  const route = read("src/app/api/partner-auth/password-recovery/route.ts");
  assert.match(route, /genericResponse/);
  assert.match(read("src/app/partner-password-recovery/page.tsx"), /response is the same whether or not an account exists/);
});

test("invalid and expired recovery links fail safely", () => {
  const callback = read("src/app/api/partner-auth/callback/route.ts");
  assert.match(callback, /invalid_link/);
  assert.match(callback, /verified\.status !== "ok"/);
});

test("valid password recovery uses token-hash verification and a short HttpOnly cookie", () => {
  const callback = read("src/app/api/partner-auth/callback/route.ts");
  const update = read("src/app/api/partner-auth/password-update/route.ts");
  assert.match(callback, /verifyPartnerAuthTokenHash/);
  assert.match(callback, /Math\.min\(600/);
  assert.match(update, /updatePartnerPassword/);
  assert.match(update, /password\.length < 12/);
});

test("email verification never creates or approves a Partner", () => {
  const callback = read("src/app/api/partner-auth/callback/route.ts");
  assert.doesNotMatch(callback, /issuePartnerHubSession|mms_commercial\.partners|update\s+mms/i);
  assert.match(callback, /signOutPartnerIdentity/);
});

test("open redirects are rejected", () => {
  const load = createTsLoader();
  const identity = load("src/lib/partnerIdentity.ts");
  assert.equal(identity.safePartnerNext("https://evil.example/path"), "/partner-hub");
  assert.equal(identity.safePartnerNext("//evil.example/path"), "/partner-hub");
  assert.equal(identity.safePartnerNext("/operations"), "/partner-hub");
  assert.equal(identity.safePartnerNext("/partner-hub/leads"), "/partner-hub/leads");
});

test("cross-origin auth mutations are rejected", () => {
  for (const route of ["login", "password-recovery", "password-update"]) {
    assert.match(read(`src/app/api/partner-auth/${route}/route.ts`), /partnerAuthOriginAllowed/);
  }
});

test("wrong-Partner lead access remains denied", () => {
  const leads = read("src/app/api/partner-hub/leads/route.ts");
  assert.match(leads, /listOwnedByPartner\(auth\.partnerId\)/);
  assert.match(leads, /currentPartnerId !== auth\.partnerId/);
});

test("wrong-Partner commission access remains denied", () => {
  const wallet = read("src/app/api/partner-hub/commission-wallet/route.ts");
  assert.match(wallet, /loadPartnerCommissionWallet\(authorization\.partnerId\)/);
  assert.match(wallet, /result\.value\.partnerId !== authorization\.partnerId/);
});

test("Partner APIs expose no clinical fields", () => {
  const paths = ["dashboard", "leads", "commercial-status", "commission-wallet", "academy", "presentation-centre"];
  const source = paths.map((name) => read(`src/app/api/partner-hub/${name}/route.ts`)).join("\n");
  assert.doesNotMatch(source, /diagnosis|prescription|medication|lab_result|clinical_note|doctor_note|medical_report|treatment_suitability/i);
});

test("Supabase service keys and tokens cannot enter the Partner client bundle", () => {
  const identity = read("src/lib/partnerIdentity.ts");
  const client = read("src/components/PartnerHubSignOutButton.tsx");
  assert.match(identity, /^import "server-only";/);
  assert.doesNotMatch(identity, /service.role|SERVICE_ROLE|NEXT_PUBLIC_/i);
  assert.doesNotMatch(client, /SUPABASE|access_token|refresh_token|MMS_PARTNER_SUPABASE/);
});

test("locale prefixes cannot bypass disabled auth routes", () => {
  const load = createTsLoader();
  const gates = load("src/lib/featureGates.ts");
  withEnv({ VERCEL_ENV: "production", MMS_PARTNER_HUB_ENABLED: "false" }, () => {
    for (const locale of ["ms", "zh", "th"]) {
      assert.equal(gates.unavailableFeatureForPath(`/${locale}/partner-hub`), "partnerHub");
      assert.equal(gates.unavailableFeatureForPath(`/${locale}/partner-login`), "partnerHub");
    }
  });
});

test("Partner auth uses Next 16 asynchronous request APIs", () => {
  assert.match(read("src/app/partner-hub/layout.tsx"), /await cookies\(\)/);
  for (const page of ["partner-login", "partner-password-recovery", "partner-password-update"]) {
    const source = read(`src/app/${page}/page.tsx`);
    assert.match(source, /searchParams\?: Promise/);
    assert.match(source, /await searchParams/);
  }
});

test("Partner sessions are revalidated against Supabase subject and Partner ID", () => {
  const auth = read("src/lib/partnerHubRequestAuth.ts");
  assert.match(auth, /getPartnerIdentityUser/);
  assert.match(auth, /metadata\.subject !== claims\.subject/);
  assert.match(auth, /metadata\.partnerId !== claims\.partnerId/);
});

test("authenticated Partner mutations retain same-origin and session-bound CSRF", () => {
  const security = read("src/lib/partnerHubMutationSecurity.ts");
  assert.match(security, /origin !== allowedOrigin/);
  assert.match(security, /sessionId: claims\.sessionId/);
  assert.match(security, /MMS_PARTNER_CSRF_HEADER/);
});

test("public self-registration does not activate Partner access", () => {
  assert.equal(fs.existsSync(path.resolve(root, "src/app/api/partner-auth/register/route.ts")), false);
  assert.match(read("src/app/partner-login/page.tsx"), /\/join-mms/);
});

test("Partner access tokens are short-lived HttpOnly Strict cookies without refresh cookies", () => {
  const identity = read("src/lib/partnerIdentity.ts");
  const login = read("src/app/api/partner-auth/login/route.ts");
  assert.match(identity, /httpOnly:\s*true/);
  assert.match(identity, /sameSite:\s*"strict"/);
  assert.match(login, /issued\.maxAge/);
  assert.doesNotMatch(login, /refresh_token/);
});
