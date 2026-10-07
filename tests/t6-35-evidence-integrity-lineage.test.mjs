import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");

test("T6.35 requires stable lineage and SHA-256 integrity metadata",()=>{
  const source=read("src/lib/evidenceIntegrityPolicy.ts");
  assert.match(source,/valid SHA-256 digest/);
  assert.match(source,/Evidence artifact requires a source reference/);
  assert.match(source,/Evidence artifact requires a storage location/);
  assert.match(source,/Verified evidence requires verifier role/);
});

test("T6.35 migration makes evidence artifacts immutable and private",()=>{
  const sql=read("database/migrations/0039_mms_evidence_integrity_lineage.sql");
  assert.match(sql,/create table if not exists mms_governance\.evidence_artifacts/);
  assert.match(sql,/content_digest_sha256 ~ '\^\[0-9a-f\]\{64\}\$'/);
  assert.match(sql,/evidence_artifacts_immutable/);
  assert.match(sql,/force row level security/);
  assert.match(sql,/revoke all on table mms_governance\.evidence_artifacts from public, anon, authenticated/);
  assert.match(sql,/governance_audit_events\s+add column if not exists evidence_id uuid references/);
});

test("T6.35 protected endpoint makes no signing or authenticity claims",()=>{
  const route=read("src/app/api/internal/operations/evidence-integrity-policy/route.ts");
  assert.match(route,/evidenceArtifactsCreatedByThisPhase: 0/);
  assert.match(route,/evidenceDigitallySignedByThisPhase: false/);
  assert.match(route,/externalTimestampAuthorityConfiguredByThisPhase: false/);
  assert.match(route,/regulatoryAuthenticityClaimedByThisPhase: false/);
});

test("T6.35 runbook explains digest limits and sensitive-data boundary",()=>{
  const doc=read("docs/MMS_RECORDS_INTEGRITY_EVIDENCE_LINEAGE_RUNBOOK.md");
  assert.match(doc,/does \*\*not\*\* by itself establish/);
  assert.match(doc,/must not be copied into the register/);
  assert.match(doc,/Existing .*governance_audit_events.* remain immutable/);
  assert.match(doc,/WORKING DRAFT/);
});
