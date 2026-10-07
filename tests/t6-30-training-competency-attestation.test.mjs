import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.30 defines evidence-gated competency lifecycle",()=>{
  const source=read("src/lib/trainingCompetencyPolicy.ts");
  assert.match(source,/Competency requires a documented assessment method/);
  assert.match(source,/Competency requires an assessor role/);
  assert.match(source,/Competency requires an evidence reference/);
  assert.match(source,/Refresh-required training cannot be marked competent/);
});

test("T6.30 migration hardens existing training records without replacing them",()=>{
  const sql=read("database/migrations/0034_mms_training_competency_attestation.sql");
  assert.match(sql,/alter table mms_governance\.training_records/);
  assert.match(sql,/evidence_reference text/);
  assert.match(sql,/policy_attestation_reference text/);
  assert.match(sql,/refresh_required boolean not null default false/);
  assert.doesNotMatch(sql,/create table.*training_records/is);
});

test("T6.30 protected policy endpoint makes no competency claims",()=>{
  const route=read("src/app/api/internal/operations/training-competency-policy/route.ts");
  assert.match(route,/internalApiConfigured/);
  assert.match(route,/isValidInternalBearerToken/);
  assert.match(route,/workforceTrainingCompletedByThisPhase: 0/);
  assert.match(route,/competencyGrantedByThisPhase: 0/);
  assert.match(route,/clinicalPrivilegeGrantedByThisPhase: 0/);
});

test("T6.30 preserves partner and clinical boundaries",()=>{
  const doc=read("docs/MMS_TRAINING_COMPETENCY_ATTESTATION_RUNBOOK.md");
  assert.match(doc,/Attendance alone is not competency/);
  assert.match(doc,/does not grant:/);
  assert.match(doc,/Sales Partner training engine remains separate and unchanged/);
  assert.match(doc,/WORKING DRAFT/);
});
