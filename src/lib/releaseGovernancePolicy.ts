export type ChangeClass = "STANDARD" | "NORMAL" | "EMERGENCY";
export type ReleaseStage = "PROPOSED" | "IMPACT_ASSESSMENT" | "APPROVED" | "IMPLEMENTED" | "VERIFIED" | "CLOSED" | "REJECTED";

export const changeClassPolicy = Object.freeze({
  STANDARD: {
    description: "Low-risk, pre-defined change using an approved repeatable method.",
    requiresApprovalReference: true,
    requiresRollbackPlan: true,
    requiresPostImplementationVerification: true,
  },
  NORMAL: {
    description: "Planned change requiring explicit impact assessment and approval.",
    requiresApprovalReference: true,
    requiresRollbackPlan: true,
    requiresPostImplementationVerification: true,
  },
  EMERGENCY: {
    description: "Urgent containment or recovery change where delay creates material operational, security, privacy or safety risk.",
    requiresApprovalReference: true,
    requiresRollbackPlan: true,
    requiresPostImplementationVerification: true,
  },
} satisfies Record<ChangeClass, {
  description: string;
  requiresApprovalReference: boolean;
  requiresRollbackPlan: boolean;
  requiresPostImplementationVerification: boolean;
}>);

export const releaseEvidenceChecklist = Object.freeze([
  "Exact source commit SHA is identified.",
  "Target environment is explicit and independently verified.",
  "Applicable CI/security/governance gates have passed for the exact commit.",
  "Schema/configuration dependencies are identified and ordered safely.",
  "Rollback or forward-fix plan is documented and technically plausible.",
  "Approval reference exists for any Production-impacting release.",
  "Post-deploy verification criteria are defined before release.",
  "Monitoring/incident escalation path is available for the change window.",
]);

export const rollbackReadinessChecklist = Object.freeze([
  "Rollback target or prior known-good release is identified.",
  "Rollback does not require unreviewed destructive data changes.",
  "Database migration compatibility is assessed.",
  "Feature gates can fail closed if rollback is unsafe or incomplete.",
  "Data reconciliation is defined for partial or duplicated mutations.",
  "Rollback completion has explicit verification criteria.",
]);

export const releaseBoundaries = Object.freeze([
  "Preview validation does not authorize Production.",
  "A Preview deployment must not be promoted as though it were the already-tested Production build.",
  "Production release authority must be explicit, attributable and separate from technical readiness.",
  "Clinical-service activation and public availability remain separate governed workflows.",
  "Emergency changes do not waive evidence, review or post-implementation verification; they only compress timing.",
]);

export function assertReleaseApproval(input: {
  changeClass: ChangeClass;
  targetEnvironment: "preview" | "production";
  commitSha: string;
  approvalReference?: string | null;
  rollbackPlan?: string | null;
  verificationPlan?: string | null;
}) {
  if (!/^[a-f0-9]{40}$/i.test(input.commitSha)) throw new Error("Release requires an exact 40-character commit SHA.");
  if (!input.rollbackPlan?.trim()) throw new Error("Release requires a rollback plan.");
  if (!input.verificationPlan?.trim()) throw new Error("Release requires a post-deploy verification plan.");
  if (input.targetEnvironment === "production" && !input.approvalReference?.trim()) {
    throw new Error("Production release requires an explicit approval reference.");
  }
}
