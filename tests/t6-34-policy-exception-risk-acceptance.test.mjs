import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.34 defines evidence-gated and time-bound exception approval",()=>{
  const source=read("src/lib/policyExceptionRiskAcceptance.ts");
  assert.match(source,/Approved exception requires approval evidence/);
  assert.match(source,/Approved exception requires an expiry timestamp/);
  assert.match(source,/High\/critical exception requires compensating controls/);
  assert.match(source,/expiry must be after its effective time/);
});

test("T6.34 migration creates private fail-closed policy exception register",()=>{
  const sql=read("database/migrations/0038_mms_policy_exception_risk_acceptance.sql");
  assert.match(sql,/create table if not exists mms_governance\.policy_exceptions/);
  assert.match(sql,/force row level security/);
  assert.match(sql,/revoke all on table mms_governance\.policy_exceptions from public, anon, authenticated/);
  assert.match(sql,/expires_at > effective_at/);
});

test("T6.34 protected endpoint makes no exception or risk-acceptance claims",()=>{
  const route=read("src/app/api/internal/operations/policy-exception-policy/route.ts");
  assert.match(route,/internalApiConfigured/);
  assert.match(route,/isValidInternalBearerToken/);
  assert.match(route,/exceptionsApprovedByThisPhase: 0/);
  assert.match(route,/risksAcceptedByThisPhase: 0/);
  assert.match(route,/productionOverridesCreatedByThisPhase: 0/);
});

test("T6.34 runbook preserves non-waivable legal and clinical boundaries",()=>{
  const doc=read("docs/MMS_POLICY_EXCEPTION_RISK_ACCEPTANCE_RUNBOOK.md");
  assert.match(doc,/An exception is a governed, time-limited departure/);
  assert.match(doc,/does not by itself override:/);
  assert.match(doc,/does not create Production overrides/);
  assert.match(doc,/WORKING DRAFT/);
});
