export type RetentionClass =
  | "TRANSIENT"
  | "OPERATIONAL"
  | "GOVERNANCE"
  | "FINANCIAL"
  | "IDENTITY_ACCESS"
  | "CLINICAL_RESTRICTED";

export const retentionClasses = Object.freeze({
  TRANSIENT: {
    purpose: "Short-lived technical/request data that is not required as a durable business record.",
    retentionPeriodState: "UNAPPROVED",
    deletionMode: "PURGE_WHEN_NO_LONGER_NEEDED",
  },
  OPERATIONAL: {
    purpose: "Operational workflow records, enquiries, CRM state and service administration evidence.",
    retentionPeriodState: "UNAPPROVED",
    deletionMode: "DELETE_OR_ANONYMISE_AFTER_APPROVED_PERIOD",
  },
  GOVERNANCE: {
    purpose: "Governance decisions, audit evidence, incident/CAPA/control records and controlled-document history.",
    retentionPeriodState: "UNAPPROVED",
    deletionMode: "PRESERVE_UNTIL_APPROVED_DISPOSAL",
  },
  FINANCIAL: {
    purpose: "Payment, commission and other financial/commercial records.",
    retentionPeriodState: "UNAPPROVED",
    deletionMode: "PRESERVE_UNTIL_APPROVED_DISPOSAL",
  },
  IDENTITY_ACCESS: {
    purpose: "Authentication, account, access-control and security evidence.",
    retentionPeriodState: "UNAPPROVED",
    deletionMode: "DELETE_OR_ANONYMISE_AFTER_APPROVED_PERIOD",
  },
  CLINICAL_RESTRICTED: {
    purpose: "Clinical/patient records if and when an approved clinical system is activated.",
    retentionPeriodState: "UNAPPROVED",
    deletionMode: "NO_AUTOMATED_DISPOSAL_WITHOUT_APPROVED_CLINICAL_POLICY",
  },
} satisfies Record<RetentionClass, {
  purpose: string;
  retentionPeriodState: "UNAPPROVED";
  deletionMode: string;
}>);

export const privacyLifecycleStates = Object.freeze([
  "COLLECTED",
  "ACTIVE_USE",
  "RESTRICTED",
  "LEGAL_HOLD",
  "ELIGIBLE_FOR_DISPOSAL",
  "DISPOSAL_APPROVED",
  "DISPOSED",
] as const);

export const disposalEvidenceChecklist = Object.freeze([
  "Record category and system of record are identified.",
  "Approved retention rule or case-specific disposal authority is referenced.",
  "Legal hold, complaint, audit, investigation, incident, litigation and regulatory preservation needs are checked.",
  "Dependencies and linked records are assessed before deletion or anonymisation.",
  "Disposal method is appropriate to the data classification and system capability.",
  "The disposal operation is attributable to an authorised actor and timestamp.",
  "A non-sensitive disposal evidence record is retained where required.",
]);

export const legalHoldRules = Object.freeze([
  "Legal hold overrides ordinary retention/disposal schedules.",
  "Records under investigation, complaint, audit, incident, litigation or regulatory review must not be disposed of until the hold is formally released.",
  "A hold must state scope, authority/reference, start date and release evidence.",
  "The system must fail closed when hold status is unknown for a record proposed for disposal.",
]);

export const minimisationRules = Object.freeze([
  "Collect only data required for the declared workflow.",
  "Do not place clinical records, identity documents or detailed medical history into general enquiry/CRM fields.",
  "Do not duplicate sensitive data into logs, analytics events or free-text notes when a structured reference is sufficient.",
  "Do not retain secrets, access tokens, passwords or raw credentials as business records.",
]);

export function assertDisposalEligibility(input: {
  retentionPeriodApproved: boolean;
  legalHoldState: "CLEAR" | "HELD" | "UNKNOWN";
  authorityReference?: string | null;
  linkedRecordReviewCompleted: boolean;
  disposalMethod?: string | null;
}) {
  if (!input.retentionPeriodApproved) throw new Error("Disposal requires an approved retention rule.");
  if (input.legalHoldState !== "CLEAR") throw new Error("Disposal is blocked unless legal-hold state is confirmed clear.");
  if (!input.authorityReference?.trim()) throw new Error("Disposal requires an authority/evidence reference.");
  if (!input.linkedRecordReviewCompleted) throw new Error("Disposal requires linked-record review.");
  if (!input.disposalMethod?.trim()) throw new Error("Disposal method is required.");
}
