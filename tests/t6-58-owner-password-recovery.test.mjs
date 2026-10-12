import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const root = process.cwd();
const nodeRequire = createRequire(import.meta.url);
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), "utf8");

function createTsLoader(fetchImpl = globalThis.fetch) {
  const cache = new Map();
  function load(relativePath) {
    const absolutePath = path.resolve(root, relativePath);
    if (cache.has(absolutePath)) return cache.get(absolutePath).exports;
    const outputText = ts.transpileModule(read(relativePath), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
      fileName: absolutePath,
    }).outputText;
    const module = { exports: {} };
    cache.set(absolutePath, module);
    const localRequire = (specifier) => {
      if (specifier === "server-only") return {};
      if (specifier.startsWith("@/")) return load(path.join("src", `${specifier.slice(2)}.ts`));
      return nodeRequire(specifier);
    };
    vm.runInNewContext(`(function(exports, require, module, process, Buffer, URL, fetch){${outputText}\n})`, { require: localRequire, TextDecoder, Request, Response, URLSearchParams, FormData, Headers }, { filename: absolutePath })(module.exports, localRequire, module, process, Buffer, URL, fetchImpl);
    return module.exports;
  }
  return load;
}

function withEnv(values, run) {
  const previous = { ...process.env };
  process.env = { ...previous, ...values };
  return Promise.resolve().then(run).finally(() => { process.env = previous; });
}

const stagingEnv = {
  NODE_ENV: "production",
  MMS_OPERATOR_ACCESS_ENABLED: "true",
  MMS_OPERATOR_SUPABASE_URL: "https://synthetic.supabase.co",
  MMS_OPERATOR_SUPABASE_PUBLISHABLE_KEY: "synthetic-publishable-key",
  MMS_OPERATOR_SESSION_SECRET: "synthetic-staging-secret-12345678901234567890",
  MMS_SITE_URL: "https://staging.scf.center",
};

test("Owner recovery request is generic and targets the configured staging recovery page", async () => {
  const calls = [];
  const load = createTsLoader(async (url, init) => {
    calls.push({ url: String(url), init });
    return new Response("{}", { status: 200 });
  });
  const route = load("src/app/api/operations/password-recovery/route.ts");
  const { NextRequest } = nodeRequire("next/server");
  await withEnv(stagingEnv, async () => {
    const request = new NextRequest("https://staging.scf.center/api/operations/password-recovery", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", origin: "https://staging.scf.center", "sec-fetch-site": "same-origin", "x-forwarded-for": "192.0.2.158" },
      body: new URLSearchParams({ username: "owner@synthetic.invalid" }),
    });
    const response = await route.POST(request);
    assert.equal(response.status, 303);
    assert.equal(new URL(response.headers.get("location")).searchParams.get("sent"), "1");
    assert.equal(calls.length, 1);
    const requestUrl = new URL(calls[0].url);
    assert.equal(requestUrl.pathname, "/auth/v1/recover");
    assert.equal(requestUrl.searchParams.get("redirect_to"), "https://staging.scf.center/operations/recovery");
    assert.equal(JSON.parse(calls[0].init.body).email, "owner@synthetic.invalid");
  });
});

test("recovery email landing is scanner-resistant and uses token_hash with recovery type", () => {
  const page = read("src/app/operations/recovery/page.tsx");
  const verify = read("src/app/api/operations/password-recovery/verify/route.ts");
  assert.match(page, /action="\/api\/operations\/password-recovery\/verify"/);
  assert.match(page, /name="token_hash"/);
  assert.match(page, /name="type" value="recovery"/);
  assert.match(page, /referrer: "no-referrer"/);
  assert.doesNotMatch(verify, /export async function GET/);
  assert.match(verify, /verifyOwnerRecoveryToken\(tokenHash\)/);
});

