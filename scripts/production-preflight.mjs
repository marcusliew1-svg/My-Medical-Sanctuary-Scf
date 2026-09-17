const PREVIEW_REF = "tfwnlmmdrkkfrtmawpma";
const IPIVOT_STAGING_REF = "saqnpgrfkblmymubkvvz";
const TEMPORARY_CANONICAL = "https://www.scf.center";

export const CONTROLLED_PUBLIC_LAUNCH_MODE = "informational";
export const CONTROLLED_PUBLIC_DISABLED_GATES = Object.freeze([
  "MMS_PATIENT_REGISTRATION_ENABLED",
  "MMS_PATIENT_PORTAL_ENABLED",
  "MMS_PARTNER_HUB_ENABLED",
  "MMS_BOOKING_PRODUCTION_APPROVED",
  "MMS_BOOKING_PERSISTENCE_ENABLED",
  "MMS_COMMERCIAL_DATABASE_ENABLED",
  "MMS_MEMBERSHIP_CHECKOUT_ENABLED",
  "MMS_STRIPE_CHECKOUT_ENABLED",
  "MMS_STRIPE_FULFILMENT_ENABLED",
  "MMS_PRODUCTION_LING_AI_ENABLED",
  "MMS_HEALTH_INTELLIGENCE_REAL_DATA_ENABLED",
  "MMS_CAREERS_APPLICATIONS_ENABLED",
  "MMS_SALES_PARTNER_APPLICATIONS_ENABLED",
  "MMS_OPERATOR_ACCESS_ENABLED",
  "MMS_HEALTH_INTELLIGENCE_INTERNAL_ENABLED",
  "MMS_HEALTH_EDUCATION_INDEXABLE",
  "MMS_MEDICAL_EDUCATION_INDEXABLE",
  "MMS_PROTOTYPE_ENABLED",
  "MMS_PARTNER_HUB_QA_BOOTSTRAP_ENABLED",
  "MMS_HEALTH_INTELLIGENCE_DEMO_MODE",
  "MMS_CRM_PERSISTENCE_ENABLED",
  "MMS_CLINIC_MANAGER_QUEUE_ENABLED",
  "MMS_AI_OPERATIONS_ASSISTANT_ENABLED",
  "MMS_LING_PUBLIC_CONCIERGE_ENABLED",
  "MMS_MANAGEMENT_INTELLIGENCE_ENABLED",
  "MMS_SYNTHETIC_DATA_ONLY",
]);

const enabled = (env, name) => env[name] === "true";
const value = (env, name) => env[name]?.trim() || "";

function httpsOrigin(raw) {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && url.origin === raw.replace(/\/$/, "") ? url.origin : "";
  } catch {
    return "";
  }
}

