import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
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

    const source = fs.readFileSync(absolutePath, "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
      fileName: absolutePath,
    });
    const module = { exports: {} };
    cache.set(absolutePath, module);

    function localRequire(specifier) {
      if (specifier === "server-only") return {};
      if (specifier.startsWith("@/")) return loadTsModule(path.join("src", `${specifier.slice(2)}.ts`));
      return nodeRequire(specifier);
    }

    vm.runInNewContext(
      `(function (exports, require, module, process, Buffer, URL, fetch) { ${outputText}\n})`,
      { require: localRequire },
      { filename: absolutePath },
    )(module.exports, localRequire, module, process, Buffer, URL, fetchImpl);
    return module.exports;
  }

  return loadTsModule;
}

const loadTsModule = createTsLoader();

function withEnv(values, run) {
  const previous = { ...process.env };
  process.env = { ...previous, ...values };
  try {
    return run();
  } finally {
    process.env = previous;
  }
}

test("operator routes are explicit default-off gates", () => {
  const { unavailableFeatureForPath } = loadTsModule("src/lib/featureGates.ts");

  for (const environment of ["production", "preview"]) {
    withEnv({ VERCEL_ENV: environment, MMS_OPERATOR_ACCESS_ENABLED: "false" }, () => {
      assert.equal(unavailableFeatureForPath("/operations/login"), "operatorAccess");
      assert.equal(unavailableFeatureForPath("/api/operations/session"), "operatorAccess");
      assert.equal(unavailableFeatureForPath("/api/internal/commerce/payments/verify"), null);
    });
  }

  withEnv({ VERCEL_ENV: "preview", MMS_OPERATOR_ACCESS_ENABLED: "true" }, () => {
    assert.equal(unavailableFeatureForPath("/operations/login"), null);
    assert.equal(unavailableFeatureForPath("/api/internal/commerce/payments/verify"), null);
  });
});

test("operator security is server-only, signed, revalidated and origin-bound", () => {
  const security = read("src/lib/operatorSecurity.ts");
  const identity = read("src/lib/operatorIdentity.ts");

  assert.match(security, /^import "server-only";/);
  assert.match(identity, /^import "server-only";/);
  assert.match(security, /createHmac/);
  assert.match(security, /timingSafeEqual/);
  assert.match(security, /getOperatorIdentityUser/);
  assert.match(security, /rolesMatch/);
  assert.match(security, /origin !== allowedOrigin/);
  assert.match(security, /Recent step-up authentication is required/);
  assert.match(identity, /app_metadata\?\.operator_id/);
  assert.match(identity, /app_metadata\?\.operator_roles/);
  assert.doesNotMatch(identity, /user_metadata/);
});

test("authorized same-origin operator mutation succeeds with server-derived identity", async () => {
  const user = {
    id: "synthetic-user-001",
    email: "operator@example.invalid",
    app_metadata: { operator_id: "MMS-OP-001", operator_roles: ["finance"] },
  };
  const loader = createTsLoader(async (url) => {
    assert.match(String(url), /\/auth\/v1\/user$/);
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });
  const identity = loader("src/lib/operatorIdentity.ts");
  const security = loader("src/lib/operatorSecurity.ts");
  const { NextRequest } = nodeRequire("next/server");
  const previous = { ...process.env };

  try {
    process.env = {
      ...previous,
      MMS_OPERATOR_ACCESS_ENABLED: "true",
      MMS_OPERATOR_SUPABASE_URL: "https://example.supabase.co",
      MMS_OPERATOR_SUPABASE_PUBLISHABLE_KEY: "synthetic-key",
      MMS_OPERATOR_SESSION_SECRET: "synthetic-test-secret-12345678901234567890",
      MMS_OPERATOR_SESSION_MAX_AGE_SECONDS: "900",
      MMS_OPERATOR_STEP_UP_MAX_AGE_SECONDS: "600",
      MMS_SITE_URL: "https://www.scf.center",
    };
    const issued = identity.issueOperatorSession(user, { stepUp: true });
    assert.ok(issued?.token);

    const request = new NextRequest("https://www.scf.center/api/internal/commerce/payments/verify", {
      method: "POST",
      headers: {
        Cookie: `${security.MMS_OPERATOR_SESSION_COOKIE}=${issued.token}; ${identity.MMS_OPERATOR_ACCESS_TOKEN_COOKIE}=synthetic-access-token`,
        Origin: "https://www.scf.center",
        "Sec-Fetch-Site": "same-origin",
      },
    });
    const result = await security.requireOperatorMutation(request, {
      roles: ["finance"],
      requireStepUp: true,
    });

    assert.equal(result.status, "ok");
    assert.equal(result.actor, "MMS-OP-001");
  } finally {
    process.env = previous;
  }
});

