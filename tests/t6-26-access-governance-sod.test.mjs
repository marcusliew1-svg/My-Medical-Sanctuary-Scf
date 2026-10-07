import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.26 defines auditor exclusivity and privileged access review controls",()=>{
  const source=read("src/lib/accessGovernancePolicy.ts");
  assert.match(source,/AUDITOR_EXCLUSIVE/);
  assert.match(source,/Auditor role must not be combined/);
  assert.match(source,/Privileged access review must not be self-approved/);
  assert.match(source,/Retaining privileged access requires business justification/);
});

test("T6.26 trusted operator metadata rejects mixed auditor role sets",()=>{
  const identity=read("src/lib/operatorIdentity.ts");
  assert.match(identity,/assertOperatorRoleCombination/);
  assert.match(identity,/assertOperatorRoleCombination\(uniqueRoles\)/);
});

test("T6.26 protected access-governance endpoint preserves evidence boundaries",()=>{
  const route=read("src/app/api/internal/operations/access-governance-policy/route.ts");
  assert.match(route,/internalApiConfigured/);
  assert.match(route,/isValidInternalBearerToken/);
  assert.match(route,/productionRoleAssignmentsChangedByThisPhase: false/);
  assert.match(route,/operatorIdentityCreatedByThisPhase: false/);
  assert.match(route,/automaticDeprovisioningConfiguredByThisPhase: false/);
});

test("T6.26 runbook requires least privilege and independent privileged review",()=>{
  const doc=read("docs/MMS_ACCESS_GOVERNANCE_SOD_RUNBOOK.md");
  assert.match(doc,/least-privilege/i);
  assert.match(doc,/must not coexist/);
  assert.match(doc,/Self-review\/self-approval is not acceptable/);
  assert.match(doc,/WORKING DRAFT/);
});
