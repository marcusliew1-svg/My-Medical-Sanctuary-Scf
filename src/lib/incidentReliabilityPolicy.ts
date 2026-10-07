export type IncidentSeverity = "P1" | "P2" | "P3" | "P4" | "CLINICAL_SAFETY";
export type IncidentStatus = "OPEN" | "CONTAINED" | "INVESTIGATING" | "RECOVERED" | "REVIEW" | "CLOSED";

export const incidentSeverityPolicy = Object.freeze({
  P1: {
    label: "Critical service or control failure",
    acknowledgementTargetMinutes: 15,
    containmentTargetMinutes: 60,
    reviewRequired: true,
    capaRequiredByDefault: true,
    externalReportingAssessmentRequired: true,
  },
  P2: {
    label: "Major operational degradation",
    acknowledgementTargetMinutes: 30,
    containmentTargetMinutes: 240,
    reviewRequired: true,
    capaRequiredByDefault: true,
    externalReportingAssessmentRequired: true,
  },
  P3: {
    label: "Limited degradation or recoverable control failure",
    acknowledgementTargetMinutes: 240,
    containmentTargetMinutes: 1440,
    reviewRequired: true,
    capaRequiredByDefault: false,
    externalReportingAssessmentRequired: true,
  },
  P4: {
    label: "Minor operational issue",
    acknowledgementTargetMinutes: 1440,
    containmentTargetMinutes: 4320,
    reviewRequired: false,
    capaRequiredByDefault: false,
    externalReportingAssessmentRequired: false,
  },
  CLINICAL_SAFETY: {
    label: "Potential or actual clinical safety event",
    acknowledgementTargetMinutes: 15,
    containmentTargetMinutes: 60,
    reviewRequired: true,
    capaRequiredByDefault: true,
    externalReportingAssessmentRequired: true,
  },
} satisfies Record<IncidentSeverity, {
  label: string;
  acknowledgementTargetMinutes: number;
  containmentTargetMinutes: number;
  reviewRequired: boolean;
  capaRequiredByDefault: boolean;
  externalReportingAssessmentRequired: boolean;
}>);

export const incidentStatusTransitions: Readonly<Record<IncidentStatus, readonly IncidentStatus[]>> = Object.freeze({
  OPEN: ["CONTAINED", "INVESTIGATING"],
  CONTAINED: ["INVESTIGATING", "RECOVERED"],
  INVESTIGATING: ["CONTAINED", "RECOVERED"],
  RECOVERED: ["REVIEW"],
  REVIEW: ["CLOSED", "INVESTIGATING"],
  CLOSED: [],
});

export const degradedServiceActions = Object.freeze([
  "Do not assume a booking, enquiry, payment, CRM sync or governance mutation succeeded without an explicit success response.",
  "Disable or suspend the affected capability when continued operation could create incorrect state, unsafe advice, data loss or duplicate transactions.",
  "Preserve immutable logs, request IDs, timestamps and affected record references needed for investigation.",
  "Do not expose internal incident detail, credentials, patient information or speculative root cause on public status surfaces.",
  "Clinical-safety events must be escalated into the approved clinical governance process; this software policy does not determine clinical or statutory reporting obligations.",
]);

export const recoveryCriteria = Object.freeze([
  "The initiating failure is no longer occurring or the affected capability is safely isolated.",
  "Data integrity has been checked for the affected scope.",
  "Queued or retried mutations have been reconciled for duplication and omission risk.",
  "Required monitoring or manual verification is in place for the recovery window.",
  "The incident record contains containment/recovery evidence sufficient for post-incident review.",
]);

export const runbookCatalog = Object.freeze([
  { key: "WEB_UNAVAILABLE", title: "Web application unavailable", defaultSeverity: "P1" as IncidentSeverity },
  { key: "DATABASE_UNAVAILABLE", title: "Commercial/governance database unavailable", defaultSeverity: "P1" as IncidentSeverity },
  { key: "CRM_SYNC_FAILURE", title: "CRM persistence or sync failure", defaultSeverity: "P2" as IncidentSeverity },
  { key: "AUTH_ACCESS_FAILURE", title: "Operator/partner/patient access-control failure", defaultSeverity: "P1" as IncidentSeverity },
  { key: "DUPLICATE_OR_LOST_MUTATION", title: "Duplicate or lost commercial mutation", defaultSeverity: "P2" as IncidentSeverity },
  { key: "PRIVACY_SECURITY_EVENT", title: "Potential privacy/security event", defaultSeverity: "P1" as IncidentSeverity },
  { key: "CLINICAL_SAFETY_EVENT", title: "Potential or actual clinical safety event", defaultSeverity: "CLINICAL_SAFETY" as IncidentSeverity },
  { key: "THIRD_PARTY_DEGRADATION", title: "Third-party dependency degradation", defaultSeverity: "P3" as IncidentSeverity },
]);

export function assertIncidentTransition(input: {
  currentStatus: IncidentStatus;
  requestedStatus: IncidentStatus;
  severity: IncidentSeverity;
  containedAt?: string | null;
  resolvedAt?: string | null;
  rootCause?: string | null;
  externalReportingState?: string | null;
}) {
  if (!incidentStatusTransitions[input.currentStatus].includes(input.requestedStatus)) {
    throw new Error(`Incident transition ${input.currentStatus} -> ${input.requestedStatus} is not permitted.`);
  }
  if (input.requestedStatus === "RECOVERED" && !input.resolvedAt) {
    throw new Error("Recovered incidents require a recovery timestamp.");
  }
  if (input.requestedStatus === "CLOSED") {
    if (!input.rootCause?.trim()) throw new Error("Closed incidents require documented root cause.");
    if ((input.severity === "P1" || input.severity === "P2" || input.severity === "CLINICAL_SAFETY") &&
        (!input.externalReportingState || input.externalReportingState === "NOT_ASSESSED")) {
      throw new Error("High-severity incidents require an external-reporting assessment before closure.");
    }
  }
}
