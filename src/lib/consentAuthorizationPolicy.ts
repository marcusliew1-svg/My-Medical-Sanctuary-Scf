export type ConsentStatus =
  | "DRAFT"
  | "PENDING"
  | "ACTIVE"
  | "WITHDRAWN"
  | "EXPIRED"
  | "REVOKED"
  | "SUPERSEDED";

export const consentGovernanceRules = Object.freeze([
  "A consent record must identify the exact consent document reference and version presented.",
  "ACTIVE consent requires capture method, accountable capture role, grant timestamp and immutable evidence.",
  "Withdrawal requires explicit withdrawal reference, timestamp and effective scope.",
  "Consent history is append-only through immutable events; prior grant/withdrawal evidence must not be rewritten.",
  "Consent must be scoped to its documented purpose and must not be reused as blanket authorization for unrelated activities.",
  "Withdrawal does not by itself erase historical records or retroactively invalidate lawful actions already taken.",
  "Consent is not assumed to be the only or correct legal basis for every privacy, clinical or operational activity.",
  "Clinical treatment consent must not be treated as present merely because a service or appointment exists.",
]);

export const consentEvidenceChecklist = Object.freeze([
  "Subject is represented by an internal/pseudonymous reference.",
  "Jurisdiction and consent type are explicit.",
  "Exact document reference and version are recorded.",
  "Scope/purpose is described.",
  "Capture method, role and timestamp are recorded for ACTIVE consent.",
  "Immutable evidence supports grant/withdrawal/revocation events.",
  "Expiry/supersession is evaluated where applicable.",
  "Withdrawal scope and downstream operational effect are documented.",
]);

export function assertConsentActivation(input: {
  documentReference?: string | null;
  documentVersion?: string | null;
  captureMethod?: string | null;
  capturedByRole?: string | null;
  grantedAt?: string | null;
  evidenceId?: string | null;
}) {
  if (!input.documentReference?.trim()) throw new Error("Consent requires a document reference.");
  if (!input.documentVersion?.trim()) throw new Error("Consent requires a document version.");
  if (!input.captureMethod?.trim()) throw new Error("Active consent requires capture method.");
  if (!input.capturedByRole?.trim()) throw new Error("Active consent requires capture role.");
  if (!input.grantedAt?.trim()) throw new Error("Active consent requires grant timestamp.");
  if (!input.evidenceId?.trim()) throw new Error("Active consent requires immutable evidence.");
}

export function assertConsentWithdrawal(input: {
  withdrawalReference?: string | null;
  withdrawnAt?: string | null;
  withdrawalEffectiveScope?: string | null;
}) {
  if (!input.withdrawalReference?.trim()) throw new Error("Withdrawal requires evidence/reference.");
  if (!input.withdrawnAt?.trim()) throw new Error("Withdrawal requires timestamp.");
  if (!input.withdrawalEffectiveScope?.trim()) throw new Error("Withdrawal requires effective scope.");
}
