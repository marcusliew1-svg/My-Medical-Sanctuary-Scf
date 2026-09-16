import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const pack = fs.readFileSync(path.resolve(root, "docs/t6-8-approved-business-inputs.md"), "utf8");

test("T6.8 keeps final-domain-dependent work blocked without guessing a domain", () => {
  assert.match(pack, /Final MMS Production domain \| \*\*Unresolved\.\*\*/);
  assert.match(pack, /All final-domain-dependent canonical, Auth, email, DNS and public-origin changes remain \*\*BLOCKED\*\*/);
  assert.match(pack, /No domain is selected or implied/);
});

test("T6.8 records incorporation intent without inventing legal facts", () => {
  assert.match(pack, /new Malaysian entity will be incorporated under the MMS \/ My Medical Sanctuary name/i);
  for (const field of ["exact legal name", "company number", "registered address", "incorporation details"])
    assert.match(pack, new RegExp(field, "i"));
  assert.match(pack, /do not invent or publish an address/i);
});

test("T6.8 treats info@scf.center as portable and provisional", () => {
  assert.match(pack, /`info@scf\.center` is the current intended address and is \*\*PROVISIONAL\*\*/);
  assert.match(pack, /must not be hard-coded into application logic or treated as the permanent sender/i);
  assert.match(pack, /sender address and sender name in the Production SMTP\/Auth provider configuration/i);
});

test("T6.8 defines Clinic Manager responsibilities without clinical authority", () => {
  for (const phrase of [
    "monitor the new booking/enquiry queue",
    "acknowledge valid enquiries",
    "appropriate clinic/doctor workflow",
    "failed persistence, email or Auth issues",
    "monitor unresolved patient-support requests",
    "own operational SLA reporting",
    "escalate privacy or medical issues",
  ]) assert.match(pack, new RegExp(phrase, "i"));
  assert.match(pack, /Clinic Manager has \*\*no clinical decision authority\*\*/);
});

test("T6.8 labels every proposed service level as unapproved policy", () => {
  assert.match(pack, /Within \*\*1 business hour during operating hours\*\*/);
  assert.match(pack, /Within \*\*30 minutes once detected\*\*/);
  assert.match(pack, /\*\*Same business day\*\*/);
  assert.match(pack, /Do \*\*not\*\* manage through the website support workflow/);
  assert.match(pack, /Every target in this table is \*\*PROPOSED\*\*, not final approved policy/);
});

test("T6.8 reclassifies only bounded packages and remains no-go", () => {
  for (let id = 1; id <= 22; id += 1) assert.match(pack, new RegExp(`\\| ${id} \\|`));
  assert.match(pack, /Booking operating owner\/SLA \| \*\*READY FOR APPROVAL\*\*/);
  assert.match(pack, /Incident\/support ownership \| \*\*READY FOR APPROVAL\*\*/);
  assert.match(pack, /No P0 is closed/);
  assert.match(pack, /Overall MMS Production launch:\*\* \*\*NO-GO\*\*/);
  assert.match(pack, /No Production feature gate was enabled/);
});

