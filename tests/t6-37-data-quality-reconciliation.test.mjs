import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.37 requires evidence and complete quality dimensions for PASS",()=>{
  const source=read("src/lib/dataQualityGovernancePolicy.ts");
  assert.match(source,/Assessed data quality requires evidence linkage/);
  assert.match(source,/PASS requires all core data-quality dimensions to satisfy policy/);
  assert.match(source,/PASS_WITH_LIMITATIONS requires explicit limitations/);
  assert.match(source,/Reconciliation variance requires a variance summary/);
});

test("T6.37 migration creates immutable private data-quality assessments",()=>{
  const sql=read("database/migrations/0041_mms_data_quality_reconciliation.sql");
  assert.match(sql,/create table if not exists mms_governance\.data_quality_assessments/);
  assert.match(sql,/data_quality_assessments_immutable/);
  assert.match(sql,/force row level security/);
  assert.match(sql,/revoke all on table mms_governance\.data_quality_assessments from public, anon, authenticated/);
  assert.match(sql,/freshness_state='CURRENT'/);
});

test("T6.37 protected endpoint makes no dataset trust claims",()=>{
  const route=read("src/app/api/internal/operations/data-quality-policy/route.ts");
  assert.match(route,/datasetsCertifiedByThisPhase: 0/);
  assert.match(route,/reconciliationsCompletedByThisPhase: 0/);
  assert.match(route,/productionDataDeclaredTrustedByThisPhase: false/);
  assert.match(route,/sourceConflictsOverwrittenByThisPhase: false/);
});

test("T6.37 preserves existing duplicate and reconciliation controls",()=>{
  const doc=read("docs/MMS_DATA_QUALITY_RECONCILIATION_RUNBOOK.md");
  assert.match(doc,/must not silently overwrite/);
  assert.match(doc,/Existing commercial lead duplicate review and Sales Partner registry reconciliation remain domain-specific controls/);
  assert.match(doc,/metric output and source-data trust as separate questions/);
  assert.match(doc,/WORKING DRAFT/);
});
