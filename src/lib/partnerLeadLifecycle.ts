import type { CommercialLead, LeadStage } from "@/lib/partnerCommercialModel";
import { assertLeadCanProgress } from "@/lib/partnerLeadRegistry";

export const PARTNER_LEAD_STAGE_TRANSITIONS: Readonly<Record<LeadStage, readonly LeadStage[]>> = {
  Registered: ["Accepted", "Duplicate", "Rejected", "Withdrawn"],
  Accepted: ["Contacted", "Lost", "Withdrawn", "Duplicate"],
  Contacted: ["Qualified", "Lost", "Withdrawn", "Duplicate"],
  Qualified: ["Application", "Lost", "Withdrawn", "Duplicate"],
  Application: ["Payment Pending", "Lost", "Withdrawn", "Rejected"],
  "Payment Pending": ["Payment Verified", "Lost", "Withdrawn"],
  "Payment Verified": ["Activated", "Lost"],
  Activated: ["Closed"],
  Closed: [],
  Lost: [],
  Withdrawn: [],
  Duplicate: [],
  Rejected: [],
};

export type PartnerLeadStageTransition = {
  allowed: boolean;
  reason?: string;
};

export function checkPartnerLeadStageTransition(
  lead: CommercialLead,
  nextStage: LeadStage,
): PartnerLeadStageTransition {
  if (lead.stage === nextStage) return { allowed: true };
  if (!PARTNER_LEAD_STAGE_TRANSITIONS[lead.stage].includes(nextStage)) {
    return { allowed: false, reason: `Lead transition from ${lead.stage} to ${nextStage} is not permitted.` };
  }

  if (!["Duplicate", "Rejected", "Withdrawn", "Lost"].includes(nextStage)) {
    try {
      assertLeadCanProgress(lead);
    } catch (error) {
      return {
        allowed: false,
        reason: error instanceof Error ? error.message : "Lead progression requirements are incomplete.",
      };
    }
  }

  return { allowed: true };
}

export function assertPartnerLeadStageTransition(lead: CommercialLead, nextStage: LeadStage): void {
  const result = checkPartnerLeadStageTransition(lead, nextStage);
  if (!result.allowed) throw new Error(result.reason || "Lead transition is not permitted.");
}

export function transitionPartnerLead(
  lead: CommercialLead,
  nextStage: LeadStage,
  occurredAt: string,
): CommercialLead {
  assertPartnerLeadStageTransition(lead, nextStage);
  if (!occurredAt || Number.isNaN(Date.parse(occurredAt))) {
    throw new Error("Lead transition timestamp must be valid.");
  }
  return { ...lead, stage: nextStage, lastActivityAt: occurredAt };
}
