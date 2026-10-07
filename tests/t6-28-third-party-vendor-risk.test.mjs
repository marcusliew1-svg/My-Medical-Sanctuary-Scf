import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.28 defines risk-tiered third-party assurance",()=>{
  const source=read("src/lib/thirdPartyRiskPolicy.ts");
  for (const tier of ["LOW","MODERATE","HIGH","CRITICAL"]) assert.match(source,new RegExp(tier));
  assert.match(source,/Critical third-party approval requires continuity evidence/);
  assert.match(source,/Critical third-party approval requires an exit plan/);
  assert.match(source,/Sensitive\/clinical third-party approval requires privacy\/data-processing terms evidence/);
});

test("T6.28 migration creates fail-closed generic vendor assurance register",()=>{
  const sql=read("database/migrations/0033_mms_third_party_assurance.sql");
  assert.match(sql,/create table if not exists mms_governance\.third_party_assessments/);
  assert.match(sql,/status not in \('APPROVED','CONDITIONAL'\)/);
  assert.match(sql,/force row level security/);
  assert.match(sql,/revoke all on table mms_governance\.third_party_assessments from public, anon, authenticated/);
});

test("T6.28 protected policy endpoint makes no vendor approval claims",()=>{
  const route=read("src/app/api/internal/operations/third-party-risk-policy/route.ts");
  assert.match(route,/internalApiConfigured/);
  assert.match(route,/isValidInternalBearerToken/);
  assert.match(route,/vendorsApprovedByThisPhase: 0/);
  assert.match(route,/productionIntegrationsActivatedByThisPhase: false/);
});

test("T6.28 runbook preserves named-vendor evidence boundary",()=>{
  const doc=read("docs/MMS_THIRD_PARTY_RISK_RUNBOOK.md");
  assert.match(doc,/does not itself approve any named vendor/i);
  assert.match(doc,/iPivot Zoho tenant must not be repurposed/i);
  assert.match(doc,/does not activate any Production integration/i);
  assert.match(doc,/WORKING DRAFT/);
});
