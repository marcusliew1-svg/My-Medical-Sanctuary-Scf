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

const ACTIVATION_BLOCK_START = "[MMS_PARTNER_ACTIVATION]";
const ACTIVATION_BLOCK_END = "[/MMS_PARTNER_ACTIVATION]";
const ACTIVATION_EVENT_START = "[MMS_PARTNER_ACTIVATION_EVENT]";
const ACTIVATION_EVENT_END = "[/MMS_PARTNER_ACTIVATION_EVENT]";
const CERTIFICATION_RENEWAL_NOTICE_DAYS = 90;

export type PartnerActivationEvidence = {
  approvedAt?: string;
  kycDueDiligenceCompletedAt?: string;
  agreementVersion?: string;
  agreementAcceptedAt?: string;
  agreementAcceptedIp?: string;
  trainingVersion?: string;
  trainingCompletedAt?: string;
  trainingAcknowledgedIp?: string;
  trainingModules?: SalesPartnerTrainingEvidence;
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
    requireIsoTimestamp(evidence.agreementAcceptedAt, "agreementAcceptedAt");
  }
  if (checklist.coreTrainingCompleted) {
    if ((evidence.trainingVersion || "") !== SALES_PARTNER_CORE_TRAINING_VERSION) {
      throw new Error("Training version does not match the currently controlled Sales Partner training version.");
    }
    requireIsoTimestamp(evidence.trainingCompletedAt, "trainingCompletedAt");
    assertSalesPartnerTrainingComplete(evidence.trainingModules);
  }
  if (checklist.quizPassed) {
    if (!Number.isFinite(evidence.quizScore) || Number(evidence.quizScore) < 80 || Number(evidence.quizScore) > 100) {
      throw new Error("Quiz score must be between 80 and 100 for a passed Sales Partner assessment.");
    }
    if (Number(evidence.noMedicalClaimsScore) !== 100) {
      throw new Error("No Medical Claims assessment score must be 100 before certification.");
    }
    requireIsoTimestamp(evidence.quizPassedAt, "quizPassedAt");
  }
  if (checklist.certificationIssued) {
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
    `Agreement Accepted At: ${record.evidence.agreementAcceptedAt || "pending"}`,
    `Training Version: ${record.evidence.trainingVersion || "pending"}`,
    `Training Modules Complete: ${completedTrainingModules(record.evidence.trainingModules)}`,
    `Training Completed At: ${record.evidence.trainingCompletedAt || "pending"}`,
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
    `Training Modules Complete: ${completedTrainingModules(record.evidence.trainingModules)}`,
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
  const description = buildPartnerActivationDescription(existingDescription, record);
  const active = sellingEnabled(record.nextStage, record.checklist);

  return {
    Description: description,
    Lead_Status: active ? "Contacted" : "Not Contacted",
    Tag: active ? [{ name: "MMS Sales Partner Active" }] : [{ name: "MMS Sales Partner Applicant" }],
  };
}