export function productionReadinessErrors(env = process.env) {
  if (env.VERCEL_ENV !== "production") return [];

  const errors = [];
  const launchMode = value(env, "MMS_PRODUCTION_LAUNCH_MODE").toLowerCase() || "full";
  const controlledPublicLaunch = launchMode === CONTROLLED_PUBLIC_LAUNCH_MODE;
  const publicOrigin = httpsOrigin(value(env, "NEXT_PUBLIC_SITE_URL"));
  const serverOrigin = httpsOrigin(value(env, "MMS_SITE_URL"));

  if (!["full", CONTROLLED_PUBLIC_LAUNCH_MODE].includes(launchMode))
    errors.push("MMS_PRODUCTION_LAUNCH_MODE must be full or informational.");

  if (!publicOrigin) errors.push("NEXT_PUBLIC_SITE_URL must be an exact HTTPS origin.");
  if (!serverOrigin) errors.push("MMS_SITE_URL must be an exact HTTPS origin.");
  if (publicOrigin && serverOrigin && publicOrigin !== serverOrigin)
    errors.push("NEXT_PUBLIC_SITE_URL and MMS_SITE_URL must match exactly.");
  if (publicOrigin.endsWith(".vercel.app") || serverOrigin.endsWith(".vercel.app"))
    errors.push("A Vercel deployment hostname is not an approved Production canonical.");

  if (controlledPublicLaunch) {
    if (!enabled(env, "MMS_CONTROLLED_PUBLIC_LAUNCH_APPROVED"))
      errors.push("MMS_CONTROLLED_PUBLIC_LAUNCH_APPROVED must record explicit informational-launch approval.");
    if (
      publicOrigin &&
      publicOrigin !== TEMPORARY_CANONICAL &&
      !enabled(env, "MMS_PRODUCTION_CANONICAL_APPROVED")
    )
      errors.push("Informational launch may use only the temporary scf.center origin unless the final canonical is approved.");
    for (const name of CONTROLLED_PUBLIC_DISABLED_GATES)
      if (enabled(env, name)) errors.push(`${name} must remain false for the controlled public informational launch.`);
  } else {
    if (publicOrigin === TEMPORARY_CANONICAL || serverOrigin === TEMPORARY_CANONICAL)
      errors.push("The temporary scf.center canonical is not approved for full Production launch.");
    if (!enabled(env, "MMS_PRODUCTION_CANONICAL_APPROVED"))
      errors.push("MMS_PRODUCTION_CANONICAL_APPROVED must record explicit domain approval.");
    if (!enabled(env, "MMS_PRODUCTION_LEGAL_APPROVED"))
      errors.push("MMS_PRODUCTION_LEGAL_APPROVED must record dated entity/privacy/terms approval.");
  }

  const scopedConfiguration = Object.entries(env)
    .filter(([name]) => /(?:SUPABASE|DATABASE)_URL$/.test(name))
    .map(([name, raw]) => [name, String(raw || "")]);
  for (const [name, raw] of scopedConfiguration) {
    if (raw.includes(PREVIEW_REF)) errors.push(`${name} points to the MMS Preview Supabase ref.`);
    if (raw.includes(IPIVOT_STAGING_REF)) errors.push(`${name} points to the forbidden iPivot staging ref.`);
  }

  if (enabled(env, "MMS_PATIENT_REGISTRATION_ENABLED") && !enabled(env, "MMS_PATIENT_PORTAL_ENABLED"))
    errors.push("Patient registration cannot be enabled while the patient portal is disabled.");
  if (enabled(env, "MMS_PATIENT_PORTAL_ENABLED")) {
    if (!value(env, "MMS_PATIENT_SUPABASE_URL")) errors.push("Patient portal requires MMS_PATIENT_SUPABASE_URL.");
    if (!value(env, "MMS_PATIENT_SUPABASE_PUBLISHABLE_KEY")) errors.push("Patient portal requires its publishable key.");
    if (!enabled(env, "MMS_PRODUCTION_SMTP_E2E_APPROVED")) errors.push("Patient Auth requires approved Production SMTP E2E evidence.");
  }

  if (enabled(env, "MMS_PARTNER_HUB_ENABLED")) {
    if (!value(env, "MMS_PARTNER_SUPABASE_URL")) errors.push("Partner Hub requires MMS_PARTNER_SUPABASE_URL.");
    if (!value(env, "MMS_PARTNER_SUPABASE_PUBLISHABLE_KEY")) errors.push("Partner Hub requires its publishable key.");
    if (!enabled(env, "MMS_COMMERCIAL_DATABASE_ENABLED")) errors.push("Partner Hub requires the commercial database gate.");
    if (!enabled(env, "MMS_PRODUCTION_SMTP_E2E_APPROVED")) errors.push("Partner Auth requires approved Production SMTP E2E evidence.");
  }
  if (enabled(env, "MMS_COMMERCIAL_DATABASE_ENABLED")) {
    if (!value(env, "MMS_COMMERCIAL_DATABASE_URL")) errors.push("Commercial database gate requires its server-only URL.");
    if (value(env, "MMS_COMMERCIAL_DATABASE_SCHEMA") !== "mms_commercial")
      errors.push("Commercial database schema must be mms_commercial.");
  }
  if (enabled(env, "MMS_BOOKING_PERSISTENCE_ENABLED")) {
    if (!enabled(env, "MMS_BOOKING_PRODUCTION_APPROVED")) errors.push("Production booking requires explicit persistence approval.");
    for (const name of ["ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN"])
      if (!value(env, name)) errors.push(`Production booking requires ${name}.`);
    if (enabled(env, "MMS_CRM_DEBUG")) errors.push("MMS_CRM_DEBUG must be false for Production booking.");
  }

  for (const name of ["MMS_PARTNER_HUB_QA_BOOTSTRAP_ENABLED", "MMS_HEALTH_INTELLIGENCE_DEMO_MODE", "MMS_PROTOTYPE_ENABLED"])
    if (enabled(env, name)) errors.push(`${name} is forbidden in Production.`);

  return errors;
}

export function assertProductionReadiness(env = process.env) {
  const errors = productionReadinessErrors(env);
  if (errors.length) throw new Error(`Production readiness preflight failed:\n- ${errors.join("\n- ")}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  assertProductionReadiness();
  console.log(envMessage(process.env));
}

function envMessage(env) {
  return env.VERCEL_ENV === "production"
    ? "Production readiness preflight passed."
    : "Production readiness preflight skipped outside Vercel Production.";
}
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
