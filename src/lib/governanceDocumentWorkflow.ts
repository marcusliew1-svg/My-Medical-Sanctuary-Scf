export const governanceDocumentStatuses = [
  "WORKING_DRAFT",
  "REVIEW",
  "APPROVED",
  "EFFECTIVE",
  "SUPERSEDED",
  "RETIRED",
] as const;

export type GovernanceDocumentStatus = (typeof governanceDocumentStatuses)[number];

const allowedTransitions: Readonly<Record<GovernanceDocumentStatus, readonly GovernanceDocumentStatus[]>> = {
  WORKING_DRAFT: ["REVIEW", "RETIRED"],
  REVIEW: ["WORKING_DRAFT", "APPROVED", "RETIRED"],
  APPROVED: ["REVIEW", "EFFECTIVE", "RETIRED"],
  EFFECTIVE: ["SUPERSEDED", "RETIRED"],
  SUPERSEDED: ["RETIRED"],
  RETIRED: [],
};

function requiredText(value: unknown, label: string): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) throw new Error(`${label} is required.`);
  return text;
}

export function assertGovernanceDocumentTransition(input: {
  currentStatus: string;
  requestedStatus?: string;
  ownerId?: string | null;
  reviewerId?: string | null;
  approverId?: string | null;
  approverRole?: string | null;
  approvalReference?: string | null;
}) {
  const current = input.currentStatus as GovernanceDocumentStatus;
  if (!governanceDocumentStatuses.includes(current)) throw new Error("Current document status is invalid.");
  if (!input.requestedStatus || input.requestedStatus === current) return;

  const requested = input.requestedStatus as GovernanceDocumentStatus;
  if (!governanceDocumentStatuses.includes(requested)) throw new Error("Document status is invalid.");
  if (!allowedTransitions[current].includes(requested)) {
    throw new Error(`Document transition ${current} -> ${requested} is not permitted.`);
  }

  if (requested === "REVIEW") {
    requiredText(input.ownerId, "Named document owner");
    requiredText(input.reviewerId, "Named document reviewer");
  }

  if (requested === "APPROVED" || requested === "EFFECTIVE") {
    requiredText(input.ownerId, "Named document owner");
    requiredText(input.reviewerId, "Named document reviewer");
    requiredText(input.approverId, "Named document approver");
    requiredText(input.approverRole, "Document approver role");
    requiredText(input.approvalReference, "Document approval evidence reference");
  }
}
