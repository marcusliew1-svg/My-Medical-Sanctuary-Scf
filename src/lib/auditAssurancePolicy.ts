export type AuditStatus = "PLANNED" | "IN_PROGRESS" | "REPORTING" | "COMPLETE" | "CANCELLED";
export type AuditRating = "COMPLIANT" | "PARTIALLY_COMPLIANT" | "NON_COMPLIANT" | "NOT_APPLICABLE";
export type ControlEffectiveness = "EFFECTIVE" | "NEEDS_IMPROVEMENT" | "INEFFECTIVE" | "NOT_TESTED";

export const auditLifecycle = Object.freeze({
  PLANNED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["REPORTING", "CANCELLED"],
  REPORTING: ["COMPLETE", "IN_PROGRESS"],
  COMPLETE: [],
  CANCELLED: [],
} satisfies Record<AuditStatus, readonly AuditStatus[]>);

export const auditEvidenceChecklist = Object.freeze([
  "Audit scope and objective are documented.",
  "Applicable controls, systems, processes and evidence sources are identified.",
  "Sampling/test method is documented before conclusion.",
  "Evidence is attributable, dated and retained at a stable reference.",
  "Exceptions are recorded rather than averaged away.",
  "Any control effectiveness conclusion is supported by the test performed.",
  "Material findings map to CAPA, risk treatment or explicit accepted-risk evidence.",
  "Audit completion records reviewer/report evidence and completion timestamp.",
]);

export const controlTestRules = Object.freeze([
  "A control must remain NOT_TESTED until actual test evidence exists.",
  "EFFECTIVE requires evidence that the defined control operated as intended for the tested scope and period.",
  "NEEDS_IMPROVEMENT requires an identified weakness with bounded residual effectiveness.",
  "INEFFECTIVE requires failure evidence and should trigger remediation/CAPA assessment.",
  "Absence of detected failure is not itself proof that a control is effective.",
]);

export function assertAuditTransition(input: {
  currentStatus: AuditStatus;
  requestedStatus: AuditStatus;
  reportReference?: string | null;
  overallRating?: AuditRating | null;
  completedAt?: string | null;
}) {
  if (!auditLifecycle[input.currentStatus].includes(input.requestedStatus)) {
    throw new Error(`Audit transition ${input.currentStatus} -> ${input.requestedStatus} is not permitted.`);
  }
  if (input.requestedStatus === "COMPLETE") {
    if (!input.reportReference?.trim()) throw new Error("Completed audit requires a report reference.");
    if (!input.overallRating) throw new Error("Completed audit requires an overall rating.");
    if (!input.completedAt?.trim()) throw new Error("Completed audit requires a completion timestamp.");
  }
}

export function assertControlTestEvidence(input: {
  effectiveness: ControlEffectiveness;
  evidenceReference?: string | null;
  testedAt?: string | null;
  testMethod?: string | null;
}) {
  if (input.effectiveness === "NOT_TESTED") return;
  if (!input.evidenceReference?.trim()) throw new Error("Control effectiveness conclusion requires evidence.");
  if (!input.testedAt?.trim()) throw new Error("Control effectiveness conclusion requires test timestamp.");
  if (!input.testMethod?.trim()) throw new Error("Control effectiveness conclusion requires documented test method.");
}
