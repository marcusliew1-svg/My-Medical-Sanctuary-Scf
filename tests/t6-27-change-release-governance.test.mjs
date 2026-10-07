import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.27 defines release classes and fail-closed production approval",()=>{
  const source=read("src/lib/releaseGovernancePolicy.ts");
  for (const item of ["STANDARD","NORMAL","EMERGENCY"]) assert.match(source,new RegExp(item));
  assert.match(source,/Production release requires an explicit approval reference/);
  assert.match(source,/Release requires a rollback plan/);
  assert.match(source,/post-deploy verification plan/);
});

test("T6.27 preserves Preview versus Production separation",()=>{
  const source=read("src/lib/releaseGovernancePolicy.ts");
  assert.match(source,/Preview validation does not authorize Production/);
  assert.match(source,/must not be promoted as though it were the already-tested Production build/);
  const runbook=read("docs/MMS_CHANGE_RELEASE_ROLLBACK_RUNBOOK.md");
  assert.match(runbook,/Preview readiness is evidence of technical validation only/);
});

test("T6.27 protected release-governance endpoint exposes no invented authority",()=>{
  const route=read("src/app/api/internal/operations/release-governance-policy/route.ts");
  assert.match(route,/internalApiConfigured/);
  assert.match(route,/isValidInternalBearerToken/);
  assert.match(route,/productionReleaseAuthorizedByThisPhase: false/);
  assert.match(route,/productionDeploymentPerformedByThisPhase: false/);
  assert.match(route,/changeApproverAssignedByThisPhase: false/);
});

test("T6.27 reuses the existing governance change-request model",()=>{
  const migration=read("database/migrations/0026_mms_operating_system_governance.sql");
  assert.match(migration,/create table if not exists mms_governance\.change_requests/);
  assert.match(migration,/approval_reference text/);
  assert.match(migration,/rollback_plan text/);
  assert.match(migration,/verified_at timestamptz/);
  const runbook=read("docs/MMS_CHANGE_RELEASE_ROLLBACK_RUNBOOK.md");
  assert.match(runbook,/canonical governance record rather than creating a competing change database/);
});