test("one shared Supabase recovery template can preserve Owner, Patient, and Partner callbacks", () => {
  const patient = read("src/app/api/patient-auth/password-recovery/route.ts");
  const partner = read("src/app/api/partner-auth/password-recovery/route.ts");
  assert.match(patient, /new URL\("\/api\/patient-auth\/callback", request\.url\)/);
  assert.doesNotMatch(patient, /callback\?next=/);
  assert.match(partner, /new URL\("\/api\/partner-auth\/callback", request\.url\)/);
  assert.doesNotMatch(partner, /callback\.searchParams\.set\("next"/);
});

test("only an exclusive trusted Owner identity receives a recovery credential", async () => {
  const user = { id: "synthetic-owner", app_metadata: { operator_id: "owner-synthetic", operator_roles: ["owner"] } };
  const load = createTsLoader(async () => new Response(JSON.stringify({ access_token: "synthetic-recovery-access", expires_in: 600, user }), { status: 200, headers: { "Content-Type": "application/json" } }));
  const route = load("src/app/api/operations/password-recovery/verify/route.ts");
  const { NextRequest } = nodeRequire("next/server");
  await withEnv(stagingEnv, async () => {
    const request = new NextRequest("https://staging.scf.center/api/operations/password-recovery/verify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", origin: "https://staging.scf.center", "sec-fetch-site": "same-origin", "x-forwarded-for": "192.0.2.159" },
      body: new URLSearchParams({ token_hash: "synthetic_owner_recovery_hash_123456789", type: "recovery" }),
    });
    const response = await route.POST(request);
    assert.equal(response.status, 303);
    assert.equal(new URL(response.headers.get("location")).pathname, "/operations/password-reset");
    assert.doesNotMatch(response.headers.get("location"), /synthetic-recovery-access/);
    const cookie = response.headers.get("set-cookie") || "";
    assert.match(cookie, /mms_owner_recovery_token=synthetic-recovery-access/);
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /Secure/);
    assert.match(cookie, /SameSite=Strict/i);
    assert.match(cookie, /Path=\/api\/operations\/password-reset/);
    assert.match(cookie, /Max-Age=600/);
  });
});

test("non-Owner and expired recovery links fail closed without exposing a token", async () => {
  const nonOwner = { id: "synthetic-admin", app_metadata: { operator_id: "admin-synthetic", operator_roles: ["admin", "operations"] } };
  const calls = [];
  const load = createTsLoader(async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).endsWith("/auth/v1/verify")) return new Response(JSON.stringify({ access_token: "synthetic-non-owner-access", expires_in: 600, user: nonOwner }), { status: 200, headers: { "Content-Type": "application/json" } });
    return new Response(null, { status: 204 });
  });
  const route = load("src/app/api/operations/password-recovery/verify/route.ts");
  const { NextRequest } = nodeRequire("next/server");
  await withEnv(stagingEnv, async () => {
    const request = new NextRequest("https://staging.scf.center/api/operations/password-recovery/verify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", origin: "https://staging.scf.center", "sec-fetch-site": "same-origin", "x-forwarded-for": "192.0.2.160" },
      body: new URLSearchParams({ token_hash: "synthetic_non_owner_recovery_hash_12345", type: "recovery" }),
    });
    const response = await route.POST(request);
    assert.equal(new URL(response.headers.get("location")).searchParams.get("error"), "invalid_link");
    assert.match(response.headers.get("set-cookie") || "", /Max-Age=0/);
    assert.ok(calls.some((call) => call.url.endsWith("/auth/v1/logout")));
  });

  const expired = createTsLoader(async () => new Response(JSON.stringify({ message: "expired" }), { status: 403, headers: { "Content-Type": "application/json" } }))("src/app/api/operations/password-recovery/verify/route.ts");
  await withEnv(stagingEnv, async () => {
    const request = new NextRequest("https://staging.scf.center/api/operations/password-recovery/verify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", origin: "https://staging.scf.center", "sec-fetch-site": "same-origin", "x-forwarded-for": "192.0.2.161" },
      body: new URLSearchParams({ token_hash: "synthetic_expired_recovery_hash_123456", type: "recovery" }),
    });
    const response = await expired.POST(request);
    assert.equal(new URL(response.headers.get("location")).searchParams.get("error"), "invalid_link");
  });
});

