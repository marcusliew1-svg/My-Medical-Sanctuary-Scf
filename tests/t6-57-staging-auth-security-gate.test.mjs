import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
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
    const webGlobals = { require: localRequire, TextDecoder, Request, Response, URLSearchParams, FormData, Headers };
    vm.runInNewContext(`(function(exports, require, module, process, Buffer, URL, fetch){${outputText}\n})`, webGlobals, { filename: absolutePath })(module.exports, localRequire, module, process, Buffer, URL, fetchImpl);
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
  MMS_OPERATOR_SESSION_MAX_AGE_SECONDS: "900",
  MMS_OPERATOR_STEP_UP_MAX_AGE_SECONDS: "600",
  MMS_SITE_URL: "https://staging.scf.center",
};

test("staging origin is exact and cross-origin mutations fail closed", async () => {
  const load = createTsLoader();
  const security = load("src/lib/operatorSecurity.ts");
  const { NextRequest } = nodeRequire("next/server");
  await withEnv(stagingEnv, () => {
    const sameOrigin = new NextRequest("https://staging.scf.center/api/operations/login", { method: "POST", headers: { origin: "https://staging.scf.center", "sec-fetch-site": "same-origin" } });
    const crossOrigin = new NextRequest("https://staging.scf.center/api/operations/login", { method: "POST", headers: { origin: "https://attacker.invalid", "sec-fetch-site": "cross-site" } });
    assert.equal(security.operatorRequestOriginAllowed(sameOrigin), true);
    assert.equal(security.operatorRequestOriginAllowed(crossOrigin), false);
  });
});

test("trusted metadata enforces Owner exclusivity and administrator Operations pairing", async () => {
  const load = createTsLoader();
  const identity = load("src/lib/operatorIdentity.ts");
  await withEnv(stagingEnv, () => {
    assert.deepEqual(Array.from(identity.operatorMetadataFromUser({ id: "synthetic-exec", app_metadata: { operator_id: "exec-synthetic", operator_roles: ["admin", "operations"] } }).roles), ["admin", "operations"]);
    assert.equal(identity.operatorMetadataFromUser({ id: "bad-admin", app_metadata: { operator_id: "bad-admin", operator_roles: ["admin"] } }), null);
    assert.equal(identity.operatorMetadataFromUser({ id: "bad-owner", app_metadata: { operator_id: "bad-owner", operator_roles: ["owner", "operations"] } }), null);
    assert.deepEqual(Array.from(identity.operatorMetadataFromUser({ id: "synthetic-finance", app_metadata: { operator_id: "finance-synthetic", operator_roles: ["finance"] } }).roles), ["finance"]);
    assert.equal(identity.operatorMetadataFromUser({ id: "untrusted", user_metadata: { operator_id: "fake", operator_roles: ["owner"] } }), null);
  });
});

test("administrator can perform Operations work but cannot cross into Finance", async () => {
  const user = { id: "synthetic-exec", app_metadata: { operator_id: "exec-synthetic", operator_roles: ["admin", "operations"] } };
  const load = createTsLoader(async () => new Response(JSON.stringify(user), { status: 200, headers: { "Content-Type": "application/json" } }));
  const identity = load("src/lib/operatorIdentity.ts");
  const security = load("src/lib/operatorSecurity.ts");
  const { NextRequest } = nodeRequire("next/server");
  await withEnv(stagingEnv, async () => {
    const issued = identity.issueOperatorSession(user, { stepUp: true });
    const request = new NextRequest("https://staging.scf.center/api/internal/commerce/payments/verify", {
      method: "POST",
      headers: {
        cookie: `${security.MMS_OPERATOR_SESSION_COOKIE}=${issued.token}; ${identity.MMS_OPERATOR_ACCESS_TOKEN_COOKIE}=synthetic-access`,
        origin: "https://staging.scf.center",
        "sec-fetch-site": "same-origin",
      },
    });
    assert.equal((await security.requireOperatorMutation(request, { roles: ["operations"] })).status, "ok");
    assert.equal((await security.requireOperatorMutation(request, { roles: ["finance"], requireStepUp: true })).status, "forbidden");
  });
});

test("expired and unsigned sessions are rejected without touching a real Auth user", async () => {
  const user = { id: "synthetic-finance", app_metadata: { operator_id: "finance-synthetic", operator_roles: ["finance"] } };
  const load = createTsLoader(async () => new Response(JSON.stringify(user), { status: 200, headers: { "Content-Type": "application/json" } }));
  const identity = load("src/lib/operatorIdentity.ts");
  const security = load("src/lib/operatorSecurity.ts");
  const { NextRequest } = nodeRequire("next/server");
  await withEnv(stagingEnv, async () => {
    const issued = identity.issueOperatorSession(user);
    const [encoded] = issued.token.split(".");
    const claims = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    claims.expiresAt = new Date(Date.now() - 1_000).toISOString();
    claims.issuedAt = new Date(Date.now() - 901_000).toISOString();
    const expiredPayload = Buffer.from(JSON.stringify(claims)).toString("base64url");
    const signature = createHmac("sha256", stagingEnv.MMS_OPERATOR_SESSION_SECRET).update(expiredPayload).digest("base64url");
    const request = new NextRequest("https://staging.scf.center/api/operations/session", { headers: { cookie: `${security.MMS_OPERATOR_SESSION_COOKIE}=${expiredPayload}.${signature}; ${identity.MMS_OPERATOR_ACCESS_TOKEN_COOKIE}=synthetic-access` } });
    assert.equal((await security.authenticateOperatorRequest(request)).status, "unauthenticated");
  });
});

