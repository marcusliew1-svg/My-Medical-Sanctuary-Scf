import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.39 separates implementation from effectiveness and closure",()=>{
  const source=read("src/lib/capaEffectivenessPolicy.ts");
  assert.match(source,/Implemented CAPA requires root-cause evidence/);
  assert.match(source,/Implemented CAPA requires implementation evidence/);
  assert.match(source,/Closed CAPA requires effectiveness evidence/);
  assert.match(source,/Closed CAPA requires an EFFECTIVE outcome/);
});

test("T6.39 migration hardens CAPA and adds immutable effectiveness reviews",()=>{
  const sql=read("database/migrations/0043_mms_capa_effectiveness_assurance.sql");
  assert.match(sql,/alter table mms_governance\.capa_actions/);
  assert.match(sql,/create table if not exists mms_governance\.capa_effectiveness_reviews/);
  assert.match(sql,/capa_effectiveness_reviews_immutable/);
  assert.match(sql,/effectiveness_result = 'EFFECTIVE'/);
  assert.match(sql,/force row level security/);
});

test("T6.39 protected endpoint makes no real remediation closure claims",()=>{
  const route=read("src/app/api/internal/operations/capa-effectiveness-policy/route.ts");
  assert.match(route,/capasClosedByThisPhase: 0/);
  assert.match(route,/capaEffectivenessConclusionsCreatedByThisPhase: 0/);
  assert.match(route,/existingCapaReclassifiedByThisPhase: false/);
  assert.match(route,/sourceFindingsClosedByThisPhase: 0/);
});

test("T6.39 preserves the real T6.18 CAPA boundary",()=>{
  const doc=read("docs/MMS_CAPA_EFFECTIVENESS_RUNBOOK.md");
  assert.match(doc,/CAPA-T618-ZOHO-TENANT/);
  assert.match(doc,/remains .*IN_PROGRESS/);
  assert.match(doc,/does not fabricate implementation evidence or effectiveness results/);
  assert.match(doc,/CAPA closure does not automatically close its source record/);
});
