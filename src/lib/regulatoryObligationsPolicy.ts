export type RegulatoryObligationStatus =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "ACTIVE"
  | "NOT_APPLICABLE"
  | "SUSPENDED"
  | "RETIRED";

export const obligationLifecycle: Readonly<Record<RegulatoryObligationStatus, readonly RegulatoryObligationStatus[]>> = Object.freeze({
  DRAFT: ["UNDER_REVIEW", "RETIRED"],
  UNDER_REVIEW: ["DRAFT", "ACTIVE", "NOT_APPLICABLE", "RETIRED"],
  ACTIVE: ["UNDER_REVIEW", "SUSPENDED", "RETIRED"],
  NOT_APPLICABLE: ["UNDER_REVIEW", "RETIRED"],
  SUSPENDED: ["UNDER_REVIEW", "ACTIVE", "RETIRED"],
  RETIRED: [],
});

export const obligationEvidenceChecklist = Object.freeze([
  "Jurisdiction and competent authority are identified.",
  "Primary or approved authoritative source is referenced.",
  "Applicability to MMS legal entity, facility, service, product or activity is documented.",
  "Accountable owner role is assigned.",
  "Trigger, recurrence and due date are documented where applicable.",
  "Required filing/reporting/renewal evidence is defined before completion.",
  "Completion evidence is retained at a stable reference.",
  "Missed or blocked obligations are escalated rather than silently reset.",
  "Changes in law, licence scope or operating model trigger re-review.",
]);

export const complianceCalendarRules = Object.freeze([
  "A due date must not be invented when the authoritative source does not establish one.",
  "ACTIVE obligations require an approval reference and applicability rationale.",
  "NOT_APPLICABLE conclusions require documented rationale and reviewability.",
  "Completed obligations require completion evidence.",
  "Overdue or blocked obligations must remain visible until formally resolved.",
  "Calendar reminders do not themselves satisfy the underlying legal or regulatory obligation.",
]);

export function assertObligationActivation(input: {
  sourceReference?: string | null;
  ownerRole?: string | null;
  approvalReference?: string | null;
  applicabilityRationale?: string | null;
}) {
  if (!input.sourceReference?.trim()) throw new Error("Active obligation requires an authoritative source reference.");
  if (!input.ownerRole?.trim()) throw new Error("Active obligation requires an accountable owner role.");
  if (!input.approvalReference?.trim()) throw new Error("Active obligation requires approval evidence.");
  if (!input.applicabilityRationale?.trim()) throw new Error("Active obligation requires applicability rationale.");
}

export function assertObligationCompletion(input: {
  completedAt?: string | null;
  completionReference?: string | null;
}) {
  if (input.completedAt && !input.completionReference?.trim()) {
    throw new Error("Completed obligation requires completion evidence.");
  }
}