test("new password replaces the credential without requiring the old password", async () => {
  const calls = [];
  const load = createTsLoader(async (url, init) => {
    calls.push({ url: String(url), init });
    if (init?.method === "PUT") return new Response("{}", { status: 200 });
    return new Response(null, { status: 204 });
  });
  const route = load("src/app/api/operations/password-reset/route.ts");
  const { NextRequest } = nodeRequire("next/server");
  await withEnv(stagingEnv, async () => {
    const request = new NextRequest("https://staging.scf.center/api/operations/password-reset", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", cookie: "mms_owner_recovery_token=synthetic-recovery-access", origin: "https://staging.scf.center", "sec-fetch-site": "same-origin", "x-forwarded-for": "192.0.2.162" },
      body: new URLSearchParams({ password: "SyntheticOnly!Password58", confirmPassword: "SyntheticOnly!Password58" }),
    });
    const response = await route.POST(request);
    const destination = new URL(response.headers.get("location"));
    assert.equal(destination.pathname, "/operations/login");
    assert.equal(destination.searchParams.get("reset"), "1");
    assert.equal(destination.searchParams.get("next"), "/owner");
    const update = calls.find((call) => call.init?.method === "PUT");
    assert.deepEqual(JSON.parse(update.init.body), { password: "SyntheticOnly!Password58" });
    assert.doesNotMatch(update.init.body, /old/i);
    assert.ok(calls.some((call) => call.url.endsWith("/auth/v1/logout")));
    assert.match(response.headers.get("set-cookie") || "", /Max-Age=0/);
  });
});

test("a recovery session that expires before submission is rejected and cleared", async () => {
  const load = createTsLoader(async () => new Response(JSON.stringify({ message: "expired" }), { status: 401, headers: { "Content-Type": "application/json" } }));
  const route = load("src/app/api/operations/password-reset/route.ts");
  const { NextRequest } = nodeRequire("next/server");
  await withEnv(stagingEnv, async () => {
    const request = new NextRequest("https://staging.scf.center/api/operations/password-reset", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", cookie: "mms_owner_recovery_token=synthetic-expired-access", origin: "https://staging.scf.center", "sec-fetch-site": "same-origin", "x-forwarded-for": "192.0.2.163" },
      body: new URLSearchParams({ password: "SyntheticOnly!Password58", confirmPassword: "SyntheticOnly!Password58" }),
    });
    const response = await route.POST(request);
    assert.equal(new URL(response.headers.get("location")).searchParams.get("error"), "invalid_link");
    assert.match(response.headers.get("set-cookie") || "", /Max-Age=0/);
  });
});

test("Google Password Manager semantics and Owner redirect are explicit", async () => {
  const login = read("src/app/operations/login/page.tsx");
  const recovery = read("src/app/operations/password-recovery/page.tsx");
  const reset = read("src/app/operations/password-reset/page.tsx");
  const owner = read("src/app/owner/page.tsx");
  assert.match(login, /name="username"[\s\S]*autoComplete="username"/);
  assert.match(login, /name="password"[\s\S]*autoComplete="current-password"/);
  assert.match(recovery, /name="username"[\s\S]*autoComplete="username"/);
  assert.match(reset, /name="password"[\s\S]*autoComplete="new-password"/);
  assert.match(reset, /name="confirmPassword"[\s\S]*autoComplete="new-password"/);
  assert.match(owner, /operations\/login\?next=\/owner/);
  const identity = createTsLoader()("src/lib/operatorIdentity.ts");
  assert.equal(identity.safeOperatorNext("/owner"), "/owner");
  assert.equal(identity.safeOperatorNext("https://attacker.invalid"), "/operations");
});

test("recovery endpoints are origin checked, bounded, throttled, and no-store", () => {
  for (const file of [
    "src/app/api/operations/password-recovery/route.ts",
    "src/app/api/operations/password-recovery/verify/route.ts",
    "src/app/api/operations/password-reset/route.ts",
  ]) {
    const source = read(file);
    assert.match(source, /operatorRequestOriginAllowed\(request\)/);
    assert.match(source, /bodyTooLarge\(request\)/);
    assert.match(source, /checkInMemoryRateLimit/);
    assert.match(source, /no-store/);
  }
});
