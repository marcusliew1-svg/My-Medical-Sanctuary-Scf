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
import {
  SALES_PARTNER_CORE_MODULES,
  assertSalesPartnerTrainingComplete,
  type SalesPartnerTrainingEvidence,
} from "@/lib/partnerTraining";
import {
  assertSalesPartnerAssessmentPassed,
  type SalesPartnerAssessmentEvidence,
} from "@/lib/partnerAssessment";

const ACTIVATION_BLOCK_START = "[MMS_PARTNER_ACTIVATION]";
const ACTIVATION_BLOCK_END = "[/MMS_PARTNER_ACTIVATION]";
const ACTIVATION_EVENT_START = "[MMS_PARTNER_ACTIVATION_EVENT]";
const ACTIVATION_EVENT_END = "[/MMS_PARTNER_ACTIVATION_EVENT]";
const CERTIFICATION_RENEWAL_NOTICE_DAYS = 90;

export type PartnerActivationEvidence = {
  approvedAt?: string;
  kycDueDiligenceCompletedAt?: string;
  agreementVersion?: string;
  agreementEffectiveDate?: string;
  agreementAcceptedAt?: string;
  agreementAcceptanceMethod?: string;
  agreementDocumentReference?: string;
  agreementStatus?: "Accepted" | "Superseded" | "Revoked";
  agreementAcceptedIp?: string;
  trainingVersion?: string;
  trainingCompletedAt?: string;
  trainingAcknowledgedIp?: string;
  trainingModules?: SalesPartnerTrainingEvidence;
  assessment?: SalesPartnerAssessmentEvidence;
  quizScore?: number;
  noMedicalClaimsScore?: number;
  quizPassedAt?: string;
  certificationIssuedAt?: string;
  certificationExpiresAt?: string;
  certificationRenewalDueAt?: string;
  complianceAcknowledgedAt?: string;
  complianceAcknowledgedIp?: string;
  crmAccessEnabledAt?: string;
};

export type PartnerActivationRecord = {
  partnerId?: string;
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

function requireNonEmpty(value: string | undefined, field: string): void {
  if (!value?.trim()) throw new Error(`${field} is required.`);
}

export function certificationScheduleForIssuedAt(issuedAt: string): {
  expiresAt: string;
  renewalDueAt: string;
} {
  requireIsoTimestamp(issuedAt, "certificationIssuedAt");
  const issued = new Date(issuedAt);
  const expires = new Date(issued.getTime());
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);
  const renewalDue = new Date(expires.getTime() - CERTIFICATION_RENEWAL_NOTICE_DAYS * 24 * 60 * 60 * 1000);
  return { expiresAt: expires.toISOString(), renewalDueAt: renewalDue.toISOString() };
}

function timestampsEqual(left: string | undefined, right: string): boolean {
  return Boolean(left) && Date.parse(left || "") === Date.parse(right);
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
    requireIsoTimestamp(evidence.agreementEffectiveDate, "agreementEffectiveDate");
    requireIsoTimestamp(evidence.agreementAcceptedAt, "agreementAcceptedAt");
    requireNonEmpty(evidence.agreementAcceptanceMethod, "agreementAcceptanceMethod");
    requireNonEmpty(evidence.agreementDocumentReference, "agreementDocumentReference");
    if (evidence.agreementStatus !== "Accepted") {
      throw new Error("The current Sales Partner Agreement must have Accepted status before onboarding can continue.");
    }
  }
  if (checklist.coreTrainingCompleted) {
    if ((evidence.trainingVersion || "") !== SALES_PARTNER_CORE_TRAINING_VERSION) {
      throw new Error("Training version does not match the currently controlled Sales Partner training version.");
    }
    requireIsoTimestamp(evidence.trainingCompletedAt, "trainingCompletedAt");
    assertSalesPartnerTrainingComplete(evidence.trainingModules);
  }
  if (checklist.quizPassed) {
    assertSalesPartnerAssessmentPassed(evidence.assessment);
    if (evidence.quizScore !== evidence.assessment?.overallScore) {
      throw new Error("Quiz score must match the controlled assessment evidence.");
    }
    if (evidence.noMedicalClaimsScore !== evidence.assessment?.noMedicalClaimsScore) {
      throw new Error("No Medical Claims score must match the controlled assessment evidence.");
    }
    requireIsoTimestamp(evidence.quizPassedAt, "quizPassedAt");
    if (!timestampsEqual(evidence.quizPassedAt, evidence.assessment!.completedAt)) {
      throw new Error("Quiz passed timestamp must match the controlled assessment completion timestamp.");
    }
  }
  if (checklist.certificationIssued) {
    if (!checklist.quizPassed) throw new Error("Certification cannot be issued before the Sales Partner assessment is passed.");
    requireIsoTimestamp(evidence.certificationIssuedAt, "certificationIssuedAt");
    requireIsoTimestamp(evidence.certificationExpiresAt, "certificationExpiresAt");
    requireIsoTimestamp(evidence.certificationRenewalDueAt, "certificationRenewalDueAt");
    const schedule = certificationScheduleForIssuedAt(evidence.certificationIssuedAt!);
    if (!timestampsEqual(evidence.certificationExpiresAt, schedule.expiresAt)) {
      throw new Error("Sales Partner certification must expire exactly 12 months after issue.");
    }
    if (!timestampsEqual(evidence.certificationRenewalDueAt, schedule.renewalDueAt)) {
      throw new Error("Sales Partner certification renewal review must be scheduled 90 days before expiry.");
    }
  }
  if (checklist.complianceAcknowledged) {
    requireIsoTimestamp(evidence.complianceAcknowledgedAt, "complianceAcknowledgedAt");
  }
  if (checklist.crmAccessEnabled) requireIsoTimestamp(evidence.crmAccessEnabledAt, "crmAccessEnabledAt");
}

