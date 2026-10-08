export const privacySecurityAssessmentRules = Object.freeze([
  "A privacy/security assessment is a governance assessment linked to an incident; it is not itself a declaration that a statutory breach occurred.",
  "Notification applicability must not be inferred from incident severity alone.",
  "Any REQUIRED / NOT_REQUIRED / PENDING_AUTHORITY_REVIEW decision requires legal/privacy review, decision evidence and immutable supporting evidence.",
  "Authority or data-subject notification must not be marked COMPLETED without a stable notification reference.",
  "No statutory notification deadline is invented by this policy; jurisdiction-specific timing must come from authoritative legal/regulatory sources.",
  "Assessment history is append-only; superseding conclusions require a new assessment record.",
  "Incident closure remains subject to the incident lifecycle and does not occur automatically from a privacy/security assessment.",
]);

export const privacySecurityAssessmentChecklist = Object.freeze([
  "Incident linkage and jurisdiction are explicit.",
  "Affected data classes and approximate scope are documented where known.",
  "Risk to individuals is assessed or explicitly marked unknown/not assessed.",
  "Notification applicability is reviewed by the appropriate legal/privacy authority.",
  "Decision evidence is retained.",
  "Authority and subject notification states are tracked separately.",
  "Completed notifications have stable evidence references.",
  "Known uncertainty and limitations remain visible.",
]);

export function assertNotificationDecision(input: {
  notificationAssessmentState: string;
  legalPrivacyReviewReference?: string | null;
  decisionReference?: string | null;
  evidenceId?: string | null;
}) {
  if (input.notificationAssessmentState === "NOT_ASSESSED") return;
  if (!input.legalPrivacyReviewReference?.trim()) throw new Error("Notification decision requires legal/privacy review evidence.");
  if (!input.decisionReference?.trim()) throw new Error("Notification decision requires decision evidence.");
  if (!input.evidenceId?.trim()) throw new Error("Notification decision requires immutable supporting evidence.");
}
