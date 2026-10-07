export type PrivacyRequestStatus =
  | "RECEIVED"
  | "IDENTITY_VERIFICATION"
  | "UNDER_REVIEW"
  | "ACTION_REQUIRED"
  | "PARTIALLY_FULFILLED"
  | "FULFILLED"
  | "DENIED"
  | "CLOSED";

export const privacyRequestLifecycle: Readonly<Record<PrivacyRequestStatus, readonly PrivacyRequestStatus[]>> = Object.freeze({
  RECEIVED: ["IDENTITY_VERIFICATION"],
  IDENTITY_VERIFICATION: ["UNDER_REVIEW", "DENIED"],
  UNDER_REVIEW: ["ACTION_REQUIRED", "PARTIALLY_FULFILLED", "FULFILLED", "DENIED"],
  ACTION_REQUIRED: ["UNDER_REVIEW", "PARTIALLY_FULFILLED", "FULFILLED", "DENIED"],
  PARTIALLY_FULFILLED: ["CLOSED"],
  FULFILLED: ["CLOSED"],
  DENIED: ["CLOSED"],
  CLOSED: [],
});

export const privacyRightsRules = Object.freeze([
  "A request type in the register is a workflow category, not a statement that the requested legal right applies universally.",
  "Identity must be verified through an approved process before substantive disclosure, correction, restriction, export, deletion or other action.",
  "Jurisdiction and applicability must be assessed before a request is fulfilled or denied.",
  "Deletion/erasure must not override legal hold, approved retention requirements, clinical-record obligations or other lawful preservation duties.",
  "Material actions and responses require immutable evidence.",
  "The request register should use a pseudonymous/internal subject reference rather than unnecessary personal details.",
  "A denial or limitation requires an explicit reason and must remain reviewable.",
]);

export const privacyRightsEvidenceChecklist = Object.freeze([
  "Request type and source channel are recorded.",
  "Subject identity verification is evidenced before substantive action.",
  "Jurisdiction/applicability assessment is documented.",
  "Legal-hold and retention requirements are assessed where deletion/erasure is requested.",
  "Search scope and relevant systems of record are documented where applicable.",
  "Material action evidence is retained immutably.",
  "Decision and response references are present before completion.",
  "Denials or limitations include a reason.",
]);

export function assertPrivacyRequestDecision(input: {
  identityVerifiedAt?: string | null;
  identityVerificationReference?: string | null;
  jurisdictionAssessmentReference?: string | null;
  decisionReference?: string | null;
  responseReference?: string | null;
  completedAt?: string | null;
}) {
  if (!input.identityVerifiedAt?.trim()) throw new Error("Privacy request decision requires identity verification.");
  if (!input.identityVerificationReference?.trim()) throw new Error("Privacy request decision requires identity-verification evidence.");
  if (!input.jurisdictionAssessmentReference?.trim()) throw new Error("Privacy request decision requires jurisdiction/applicability assessment.");
  if (!input.decisionReference?.trim()) throw new Error("Privacy request completion requires decision evidence.");
  if (!input.responseReference?.trim()) throw new Error("Privacy request completion requires response evidence.");
  if (!input.completedAt?.trim()) throw new Error("Privacy request completion requires completion timestamp.");
}

export function assertDeletionFulfilment(input: {
  legalHoldState: "UNKNOWN" | "CLEAR" | "HELD" | "NOT_APPLICABLE";
  retentionAssessmentReference?: string | null;
}) {
  if (input.legalHoldState !== "CLEAR") {
    throw new Error("Deletion/erasure fulfilment requires confirmed-clear legal hold.");
  }
  if (!input.retentionAssessmentReference?.trim()) {
    throw new Error("Deletion/erasure fulfilment requires retention assessment.");
  }
}
