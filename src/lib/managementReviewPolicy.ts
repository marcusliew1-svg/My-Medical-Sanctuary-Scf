export type ManagementReviewStatus =
  | "PLANNED"
  | "IN_PREPARATION"
  | "IN_REVIEW"
  | "ACTIONS_OPEN"
  | "COMPLETE"
  | "CANCELLED";

export type ManagementAssurance =
  | "NOT_ASSESSED"
  | "ADEQUATE"
  | "ADEQUATE_WITH_CONDITIONS"
  | "INADEQUATE";

export const managementReviewLifecycle: Readonly<Record<ManagementReviewStatus, readonly ManagementReviewStatus[]>> = Object.freeze({
  PLANNED: ["IN_PREPARATION", "CANCELLED"],
  IN_PREPARATION: ["IN_REVIEW", "CANCELLED"],
  IN_REVIEW: ["ACTIONS_OPEN", "COMPLETE"],
  ACTIONS_OPEN: ["IN_REVIEW", "COMPLETE"],
  COMPLETE: [],
  CANCELLED: [],
});

export const managementReviewEvidenceChecklist = Object.freeze([
  "Review period, scope and review type are explicit.",
  "Risks, control effectiveness and overdue control tests are included.",
  "Open incidents, CAPA, complaints/concerns and material audit findings are included.",
  "Regulatory obligations, licensing blockers and overdue/blocked obligations are included.",
  "Training/competency gaps and privileged-access review findings are included where material.",
  "Critical third-party/vendor dependencies and unresolved assurance findings are included.",
  "Launch/readiness state and unresolved Production blockers are presented without dilution.",
  "Decisions and actions are attributable and retained at stable evidence references.",
  "Material unresolved issues remain visible after the review; completion does not erase them.",
]);

export const managementReviewRules = Object.freeze([
  "A management review must not be marked complete without an evidence pack, minutes, action register, assurance conclusion and approval evidence.",
  "Management assurance is a governance conclusion for the reviewed scope; it is not a legal, regulatory, clinical or certification opinion.",
  "Open critical or major issues must not be hidden by aggregate green status.",
  "Deferred decisions and accepted risks require their own governance evidence.",
  "A completed review does not automatically close incidents, CAPA, complaints, risks, audits or regulatory obligations.",
  "Production readiness remains subject to the separate release, launch, legal, privacy, clinical, licensing and insurance gates.",
]);

export function assertManagementReviewCompletion(input: {
  evidencePackReference?: string | null;
  minutesReference?: string | null;
  actionRegisterReference?: string | null;
  overallAssurance?: ManagementAssurance | null;
  completedAt?: string | null;
  approvalReference?: string | null;
}) {
  if (!input.evidencePackReference?.trim()) throw new Error("Completed management review requires an evidence-pack reference.");
  if (!input.minutesReference?.trim()) throw new Error("Completed management review requires minutes.");
  if (!input.actionRegisterReference?.trim()) throw new Error("Completed management review requires an action-register reference.");
  if (!input.overallAssurance || input.overallAssurance === "NOT_ASSESSED") {
    throw new Error("Completed management review requires an assurance conclusion.");
  }
  if (!input.completedAt?.trim()) throw new Error("Completed management review requires a completion timestamp.");
  if (!input.approvalReference?.trim()) throw new Error("Completed management review requires approval evidence.");
}
