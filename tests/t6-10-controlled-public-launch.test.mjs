import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  CONTROLLED_PUBLIC_DISABLED_GATES,
  productionReadinessErrors,
} from "../scripts/production-preflight.mjs";

const root = process.cwd();
const pack = fs.readFileSync(path.join(root, "docs/t6-10-controlled-public-informational-launch.md"), "utf8");
const featureGates = fs.readFileSync(path.join(root, "src/lib/featureGates.ts"), "utf8");

const informationalEnv = {
  VERCEL_ENV: "production",
  MMS_PRODUCTION_LAUNCH_MODE: "informational",
  MMS_CONTROLLED_PUBLIC_LAUNCH_APPROVED: "true",
  MMS_SITE_URL: "https://www.scf.center",
  NEXT_PUBLIC_SITE_URL: "https://www.scf.center",
};

test("controlled informational mode accepts the temporary origin without final legal/domain attestations", () => {
  assert.deepEqual(productionReadinessErrors(informationalEnv), []);
});

test("controlled informational mode requires its own explicit approval", () => {
  const errors = productionReadinessErrors({
    ...informationalEnv,
    MMS_CONTROLLED_PUBLIC_LAUNCH_APPROVED: "false",
  });
  assert.ok(errors.some((error) => error.includes("MMS_CONTROLLED_PUBLIC_LAUNCH_APPROVED")));
});

test("every operational, authenticated, commercial and clinical gate is hard-blocked", () => {
  assert.ok(CONTROLLED_PUBLIC_DISABLED_GATES.length >= 20);
  for (const name of CONTROLLED_PUBLIC_DISABLED_GATES) {
    const errors = productionReadinessErrors({ ...informationalEnv, [name]: "true" });
    assert.ok(errors.some((error) => error.includes(`${name} must remain false`)), name);
  }
});

test("full launch retains final-domain and legal approval requirements", () => {
  const errors = productionReadinessErrors({
    ...informationalEnv,
    MMS_PRODUCTION_LAUNCH_MODE: "full",
    MMS_CONTROLLED_PUBLIC_LAUNCH_APPROVED: "false",
  });
  assert.ok(errors.some((error) => error.includes("temporary scf.center canonical")));
  assert.ok(errors.some((error) => error.includes("MMS_PRODUCTION_CANONICAL_APPROVED")));
  assert.ok(errors.some((error) => error.includes("MMS_PRODUCTION_LEGAL_APPROVED")));
});

test("informational mode still rejects Vercel canonicals and forbidden Preview references", () => {
  const vercelErrors = productionReadinessErrors({
    ...informationalEnv,
    MMS_SITE_URL: "https://example.vercel.app",
    NEXT_PUBLIC_SITE_URL: "https://example.vercel.app",
  });
  assert.ok(vercelErrors.some((error) => error.includes("Vercel deployment hostname")));

  const previewErrors = productionReadinessErrors({
    ...informationalEnv,
    MMS_PARTNER_SUPABASE_URL: "https://tfwnlmmdrkkfrtmawpma.supabase.co",
  });
  assert.ok(previewErrors.some((error) => error.includes("MMS Preview Supabase ref")));
});

test("write-capable public APIs are proxy-gated while their feature flags are off", () => {
  for (const route of [
    "/api/booking",
    "/api/checkout",
    "/api/stripe/webhook",
    "/api/sales-partner-application",
    "/api/careers-application",
  ]) assert.match(featureGates, new RegExp(route.replaceAll("/", "\\/")));
});

test("approval pack records the route boundary, temporary origin defect and exact change set", () => {
  assert.match(pack, /CONTROLLED PUBLIC LAUNCH: NOT READY/);
  assert.match(pack, /Safe public route candidates/);
  assert.match(pack, /Routes and features that remain gated/);
  assert.match(pack, /Public claim and experience blockers/);
  assert.match(pack, /https:\/\/my-medical-sanctuary-scf\.vercel\.app/);
  for (const token of [
    "MMS_PRODUCTION_LAUNCH_MODE=informational",
    "MMS_CONTROLLED_PUBLIC_LAUNCH_APPROVED=true",
    "MMS_SITE_URL=https://www.scf.center",
    "NEXT_PUBLIC_SITE_URL=https://www.scf.center",
  ]) assert.match(pack, new RegExp(token.replaceAll(".", "\\.")));
  assert.match(pack, /No deployment, DNS change, Supabase write or Production configuration write was performed/);
});
