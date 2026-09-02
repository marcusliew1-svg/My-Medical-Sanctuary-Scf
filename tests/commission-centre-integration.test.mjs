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

function loadLedger() {
  const source = read("src/lib/partnerCommissionLedger.ts");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  const context = vm.createContext({ module, exports: module.exports, Date, Error, Math, Number, String });
  const localRequire = (specifier) => {
    if (specifier === "@/lib/salesPartnerPolicy") {
      return {
        calculateCommissionMinorUnits: (amount, rate) => Math.round(amount * rate),
        normalisePartnerId: (value) => String(value || "").trim() || null,
        validateCommissionRule: () => undefined,
      };
    }
    if (specifier === "@/lib/partnerCommercialModel") return {};
    throw new Error(`Unexpected test dependency: ${specifier}`);
  };
  vm.runInContext(`(function (exports, require, module) { ${compiled}\n})(module.exports, localRequire, module);`, vm.createContext({ ...context, module, localRequire }));
  return module.exports;
}

function eligibleTransaction(overrides = {}) {
  return {
    transactionId: "COM-TEST-0001",
    partnerId: "MMS-P-001",
    applicationId: "APP-TEST-0001",
    paymentId: "PAY-TEST-0001",
    membershipId: "MEM-TEST-0001",
    memberReference: "MEMBER-001",
    membershipCode: "Ascend",
    paymentTransactionReference: "TXN-001",
    currency: "MYR",
    eligibleRevenueMinorUnits: 100000,
    commissionRuleVersion: "synthetic-v1",
    partnerLevelAtEligibility: "Alliance",
    commissionRate: 0.1,
    grossCommissionMinorUnits: 10000,
    adjustmentMinorUnits: 0,
    approvedCommissionMinorUnits: 0,
    status: "Eligible",
    eligibility: {
      checkedBy: "MMS-OP-001",
      checkedAt: "2026-08-25T01:00:00.000Z",
      partnerId: "MMS-P-001",
      partnerLevel: "Alliance",
      attributionVerified: true,
      paymentCleared: true,
      membershipActive: true,
      cancellationClear: true,
      complianceClear: true,
      ruleVersion: "synthetic-v1",
    },
    ...overrides,
  };
}

test("unauthenticated commission reads inherit the authenticated Wave 2 guard", () => {
  for (const route of ["src/app/api/operations/commissions/route.ts", "src/app/api/operations/commissions/[transactionId]/route.ts"]) {
    const source = read(route);
    assert.match(source, /requireOperatorRead/);
    assert.match(source, /status:\s*401/);
  }
});

test("wrong-role commission reads are denied", () => {
  const routes = read("src/app/api/operations/commissions/route.ts") + read("src/app/api/operations/commissions/[transactionId]/route.ts");
  assert.match(routes, /roles:\s*\["finance",\s*"auditor"\]/);
  assert.match(routes, /status:\s*403/);
});

test("auditor commission access is read-only", () => {
  const api = read("src/app/api/operations/commissions/[transactionId]/route.ts");
  const client = read("src/components/operations/CommissionDetailClient.tsx");
  assert.match(api, /canMutate = operator\.claims\.roles\.includes\("admin"\) \|\| operator\.claims\.roles\.includes\("finance"\)/);
  assert.match(client, /canMutate \? <>/);
  assert.match(client, /read-only access/);
});

test("commission mutations require Finance authority", () => {
  for (const action of ["approve", "pay", "reverse", "hold"]) {
    assert.match(read(`src/app/api/internal/commerce/commissions/${action}/route.ts`), /roles:\s*\["finance"\]/);
  }
});

test("commission mutations inherit cross-origin rejection", () => {
  const security = read("src/lib/operatorSecurity.ts");
  assert.match(security, /operatorRequestOriginAllowed/);
  assert.match(security, /origin !== allowedOrigin/);
});

test("sensitive Finance commission actions require recent step-up", () => {
  for (const action of ["approve", "pay", "reverse"]) {
    assert.match(read(`src/app/api/internal/commerce/commissions/${action}/route.ts`), /requireStepUp:\s*true/);
  }
});

