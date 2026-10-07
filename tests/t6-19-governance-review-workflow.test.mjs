import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { createRequire } from "node:module";

const root=process.cwd();
const nodeRequire=createRequire(import.meta.url);
const ts=nodeRequire("typescript");
const source=fs.readFileSync(path.resolve(root,"src/lib/governanceDocumentWorkflow.ts"),"utf8");
const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},fileName:"governanceDocumentWorkflow.ts"}).outputText;
const module={exports:{}};
vm.runInNewContext(`(function(exports,require,module){${output}\n})(module.exports,require,module);`,{module,exports:module.exports,require:nodeRequire});
const {assertGovernanceDocumentTransition}=module.exports;

const evidence={
  ownerId:"operator-owner-001",
  reviewerId:"operator-reviewer-001",
  approverId:"operator-approver-001",
  approverRole:"Compliance",
  approvalReference:"GOV-APPROVAL-2026-001",
};

test("T6.19 blocks draft-to-approved shortcut",()=>{
  assert.throws(()=>assertGovernanceDocumentTransition({currentStatus:"WORKING_DRAFT",requestedStatus:"APPROVED",...evidence}),/not permitted/);
});

test("T6.19 requires named owner and reviewer before REVIEW",()=>{
  assert.throws(()=>assertGovernanceDocumentTransition({currentStatus:"WORKING_DRAFT",requestedStatus:"REVIEW"}),/Named document owner/);
  assert.throws(()=>assertGovernanceDocumentTransition({currentStatus:"WORKING_DRAFT",requestedStatus:"REVIEW",ownerId:evidence.ownerId}),/Named document reviewer/);
  assert.doesNotThrow(()=>assertGovernanceDocumentTransition({currentStatus:"WORKING_DRAFT",requestedStatus:"REVIEW",ownerId:evidence.ownerId,reviewerId:evidence.reviewerId}));
});

test("T6.19 requires named approver and evidence before APPROVED",()=>{
  assert.throws(()=>assertGovernanceDocumentTransition({currentStatus:"REVIEW",requestedStatus:"APPROVED",ownerId:evidence.ownerId,reviewerId:evidence.reviewerId}),/Named document approver/);
  assert.throws(()=>assertGovernanceDocumentTransition({currentStatus:"REVIEW",requestedStatus:"APPROVED",...evidence,approvalReference:null}),/approval evidence reference/i);
  assert.doesNotThrow(()=>assertGovernanceDocumentTransition({currentStatus:"REVIEW",requestedStatus:"APPROVED",...evidence}));
});

test("T6.19 requires sequential approval before EFFECTIVE",()=>{
  assert.throws(()=>assertGovernanceDocumentTransition({currentStatus:"REVIEW",requestedStatus:"EFFECTIVE",...evidence}),/not permitted/);
  assert.doesNotThrow(()=>assertGovernanceDocumentTransition({currentStatus:"APPROVED",requestedStatus:"EFFECTIVE",...evidence}));
});

test("T6.19 migration preserves fail-closed evidence constraints",()=>{
  const sql=fs.readFileSync(path.resolve(root,"database/migrations/0032_mms_governance_document_review_workflow.sql"),"utf8");
  assert.match(sql,/owner_id text/);
  assert.match(sql,/reviewer_id text/);
  assert.match(sql,/approver_id text/);
  assert.match(sql,/approval_reference text/);
  assert.match(sql,/governance_documents_approval_evidence_check/);
  assert.match(sql,/status <> 'EFFECTIVE' or effective_at is not null/);
});

test("T6.19 remains Preview-only and forbids fabricated approvals",()=>{
  const doc=fs.readFileSync(path.resolve(root,"docs/t6-19-governance-ownership-review-workflow.md"),"utf8");
  assert.match(doc,/Preview only/);
  assert.match(doc,/No named owner, reviewer or approver is fabricated/);
  assert.match(doc,/Production\/main remain untouched/);
});
