export type AiGovernanceStatus =
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "ACTIVE"
  | "RESTRICTED"
  | "SUSPENDED"
  | "RETIRED";

export const aiGovernanceRules = Object.freeze([
  "AI use cases must remain human-reviewed where human review is required by the approved design.",
  "APPROVED or ACTIVE AI use cases require identified provider, model, version, system policy, human-oversight design, privacy review, validation evidence, monitoring, disable/rollback controls and approval evidence.",
  "Clinical-governance-required AI use cases additionally require explicit clinical-governance evidence.",
  "AI output must not silently mutate authoritative systems or become the sole basis for a clinical, legal, regulatory, financial or access-control decision.",
  "Model/provider/version or material system-prompt changes require reassessment before continued reliance.",
  "Validation evidence is append-only; failed or limited tests remain visible.",
  "A passed AI validation proves only the tested scope and does not establish general safety, accuracy, legality or clinical fitness.",
]);

export const aiValidationChecklist = Object.freeze([
  "Intended use and prohibited uses are explicit.",
  "Provider/model/version are identified.",
  "Data classification and minimum-data design are documented.",
  "System policy/prompt boundary is controlled.",
  "Human-review workflow and escalation path are documented.",
  "Safety/refusal/grounding tests are defined for the intended use.",
  "Privacy/security review evidence is retained.",
  "Clinical governance is evidenced where required.",
  "Monitoring and disable/rollback procedures are defined.",
  "Material model/prompt/provider changes trigger reassessment.",
]);

export function assertAiActivation(input: {
  providerName?: string | null;
  modelIdentifier?: string | null;
  modelVersion?: string | null;
  systemPolicyReference?: string | null;
  humanReviewRequired: boolean;
  humanOversightReference?: string | null;
  privacyReviewReference?: string | null;
  validationReference?: string | null;
  monitoringReference?: string | null;
  disableOrRollbackReference?: string | null;
  approvalReference?: string | null;
  lastValidatedAt?: string | null;
  clinicalGovernanceRequired: boolean;
  clinicalGovernanceReference?: string | null;
}) {
  if (!input.providerName?.trim()) throw new Error("AI activation requires an identified provider.");
  if (!input.modelIdentifier?.trim()) throw new Error("AI activation requires a model identifier.");
  if (!input.modelVersion?.trim()) throw new Error("AI activation requires a model version.");
  if (!input.systemPolicyReference?.trim()) throw new Error("AI activation requires a controlled system-policy reference.");
  if (!input.humanReviewRequired) throw new Error("AI activation requires the approved human-review control to remain enabled.");
  if (!input.humanOversightReference?.trim()) throw new Error("AI activation requires human-oversight evidence.");
  if (!input.privacyReviewReference?.trim()) throw new Error("AI activation requires privacy-review evidence.");
  if (!input.validationReference?.trim()) throw new Error("AI activation requires validation evidence.");
  if (!input.monitoringReference?.trim()) throw new Error("AI activation requires monitoring evidence.");
  if (!input.disableOrRollbackReference?.trim()) throw new Error("AI activation requires disable/rollback evidence.");
  if (!input.approvalReference?.trim()) throw new Error("AI activation requires approval evidence.");
  if (!input.lastValidatedAt?.trim()) throw new Error("AI activation requires a validation timestamp.");
  if (input.clinicalGovernanceRequired && !input.clinicalGovernanceReference?.trim()) {
    throw new Error("Clinical AI activation requires clinical-governance evidence.");
  }
}
