import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { createRequire } from "node:module";

const root=process.cwd();
const nodeRequire=createRequire(import.meta.url);
const ts=nodeRequire("typescript");
const cache=new Map();
const read=(p)=>fs.readFileSync(path.resolve(root,p),"utf8");
function loadTsModule(relativePath){
  const absolute=path.resolve(root,relativePath);
  if(cache.has(absolute)) return cache.get(absolute).exports;
  const output=ts.transpileModule(read(relativePath),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true},fileName:absolute}).outputText;
  const module={exports:{}}; cache.set(absolute,module);
  const localRequire=(specifier)=>specifier.startsWith("@/")?loadTsModule(path.join("src",`${specifier.slice(2)}.ts`)):nodeRequire(specifier);
  const context=vm.createContext({module,exports:module.exports,require:localRequire,process,URL,Date,setTimeout,clearTimeout});
  vm.runInContext(`(function(exports, require, module){${output}\n})(module.exports, require, module);`,context);
  return module.exports;
}

const configuration=loadTsModule("src/lib/zohoCommercialConfiguration.ts");
const adapter=loadTsModule("src/lib/crmZohoAdapter.ts");

function leanEnv(){
  return {
    ZOHO_CLIENT_ID:"synthetic-id",ZOHO_CLIENT_SECRET:"synthetic-secret",ZOHO_REFRESH_TOKEN:"synthetic-refresh",ZOHO_DC:"com",
    ZOHO_LEADS_MODULE_API_NAME:"Leads",ZOHO_ORGANIZATION_ID:"mms-org",ZOHO_CRM_OWNER_ID:"mms-owner",
    ZOHO_DAY_ONE_COMMERCIAL_CRM_APPROVED:"true",ZOHO_TENANT_IDENTITY_VERIFIED:"true",ZOHO_LEADS_FIELD_MAPPING_APPROVED:"true",
    ZOHO_LEADS_FIELD_MAPPING_JSON:JSON.stringify({firstName:"First_Name",lastName:"Last_Name",email:"Email",mobile:"Mobile",country:"Country",source:"Lead_Source",leadStatus:"Lead_Status",assignedOwner:"Owner"}),
    ZOHO_LEAD_SOURCE_TAXONOMY_JSON:"[\"Web Download\",\"Partner\",\"Facebook\"]",
    ZOHO_LEAD_STATUS_PICKLIST_JSON:"[\"Not Contacted\",\"Attempted to Contact\",\"Contacted\",\"Pre-Qualified\",\"Lost Lead\"]",
    ZOHO_LOSS_REASON_PICKLIST_JSON:"[\"Lost Lead\"]",
    ZOHO_DEDUPE_FIELDS_JSON:"[\"Email\",\"Mobile\"]"
  };
}

test("T6.18 requires verified MMS Zoho tenant identity",()=>{
  const env=leanEnv(); delete env.ZOHO_TENANT_IDENTITY_VERIFIED;
  const result=configuration.zohoDayOneCommercialReadiness(env);
  assert.equal(result.ready,false);
  assert.ok(result.blockers.some((b)=>b.includes("ZOHO_TENANT_IDENTITY_VERIFIED")));
});

test("tenant-approved lean standard-field mapping is accepted",()=>{
  const result=configuration.zohoDayOneCommercialReadiness(leanEnv());
  assert.equal(result.ready,true);
  assert.equal(result.fieldMapping.firstName,"First_Name");
  assert.equal(result.fieldMapping.assignedOwner,"Owner");
  assert.equal(result.fieldMapping.partnerId,undefined);
});

test("lean mapping drops unsupported metadata instead of abusing unrelated Zoho fields",()=>{
  const mapping=configuration.parseApprovedZohoCommercialFieldMapping(leanEnv(),[]);
  const record=adapter.mapAdministrativeLeadToZoho({
    sourceRequestId:"t618-lean",assignedOwnerId:"7504999000000612001",
    lead:{name:"MMS Synthetic Preview",email:"synthetic@example.com",mobile:"+601100000618",country:"Malaysia",source:"Web Download",leadStatus:"Not Contacted",
      partnerId:"MMS-PARTNER-SYNTH",referralCode:"SYNTH",programmeInterest:"Preventive health information",
      contactConsentTimestamp:"2026-10-07T00:00:00.000Z",contactConsentVersion:"SYNTH-v1",marketingConsent:false,sourceConsentEvidence:"Synthetic",doNotContact:false}
  },"synthetic-idempotency",mapping);
  assert.equal(record.First_Name,"MMS Synthetic");
  assert.equal(record.Last_Name,"Preview");
  assert.equal(record.Email,"synthetic@example.com");
  assert.equal(record.Owner.id,"7504999000000612001");
  assert.equal(Object.values(record).includes("MMS-PARTNER-SYNTH"),false);
  assert.equal(Object.values(record).includes("Preventive health information"),false);
});

test("T6.18 report blocks use of connected iPivot Zoho tenant for MMS",()=>{
  const report=read("docs/t6-18-operational-closure.md");
  assert.match(report,/Connected organization: \*\*iPivot Sdn Bhd\*\*/);
  assert.match(report,/not an approved MMS tenant/);
  assert.match(report,/Do not reuse the connected iPivot organization for MMS/);
  assert.match(report,/PASS WITH BLOCKERS/);
});