test("invitation acceptance resists link scanners and clears the path-scoped token", () => {
  const page = read("src/app/operations/invite/page.tsx");
  const invite = read("src/app/api/operations/invite/route.ts");
  const setup = read("src/app/api/operations/setup/route.ts");
  assert.match(page, /method="post" action="\/api\/operations\/invite"/);
  assert.match(page, /referrer: "no-referrer"/);
  assert.doesNotMatch(invite, /export async function GET/);
  assert.match(invite, /body: JSON\.stringify\(\{ token_hash: hash, type: "invite" \}\)/);
  assert.match(invite + setup, /path: "\/api\/operations\/setup", maxAge: 0/);
  assert.match(invite + setup, /operatorRequestOriginAllowed\(request\)/);
});

test("expired invitations fail closed and clear the setup credential", async () => {
  const load = createTsLoader(async () => new Response(JSON.stringify({ message: "expired" }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  }));
  const invite = load("src/app/api/operations/invite/route.ts");
  const { NextRequest } = nodeRequire("next/server");
  await withEnv(stagingEnv, async () => {
    const request = new NextRequest("https://staging.scf.center/api/operations/invite", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://staging.scf.center",
        "sec-fetch-site": "same-origin",
        "x-forwarded-for": "192.0.2.57",
      },
      body: new URLSearchParams({ token_hash: "synthetic_expired_invitation_hash_12345", type: "invite" }),
    });
    const response = await invite.POST(request);
    assert.equal(response.status, 303);
    const destination = new URL(response.headers.get("location"));
    assert.equal(destination.pathname, "/operations/setup");
    assert.equal(destination.searchParams.get("error"), "invalid_invitation");
    const cookie = response.headers.get("set-cookie") || "";
    assert.match(cookie, /mms_operator_invite_token=;/);
    assert.match(cookie, /Path=\/api\/operations\/setup/);
    assert.match(cookie, /Max-Age=0/);
  });
});

test("valid invitation and password setup keep the credential server-only and one-time", async () => {
  const fetchCalls = [];
  const loadInvite = createTsLoader(async (url, init) => {
    fetchCalls.push({ url: String(url), init });
    return new Response(JSON.stringify({ access_token: "synthetic-invite-access", expires_in: 600 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });
  const invite = loadInvite("src/app/api/operations/invite/route.ts");
  const { NextRequest } = nodeRequire("next/server");
  await withEnv(stagingEnv, async () => {
    const request = new NextRequest("https://staging.scf.center/api/operations/invite", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://staging.scf.center",
        "sec-fetch-site": "same-origin",
        "x-forwarded-for": "192.0.2.58",
      },
      body: new URLSearchParams({ token_hash: "synthetic_valid_invitation_hash_123456", type: "invite" }),
    });
    const response = await invite.POST(request);
    assert.equal(response.status, 303);
    const destination = new URL(response.headers.get("location"));
    assert.equal(destination.pathname, "/operations/setup");
    assert.equal(destination.searchParams.get("error"), null);
    assert.doesNotMatch(response.headers.get("location"), /synthetic-invite-access/);
    const cookie = response.headers.get("set-cookie") || "";
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /Secure/);
    assert.match(cookie, /SameSite=Strict/i);
    assert.match(cookie, /Path=\/api\/operations\/setup/);
    assert.equal(fetchCalls.length, 1);
  });

  const setupCalls = [];
  const loadSetup = createTsLoader(async (url, init) => {
    setupCalls.push({ url: String(url), init });
    return new Response(JSON.stringify({}), { status: 200, headers: { "Content-Type": "application/json" } });
  });
  const setup = loadSetup("src/app/api/operations/setup/route.ts");
  await withEnv(stagingEnv, async () => {
    const request = new NextRequest("https://staging.scf.center/api/operations/setup", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        cookie: "mms_operator_invite_token=synthetic-invite-access",
        origin: "https://staging.scf.center",
        "sec-fetch-site": "same-origin",
        "x-forwarded-for": "192.0.2.59",
      },
      body: new URLSearchParams({ password: "SyntheticOnly!Password57", confirm: "SyntheticOnly!Password57" }),
    });
    const response = await setup.POST(request);
    assert.equal(response.status, 303);
    assert.equal(new URL(response.headers.get("location")).pathname, "/operations/login");
    assert.equal(new URL(response.headers.get("location")).searchParams.get("setup"), "1");
    assert.match(response.headers.get("set-cookie") || "", /Max-Age=0/);
    assert.equal(setupCalls.length, 1);
    assert.equal(setupCalls[0].init.headers.Authorization, "Bearer synthetic-invite-access");
  });
});

