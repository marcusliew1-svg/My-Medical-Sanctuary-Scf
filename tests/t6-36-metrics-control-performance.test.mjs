import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.36 requires approved metric definitions and thresholds",()=>{
  const source=read("src/lib/metricGovernancePolicy.ts");
  assert.match(source,/Active metric requires approval evidence/);
  assert.match(source,/Active metric requires a calculation method/);
  assert.match(source,/Non-informational active metric requires approved traffic-light thresholds/);
  assert.match(source,/Assessed metric observation requires evidence linkage/);
});

test("T6.36 migration creates private metric definitions and immutable observations",()=>{
  const sql=read("database/migrations/0040_mms_metrics_control_performance.sql");
  assert.match(sql,/create table if not exists mms_governance\.metric_definitions/);
  assert.match(sql,/create table if not exists mms_governance\.metric_observations/);
  assert.match(sql,/metric_observations_immutable/);
  assert.match(sql,/force row level security/);
  assert.match(sql,/revoke all on table mms_governance\.metric_observations from public, anon, authenticated/);
  assert.match(sql,/threshold_state = 'NOT_ASSESSED'\s+or evidence_id is not null/);
});

test("T6.36 protected endpoint makes no KPI or monitoring claims",()=>{
  const route=read("src/app/api/internal/operations/metric-governance-policy/route.ts");
  assert.match(route,/metricsActivatedByThisPhase: 0/);
  assert.match(route,/kpiTargetsApprovedByThisPhase: 0/);
  assert.match(route,/metricObservationsCreatedByThisPhase: 0/);
  assert.match(route,/productionMonitoringConfiguredByThisPhase: false/);
});

test("T6.36 runbook keeps operational counters separate from approved KPIs",()=>{
  const doc=read("docs/MMS_METRICS_CONTROL_PERFORMANCE_RUNBOOK.md");
  assert.match(doc,/must not be reverse-engineered/);
  assert.match(doc,/does not silently convert those counters into approved KPIs/);
  assert.match(doc,/A green metric is a measured result against an approved threshold/);
  assert.match(doc,/WORKING DRAFT/);
});
