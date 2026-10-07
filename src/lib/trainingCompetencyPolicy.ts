export type TrainingStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUPERVISED_PRACTICE"
  | "COMPETENT"
  | "COMPETENT_WITH_CONDITIONS"
  | "EXPIRED"
  | "SUSPENDED";

export const trainingLifecycle: Readonly<Record<TrainingStatus, readonly TrainingStatus[]>> = Object.freeze({
  NOT_STARTED: ["IN_PROGRESS"],
  IN_PROGRESS: ["SUPERVISED_PRACTICE", "COMPETENT", "COMPETENT_WITH_CONDITIONS", "SUSPENDED"],
  SUPERVISED_PRACTICE: ["COMPETENT", "COMPETENT_WITH_CONDITIONS", "SUSPENDED"],
  COMPETENT: ["IN_PROGRESS", "EXPIRED", "SUSPENDED"],
  COMPETENT_WITH_CONDITIONS: ["IN_PROGRESS", "EXPIRED", "SUSPENDED"],
  EXPIRED: ["IN_PROGRESS"],
  SUSPENDED: ["IN_PROGRESS"],
});

export const competencyEvidenceChecklist = Object.freeze([
  "Subject identity and role are uniquely identified.",
  "Module name and version are recorded.",
  "Required competency method is documented.",
  "Completion evidence is retained at a stable reference.",
  "Assessor role is recorded where competency is assessed.",
  "Completion and verification timestamps are recorded.",
  "Conditions, supervision requirements or restrictions are explicit.",
  "Expiry/refresh requirements are recorded where applicable.",
  "Policy attestation is separately referenced when acknowledgement is required.",
]);

export const trainingGovernanceRules = Object.freeze([
  "Training completion is not equivalent to competency unless an assessment method and evidence support that conclusion.",
  "Competency must not be inferred from attendance alone.",
  "Expired or refresh-required training cannot be treated as current competency.",
  "Role change requires reassessment of role-specific training requirements.",
  "Clinical competency does not itself grant clinical privilege, licensure or Medical Director approval.",
  "Policy acknowledgement does not replace actual skills assessment where competency is required.",
]);

export function assertTrainingTransition(input: {
  currentStatus: TrainingStatus;
  requestedStatus: TrainingStatus;
  competencyMethod?: string | null;
  assessorRole?: string | null;
  completedAt?: string | null;
  evidenceReference?: string | null;
  verifiedAt?: string | null;
  refreshRequired?: boolean;
}) {
  if (!trainingLifecycle[input.currentStatus].includes(input.requestedStatus)) {
    throw new Error(`Training transition ${input.currentStatus} -> ${input.requestedStatus} is not permitted.`);
  }

  if (input.requestedStatus === "COMPETENT" || input.requestedStatus === "COMPETENT_WITH_CONDITIONS") {
    if (!input.competencyMethod?.trim()) throw new Error("Competency requires a documented assessment method.");
    if (!input.assessorRole?.trim()) throw new Error("Competency requires an assessor role.");
    if (!input.completedAt?.trim()) throw new Error("Competency requires a completion timestamp.");
    if (!input.evidenceReference?.trim()) throw new Error("Competency requires an evidence reference.");
    if (!input.verifiedAt?.trim()) throw new Error("Competency requires a verification timestamp.");
    if (input.refreshRequired) throw new Error("Refresh-required training cannot be marked competent.");
  }
}

export function trainingIsCurrent(input: {
  status: TrainingStatus;
  expiresAt?: string | null;
  refreshRequired?: boolean;
  now?: Date;
}) {
  if (input.status !== "COMPETENT" && input.status !== "COMPETENT_WITH_CONDITIONS") return false;
  if (input.refreshRequired) return false;
  if (!input.expiresAt) return true;
  const expiry = Date.parse(input.expiresAt);
  if (Number.isNaN(expiry)) return false;
  return expiry > (input.now ?? new Date()).getTime();
}
