import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.29 enforces audit lifecycle and completion evidence",()=>{
  const source=read("src/lib/auditAssurancePolicy.ts");
  assert.match(source,/PLANNED: \["IN_PROGRESS", "CANCELLED"\]/);
  assert.match(source,/REPORTING: \["COMPLETE", "IN_PROGRESS"\]/);
  assert.match(source,/Completed audit requires a report reference/);
  assert.match(source,/Completed audit requires an overall rating/);
  assert.match(source,/Completed audit requires a completion timestamp/);
});

test("T6.29 prevents unsupported control effectiveness conclusions",()=>{
  const source=read("src/lib/auditAssurancePolicy.ts");
  assert.match(source,/A control must remain NOT_TESTED until actual test evidence exists/);
  assert.match(source,/Control effectiveness conclusion requires evidence/);
  assert.match(source,/requires test timestamp/);
  assert.match(source,/requires documented test method/);
});

test("T6.29 protected endpoint claims no fabricated audit results",()=>{
  const route=read("src/app/api/internal/operations/audit-assurance-policy/route.ts");
  assert.match(route,/internalApiConfigured/);
  assert.match(route,/isValidInternalBearerToken/);
  assert.match(route,/auditsCompletedByThisPhase: 0/);
  assert.match(route,/controlsMarkedEffectiveByThisPhase: 0/);
  assert.match(route,/externalCertificationClaimedByThisPhase: false/);
});

test("T6.29 reuses canonical governance assurance records",()=>{
  const migration=read("database/migrations/0026_mms_operating_system_governance.sql");
  for (const table of ["audits","controls","capa_actions","risks","governance_audit_events"]) {
    assert.match(migration,new RegExp(`mms_governance\\.${table}`));
  }
  const doc=read("docs/MMS_AUDIT_CONTROL_ASSURANCE_RUNBOOK.md");
  assert.match(doc,/rather than creating a competing assurance database/);
  assert.match(doc,/does not itself complete an audit/);
  assert.match(doc,/WORKING DRAFT/);
});
