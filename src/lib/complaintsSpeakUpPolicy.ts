export type ComplaintSeverity = "CRITICAL" | "MAJOR" | "MODERATE" | "MINOR";
export type ComplaintStatus =
  | "OPEN"
  | "TRIAGED"
  | "INVESTIGATING"
  | "ACTION_REQUIRED"
  | "RESPONSE_PREPARED"
  | "RESOLVED"
  | "CLOSED";

export const complaintLifecycle: Readonly<Record<ComplaintStatus, readonly ComplaintStatus[]>> = Object.freeze({
  OPEN: ["TRIAGED"],
  TRIAGED: ["INVESTIGATING", "ACTION_REQUIRED"],
  INVESTIGATING: ["ACTION_REQUIRED", "RESPONSE_PREPARED"],
  ACTION_REQUIRED: ["INVESTIGATING", "RESPONSE_PREPARED"],
  RESPONSE_PREPARED: ["RESOLVED"],
  RESOLVED: ["CLOSED", "INVESTIGATING"],
  CLOSED: [],
});

export const complaintTriageRules = Object.freeze([
  "Clinical-safety concerns require immediate safety escalation and must not be handled only as customer-service complaints.",
  "Privacy/security concerns require assessment under the relevant incident/privacy process.",
  "Allegations involving retaliation, fraud, serious misconduct or regulatory breach require independent escalation and evidence preservation.",
  "Anonymous or confidential sources must not be deanonymised unless necessary, lawful and specifically authorised.",
  "Complaint handling must not suppress linked incident, CAPA, legal, privacy, regulatory or clinical obligations.",
]);

export const nonRetaliationRules = Object.freeze([
  "Good-faith reporting must not trigger retaliation or adverse treatment because the concern was raised.",
  "The subject of a concern must not be the sole investigator or closure approver where a conflict exists.",
  "Evidence of retaliation or interference should be treated as a separate concern and escalated.",
]);

export const closureEvidenceChecklist = Object.freeze([
  "Scope and issue classification are documented.",
  "Relevant evidence has been preserved and reviewed.",
  "Conflicts of interest have been identified and managed.",
  "Required incident/CAPA/privacy/clinical/regulatory linkages are recorded.",
  "Resolution summary and evidence reference are documented.",
  "External/regulatory reporting need has been assessed before closure.",
  "Complainant notification state is recorded where applicable and safe.",
]);

export function assertComplaintTransition(input: {
  currentStatus: ComplaintStatus;
  requestedStatus: ComplaintStatus;
  resolutionSummary?: string | null;
  evidenceReference?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  regulatorAssessmentState?: "NOT_ASSESSED" | "NOT_REQUIRED" | "REQUIRED" | "SUBMITTED" | "COMPLETE";
}) {
  if (!complaintLifecycle[input.currentStatus].includes(input.requestedStatus)) {
    throw new Error(`Complaint transition ${input.currentStatus} -> ${input.requestedStatus} is not permitted.`);
  }

  if (input.requestedStatus === "RESOLVED") {
    if (!input.resolutionSummary?.trim()) throw new Error("Resolved complaint requires a resolution summary.");
    if (!input.evidenceReference?.trim()) throw new Error("Resolved complaint requires an evidence reference.");
    if (!input.resolvedAt?.trim()) throw new Error("Resolved complaint requires a resolution timestamp.");
  }

  if (input.requestedStatus === "CLOSED") {
    if (!input.closedAt?.trim()) throw new Error("Closed complaint requires a closure timestamp.");
    if (!input.regulatorAssessmentState || input.regulatorAssessmentState === "NOT_ASSESSED") {
      throw new Error("Complaint closure requires external/regulatory reporting assessment.");
    }
  }
}
