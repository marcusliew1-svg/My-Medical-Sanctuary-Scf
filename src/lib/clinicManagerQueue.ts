import type { CrmAdministrativeLead } from "@/lib/crmDomain";

export const clinicManagerQueueStates = [
  "New",
  "Awaiting Contact",
  "Follow-Up Due",
  "Consultation Requested",
  "Scheduled",
  "Escalated",
  "Completed",
] as const;

export type ClinicManagerQueueState = (typeof clinicManagerQueueStates)[number];
export type SlaStatus = "On Time" | "Due Soon" | "Overdue";

export type ClinicManagerSlaConfiguration = {
  acknowledgementMinutes: number;
  failureEscalationMinutes: number;
  dueSoonMinutes: number;
  policyStatus: "proposed" | "approved";
};

export type ClinicManagerQueueItem = {
  crmLeadId: string;
  displayName: string;
  contactChannel: string;
  source: string;
  partnerId?: string;
  assignedOwner: string;
  queueState: ClinicManagerQueueState;
  nextAction: string;
  nextActionDue: string;
  enquiryAgeMinutes: number;
  slaStatus: SlaStatus;
  escalated: boolean;
};

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function clinicManagerSlaConfiguration(env: NodeJS.ProcessEnv = process.env): ClinicManagerSlaConfiguration {
  return {
    acknowledgementMinutes: positiveInteger(env.MMS_CRM_ACKNOWLEDGEMENT_SLA_MINUTES, 60),
    failureEscalationMinutes: positiveInteger(env.MMS_CRM_FAILURE_ESCALATION_SLA_MINUTES, 30),
    dueSoonMinutes: positiveInteger(env.MMS_CRM_DUE_SOON_MINUTES, 15),
    policyStatus: env.MMS_CRM_SLA_POLICY_APPROVED === "true" ? "approved" : "proposed",
  };
}

export function calculateSlaStatus(nextActionDue: string, now: string, dueSoonMinutes: number): SlaStatus {
  const dueAt = Date.parse(nextActionDue);
  const nowAt = Date.parse(now);
  if (Number.isNaN(dueAt) || Number.isNaN(nowAt)) throw new Error("SLA calculation requires valid timestamps.");
  const remainingMinutes = (dueAt - nowAt) / 60_000;
  if (remainingMinutes < 0) return "Overdue";
  if (remainingMinutes <= dueSoonMinutes) return "Due Soon";
  return "On Time";
}

export function queueStateForLead(lead: CrmAdministrativeLead, now: string): ClinicManagerQueueState {
  if (lead.leadStatus === "Consultation Requested") return "Consultation Requested";
  if (lead.leadStatus === "Consultation Scheduled") return "Scheduled";
  if (["Converted", "Not Proceeding", "Do Not Contact", "Spam", "Duplicate"].includes(lead.leadStatus)) return "Completed";
  if (lead.nextActionDue && Date.parse(lead.nextActionDue) < Date.parse(now)) return "Follow-Up Due";
  if (lead.leadStatus === "New Enquiry") return "New";
  return "Awaiting Contact";
}

export function buildClinicManagerQueueItem(
  lead: CrmAdministrativeLead,
  input: { createdAt: string; now: string; escalated?: boolean },
  configuration: ClinicManagerSlaConfiguration = clinicManagerSlaConfiguration(),
): ClinicManagerQueueItem {
  if (!lead.crmLeadId) throw new Error("Queue items require a CRM lead ID.");
  const nextActionDue = lead.nextActionDue || new Date(Date.parse(input.createdAt) + configuration.acknowledgementMinutes * 60_000).toISOString();
  return {
    crmLeadId: lead.crmLeadId,
    displayName: lead.name,
    contactChannel: lead.preferredContactChannel || "Not specified",
    source: lead.source,
    partnerId: lead.partnerId,
    assignedOwner: lead.assignedClinicManager || "Clinic Manager queue",
    queueState: input.escalated ? "Escalated" : queueStateForLead({ ...lead, nextActionDue }, input.now),
    nextAction: lead.nextAction || "Acknowledge enquiry",
    nextActionDue,
    enquiryAgeMinutes: Math.max(0, Math.floor((Date.parse(input.now) - Date.parse(input.createdAt)) / 60_000)),
    slaStatus: calculateSlaStatus(nextActionDue, input.now, configuration.dueSoonMinutes),
    escalated: Boolean(input.escalated),
  };
}

export function sortClinicManagerQueue(items: readonly ClinicManagerQueueItem[]): ClinicManagerQueueItem[] {
  const rank: Record<SlaStatus, number> = { Overdue: 0, "Due Soon": 1, "On Time": 2 };
  return [...items].sort((left, right) =>
    rank[left.slaStatus] - rank[right.slaStatus] || Date.parse(left.nextActionDue) - Date.parse(right.nextActionDue),
  );
}
