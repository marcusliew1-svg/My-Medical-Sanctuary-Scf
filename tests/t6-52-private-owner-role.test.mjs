import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const security = readFileSync("src/lib/operatorSecurity.ts","utf8");
const identity = readFileSync("src/lib/operatorIdentity.ts","utf8");
const governance = readFileSync("src/lib/accessGovernancePolicy.ts","utf8");
test("owner is recognized by session and identity role allowlists",()=>{
  assert.match(security,/OperatorRole = [^;]*"owner"/);
  assert.match(security,/ROLE_SET = new Set<OperatorRole>\(\[[^\]]*"owner"/);
  assert.match(identity,/OPERATOR_ROLE_SET = new Set<OperatorRole>\(\[[^\]]*"owner"/);
});
test("owner is exclusive, never combined with admin or finance",()=>{
  assert.match(governance,/unique\.includes\("owner"\) && unique\.length > 1/);
  assert.match(governance,/Private owner role must be exclusive/);
});
test("owner is not silently made an all-access operator",()=>{
  assert.match(security,/if \(claims\.roles\.includes\("admin"\)\) return true;/);
  assert.doesNotMatch(security,/if \(claims\.roles\.includes\("owner"\)\) return true;/);
});
