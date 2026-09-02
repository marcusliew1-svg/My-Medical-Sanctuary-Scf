import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();
function read(relativePath) {
  return fs.readFileSync(path.resolve(repoRoot, relativePath), "utf8");
}

test("Wave 2 Operations Console inherits the Wave 1 operator security model", () => {
  const readGuard = read("src/lib/operatorReadSecurity.ts");
  const mutationGuard = read("src/lib/operatorSecurity.ts");
  assert.match(readGuard, /authenticateOperatorRequest/);
  assert.match(readGuard, /claims\.roles\.includes\("admin"\)/);
  assert.match(mutationGuard, /Auditor access is read-only/);
  assert.match(mutationGuard, /operatorRequestOriginAllowed/);
  assert.match(mutationGuard, /Recent step-up authentication is required/);
});

test("Wave 2 read APIs are authenticated and role-scoped", () => {
  const dashboard = read("src/app/api/operations/dashboard/route.ts");
  const applications = read("src/app/api/operations/applications/route.ts");
  const payments = read("src/app/api/operations/payments/route.ts");
  const memberships = read("src/app/api/operations/memberships/route.ts");
  for (const source of [dashboard, applications, payments, memberships]) {
    assert.match(source, /requireOperatorRead/);
    assert.match(source, /status:\s*503/);
    assert.match(source, /status:\s*401/);
    assert.match(source, /status:\s*403/);
    assert.match(source, /Cache-Control/);
  }
  assert.match(payments, /roles:\s*\["finance",\s*"auditor"\]/);
});

test("Wave 2 converts dynamic Operations routes and pages to Next 16 async params", () => {
  const apiDetail = read("src/app/api/operations/applications/[applicationId]/route.ts");
  const pageDetail = read("src/app/operations/applications/[applicationId]/page.tsx");
  const applications = read("src/app/operations/applications/page.tsx");
  const finance = read("src/app/operations/finance/page.tsx");
  const memberships = read("src/app/operations/memberships/page.tsx");
  assert.match(apiDetail, /params:\s*Promise</);
  assert.match(apiDetail, /await context\.params/);
  assert.match(pageDetail, /params:\s*Promise</);
  assert.match(pageDetail, /await params/);
  for (const source of [applications, finance, memberships]) {
    assert.match(source, /searchParams\?:\s*Promise</);
    assert.match(source, /await searchParams/);
  }
});

test("Wave 2 commercial query layer remains server-side and avoids clinical fields", () => {
  const query = read("src/lib/operatorCommerceQuery.ts");
  assert.match(query, /mmsCommercialDatabaseClient/);
  assert.doesNotMatch(query, /diagnosis|prescription|labResult|clinicalNote|medicalReport|treatmentSuitability/i);
});

test("Wave 2 Finance-only application views redact direct contact fields", () => {
  const list = read("src/app/api/operations/applications/route.ts");
  const detail = read("src/app/api/operations/applications/[applicationId]/route.ts");
  for (const source of [list, detail]) {
    assert.match(source, /financeOnly/);
    assert.match(source, /customerEmail:\s*_email/);
    assert.match(source, /customerPhone:\s*_phone/);
  }
});