test("sign-in creates hardened cookies and sign-out revokes and clears them", async () => {
  const user = { id: "synthetic-operations", app_metadata: { operator_id: "operations-synthetic", operator_roles: ["operations"] } };
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).endsWith("/auth/v1/token?grant_type=password")) {
      return new Response(JSON.stringify({ access_token: "synthetic-access", expires_in: 900, user }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return new Response(null, { status: 204 });
  };
  const loadLogin = createTsLoader(fetchImpl);
  const login = loadLogin("src/app/api/operations/login/route.ts");
  const { NextRequest } = nodeRequire("next/server");
  await withEnv(stagingEnv, async () => {
    const request = new NextRequest("https://staging.scf.center/api/operations/login", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://staging.scf.center",
        "sec-fetch-site": "same-origin",
        "x-forwarded-for": "192.0.2.60",
      },
      body: new URLSearchParams({ email: "operations@synthetic.invalid", password: "SyntheticOnly!Password57", next: "/operations" }),
    });
    const response = await login.POST(request);
    assert.equal(response.status, 303);
    const destination = new URL(response.headers.get("location"));
    assert.equal(destination.searchParams.get("error"), null);
    assert.equal(destination.pathname, "/operations");
    const cookies = response.headers.getSetCookie();
    assert.equal(cookies.length, 2);
    for (const cookie of cookies) {
      assert.match(cookie, /HttpOnly/);
      assert.match(cookie, /Secure/);
      assert.match(cookie, /SameSite=Strict/i);
      assert.match(cookie, /Path=\//);
      assert.match(cookie, /Max-Age=900/);
    }
  });

  const loadLogout = createTsLoader(fetchImpl);
  const logout = loadLogout("src/app/api/operations/logout/route.ts");
  await withEnv(stagingEnv, async () => {
    const request = new NextRequest("https://staging.scf.center/api/operations/logout", {
      method: "POST",
      headers: {
        cookie: "mms_operator_session=synthetic-session; mms_operator_access_token=synthetic-access",
        origin: "https://staging.scf.center",
        "sec-fetch-site": "same-origin",
      },
    });
    const response = await logout.POST(request);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).status, "signed_out");
    const cookies = response.headers.getSetCookie();
    assert.equal(cookies.length, 2);
    for (const cookie of cookies) assert.match(cookie, /Max-Age=0/);
    assert.ok(calls.some((call) => call.url.endsWith("/auth/v1/logout")));
  });
});

test("unauthenticated requests are denied by read and mutation guards", async () => {
  const load = createTsLoader();
  const readSecurity = load("src/lib/operatorReadSecurity.ts");
  const security = load("src/lib/operatorSecurity.ts");
  const { NextRequest } = nodeRequire("next/server");
  await withEnv(stagingEnv, async () => {
    const request = new NextRequest("https://staging.scf.center/api/operations/session");
    assert.equal((await readSecurity.requireOperatorRead(request, { roles: ["operations"] })).status, "unauthorized");
    assert.equal((await security.requireOperatorMutation(request, { roles: ["operations"] })).status, "unauthorized");
  });
});

test("login, step-up, invitation and setup endpoints are throttled and body-bounded", () => {
  for (const route of ["login", "step-up", "invite", "setup"]) {
    const source = read(`src/app/api/operations/${route}/route.ts`);
    assert.match(source, /checkInMemoryRateLimit/);
    assert.match(source, /bodyTooLarge\(request\)/);
  }
  assert.match(read("src/app/api/operations/login/route.ts"), /Retry-After/);
  assert.match(read("src/app/api/operations/step-up/route.ts"), /Retry-After/);
});

test("staff-facing interfaces contain no personal email address", () => {
  const roots = ["src/app/operations", "src/components/operations"];
  const files = roots.flatMap((directory) => fs.readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(?:ts|tsx)$/.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name)));
  for (const file of files) assert.doesNotMatch(fs.readFileSync(file, "utf8"), /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, file);
});

test("operator secrets remain server-only and are not assigned literal values", () => {
  const sources = [read("env.example"), read("src/lib/operatorIdentity.ts"), read("src/lib/operatorSecurity.ts")].join("\n");
  assert.doesNotMatch(sources, /NEXT_PUBLIC_MMS_OPERATOR/);
  assert.match(sources, /MMS_OPERATOR_SESSION_SECRET=/);
  assert.doesNotMatch(read("env.example"), /MMS_OPERATOR_SESSION_SECRET=.+/);
});
