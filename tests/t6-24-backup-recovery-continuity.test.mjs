import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.24 defines RTO/RPO targets without misrepresenting them as SLAs",()=>{
  const source=read("src/lib/businessContinuityPolicy.ts");
  assert.match(source,/TIER_0/);
  assert.match(source,/targetRtoMinutes: 60/);
  assert.match(source,/targetRpoMinutes: 15/);
  const doc=read("docs/MMS_BACKUP_RECOVERY_CONTINUITY_RUNBOOK.md");
  assert.match(doc,/not approved contractual SLAs/i);
});

test("T6.24 requires restore integrity and reconciliation evidence",()=>{
  const source=read("src/lib/businessContinuityPolicy.ts");
  assert.match(source,/integrityVerified/);
  assert.match(source,/reconciliationCompleted/);
  assert.match(source,/unresolvedDiscrepancies > 0/);
  assert.match(source,/Recovery cannot complete with unresolved discrepancies/);
});

test("T6.24 continuity endpoint is protected and reports unverified evidence honestly",()=>{
  const route=read("src/app/api/internal/operations/continuity-policy/route.ts");
  assert.match(route,/internalApiConfigured/);
  assert.match(route,/isValidInternalBearerToken/);
  assert.match(route,/backupEvidenceState: "NOT_VERIFIED"/);
  assert.match(route,/restoreEvidenceState: "NOT_VERIFIED"/);
  assert.match(route,/successfulRestoreClaimedByThisPhase: false/);
  assert.match(route,/productionFailoverConfiguredByThisPhase: false/);
});

test("T6.24 preserves fail-closed auth and recovery boundaries",()=>{
  const doc=read("docs/MMS_BACKUP_RECOVERY_CONTINUITY_RUNBOOK.md");
  assert.match(doc,/FAIL_CLOSED/);
  assert.match(doc,/do not recover users by direct SQL mutation of `auth\.users`/);
  assert.match(doc,/dedicated MMS Zoho tenant is verified/);
  assert.match(doc,/WORKING DRAFT/);
});
