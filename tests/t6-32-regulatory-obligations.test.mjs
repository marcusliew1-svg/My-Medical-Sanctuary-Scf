import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.32 defines evidence-gated regulatory obligation activation",()=>{
  const source=read("src/lib/regulatoryObligationsPolicy.ts");
  assert.match(source,/Active obligation requires an authoritative source reference/);
  assert.match(source,/Active obligation requires an accountable owner role/);
  assert.match(source,/Active obligation requires approval evidence/);
  assert.match(source,/Active obligation requires applicability rationale/);
});

test("T6.32 migration creates private fail-closed obligation register",()=>{
  const sql=read("database/migrations/0036_mms_regulatory_obligations.sql");
  assert.match(sql,/create table if not exists mms_governance\.regulatory_obligations/);
  assert.match(sql,/force row level security/);
  assert.match(sql,/revoke all on table mms_governance\.regulatory_obligations from public, anon, authenticated/);
  assert.match(sql,/completed_at is null\s+or completion_reference is not null/);
});

test("T6.32 protected endpoint makes no statutory compliance claims",()=>{
  const route=read("src/app/api/internal/operations/regulatory-obligations-policy/route.ts");
  assert.match(route,/internalApiConfigured/);
  assert.match(route,/isValidInternalBearerToken/);
  assert.match(route,/statutoryObligationsSeededByThisPhase: 0/);
  assert.match(route,/regulatoryDeadlinesClaimedByThisPhase: 0/);
  assert.match(route,/regulatorFilingsCompletedByThisPhase: 0/);
});

test("T6.32 runbook prohibits invented deadlines and obligations",()=>{
  const doc=read("docs/MMS_REGULATORY_OBLIGATIONS_RUNBOOK.md");
  assert.match(doc,/must not be invented/);
  assert.match(doc,/No Malaysia, Thailand, Singapore or other jurisdiction-specific obligation is seeded or asserted/);
  assert.match(doc,/WORKING DRAFT/);
});
