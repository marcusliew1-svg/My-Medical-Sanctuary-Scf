import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.23 defines explicit incident severity and lifecycle policy",()=>{
  const source=read("src/lib/incidentReliabilityPolicy.ts");
  for (const severity of ["P1","P2","P3","P4","CLINICAL_SAFETY"]) assert.match(source,new RegExp(severity));
  assert.match(source,/OPEN: \["CONTAINED", "INVESTIGATING"\]/);
  assert.match(source,/RECOVERED: \["REVIEW"\]/);
  assert.match(source,/Closed incidents require documented root cause/);
  assert.match(source,/external-reporting assessment before closure/);
});

test("T6.23 incident policy endpoint is protected and does not invent responders",()=>{
  const route=read("src/app/api/internal/operations/incident-policy/route.ts");
  assert.match(route,/internalApiConfigured/);
  assert.match(route,/isValidInternalBearerToken/);
  assert.match(route,/namedRespondersConfigured: false/);
  assert.match(route,/externalAlertRoutingConfiguredByThisPhase: false/);
  assert.match(route,/statutoryReportingDeterminedByThisPolicy: false/);
});

test("T6.23 runbook requires fail-closed degraded operation and evidence preservation",()=>{
  const doc=read("docs/MMS_INCIDENT_RESPONSE_RUNBOOK.md");
  assert.match(doc,/fail closed/i);
  assert.match(doc,/preserve request IDs\/timestamps/i);
  assert.match(doc,/does not decide them/i);
  assert.match(doc,/WORKING DRAFT/);
});

test("T6.23 reuses the existing governance incident schema",()=>{
  const migration=read("database/migrations/0026_mms_operating_system_governance.sql");
  assert.match(migration,/create table if not exists mms_governance\.incidents/);
  assert.match(migration,/severity text not null check \(severity in \('P1','P2','P3','P4','CLINICAL_SAFETY'\)\)/);
  assert.match(migration,/external_reporting_state/);
});
