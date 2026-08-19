import { SALES_PARTNER_CORE_TRAINING_VERSION } from "@/lib/salesPartnerPolicy";
import { SALES_PARTNER_CORE_MODULES, type SalesPartnerTrainingEvidence } from "@/lib/partnerTraining";
import type { PartnerHubCertificationSummary } from "@/lib/partnerHubDashboard";

export type PartnerHubAcademyModule = {
  moduleId: string;
  title: string;
  version: string;
  status: "Not Started" | "Completed" | "Refresh Required";
  completedAt?: string;
  acknowledgedAt?: string;
};

export type PartnerHubAcademySummary = {
  trainingVersion: string;
  modules: PartnerHubAcademyModule[];
  completedModules: number;
  totalModules: number;
  trainingComplete: boolean;
  assessment: {
    status: "Not Attempted" | "Passed" | "Failed";
    overallScore?: number;
    noMedicalClaimsScore?: number;
    completedAt?: string;
  };
  certification: PartnerHubCertificationSummary;
};

function validTimestamp(value: string | undefined): boolean {
  return Boolean(value) && !Number.isNaN(Date.parse(String(value)));
}

export function buildPartnerHubAcademySummary(input: {
  training?: SalesPartnerTrainingEvidence;
  assessmentResult?: "Passed" | "Failed";
  assessmentOverallScore?: number;
  assessmentNoMedicalClaimsScore?: number;
  assessmentCompletedAt?: string;
  certification: PartnerHubCertificationSummary;
}): PartnerHubAcademySummary {
  const byId = new Map((input.training?.modules || []).map((module) => [module.moduleId, module]));
  const modules = SALES_PARTNER_CORE_MODULES.map((required) => {
    const evidence = byId.get(required.id);
    const currentVersion = evidence?.version === SALES_PARTNER_CORE_TRAINING_VERSION;
    const complete = Boolean(
      evidence &&
      currentVersion &&
      validTimestamp(evidence.completedAt) &&
      validTimestamp(evidence.acknowledgedAt) &&
      evidence.passed !== false &&
      !evidence.refreshRequired,
    );
    return {
      moduleId: required.id,
      title: required.title,
      version: SALES_PARTNER_CORE_TRAINING_VERSION,
      status: evidence?.refreshRequired || (evidence && !currentVersion)
        ? "Refresh Required" as const
        : complete
          ? "Completed" as const
          : "Not Started" as const,
      completedAt: evidence?.completedAt,
      acknowledgedAt: evidence?.acknowledgedAt,
    };
  });
  const completedModules = modules.filter((module) => module.status === "Completed").length;

  return {
    trainingVersion: SALES_PARTNER_CORE_TRAINING_VERSION,
    modules,
    completedModules,
    totalModules: modules.length,
    trainingComplete: completedModules === modules.length,
    assessment: {
      status: input.assessmentResult || "Not Attempted",
      overallScore: input.assessmentOverallScore,
      noMedicalClaimsScore: input.assessmentNoMedicalClaimsScore,
      completedAt: input.assessmentCompletedAt,
    },
    certification: input.certification,
  };
}

// Academy data is training/compliance data only. It must not expose member clinical information.
