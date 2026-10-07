import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.33 defines evidence-gated management review completion",()=>{
  const source=read("src/lib/managementReviewPolicy.ts");
  assert.match(source,/Completed management review requires an evidence-pack reference/);
  assert.match(source,/Completed management review requires minutes/);
  assert.match(source,/Completed management review requires an action-register reference/);
  assert.match(source,/Completed management review requires an assurance conclusion/);
  assert.match(source,/Completed management review requires approval evidence/);
});

test("T6.33 migration creates private management-review governance register",()=>{
  const sql=read("database/migrations/0037_mms_management_review_assurance.sql");
  assert.match(sql,/create table if not exists mms_governance\.management_reviews/);
  assert.match(sql,/force row level security/);
  assert.match(sql,/revoke all on table mms_governance\.management_reviews from public, anon, authenticated/);
  assert.match(sql,/overall_assurance <> 'NOT_ASSESSED'/);
});

test("T6.33 protected endpoint makes no fabricated management conclusions",()=>{
  const route=read("src/app/api/internal/operations/management-review-policy/route.ts");
  assert.match(route,/internalApiConfigured/);
  assert.match(route,/isValidInternalBearerToken/);
  assert.match(route,/managementReviewsCompletedByThisPhase: 0/);
  assert.match(route,/managementAssuranceConclusionsCreatedByThisPhase: 0/);
  assert.match(route,/productionReadinessApprovedByThisPhase: false/);
});

test("T6.33 runbook preserves independent lifecycle and Production boundaries",()=>{
  const doc=read("docs/MMS_MANAGEMENT_REVIEW_ASSURANCE_RUNBOOK.md");
  assert.match(doc,/must not automatically close/);
  assert.match(doc,/does not itself authorize Production/);
  assert.match(doc,/must not be presented as a regulatory approval, legal opinion, clinical approval or external certification/);
  assert.match(doc,/WORKING DRAFT/);
});
