import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.resolve(root, p), "utf8");

test("governance console is Preview-default and Production fail-closed", () => {
  const source = read("src/lib/governanceStore.ts");
  assert.match(source, /VERCEL_ENV === "production"/);
  assert.match(source, /MMS_GOVERNANCE_CONSOLE_PRODUCTION_APPROVED/);
  assert.match(source, /if \(explicit === "false"\) return false/);
});

test("governance API requires operator auth and step-up for mutations", () => {
  const route = read("src/app/api/operations/governance/route.ts");
  assert.match(route, /requireOperatorRead/);
  assert.match(route, /requireOperatorMutation/);
  assert.match(route, /requireStepUp: true/);
  assert.match(route, /roles: \["operations"\]/);
});

test("governance mutations cannot activate clinical services or Production gates", () => {
  const store = read("src/lib/governanceStore.ts");
  assert.match(store, /This console cannot enable Production gates/);
  assert.match(store, /Clinical activation\/public availability requires the separate Medical Director and regulatory activation workflow/);
  assert.match(store, /input\.clinicalStatus === "ACTIVE"/);
  assert.match(store, /input\.publicExposureStatus === "PUBLIC_AVAILABLE"/);
});

test("governance store writes immutable audit evidence for mutations", () => {
  const store = read("src/lib/governanceStore.ts");
  assert.match(store, /governance_audit_events/);
  assert.match(store, /previous_state/);
  assert.match(store, /new_state/);
  assert.match(store, /await audit\(/);
});

test("baseline risk/control library covers seven enterprise risk domains", () => {
  const sql = read("database/migrations/0028_mms_os_baseline_risk_control_library.sql");
  for (const domain of ["Clinical","Regulatory / Legal","Privacy / Data","Technology / Cybersecurity","Commercial / Operational","Financial","Reputational"]) {
    assert.ok(sql.includes(domain));
  }
  assert.match(sql, /RISK-CLN-001/);
  assert.match(sql, /CTRL-TEC-001/);
  assert.match(sql, /risk_control_links/);
});

test("governance UI is internal and declares activation boundaries", () => {
  const page = read("src/app/operations/governance/page.tsx");
  const client = read("src/components/operations/GovernanceConsoleClient.tsx");
  assert.match(page, /Internal governance/);
  assert.match(page, /does not itself authorize Production activation or clinical care/);
  assert.match(client, /This console does not activate Production gates or authorize clinical care/);
});
