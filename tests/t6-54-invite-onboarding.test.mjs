import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const invite = readFileSync("src/app/api/operations/invite/route.ts","utf8");
const acceptance = readFileSync("src/app/operations/invite/page.tsx","utf8");
const setup = readFileSync("src/app/api/operations/setup/route.ts","utf8");
const page = readFileSync("src/app/operations/setup/page.tsx","utf8");
test("invitation only accepts server-verified invite token hashes", () => {
 assert.doesNotMatch(invite,/export async function GET/);
 assert.match(invite,/export async function POST/);
 assert.match(invite,/email link scanners cannot consume/);
 assert.match(invite,/type !== "invite"/);
 assert.match(invite,/auth\/v1\/verify/);
 assert.match(invite,/token_hash: hash, type: "invite"/);
 assert.doesNotMatch(invite,/service_role|MMS_SUPABASE_SERVICE_ROLE_KEY/);
 assert.match(acceptance,/action="\/api\/operations\/invite"/);
 assert.match(acceptance,/type="hidden" name="token_hash"/);
});
test("onboarding password change requires authenticated invitation and matching passwords", () => {
 assert.match(setup,/operatorRequestOriginAllowed\(request\)/);
 assert.match(setup,/request.cookies.get\(cookieName\)/);
 assert.match(setup,/password.length < 12/);
 assert.match(setup,/password !== confirm/);
 assert.match(setup,/Authorization: "Bearer " \+ token/);
 assert.match(setup,/path: "\/api\/operations\/setup", maxAge: 0/);
});
test("MMS setup is noindex and never grants roles", () => {
 assert.match(page+acceptance,/index: false/);
 assert.doesNotMatch(invite+acceptance+setup+page,/operator_roles|operator_id|app_metadata/);
});
