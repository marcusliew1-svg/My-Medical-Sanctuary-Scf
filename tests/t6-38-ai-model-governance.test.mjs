import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.38 requires provider/model/human oversight and validation evidence",()=>{
  const source=read("src/lib/aiModelGovernancePolicy.ts");
  assert.match(source,/AI activation requires an identified provider/);
  assert.match(source,/AI activation requires a model identifier/);
  assert.match(source,/AI activation requires human-oversight evidence/);
  assert.match(source,/AI activation requires validation evidence/);
  assert.match(source,/Clinical AI activation requires clinical-governance evidence/);
});

test("T6.38 migration hardens canonical AI use cases and adds immutable validations",()=>{
  const sql=read("database/migrations/0042_mms_ai_model_governance.sql");
  assert.match(sql,/alter table mms_governance\.ai_use_cases/);
  assert.match(sql,/create table if not exists mms_governance\.ai_validation_assessments/);
  assert.match(sql,/ai_validation_assessments_immutable/);
  assert.match(sql,/human_review_required = true/);
  assert.match(sql,/clinical_governance_required = false\s+or clinical_governance_reference is not null/);
});

test("T6.38 protected endpoint makes no AI activation claims",()=>{
  const route=read("src/app/api/internal/operations/ai-model-governance-policy/route.ts");
  assert.match(route,/aiUseCasesActivatedByThisPhase: 0/);
  assert.match(route,/modelsApprovedByThisPhase: 0/);
  assert.match(route,/clinicalAiApprovedByThisPhase: 0/);
  assert.match(route,/autonomousDecisionsEnabledByThisPhase: false/);
  assert.match(route,/productionAiEnabledByThisPhase: false/);
});

test("T6.38 preserves current AI and Ling safety boundaries",()=>{
  const doc=read("docs/MMS_AI_MODEL_GOVERNANCE_RUNBOOK.md");
  assert.match(doc,/Current Preview records remain in REVIEW/);
  assert.match(doc,/No provider\/model\/version or approval is fabricated/);
  assert.match(doc,/existing AI Operations Assistant remains administrative\/advisory/);
  assert.match(doc,/Existing Ling safety\/refusal and approved-content controls remain intact/);
  assert.match(doc,/WORKING DRAFT/);
});
