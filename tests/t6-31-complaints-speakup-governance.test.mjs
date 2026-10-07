import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.31 defines controlled complaint lifecycle and closure evidence",()=>{
  const source=read("src/lib/complaintsSpeakUpPolicy.ts");
  assert.match(source,/OPEN: \["TRIAGED"\]/);
  assert.match(source,/Resolved complaint requires a resolution summary/);
  assert.match(source,/Resolved complaint requires an evidence reference/);
  assert.match(source,/Complaint closure requires external\/regulatory reporting assessment/);
});

test("T6.31 creates a fail-closed complaint/concern governance register",()=>{
  const sql=read("database/migrations/0035_mms_complaints_speakup_governance.sql");
  assert.match(sql,/create table if not exists mms_governance\.complaints_and_concerns/);
  assert.match(sql,/force row level security/);
  assert.match(sql,/revoke all on table mms_governance\.complaints_and_concerns from public, anon, authenticated/);
  assert.match(sql,/regulator_assessment_state <> 'NOT_ASSESSED'/);
});

test("T6.31 protected endpoint makes no case-management claims",()=>{
  const route=read("src/app/api/internal/operations/complaints-speakup-policy/route.ts");
  assert.match(route,/internalApiConfigured/);
  assert.match(route,/isValidInternalBearerToken/);
  assert.match(route,/complaintsCreatedByThisPhase: 0/);
  assert.match(route,/anonymousHotlineConfiguredByThisPhase: false/);
  assert.match(route,/productionCaseIntakeActivatedByThisPhase: false/);
});

test("T6.31 runbook protects escalation and non-retaliation boundaries",()=>{
  const doc=read("docs/MMS_COMPLAINTS_SPEAKUP_RUNBOOK.md");
  assert.match(doc,/must not suppress a safety, privacy, security, fraud, misconduct or regulatory issue/);
  assert.match(doc,/must not result in retaliation/);
  assert.match(doc,/does not claim that an anonymous reporting channel/);
  assert.match(doc,/WORKING DRAFT/);
});
