import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.22 exposes a minimal non-secret public liveness endpoint",()=>{
  const route=read("src/app/api/status/route.ts");
  assert.match(route,/status: "ok"/);
  assert.match(route,/service: "mms-web"/);
  assert.match(route,/X-Request-Id/);
  assert.doesNotMatch(route,/process\.env|database|zoho|feature/i);
});

test("T6.22 protects detailed readiness behind existing internal bearer auth",()=>{
  const route=read("src/app/api/internal/operations/readiness/route.ts");
  assert.match(route,/internalApiConfigured/);
  assert.match(route,/isValidInternalBearerToken/);
  assert.match(route,/probeMmsCommercialDatabase/);
  assert.match(route,/zohoDayOneCommercialReadiness/);
  assert.match(route,/status: ready \? "ready" : "degraded"/);
  assert.match(route,/No credentials, tokens, database URLs, SQL text or Zoho secret values/);
});

test("T6.22 structured logs redact likely credentials and preserve request correlation",()=>{
  const source=read("src/lib/operationalObservability.ts");
  assert.match(source,/authorization\|cookie\|secret\|token\|password\|credential/);
  assert.match(source,/\[redacted\]/);
  assert.match(source,/randomUUID/);
  assert.match(source,/x-request-id/);
  assert.match(source,/JSON\.stringify/);
});

test("T6.22 CI gates operational resilience regressions",()=>{
  const pkg=JSON.parse(read("package.json"));
  assert.match(pkg.scripts["test:t6-22"],/t6-22-operational-resilience/);
  assert.match(read(".github/workflows/ci.yml"),/T6\.22 operational resilience tests/);
});
