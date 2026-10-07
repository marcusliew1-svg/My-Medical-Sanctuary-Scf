export type ExceptionStatus =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "APPROVED_WITH_CONDITIONS"
  | "REJECTED"
  | "EXPIRED"
  | "REVOKED"
  | "CLOSED";

export type ExceptionRisk = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export const exceptionLifecycle: Readonly<Record<ExceptionStatus, readonly ExceptionStatus[]>> = Object.freeze({
  DRAFT: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["DRAFT", "APPROVED", "APPROVED_WITH_CONDITIONS", "REJECTED"],
  APPROVED: ["EXPIRED", "REVOKED", "CLOSED", "UNDER_REVIEW"],
  APPROVED_WITH_CONDITIONS: ["EXPIRED", "REVOKED", "CLOSED", "UNDER_REVIEW"],
  REJECTED: [],
  EXPIRED: ["CLOSED"],
  REVOKED: ["CLOSED"],
  CLOSED: [],
});

export const exceptionGovernanceRules = Object.freeze([
  "Exceptions must be specific, time-bound and attributable.",
  "Exceptions must not silently rewrite the underlying policy or control.",
  "Approved exceptions require explicit approval evidence and expiry.",
  "HIGH and CRITICAL exceptions require documented compensating controls.",
  "Expired exceptions must not be treated as continuing approval.",
  "Emergency exceptions may compress review timing but do not eliminate evidence, ownership, expiry or retrospective review.",
  "Clinical, legal, regulatory, privacy or security prohibitions cannot be waived merely by creating an exception record.",
]);

export const exceptionEvidenceChecklist = Object.freeze([
  "Policy/control/requirement being excepted is identified.",
  "Business rationale and affected scope are documented.",
  "Risk rating is explicit.",
  "Compensating controls are documented where risk is HIGH or CRITICAL.",
  "Owner role and approver role are recorded.",
  "Approval evidence is retained at a stable reference.",
  "Effective and expiry timestamps are explicit.",
  "Review/monitoring requirements are documented.",
  "Closure or revocation evidence is retained.",
]);

export function assertExceptionApproval(input: {
  riskRating: ExceptionRisk;
  approvalReference?: string | null;
  approverRole?: string | null;
  effectiveAt?: string | null;
  expiresAt?: string | null;
  evidenceReference?: string | null;
  compensatingControls?: string | null;
}) {
  if (!input.approvalReference?.trim()) throw new Error("Approved exception requires approval evidence.");
  if (!input.approverRole?.trim()) throw new Error("Approved exception requires an approver role.");
  if (!input.effectiveAt?.trim()) throw new Error("Approved exception requires an effective timestamp.");
  if (!input.expiresAt?.trim()) throw new Error("Approved exception requires an expiry timestamp.");
  if (!input.evidenceReference?.trim()) throw new Error("Approved exception requires an evidence reference.");
  if ((input.riskRating === "HIGH" || input.riskRating === "CRITICAL") && !input.compensatingControls?.trim()) {
    throw new Error("High/critical exception requires compensating controls.");
  }
  const effective = Date.parse(input.effectiveAt);
  const expiry = Date.parse(input.expiresAt);
  if (Number.isNaN(effective) || Number.isNaN(expiry) || expiry <= effective) {
    throw new Error("Approved exception expiry must be after its effective time.");
  }
}

export function exceptionIsCurrent(input: {
  status: ExceptionStatus;
  expiresAt?: string | null;
  now?: Date;
}) {
  if (input.status !== "APPROVED" && input.status !== "APPROVED_WITH_CONDITIONS") return false;
  if (!input.expiresAt) return false;
  const expiry = Date.parse(input.expiresAt);
  if (Number.isNaN(expiry)) return false;
  return expiry > (input.now ?? new Date()).getTime();
}
