export type DeploymentEnvironment = "production" | "preview" | "development";

export type MmsFeature =
  | "prototype"
  | "partnerHub"
  | "patientPortal"
  | "membershipCheckout"
  | "productionLingAi"
  | "healthIntelligenceInternal";

type FeatureRule = {
  envVar: string;
  enabledOutsideProduction: boolean;
  description: string;
};

export const mmsFeatureRules: Record<MmsFeature, FeatureRule> = {
  prototype: {
    envVar: "MMS_PROTOTYPE_ENABLED",
    enabledOutsideProduction: true,
    description: "Synthetic operations prototype routes under /prototype.",
  },
  partnerHub: {
    envVar: "MMS_PARTNER_HUB_ENABLED",
    enabledOutsideProduction: true,
    description: "Unfinished partner-facing portal and partner-hub APIs.",
  },
  patientPortal: {
    envVar: "MMS_PATIENT_PORTAL_ENABLED",
    enabledOutsideProduction: true,
    description: "Unfinished My Sanctuary login, registration and onboarding surfaces.",
  },
  membershipCheckout: {
    envVar: "MMS_MEMBERSHIP_CHECKOUT_ENABLED",
    enabledOutsideProduction: true,
    description: "Unfinished membership checkout page surface.",
  },
  productionLingAi: {
    envVar: "MMS_PRODUCTION_LING_AI_ENABLED",
    enabledOutsideProduction: false,
    description: "Production AI responses for Ling. Placeholder routing remains available.",
  },
  healthIntelligenceInternal: {
    envVar: "MMS_HEALTH_INTELLIGENCE_INTERNAL_ENABLED",
    enabledOutsideProduction: false,
    description: "Authenticated internal Health Intelligence reviewer console and APIs.",
  },
};

export function getDeploymentEnvironment(env: NodeJS.ProcessEnv = process.env): DeploymentEnvironment {
  if (env.VERCEL_ENV === "production") return "production";
  if (env.VERCEL_ENV === "preview") return "preview";
  return "development";
}

export function isProductionDeployment(env: NodeJS.ProcessEnv = process.env): boolean {
  return getDeploymentEnvironment(env) === "production";
}

export function featureFlagValue(feature: MmsFeature, env: NodeJS.ProcessEnv = process.env): boolean {
  return env[mmsFeatureRules[feature].envVar]?.trim().toLowerCase() === "true";
}

export function isMmsFeatureEnabled(feature: MmsFeature, env: NodeJS.ProcessEnv = process.env): boolean {
  if (isProductionDeployment(env)) return featureFlagValue(feature, env);
  const explicit = env[mmsFeatureRules[feature].envVar]?.trim().toLowerCase();
  if (explicit === "false") return false;
  if (explicit === "true") return true;
  return mmsFeatureRules[feature].enabledOutsideProduction;
}

export const gatedRoutePrefixes: ReadonlyArray<{ prefix: string; feature: MmsFeature }> = [
  { prefix: "/prototype", feature: "prototype" },
  { prefix: "/partner-hub", feature: "partnerHub" },
  { prefix: "/api/partner-hub", feature: "partnerHub" },
  { prefix: "/api/internal/partner-hub", feature: "partnerHub" },
  { prefix: "/login", feature: "patientPortal" },
  { prefix: "/register", feature: "patientPortal" },
  { prefix: "/onboarding", feature: "patientPortal" },
  { prefix: "/my-sanctuary", feature: "patientPortal" },
  { prefix: "/membership-checkout", feature: "membershipCheckout" },
  { prefix: "/internal/health-intelligence", feature: "healthIntelligenceInternal" },
  { prefix: "/api/internal/health-intelligence", feature: "healthIntelligenceInternal" },
] as const;

export function unavailableFeatureForPath(pathname: string, env: NodeJS.ProcessEnv = process.env): MmsFeature | null {
  const matched = gatedRoutePrefixes.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!matched) return null;
  return isMmsFeatureEnabled(matched.feature, env) ? null : matched.feature;
}
