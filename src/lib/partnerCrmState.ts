import {
  PARTNER_STAGES,
  type ActivationChecklist,
  type PartnerStage,
  normalisePartnerId,
} from "@/lib/salesPartnerPolicy";

const partnerStages = new Set<string>(PARTNER_STAGES);

export const ACTIVATION_CHECKLIST_KEYS: Array<keyof ActivationChecklist> = [
  "approved",
  "kycDueDiligenceCompleted",
  "agreementCompleted",
  "coreTrainingCompleted",
  "quizPassed",
  "certificationIssued",
  "partnerCodeIssued",
  "crmAccessEnabled",
  "complianceAcknowledged",
];

export type PartnerCrmState = {
  stage: PartnerStage | "";
  partnerId: string;
  checklist: ActivationChecklist;
  sellingEnabled: boolean;
  referralUrl: string;
  agreementVersion: string;
  agreementStatus: string;
  trainingVersion: string;
  trainingModulesComplete: string;
  assessmentAttemptId: string;
  assessmentVersion: string;
  assessmentSource: string;
  assessmentResult: string;
  quizScore: number | null;
  noMedicalClaimsScore: number | null;
  certificationIssuedAt: string;
  certificationExpiresAt: string;
  certificationRenewalDueAt: string;
  lastAuditActor: string;
  lastAuditTimestamp: string;
};

function emptyChecklist(): ActivationChecklist {
  return {
    approved: false,
    kycDueDiligenceCompleted: false,
    agreementCompleted: false,
    coreTrainingCompleted: false,
    quizPassed: false,
    certificationIssued: false,
    partnerCodeIssued: false,
    crmAccessEnabled: false,
    complianceAcknowledged: false,
  };
}

function latestLine(description: string, label: string): string {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = [...description.matchAll(new RegExp(`^${escaped}:\\s*(.*)$`, "gim"))];
  return matches.at(-1)?.[1]?.trim() || "";
}

function nullableScore(value: string): number | null {
  if (!value || value.toLowerCase() === "pending") return null;
  const score = Number(value);
  return Number.isFinite(score) ? score : null;
}

export function partnerStageFromDescription(description: string): PartnerStage | "" {
  const matches = [...description.matchAll(/^Partner Stage:\s*(.+)$/gim)];
  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const candidate = matches[index]?.[1]?.trim();
    if (candidate && partnerStages.has(candidate)) return candidate as PartnerStage;
  }
  return "";
}

export function partnerIdFromDescription(description: string): string {
  const matches = [...description.matchAll(/^Partner ID:\s*(MMSP-\d{4,})\s*$/gim)];
  return normalisePartnerId(matches.at(-1)?.[1] || "");
}

export function checklistFromDescription(description: string): ActivationChecklist {
  const result = emptyChecklist();
  const latest = latestLine(description, "Completed Controls");
  if (!latest || latest.toLowerCase() === "none") return result;

  const completed = new Set(latest.split(",").map((value) => value.trim()));
  for (const key of ACTIVATION_CHECKLIST_KEYS) result[key] = completed.has(key);
  return result;
}

export function parsePartnerCrmState(description: string): PartnerCrmState {
  return {
    stage: partnerStageFromDescription(description),
    partnerId: partnerIdFromDescription(description),
    checklist: checklistFromDescription(description),
    sellingEnabled: latestLine(description, "Selling Enabled").toLowerCase() === "yes",
    referralUrl: latestLine(description, "Referral URL"),
    agreementVersion: latestLine(description, "Agreement Version"),
    agreementStatus: latestLine(description, "Agreement Status"),
    trainingVersion: latestLine(description, "Training Version"),
    trainingModulesComplete: latestLine(description, "Training Modules Complete"),
    assessmentAttemptId: latestLine(description, "Assessment Attempt ID"),
    assessmentVersion: latestLine(description, "Assessment Version"),
    assessmentSource: latestLine(description, "Assessment Source"),
    assessmentResult: latestLine(description, "Assessment Result"),
    quizScore: nullableScore(latestLine(description, "Quiz Score")),
    noMedicalClaimsScore: nullableScore(latestLine(description, "No Medical Claims Score")),
    certificationIssuedAt: latestLine(description, "Certification Issued At"),
    certificationExpiresAt: latestLine(description, "Certification Expires At"),
    certificationRenewalDueAt: latestLine(description, "Certification Renewal Due At"),
    lastAuditActor: latestLine(description, "Last Audit Actor"),
    lastAuditTimestamp: latestLine(description, "Last Audit Timestamp"),
  };
}

export function checklistRegresses(previous: ActivationChecklist, next: ActivationChecklist): boolean {
  return ACTIVATION_CHECKLIST_KEYS.some((key) => previous[key] && !next[key]);
}
