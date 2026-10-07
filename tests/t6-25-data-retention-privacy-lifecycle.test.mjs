import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.25 defines retention classes without inventing retention periods",()=>{
  const source=read("src/lib/dataRetentionPrivacyPolicy.ts");
  for (const klass of ["TRANSIENT","OPERATIONAL","GOVERNANCE","FINANCIAL","IDENTITY_ACCESS","CLINICAL_RESTRICTED"]) {
    assert.match(source,new RegExp(klass));
  }
  assert.match(source,/retentionPeriodState: "UNAPPROVED"/);
  assert.doesNotMatch(source,/retentionDays|retentionYears/);
});

test("T6.25 disposal fails closed on hold, missing authority or incomplete review",()=>{
  const source=read("src/lib/dataRetentionPrivacyPolicy.ts");
  assert.match(source,/legalHoldState !== "CLEAR"/);
  assert.match(source,/Disposal requires an authority\/evidence reference/);
  assert.match(source,/Disposal requires linked-record review/);
  assert.match(source,/Disposal method is required/);
});

test("T6.25 protected policy endpoint exposes boundaries honestly",()=>{
  const route=read("src/app/api/internal/operations/privacy-retention-policy/route.ts");
  assert.match(route,/internalApiConfigured/);
  assert.match(route,/isValidInternalBearerToken/);
  assert.match(route,/statutoryRetentionPeriodsApproved: false/);
  assert.match(route,/automatedProductionDisposalConfiguredByThisPhase: false/);
  assert.match(route,/clinicalRecordRetentionApprovedByThisPhase: false/);
});

test("T6.25 runbook preserves minimisation and legal-hold boundaries",()=>{
  const doc=read("docs/MMS_DATA_RETENTION_PRIVACY_LIFECYCLE_RUNBOOK.md");
  assert.match(doc,/All retention periods remain \*\*UNAPPROVED\*\*/);
  assert.match(doc,/Legal hold overrides ordinary disposal/);
  assert.match(doc,/General enquiry and CRM workflows must not become a substitute clinical record/);
  assert.match(doc,/does not configure purge jobs/);
  assert.match(doc,/WORKING DRAFT/);
});
