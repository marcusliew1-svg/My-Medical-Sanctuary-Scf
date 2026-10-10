import assert from "node:assert/strict";
import test from "node:test";
import { validateProvisioningContext, prepareMetadata, provision } from "../scripts/t6-49-provision-preview-admin.mjs";
const uid = "495e204f-e68c-4a23-96da-fc20644ed900";
const env = {
  MMS_SUPABASE_PROJECT_REF: "tfwnlmmdrkkfrtmawpma",
  MMS_OPERATOR_TARGET_USER_ID: uid,
  MMS_OPERATOR_TARGET_EMAIL: "marcusliew1@gmail.com",
  MMS_SUPABASE_URL: "https://tfwnlmmdrkkfrtmawpma.supabase.co",
  MMS_SUPABASE_SERVICE_ROLE_KEY: "synthetic-test-secret",
};
test("refuses a different Preview or Production project", () => {
  assert.throws(() => validateProvisioningContext({...env, MMS_SUPABASE_PROJECT_REF:"ywbqfkhrshmpilgzytpl"}, []), /Preview project/);
  assert.throws(() => validateProvisioningContext({...env, MMS_SUPABASE_URL:"https://ywbqfkhrshmpilgzytpl.supabase.co"}, []), /Preview Auth URL/);
});
test("execute requires independent authorization and evidence", () => {
  assert.throws(() => validateProvisioningContext(env, ["--execute"]), /approval flag/);
  assert.throws(() => validateProvisioningContext({...env,MMS_OPERATOR_PROVISIONING_APPROVED:"true"}, ["--execute"]), /independent approver/);
  assert.throws(() => validateProvisioningContext({...env,MMS_OPERATOR_PROVISIONING_APPROVED:"true",MMS_OPERATOR_APPROVER_ID:"MMS-ADMIN-001",MMS_OPERATOR_APPROVAL_REFERENCE:"A"}, ["--execute"]), /independent approver/);
});
test("merges provider metadata, refuses unrelated user and conflicting privilege state", () => {
  const result = prepareMetadata({provider:"email",providers:["email"]},"marcusliew1@gmail.com",uid);
  assert.equal(result.provider,"email");
  assert.deepEqual(result.operator_roles,["admin","operations"]);
  assert.throws(() => prepareMetadata({},"other@example.com",uid), /wrong Auth identity/);
  assert.throws(() => prepareMetadata({operator_roles:["finance"]},"marcusliew1@gmail.com",uid), /conflict/);
});
test("dry run reads only, does not update Auth even if valid", async () => {
  const calls=[];
  const fake = async (_url,opts) => {
    calls.push(opts.method);
    return {ok:true,json:async()=>({id:uid,email:"marcusliew1@gmail.com",app_metadata:{provider:"email"}})};
  };
  const result=await provision(env,[],fake);
  assert.equal(result.status,"dry_run");
  assert.deepEqual(calls,["GET"]);
});
test("approved execution merges, PUTs and verifies through Auth Admin", async () => {
  const calls=[];
  let app={provider:"email"};
  const fake=async (_url,opts)=>{
    calls.push(opts.method);
    if(opts.method==="PUT"){app=JSON.parse(opts.body).app_metadata;}
    return {ok:true,json:async()=>({id:uid,email:"marcusliew1@gmail.com",app_metadata:app})};
  };
  const approved={...env,MMS_OPERATOR_PROVISIONING_APPROVED:"true",MMS_OPERATOR_APPROVER_ID:"MMS-REVIEWER-002",MMS_OPERATOR_APPROVAL_REFERENCE:"QA-2026-001"};
  const result=await provision(approved,["--execute"],fake);
  assert.equal(result.status,"verified");
  assert.deepEqual(calls,["GET","PUT","GET"]);
  assert.equal(app.provider,"email");
});