test("operator cookies are short-lived and hardened", () => {
  const identity = read("src/lib/operatorIdentity.ts");
  const logout = read("src/app/api/operations/logout/route.ts");

  assert.match(identity, /httpOnly:\s*true/);
  assert.match(identity, /sameSite:\s*"strict"/);
  assert.match(identity, /secure:\s*process\.env\.NODE_ENV === "production"/);
  assert.match(identity, /Math\.min\(Math\.max\(Math\.floor\(raw\), 300\), 3600\)/);
  assert.doesNotMatch(identity, /REFRESH_TOKEN_COOKIE/);
  assert.match(logout, /signOutOperatorIdentity/);
  assert.match(logout, /maxAge:\s*0/);
});

test("operator authentication mutations reject cross-origin posts", () => {
  for (const route of ["login", "logout", "step-up"]) {
    assert.match(read(`src/app/api/operations/${route}/route.ts`), /operatorRequestOriginAllowed/);
  }
});

test("commercial mutations use verified operator actors instead of request actors", () => {
  const routeRoot = path.resolve(root, "src/app/api/internal/commerce");
  const routes = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(target);
      if (entry.isFile() && entry.name === "route.ts") routes.push(target);
    }
  };
  visit(routeRoot);

  const converted = routes.filter((route) => read(path.relative(root, route)).includes("requireOperatorMutation"));
  assert.equal(converted.length, 13);
  for (const route of converted) {
    const source = fs.readFileSync(route, "utf8");
    assert.doesNotMatch(source, /isValid(?:Internal|Finance)BearerToken/);
    assert.match(source, /operator\.actor|operator\.occurredAt/);
  }
});

test("Finance-sensitive mutations require step-up", () => {
  for (const relativePath of [
    "src/app/api/internal/commerce/payments/verify/route.ts",
    "src/app/api/internal/commerce/commissions/approve/route.ts",
    "src/app/api/internal/commerce/commissions/pay/route.ts",
    "src/app/api/internal/commerce/commissions/reverse/route.ts",
    "src/app/api/internal/commerce/memberships/cancel/route.ts",
    "src/app/api/internal/commerce/leads/transfer-ownership/route.ts",
  ]) {
    assert.match(read(relativePath), /requireStepUp:\s*true/);
  }
});

test("operator pages use Next 16 asynchronous searchParams", () => {
  for (const page of ["src/app/operations/login/page.tsx", "src/app/operations/step-up/page.tsx"]) {
    const source = read(page);
    assert.match(source, /searchParams\?: Promise</);
    assert.match(source, /await searchParams/);
  }
});

test("operator environment variables remain server-only", () => {
  const env = read("env.example");
  assert.match(env, /MMS_OPERATOR_ACCESS_ENABLED=false/);
  assert.match(env, /MMS_OPERATOR_STEP_UP_MAX_AGE_SECONDS=600/);
  assert.doesNotMatch(env, /NEXT_PUBLIC_MMS_OPERATOR/);
});

test("approved T1 database client remains authoritative", () => {
  const database = read("src/lib/mmsCommercialDatabaseClient.ts");
  assert.match(database, /^import "server-only";/);
  assert.match(database, /import pg from "pg"/);
  assert.doesNotMatch(database, /createRequire|eval\("require"\)/);
  assert.equal(fs.existsSync(path.resolve(root, "src/types/pg.d.ts")), false);
});
