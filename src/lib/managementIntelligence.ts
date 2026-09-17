import type { CrmAdministrativeLead } from "@/lib/crmDomain";

export type OperationalFailureCounts = {
  crmFailures: number;
  bookingFailures: number;
  emailFailures: number;
};

export type ManagementPipelineSnapshot = OperationalFailureCounts & {
  generatedAt: string;
  enquiriesToday: number;
  enquiriesWeek: number;
  enquiriesMonth: number;
  bySource: Record<string, number>;
  byChannel: Record<string, number>;
  partnerReferrals: number;
  averageResponseMinutes: number | null;
  overdueEnquiries: number;
  consultationRequests: number;
  scheduledConsultations: number;
  conversions: number;
  conversionRate: number;
  byProgrammeInterest: Record<string, number>;
  byLostReason: Record<string, number>;
};

export type ManagementLeadObservation = {
  lead: CrmAdministrativeLead;
  createdAt: string;
  firstResponseAt?: string;
};

export type ManagementBrief = {
  kind: "management_brief";
  generatedAt: string;
  advisory: true;
  requiresHumanReview: true;
  whatChanged: string;
  requiresAttention: string[];
  sourcePerformance: string[];
  operationalFailures: string[];
  suggestedAdministrativePriorities: string[];
};

function increment(target: Record<string, number>, key: string | undefined): void {
  const normalized = key?.trim() || "Not specified";
  target[normalized] = (target[normalized] || 0) + 1;
}

export function buildManagementPipelineSnapshot(input: {
  observations: readonly ManagementLeadObservation[];
  failures?: Partial<OperationalFailureCounts>;
  now?: string;
}): ManagementPipelineSnapshot {
  const now = Date.parse(input.now || new Date().toISOString());
  const startDay = new Date(now); startDay.setUTCHours(0, 0, 0, 0);
  const startWeek = now - 7 * 24 * 60 * 60 * 1000;
  const startMonth = now - 30 * 24 * 60 * 60 * 1000;
  const bySource: Record<string, number> = {};
  const byChannel: Record<string, number> = {};
  const byProgrammeInterest: Record<string, number> = {};
  const byLostReason: Record<string, number> = {};
  const responseMinutes: number[] = [];
  let enquiriesToday = 0;
  let enquiriesWeek = 0;
  let enquiriesMonth = 0;
  let partnerReferrals = 0;
  let overdueEnquiries = 0;
  let consultationRequests = 0;
  let scheduledConsultations = 0;
  let conversions = 0;

  for (const { lead, createdAt, firstResponseAt } of input.observations) {
    const created = Date.parse(createdAt);
    if (created >= startDay.getTime()) enquiriesToday += 1;
    if (created >= startWeek) enquiriesWeek += 1;
    if (created >= startMonth) enquiriesMonth += 1;
    increment(bySource, lead.source);
    increment(byChannel, lead.preferredContactChannel);
    increment(byProgrammeInterest, lead.programmeInterest || lead.broadInterestCategory);
    if (lead.reasonLost) increment(byLostReason, lead.reasonLost);
    if (lead.partnerId) partnerReferrals += 1;
    if (lead.nextActionDue && Date.parse(lead.nextActionDue) < now && !["Converted", "Not Proceeding", "Do Not Contact"].includes(lead.leadStatus)) overdueEnquiries += 1;
    if (["Consultation Requested", "Consultation Scheduled", "Consultation Completed", "Programme Proposed", "Decision Pending", "Converted"].includes(lead.leadStatus)) consultationRequests += 1;
    if (["Consultation Scheduled", "Consultation Completed", "Programme Proposed", "Decision Pending", "Converted"].includes(lead.leadStatus)) scheduledConsultations += 1;
    if (lead.leadStatus === "Converted") conversions += 1;
    if (firstResponseAt) {
      const duration = (Date.parse(firstResponseAt) - created) / 60_000;
      if (Number.isFinite(duration) && duration >= 0) responseMinutes.push(duration);
    }
  }

  const total = input.observations.length;
  return {
    generatedAt: new Date(now).toISOString(),
    enquiriesToday,
    enquiriesWeek,
    enquiriesMonth,
    bySource,
    byChannel,
    partnerReferrals,
    averageResponseMinutes: responseMinutes.length ? Math.round(responseMinutes.reduce((sum, value) => sum + value, 0) / responseMinutes.length) : null,
    overdueEnquiries,
    consultationRequests,
    scheduledConsultations,
    conversions,
    conversionRate: total ? Number(((conversions / total) * 100).toFixed(1)) : 0,
    byProgrammeInterest,
    byLostReason,
    crmFailures: input.failures?.crmFailures || 0,
    bookingFailures: input.failures?.bookingFailures || 0,
    emailFailures: input.failures?.emailFailures || 0,
  };
}

export function generateManagementBrief(snapshot: ManagementPipelineSnapshot): ManagementBrief {
  const failures = [
    snapshot.crmFailures ? `${snapshot.crmFailures} CRM failure(s)` : "",
    snapshot.bookingFailures ? `${snapshot.bookingFailures} booking failure(s)` : "",
    snapshot.emailFailures ? `${snapshot.emailFailures} email failure(s)` : "",
  ].filter(Boolean);
  const sources = Object.entries(snapshot.bySource)
    .sort((left, right) => right[1] - left[1])
    .map(([source, count]) => `${source}: ${count} enquiry/enquiries`);
  const attention: string[] = [];
  if (snapshot.overdueEnquiries) attention.push(`${snapshot.overdueEnquiries} overdue administrative follow-up(s).`);
  if (failures.length) attention.push("Operational failures require owner review.");
  if (!attention.length) attention.push("No overdue follow-ups or recorded operational failures in this snapshot.");
  return {
    kind: "management_brief",
    generatedAt: snapshot.generatedAt,
    advisory: true,
    requiresHumanReview: true,
    whatChanged: `${snapshot.enquiriesToday} enquiry/enquiries today; ${snapshot.enquiriesWeek} in the last 7 days; ${snapshot.conversions} conversion(s).`,
    requiresAttention: attention,
    sourcePerformance: sources,
    operationalFailures: failures.length ? failures : ["No recorded CRM, booking or email failures."],
    suggestedAdministrativePriorities: [
      "Review overdue follow-ups in SLA order.",
      "Assign unowned enquiries to the Clinic Manager queue.",
      "Review and resolve operational failures; do not infer clinical priorities.",
    ],
  };
}