export function validatePartnerActivationRecord(record: PartnerActivationRecord): void {
  const partnerId = normalisePartnerId(record.partnerId);
  const partnerIdRequired = record.checklist.partnerCodeIssued || record.nextStage === "Active";

  if (record.partnerId && !partnerId) throw new Error("Supplied MMS Partner ID is invalid.");
  if (partnerIdRequired && !partnerId) {
    throw new Error("A valid permanent MMS Partner ID is required once Partner Code is issued and before activation.");
  }
  if (record.checklist.partnerCodeIssued !== Boolean(partnerId)) {
    throw new Error("Partner Code status must match the presence of the permanent MMS Partner ID.");
  }
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

function completedControls(checklist: ActivationChecklist): string {
  return Object.entries(checklist)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(", ");
}

function completedTrainingModules(evidence: SalesPartnerTrainingEvidence | undefined): string {
  if (!evidence?.modules?.length) return "0";
  const required = new Set(SALES_PARTNER_CORE_MODULES.map((module) => module.id));
  const completed = new Set(
    evidence.modules
      .filter((module) => required.has(module.moduleId) && !module.refreshRequired && module.passed !== false)
      .map((module) => module.moduleId),
  );
  return `${completed.size}/${SALES_PARTNER_CORE_MODULES.length}`;
}

function trainingAuditLines(evidence: SalesPartnerTrainingEvidence | undefined): string[] {
  if (!evidence?.modules?.length) return [];
  const required = new Set(SALES_PARTNER_CORE_MODULES.map((module) => module.id));
  return evidence.modules
    .filter((module) => required.has(module.moduleId))
    .sort((left, right) => left.moduleId.localeCompare(right.moduleId))
    .map((module) => [
      `Training Module ${module.moduleId}`,
      `version=${module.version}`,
      `completed=${module.completedAt}`,
      `acknowledged=${module.acknowledgedAt}`,
      `passed=${module.passed === false ? "no" : "yes"}`,
      `refresh=${module.refreshRequired ? "yes" : "no"}`,
    ].join(" | "));
}

function activationSnapshot(record: PartnerActivationRecord): string {
  const partnerId = normalisePartnerId(record.partnerId);
  const isSellingEnabled = sellingEnabled(record.nextStage, record.checklist);
  const referralUrl = isSellingEnabled && partnerId
    ? referralUrlForPartner(record.siteUrl, partnerId)
    : "withheld until Active";

  return [
    ACTIVATION_BLOCK_START,
    `Partner ID: ${partnerId || "pending"}`,
    `Partner Stage: ${record.nextStage}`,
    `Completed Controls: ${completedControls(record.checklist) || "none"}`,
    `Selling Enabled: ${isSellingEnabled ? "yes" : "no"}`,
    `Referral URL: ${referralUrl}`,
    `Agreement Version: ${record.evidence.agreementVersion || "pending"}`,
    `Agreement Effective Date: ${record.evidence.agreementEffectiveDate || "pending"}`,
    `Agreement Status: ${record.evidence.agreementStatus || "pending"}`,
    `Agreement Acceptance Method: ${record.evidence.agreementAcceptanceMethod || "pending"}`,
    `Agreement Document Reference: ${record.evidence.agreementDocumentReference || "pending"}`,
    `Agreement Accepted At: ${record.evidence.agreementAcceptedAt || "pending"}`,
    `Training Version: ${record.evidence.trainingVersion || "pending"}`,
    `Training Modules Complete: ${completedTrainingModules(record.evidence.trainingModules)}`,
    `Training Completed At: ${record.evidence.trainingCompletedAt || "pending"}`,
    `Assessment Attempt ID: ${record.evidence.assessment?.attemptId || "pending"}`,
    `Assessment Version: ${record.evidence.assessment?.version || "pending"}`,
    `Assessment Source: ${record.evidence.assessment?.source || "pending"}`,
    `Assessment Result: ${record.evidence.assessment?.result || "pending"}`,
    `Quiz Score: ${record.evidence.quizScore ?? "pending"}`,
    `No Medical Claims Score: ${record.evidence.noMedicalClaimsScore ?? "pending"}`,
    `Quiz Passed At: ${record.evidence.quizPassedAt || "pending"}`,
    `Certification Issued At: ${record.evidence.certificationIssuedAt || "pending"}`,
    `Certification Expires At: ${record.evidence.certificationExpiresAt || "pending"}`,
    `Certification Renewal Due At: ${record.evidence.certificationRenewalDueAt || "pending"}`,
    `KYC/DD Completed At: ${record.evidence.kycDueDiligenceCompletedAt || "pending"}`,
    `Compliance Acknowledged At: ${record.evidence.complianceAcknowledgedAt || "pending"}`,
    `CRM Access Enabled At: ${record.evidence.crmAccessEnabledAt || "pending"}`,
    `Last Audit Actor: ${record.actor.trim()}`,
    `Last Audit Timestamp: ${record.changedAt}`,
    ACTIVATION_BLOCK_END,
  ].join("\n");
}

function activationAuditEvent(record: PartnerActivationRecord): string {
  const partnerId = normalisePartnerId(record.partnerId);

  return [
    ACTIVATION_EVENT_START,
    `Partner ID: ${partnerId || "pending"}`,
    `Transition: ${record.currentStage} -> ${record.nextStage}`,
    `Completed Controls: ${completedControls(record.checklist) || "none"}`,
    `Approved At: ${record.evidence.approvedAt || "pending"}`,
    `KYC/DD Completed At: ${record.evidence.kycDueDiligenceCompletedAt || "pending"}`,
    `Agreement Version: ${record.evidence.agreementVersion || "pending"}`,
    `Agreement Effective Date: ${record.evidence.agreementEffectiveDate || "pending"}`,
    `Agreement Status: ${record.evidence.agreementStatus || "pending"}`,
    `Agreement Acceptance Method: ${record.evidence.agreementAcceptanceMethod || "pending"}`,
    `Agreement Document Reference: ${record.evidence.agreementDocumentReference || "pending"}`,
    `Agreement Accepted At: ${record.evidence.agreementAcceptedAt || "pending"}`,
    `Training Version: ${record.evidence.trainingVersion || "pending"}`,
    `Training Modules Complete: ${completedTrainingModules(record.evidence.trainingModules)}`,
    ...trainingAuditLines(record.evidence.trainingModules),
    `Training Completed At: ${record.evidence.trainingCompletedAt || "pending"}`,
    `Assessment Attempt ID: ${record.evidence.assessment?.attemptId || "pending"}`,
    `Assessment Version: ${record.evidence.assessment?.version || "pending"}`,
    `Assessment Source: ${record.evidence.assessment?.source || "pending"}`,
    `Assessment Result: ${record.evidence.assessment?.result || "pending"}`,
    `Quiz Score: ${record.evidence.quizScore ?? "pending"}`,
    `No Medical Claims Score: ${record.evidence.noMedicalClaimsScore ?? "pending"}`,
    `Quiz Passed At: ${record.evidence.quizPassedAt || "pending"}`,
    `Certification Issued At: ${record.evidence.certificationIssuedAt || "pending"}`,
    `Certification Expires At: ${record.evidence.certificationExpiresAt || "pending"}`,
    `Certification Renewal Due At: ${record.evidence.certificationRenewalDueAt || "pending"}`,
    `Compliance Acknowledged At: ${record.evidence.complianceAcknowledgedAt || "pending"}`,
    `CRM Access Enabled At: ${record.evidence.crmAccessEnabledAt || "pending"}`,
    `Actor: ${record.actor.trim()}`,
    `Timestamp: ${record.changedAt}`,
    ACTIVATION_EVENT_END,
  ].join("\n");
}

export function buildPartnerActivationDescription(
  existingDescription: string,
  record: PartnerActivationRecord,
): string {
  validatePartnerActivationRecord(record);
  const withSnapshot = replaceStructuredBlock(existingDescription || "", activationSnapshot(record));
  const withEvent = [withSnapshot.trim(), activationAuditEvent(record)].filter(Boolean).join("\n\n");

  if (withEvent.length > 32_000) {
    throw new Error("Partner activation audit history is too large for the current CRM Description storage. Move audit events to a dedicated immutable store before continuing.");
  }

  return withEvent;
}

export function activationZohoChanges(existingDescription: string, record: PartnerActivationRecord) {
  return {
    Description: buildPartnerActivationDescription(existingDescription, record),
  };
}
