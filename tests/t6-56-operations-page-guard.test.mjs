import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
const paths=["page.tsx","applications/page.tsx","applications/[applicationId]/page.tsx","commissions/page.tsx","commissions/[transactionId]/page.tsx","crm/page.tsx","finance/page.tsx","governance/page.tsx","memberships/page.tsx"];
test("all commercial operations pages are under authenticated route group",()=>{
 for(const path of paths){
  assert.equal(existsSync("src/app/operations/"+path),false,"unguarded "+path);
  assert.equal(existsSync("src/app/operations/(protected)/"+path),true,"protected "+path);
 }
});
test("server-side operations gate verifies user and excludes owner-only identities",()=>{
 const code=readFileSync("src/app/operations/(protected)/layout.tsx","utf8");
 assert.match(code,/authenticateOperatorRequest\(request\)/);
 assert.match(code,/auth\.status !== "authenticated"/);
 assert.match(code,/\["admin", "operations", "finance", "auditor"\]/);
 assert.match(code,/redirect\("\/owner"\)/);
});
test("login and setup remain outside protected route group",()=>{
 for(const path of ["login/page.tsx","setup/page.tsx","step-up/page.tsx"])
  assert.equal(existsSync("src/app/operations/"+path),true);
});
