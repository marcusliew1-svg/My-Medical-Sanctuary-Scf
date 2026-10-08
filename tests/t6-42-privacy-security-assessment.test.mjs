import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.42 requires legal/privacy and immutable evidence for notification decisions",()=>{
  const source=read("src/lib/privacySecurityAssessmentPolicy.ts");
  assert.match(source,/Notification decision requires legal\/privacy review evidence/);
  assert.match(source,/Notification decision requires decision evidence/);
  assert.match(source,/Notification decision requires immutable supporting evidence/);
});

test("T6.42 migration creates immutable private breach-assessment governance",()=>{
  const sql=read("database/migrations/0046_mms_privacy_security_assessment.sql");
  assert.match(sql,/create table if not exists mms_governance\.privacy_security_assessments/);
  assert.match(sql,/privacy_security_assessments_immutable/);
  assert.match(sql,/authority_notification_state <> 'COMPLETED'/);
  assert.match(sql,/subject_notification_state <> 'COMPLETED'/);
  assert.match(sql,/force row level security/);
});

test("T6.42 protected endpoint makes no breach or notification claims",()=>{
  const route=read("src/app/api/internal/operations/privacy-security-assessment-policy/route.ts");
  assert.match(route,/realBreachesDeclaredByThisPhase: 0/);
  assert.match(route,/realNotificationsCompletedByThisPhase: 0/);
  assert.match(route,/statutoryDeadlinesCreatedByThisPhase: false/);
  assert.match(route,/regulatorNotificationAutomatedByThisPhase: false/);
});

test("T6.42 runbook preserves incident and regulatory boundaries",()=>{
  const doc=read("docs/MMS_PRIVACY_SECURITY_ASSESSMENT_RUNBOOK.md");
  assert.match(doc,/Incident severity alone is not enough/);
  assert.match(doc,/does not create any statutory deadline/);
  assert.match(doc,/T6.32 regulatory-obligations register/);
  assert.match(doc,/WORKING DRAFT/);
});
