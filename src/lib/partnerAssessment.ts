import { SALES_PARTNER_ASSESSMENT_VERSION } from "@/lib/salesPartnerPolicy";

export type SalesPartnerAssessmentEvidence = {
  attemptId: string;
  version: string;
  completedAt: string;
  source: "LMS" | "Staff Verified";
  overallScore: number;
  noMedicalClaimsScore: number;
  result: "Passed" | "Failed";
};

function validTimestamp(value: string): boolean {
  return Boolean(value) && !Number.isNaN(Date.parse(value));
}

export function validateSalesPartnerAssessmentEvidence(evidence: SalesPartnerAssessmentEvidence | undefined): void {
  if (!evidence) throw new Error("Certification assessment evidence is required.");
  if (!evidence.attemptId.trim()) throw new Error("Assessment attempt ID is required.");
  if (evidence.version !== SALES_PARTNER_ASSESSMENT_VERSION) {
    throw new Error("Assessment version does not match the currently controlled Sales Partner assessment.");
  }
  if (!validTimestamp(evidence.completedAt)) throw new Error("Assessment completion timestamp is invalid.");
  if (evidence.source !== "LMS" && evidence.source !== "Staff Verified") {
    throw new Error("Assessment source is invalid.");
  }
  if (!Number.isFinite(evidence.overallScore) || evidence.overallScore < 0 || evidence.overallScore > 100) {
    throw new Error("Assessment overall score must be between 0 and 100.");
  }
  if (!Number.isFinite(evidence.noMedicalClaimsScore) || evidence.noMedicalClaimsScore < 0 || evidence.noMedicalClaimsScore > 100) {
    throw new Error("No Medical Claims score must be between 0 and 100.");
  }

  const passed = evidence.overallScore >= 80 && evidence.noMedicalClaimsScore === 100;
  if (evidence.result === "Passed" && !passed) {
    throw new Error("Assessment cannot be marked Passed unless overall score is at least 80 and No Medical Claims score is 100.");
  }
  if (evidence.result === "Failed" && passed) {
    throw new Error("Assessment result conflicts with the recorded passing scores.");
  }
}

export function assertSalesPartnerAssessmentPassed(evidence: SalesPartnerAssessmentEvidence | undefined): void {
  validateSalesPartnerAssessmentEvidence(evidence);
  if (evidence?.result !== "Passed") throw new Error("Sales Partner certification assessment has not been passed.");
}
