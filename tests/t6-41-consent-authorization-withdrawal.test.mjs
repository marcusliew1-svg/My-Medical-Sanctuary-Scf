import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.41 requires versioned evidence for active consent and withdrawal",()=>{
  const source=read("src/lib/consentAuthorizationPolicy.ts");
  assert.match(source,/Consent requires a document reference/);
  assert.match(source,/Consent requires a document version/);
  assert.match(source,/Active consent requires immutable evidence/);
  assert.match(source,/Withdrawal requires effective scope/);
});

test("T6.41 migration creates private consent register and immutable event history",()=>{
  const sql=read("database/migrations/0045_mms_consent_authorization_withdrawal.sql");
  assert.match(sql,/create table if not exists mms_governance\.consent_authorizations/);
  assert.match(sql,/create table if not exists mms_governance\.consent_events/);
  assert.match(sql,/consent_events_immutable/);
  assert.match(sql,/status <> 'ACTIVE'/);
  assert.match(sql,/status <> 'WITHDRAWN'/);
  assert.match(sql,/force row level security/);
});

test("T6.41 protected endpoint makes no real consent or Production claims",()=>{
  const route=read("src/app/api/internal/operations/consent-governance-policy/route.ts");
  assert.match(route,/realConsentsCreatedByThisPhase: 0/);
  assert.match(route,/clinicalConsentApprovedByThisPhase: false/);
  assert.match(route,/universalLegalBasisClaimedByThisPhase: false/);
  assert.match(route,/productionConsentCaptureEnabledByThisPhase: false/);
});

test("T6.41 runbook preserves clinical and retention boundaries",()=>{
  const doc=read("docs/MMS_CONSENT_AUTHORIZATION_WITHDRAWAL_RUNBOOK.md");
  assert.match(doc,/must not be interpreted as treatment consent merely because it exists/);
  assert.match(doc,/does not automatically erase historical records/);
  assert.match(doc,/Existing clinical services remain non-active unless separately approved/);
  assert.match(doc,/WORKING DRAFT/);
});
