import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const read = (p) => fs.readFileSync(path.resolve(process.cwd(), p), "utf8");
const commerce = "src/app/api/internal/commerce";
const mutations = [
  ["leads/duplicate-review", "operations"],
  ["leads/transfer-ownership", "operations"],
  ["applications/transition", "operations"],
  ["payments/verify", "finance"],
  ["memberships/activate", "operations"],
  ["memberships/cancel", "operations"],
  ["commissions/eligibility", "finance"],
  ["commissions/approve", "finance"],
  ["commissions/pay", "finance"],
  ["commissions/reverse", "finance"],
  ["commissions/hold", "finance"],
];
for (const [route, role] of mutations) {
  test("Commercial mutation requires server-side operator guard: " + route, () => {
    const src = read(commerce + "/" + route + "/route.ts");
    assert.match(src, /requireOperatorMutation\(/);
    assert.match(src, new RegExp('roles: \\[([^\\]]*"' + role + '")'));
    assert.match(src, /operator\.actor|checkedBy: operator\.actor/);
  });
}
test("Membership cancellation is atomic and linked to reversal", () => {
  const sql = read("database/migrations/0010_mms_membership_cancellation_and_commission_reversal.sql");
  assert.match(sql, /create or replace function mms_commercial\.cancel_membership_and_reverse_commission/);
  assert.match(sql, /for update/);
  assert.match(sql, /perform mms_commercial\.transition_commission/);
  assert.match(sql, /'Reversed'/);
  assert.match(sql, /v_commission\.status='Paid'/);
  const endpoint = read(commerce + "/memberships/cancel/route.ts");
  assert.match(endpoint, /mms_commercial\.cancel_membership_and_reverse_commission/);
  assert.match(endpoint, /requireStepUp: true/);
});
test("Partner workflow limits clinical disclosure", () => {
  const store = read("src/lib/partnerHubStore.ts");
  assert.match(store, /never treatment, diagnosis or clinical-utilisation/);
  assert.match(store, /currently owned by that Partner/);
  const presentation = read("src/lib/partnerHubPostgres.ts");
  assert.match(presentation, /approval_status = 'APPROVED'/);
  assert.match(presentation, /effective_from <= now\(\)/);
});
test("Zoho calls are blocked unless MMS identity and mapping are verified", () => {
  const adapter = read("src/lib/crmZohoAdapter.ts");
  assert.ok(adapter.indexOf("zohoDayOneCommercialReadiness()") < adapter.indexOf("transport.findDuplicates("));
  const config = read("src/lib/zohoCommercialConfiguration.ts");
  assert.match(config, /ZOHO_TENANT_IDENTITY_VERIFIED/);
  assert.match(config, /ZOHO_LEADS_FIELD_MAPPING_APPROVED/);
});
test("Readiness cannot be true based only on healthy commercial database", () => {
  const route = read("src/app/api/internal/operations/readiness/route.ts");
  assert.match(route, /const ready = databaseReady && zoho\.ready;/);
});
