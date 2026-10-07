import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.40 requires identity, jurisdiction, decision and response evidence",()=>{
  const source=read("src/lib/privacyRightsRequestPolicy.ts");
  assert.match(source,/requires identity verification/);
  assert.match(source,/requires jurisdiction\/applicability assessment/);
  assert.match(source,/requires decision evidence/);
  assert.match(source,/requires response evidence/);
  assert.match(source,/confirmed-clear legal hold/);
});

test("T6.40 migration creates private request register and immutable action history",()=>{
  const sql=read("database/migrations/0044_mms_privacy_rights_requests.sql");
  assert.match(sql,/create table if not exists mms_governance\.privacy_rights_requests/);
  assert.match(sql,/create table if not exists mms_governance\.privacy_rights_request_actions/);
  assert.match(sql,/privacy_rights_request_actions_immutable/);
  assert.match(sql,/legal_hold_state = 'CLEAR'/);
  assert.match(sql,/force row level security/);
});

test("T6.40 protected endpoint makes no universal-right or automation claims",()=>{
  const route=read("src/app/api/internal/operations/privacy-rights-policy/route.ts");
  assert.match(route,/realPrivacyRequestsCreatedByThisPhase: 0/);
  assert.match(route,/universalPrivacyRightsClaimedByThisPhase: false/);
  assert.match(route,/productionSelfServiceEnabledByThisPhase: false/);
  assert.match(route,/deletionAutomationEnabledByThisPhase: false/);
});

test("T6.40 runbook preserves T6.25 retention and legal-hold boundaries",()=>{
  const doc=read("docs/MMS_PRIVACY_RIGHTS_REQUESTS_RUNBOOK.md");
  assert.match(doc,/workflow categories only/);
  assert.match(doc,/No statutory response period is invented/);
  assert.match(doc,/legal-hold state must be confirmed CLEAR/);
  assert.match(doc,/preserves T6.25 legal-hold and retention controls/);
  assert.match(doc,/WORKING DRAFT/);
});
