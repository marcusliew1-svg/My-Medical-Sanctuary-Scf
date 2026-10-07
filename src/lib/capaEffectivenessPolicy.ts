export type CapaStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "IMPLEMENTED"
  | "EFFECTIVENESS_REVIEW"
  | "CLOSED";

export type CapaEffectiveness =
  | "NOT_ASSESSED"
  | "EFFECTIVE"
  | "PARTIALLY_EFFECTIVE"
  | "INEFFECTIVE";

export const capaLifecycle: Readonly<Record<CapaStatus, readonly CapaStatus[]>> = Object.freeze({
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["IMPLEMENTED"],
  IMPLEMENTED: ["EFFECTIVENESS_REVIEW"],
  EFFECTIVENESS_REVIEW: ["IN_PROGRESS", "CLOSED"],
  CLOSED: [],
});

export const capaGovernanceRules = Object.freeze([
  "Implementation is not the same as effectiveness.",
  "IMPLEMENTED requires documented root-cause/causal analysis, implementation timestamp and implementation evidence.",
  "EFFECTIVENESS_REVIEW requires evidence, verifier role, verification timestamp and a non-NOT_ASSESSED effectiveness result.",
  "CLOSED requires EFFECTIVE verification plus closure evidence and closure timestamp.",
  "PARTIALLY_EFFECTIVE or INEFFECTIVE remediation must not be silently closed.",
  "Effectiveness-review history is append-only; failed or limited reviews remain visible.",
  "Closing CAPA does not automatically close the originating incident, complaint, audit finding, risk or supplier issue.",
]);

export const capaEvidenceChecklist = Object.freeze([
  "Source finding and severity are traceable.",
  "Root cause or causal-analysis reference is documented before implementation closure.",
  "Implementation evidence demonstrates what changed.",
  "Effectiveness review is independent enough for the risk and records reviewer role.",
  "Effectiveness evidence tests whether the corrective action actually addressed the finding.",
  "Follow-up is documented for ineffective, partially effective or blocked outcomes.",
  "Closure evidence is retained separately from implementation evidence.",
  "Related incident/risk/audit/complaint records retain their own lifecycle.",
]);

export function assertCapaImplementation(input: {
  rootCauseReference?: string | null;
  implementedAt?: string | null;
  implementationEvidenceReference?: string | null;
}) {
  if (!input.rootCauseReference?.trim()) throw new Error("Implemented CAPA requires root-cause evidence.");
  if (!input.implementedAt?.trim()) throw new Error("Implemented CAPA requires implementation timestamp.");
  if (!input.implementationEvidenceReference?.trim()) throw new Error("Implemented CAPA requires implementation evidence.");
}

export function assertCapaClosure(input: {
  effectivenessEvidence?: string | null;
  effectivenessResult: CapaEffectiveness;
  verifiedByRole?: string | null;
  verifiedAt?: string | null;
  closureReference?: string | null;
  closedAt?: string | null;
}) {
  if (!input.effectivenessEvidence?.trim()) throw new Error("Closed CAPA requires effectiveness evidence.");
  if (input.effectivenessResult !== "EFFECTIVE") throw new Error("Closed CAPA requires an EFFECTIVE outcome.");
  if (!input.verifiedByRole?.trim()) throw new Error("Closed CAPA requires verifier role.");
  if (!input.verifiedAt?.trim()) throw new Error("Closed CAPA requires verification timestamp.");
  if (!input.closureReference?.trim()) throw new Error("Closed CAPA requires closure evidence.");
  if (!input.closedAt?.trim()) throw new Error("Closed CAPA requires closure timestamp.");
}
