import type { OperatorRole } from "@/lib/operatorSecurity";

export const privilegedRoles = Object.freeze(["admin", "finance"] satisfies readonly OperatorRole[]);

export const segregationRules = Object.freeze([
  {
    key: "AUDITOR_EXCLUSIVE",
    description: "Auditor is an independent read-only role and must not coexist with mutation-capable operator roles.",
    incompatibleRoles: ["operations", "finance", "admin"] as const,
  },
  {
    key: "FINANCE_STEP_UP",
    description: "Finance-sensitive approvals, payouts, reversals and cancellations require recent step-up authentication.",
    enforcedInApplication: true,
  },
  {
    key: "PRIVILEGE_ASSIGNMENT_INDEPENDENCE",
    description: "A person requesting or using privileged access should not be the sole approver of their own access assignment.",
    enforcedInApplication: false,
  },
  {
    key: "ACCESS_REVIEW_INDEPENDENCE",
    description: "Privileged-access review should be performed by an accountable reviewer independent of the subject where practicable.",
    enforcedInApplication: false,
  },
]);

export const accessReviewChecklist = Object.freeze([
  "Identity is active and uniquely attributable.",
  "Operator ID and roles are sourced only from trusted app metadata.",
  "Role assignment matches current job responsibility and least privilege.",
  "Auditor role is not combined with any mutation-capable role.",
  "Privileged roles have a documented business justification.",
  "Stale, duplicate, dormant or departed-user access is removed.",
  "Service credentials and shared secrets are not represented as named human operator access.",
  "Reviewer identity, review date, result and evidence reference are recorded.",
]);

export type AccessReviewDecision = "RETAIN" | "REDUCE" | "REVOKE" | "ESCALATE";

export function assertOperatorRoleCombination(roles: readonly OperatorRole[]) {
  const unique = [...new Set(roles)];
  if (!unique.length) throw new Error("At least one operator role is required.");
  if (unique.includes("auditor") && unique.length > 1) {
    throw new Error("Auditor role must not be combined with mutation-capable operator roles.");
  }
}

export function assertAccessReviewEvidence(input: {
  subjectOperatorId: string;
  reviewerOperatorId: string;
  decision: AccessReviewDecision;
  evidenceReference?: string | null;
  businessJustification?: string | null;
}) {
  if (!input.subjectOperatorId.trim() || !input.reviewerOperatorId.trim()) {
    throw new Error("Access review requires subject and reviewer identities.");
  }
  if (input.subjectOperatorId === input.reviewerOperatorId) {
    throw new Error("Privileged access review must not be self-approved.");
  }
  if (!input.evidenceReference?.trim()) throw new Error("Access review requires an evidence reference.");
  if (input.decision === "RETAIN" && !input.businessJustification?.trim()) {
    throw new Error("Retaining privileged access requires business justification.");
  }
}
