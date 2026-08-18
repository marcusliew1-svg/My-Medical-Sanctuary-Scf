import {
  SALES_PARTNER_AGREEMENT_VERSION,
  SALES_PARTNER_CORE_TRAINING_VERSION,
  type ActivationChecklist,
  type PartnerStage,
  assertPartnerStageTransition,
  normalisePartnerId,
  referralUrlForPartner,
  sellingEnabled,
} from "@/lib/salesPartnerPolicy";

const ACTIVATION_BLOCK_START = "[MMS_PARTNER_ACTIVATION]";
const ACTIVATION_BLOCK_END = "[/MMS_PARTNER_ACTIVATION]";

export type PartnerActivationEvidence = {
  approvedAt?: string;
  kycDueDiligenceCompletedAt?: string;
  agreementVersion?: string;
  agreementAcceptedAt?: string;
  agreementAcceptedIp?: string;
  trainingVersion?: string;
  trainingCompletedAt?: string;
  trainingAcknowledgedIp?: string;
  quizScore?: number;
  quizPassedAt?: string;
  certificationIssuedAt?: string;
  certificationExpiresAt?: string;
  complianceAcknowledgedAt?: string;
  complianceAcknowledgedIp?: string;
  crmAccessEnabledAt?: string;
};

export type PartnerActivationRecord = {
  partnerId: string;
  currentStage: PartnerStage;
  nextStage: PartnerStage;
  checklist: ActivationChecklist;
  evidence: PartnerActivationEvidence;
  actor: string;
  changedAt: string;
  siteUrl: string;
};

function requireIsoTimestamp(value: string | undefined, field: string): void {
  if (!value || Number.isNaN(Date.parse(value))) throw new Error(`${field} must contain a valid timestamp.`);
}

function validateActivationEvidence(record: PartnerActivationRecord): void {
  const { checklist, evidence } = record;

  if (checklist.approved) requireIsoTimestamp(evidence.approvedAt, "approvedAt");
  if (checklist.kycDueDiligenceCompleted) {
    requireIsoTimestamp(evidence.kycDueDiligenceCompletedAt, "kycDueDiligenceCompletedAt");
  }
  if (checklist.agreementCompleted) {
    if ((evidence.agreementVersion || "") !== SALES_PARTNER_AGREEMENT_VERSION) {
      throw new Error("Agreement version does not match the currently controlled Sales Partner Agreement version.");
    }
    requireIsoTimestamp(evidence.agreementAcceptedAt, "agreementAcceptedAt");
  }
  if (checklist.coreTrainingCompleted) {
    if ((evidence.trainingVersion || "") !== SALES_PARTNER_CORE_TRAINING_VERSION) {
      throw new Error("Training version does not match the currently controlled Sales Partner training version.");
    }
    requireIsoTimestamp(evidence.trainingCompletedAt, "trainingCompletedAt");
  }
  if (checklist.quizPassed) {
    if (!Number.isFinite(evidence.quizScore) || Number(evidence.quizScore) < 80 || Number(evidence.quizScore) > 100) {
      throw new Error("Quiz score must be between 80 and 100 for a passed Sales Partner assessment.");
    }
    requireIsoTimestamp(evidence.quizPassedAt, "quizPassedAt");
  }
  if (checklist.certificationIssued) {
    requireIsoTimestamp(evidence.certificationIssuedAt, "certificationIssuedAt");
    requireIsoTimestamp(evidence.certificationExpiresAt, "certificationExpiresAt");
  }
  if (checklist.complianceAcknowledged) {
    requireIsoTimestamp(evidence.complianceAcknowledgedAt, "complianceAcknowledgedAt");
  }
  if (checklist.crmAccessEnabled) requireIsoTimestamp(evidence.crmAccessEnabledAt, "crmAccessEnabledAt");
}

export function validatePartnerActivationRecord(record: PartnerActivationRecord): void {
  const partnerId = normalisePartnerId(record.partnerId);
  if (!partnerId) throw new Error("A valid permanent MMS Partner ID is required.");
  if (!record.actor.trim()) throw new Error("Activation actor is required for auditability.");
  requireIsoTimestamp(record.changedAt, "changedAt");
  assertPartnerStageTransition(record.currentStage, record.nextStage, record.checklist);
  validateActivationEvidence(record);
}

function replaceStructuredBlock(description: string, block: string): string {
  const startIndex = description.indexOf(ACTIVATION_BLOCK_START);
  const endIndex = description.indexOf(ACTIVATION_BLOCK_END);

  if (startIndex >= 0 && endIndex > startIndex) {
    const afterEnd = endIndex + ACTIVATION_BLOCK_END.length;
    return `${description.slice(0, startIndex)}${block}${description.slice(afterEnd)}`.trim();
  }

  return [description.trim(), block].filter(Boolean).join("\n\n");
}

export function buildPartnerActivationDescription(
  existingDescription: string,
  record: PartnerActivationRecord,
): string {
  validatePartnerActivationRecord(record);
  const partnerId = normalisePartnerId(record.partnerId);
  const isSellingEnabled = sellingEnabled(record.nextStage, record.checklist);
  const referralUrl = isSellingEnabled ? referralUrlForPartner(record.siteUrl, partnerId) : "withheld until Active";

  const lines = [
    ACTIVATION_BLOCK_START,
    `Partner ID: ${partnerId}`,
    `Partner Stage: ${record.nextStage}`,
    `Selling Enabled: ${isSellingEnabled ? "yes" : "no"}`,
    `Referral URL: ${referralUrl}`,
    `Agreement Version: ${record.evidence.agreementVersion || "pending"}`,
    `Agreement Accepted At: ${record.evidence.agreementAcceptedAt || "pending"}`,
    `Training Version: ${record.evidence.trainingVersion || "pending"}`,
    `Training Completed At: ${record.evidence.trainingCompletedAt || "pending"}`,
    `Quiz Score: ${record.evidence.quizScore ?? "pending"}`,
    `Quiz Passed At: ${record.evidence.quizPassedAt || "pending"}`,
    `Certification Issued At: ${record.evidence.certificationIssuedAt || "pending"}`,
    `Certification Expires At: ${record.evidence.certificationExpiresAt || "pending"}`,
    `KYC/DD Completed At: ${record.evidence.kycDueDiligenceCompletedAt || "pending"}`,
    `Compliance Acknowledged At: ${record.evidence.complianceAcknowledgedAt || "pending"}`,
    `CRM Access Enabled At: ${record.evidence.crmAccessEnabledAt || "pending"}`,
    `Audit Actor: ${record.actor.trim()}`,
    `Audit Timestamp: ${record.changedAt}`,
    ACTIVATION_BLOCK_END,
  ];

  return replaceStructuredBlock(existingDescription || "", lines.join("\n")).slice(0, 32_000);
}

export function activationZohoChanges(existingDescription: string, record: PartnerActivationRecord) {
  const description = buildPartnerActivationDescription(existingDescription, record);
  const active = sellingEnabled(record.nextStage, record.checklist);

  return {
    Description: description,
    Lead_Status: active ? "Contacted" : "Not Contacted",
    Tag: active ? [{ name: "MMS Sales Partner Active" }] : [{ name: "MMS Sales Partner Applicant" }],
  };
}
