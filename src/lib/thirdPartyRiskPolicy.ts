export type ThirdPartyRiskTier = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
export type ThirdPartyDataAccess = "NONE" | "BUSINESS" | "PERSONAL" | "SENSITIVE" | "CLINICAL";

export const thirdPartyRiskPolicy = Object.freeze({
  LOW: {
    description: "Low operational dependency and no meaningful sensitive-data or safety impact.",
    reviewIntensity: "BASIC",
  },
  MODERATE: {
    description: "Meaningful business dependency or personal-data exposure with bounded operational impact.",
    reviewIntensity: "STANDARD",
  },
  HIGH: {
    description: "Material operational, privacy, security, financial or compliance dependency.",
    reviewIntensity: "ENHANCED",
  },
  CRITICAL: {
    description: "Failure or compromise could materially affect safety, identity, payments, core operations, sensitive data or governed evidence.",
    reviewIntensity: "ENHANCED_PLUS_CONTINUITY_EXIT",
  },
} satisfies Record<ThirdPartyRiskTier, { description: string; reviewIntensity: string }>);

export const thirdPartyAssuranceChecklist = Object.freeze([
  "Legal entity and service scope are identified.",
  "Jurisdiction and data-processing locations are understood where applicable.",
  "Business owner and intended use are documented.",
  "Criticality and data-access class are assigned.",
  "Security/privacy/quality evidence is proportionate to risk.",
  "Contractual terms and confidentiality/data-processing obligations are reviewed where applicable.",
  "Subprocessors or material downstream dependencies are understood where applicable.",
  "Business continuity and exit strategy are documented for critical dependencies.",
  "Approval reference, assessment date and review-due date are recorded before approval.",
  "Restrictions and unresolved findings are explicit rather than silently accepted.",
]);

export const thirdPartyCategories = Object.freeze([
  "INFRASTRUCTURE_CLOUD",
  "SAAS_APPLICATION",
  "CRM",
  "PAYMENTS",
  "DATA_PROCESSOR",
  "AI_MODEL_PROVIDER",
  "CLINICAL_SUPPLIER",
  "DIAGNOSTIC_PARTNER",
  "PROFESSIONAL_SERVICE",
  "OTHER",
] as const);

export function assertThirdPartyApproval(input: {
  criticality: ThirdPartyRiskTier;
  dataAccessClass: ThirdPartyDataAccess;
  dueDiligenceReference?: string | null;
  approvalReference?: string | null;
  assessedAt?: string | null;
  privacyTermsReference?: string | null;
  continuityReference?: string | null;
  exitPlanReference?: string | null;
}) {
  if (!input.dueDiligenceReference?.trim()) throw new Error("Third-party approval requires due-diligence evidence.");
  if (!input.approvalReference?.trim()) throw new Error("Third-party approval requires approval evidence.");
  if (!input.assessedAt?.trim()) throw new Error("Third-party approval requires an assessment timestamp.");

  if ((input.dataAccessClass === "SENSITIVE" || input.dataAccessClass === "CLINICAL")
      && !input.privacyTermsReference?.trim()) {
    throw new Error("Sensitive/clinical third-party approval requires privacy/data-processing terms evidence.");
  }

  if (input.criticality === "CRITICAL") {
    if (!input.continuityReference?.trim()) throw new Error("Critical third-party approval requires continuity evidence.");
    if (!input.exitPlanReference?.trim()) throw new Error("Critical third-party approval requires an exit plan.");
  }
}
