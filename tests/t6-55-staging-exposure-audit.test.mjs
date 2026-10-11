import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=p=>readFileSync(p,"utf8");
const guarded=[
 "dashboard","governance","applications","commissions","memberships","payments",
 "crm/queue","crm/management","crm/synthetic-enquiries","crm/assistant","crm/ling"
];
test("commercial Operations GET endpoints check role-based authorization",()=>{
 for(const route of guarded){
  const code=read("src/app/api/operations/"+route+"/route.ts");
  assert.match(code,/requireOperator(Read|Mutation)|authenticateOperatorRequest/, route+" must authenticate");
 }
});
test("private owner portal checks signed session and exclusive owner role",()=>{
 const page=read("src/app/owner/page.tsx");
 assert.match(page,/authenticateOperatorRequest\(request\)/);
 assert.match(page,/roles\.length !== 1 \|\| auth\.claims\.roles\[0\] !== "owner"/);
});
test("deployment protection exception requires independent page security sign-off",()=>{
 const layout=read("src/app/operations/layout.tsx");
 // Audit assertion records that shell navigation can be public; this is NOT a release clearance.
 assert.doesNotMatch(layout,/authenticateOperatorRequest/, "layout changed; review route guards before release");
 const proxy=read("src/proxy.ts");
 assert.doesNotMatch(proxy,/requireOperator(Read|Mutation)/);
});
