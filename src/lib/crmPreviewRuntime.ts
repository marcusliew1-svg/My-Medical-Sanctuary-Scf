import { getDeploymentEnvironment, isMmsFeatureEnabled } from "@/lib/featureGates";

export type CrmPreviewRuntimeReadiness = {
  ready: boolean;
  blockers: string[];
};

export function crmPreviewRuntimeReadiness(env: NodeJS.ProcessEnv = process.env): CrmPreviewRuntimeReadiness {
  const blockers: string[] = [];
  if (getDeploymentEnvironment(env) !== "preview") blockers.push("CRM pilot operations are restricted to Vercel Preview.");
  if (env.MMS_SYNTHETIC_DATA_ONLY?.trim().toLowerCase() !== "true") blockers.push("MMS_SYNTHETIC_DATA_ONLY must be true.");
  for (const feature of ["crmPersistence", "clinicManagerQueue"] as const) {
    if (!isMmsFeatureEnabled(feature, env)) blockers.push(`${feature} is disabled.`);
  }
  return { ready: blockers.length === 0, blockers };
}

export function assertCrmPreviewRuntime(env: NodeJS.ProcessEnv = process.env): void {
  const readiness = crmPreviewRuntimeReadiness(env);
  if (!readiness.ready) throw new Error(readiness.blockers.join(" "));
}

export function previewPilotFeatureReady(
  feature: "aiOperationsAssistant" | "lingPublicConcierge" | "managementIntelligence",
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return getDeploymentEnvironment(env) === "preview" &&
    env.MMS_SYNTHETIC_DATA_ONLY?.trim().toLowerCase() === "true" &&
    isMmsFeatureEnabled(feature, env);
}