test("authorised Finance actions use the current mutation guard", () => {
  for (const action of ["approve", "pay", "reverse", "hold"]) {
    assert.match(read(`src/app/api/internal/commerce/commissions/${action}/route.ts`), /requireOperatorMutation/);
  }
});

test("commission actors are server-derived", () => {
  for (const action of ["approve", "pay", "reverse", "hold"]) {
    assert.match(read(`src/app/api/internal/commerce/commissions/${action}/route.ts`), /operator\.actor/);
  }
});

test("commission mutation timestamps are server-derived", () => {
  for (const action of ["approve", "pay", "reverse", "hold"]) {
    assert.match(read(`src/app/api/internal/commerce/commissions/${action}/route.ts`), /operator\.occurredAt/);
  }
});

test("valid commission lifecycle transition records immutable event context", () => {
  const ledger = loadLedger();
  const result = ledger.approveCommissionTransaction({
    transaction: eligibleTransaction(),
    approvedBy: "MMS-FIN-001",
    approvedAt: "2026-08-25T02:00:00.000Z",
  });
  assert.equal(result.transaction.status, "Approved");
  assert.equal(result.event.previousStatus, "Eligible");
  assert.equal(result.event.nextStatus, "Approved");
  assert.equal(result.event.actor, "MMS-FIN-001");
});

test("invalid commission lifecycle transition is rejected", () => {
  const ledger = loadLedger();
  assert.throws(() => ledger.markCommissionPaid({
    transaction: eligibleTransaction(),
    payoutBatchId: "BATCH-001",
    payoutReference: "PAYOUT-001",
    paidBy: "MMS-FIN-001",
    paidAt: "2026-08-25T03:00:00.000Z",
  }), /Only Approved commission can be marked Paid/);
});

test("paid commission reversal records full clawback and event", () => {
  const ledger = loadLedger();
  const transaction = eligibleTransaction({ status: "Paid", approvedCommissionMinorUnits: 10000 });
  const result = ledger.reverseCommissionForCancellation({
    transaction,
    actor: "MMS-FIN-001",
    occurredAt: "2026-08-25T04:00:00.000Z",
    reason: "Synthetic cancellation test",
  });
  assert.equal(result.transaction.status, "Reversed");
  assert.equal(result.transaction.clawbackMinorUnits, 10000);
  assert.equal(result.event.previousStatus, "Paid");
});

test("commission query and API avoid clinical fields", () => {
  const source = read("src/lib/operatorCommissionQuery.ts") + read("src/app/api/operations/commissions/route.ts") + read("src/app/api/operations/commissions/[transactionId]/route.ts");
  assert.doesNotMatch(source, /diagnosis|prescription|medication|lab_result|clinical_note|treatment_suitability|doctor_comment|medical_report/i);
});

test("commission client modules contain no database or server-secret access", () => {
  const source = read("src/components/operations/CommissionQueueClient.tsx") + read("src/components/operations/CommissionDetailClient.tsx");
  assert.doesNotMatch(source, /from\s+["']pg["']|MMS_COMMERCIAL_DATABASE_URL|SUPABASE_SERVICE_ROLE|MMS_INTERNAL_API_TOKEN/);
});

test("disabled operator feature gate fails Commission Centre closed", () => {
  const gates = read("src/lib/featureGates.ts");
  const proxy = read("src/proxy.ts");
  assert.match(gates, /prefix:\s*"\/operations",\s*feature:\s*"operatorAccess"/);
  assert.match(gates, /prefix:\s*"\/api\/operations",\s*feature:\s*"operatorAccess"/);
  assert.match(proxy, /unavailableFeatureForPath/);
  assert.match(proxy, /status:\s*404/);
});

test("Commission Centre dynamic params use Next 16 asynchronous APIs", () => {
  const api = read("src/app/api/operations/commissions/[transactionId]/route.ts");
  const page = read("src/app/operations/commissions/[transactionId]/page.tsx");
  assert.match(api, /params:\s*Promise/);
  assert.match(api, /await context\.params/);
  assert.match(page, /params:\s*Promise/);
  assert.match(page, /await params/);
});

test("commission query module is server-only", () => {
  assert.match(read("src/lib/operatorCommissionQuery.ts"), /^import "server-only";/);
});
