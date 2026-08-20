import { normalisePartnerId } from "@/lib/salesPartnerPolicy";
import type { CommercialLead, LeadOwnershipEvent } from "@/lib/partnerCommercialModel";

export const PARTNER_LEAD_CONSENT_VERSION = "MMS-PDPA-MARKETING-2026-08-v1";

export type PartnerLeadContact = {
  fullName: string;
  email?: string;
  phone?: string;
};

export type PartnerLeadDraftInput = {
  partnerId: string;
  contact: PartnerLeadContact;
  source?: string;
  campaign?: string;
  consentAccepted: boolean;
  consentVersion: string;
  consentCapturedAt: string;
  registeredAt: string;
};

export type ValidatedPartnerLeadDraft = {
  partnerId: string;
  contact: PartnerLeadContact;
  source?: string;
  campaign?: string;
  consentVersion: string;
  consentCapturedAt: string;
  registeredAt: string;
};

export type PartnerLeadRegistrationInput = PartnerLeadDraftInput & {
  leadId: string;
};

export type PartnerLeadRegistration = {
  lead: CommercialLead;
  contact: PartnerLeadContact;
  consentVersion: string;
};

export type PartnerLeadDuplicateDecision = {
  status: "Clear" | "Possible Duplicate" | "Confirmed Duplicate";
  matchedLeadIds: string[];
  checkedAt: string;
  checkedBy: string;
};

function requireTimestamp(value: string, field: string): void {
  if (!value || Number.isNaN(Date.parse(value))) throw new Error(`${field} must be a valid timestamp.`);
}

function cleanText(value: string | undefined, max: number): string {
  return String(value || "").trim().slice(0, max);
}

function validateContact(contact: PartnerLeadContact): PartnerLeadContact {
  const fullName = cleanText(contact.fullName, 160);
  const email = cleanText(contact.email, 254).toLowerCase();
  const phone = cleanText(contact.phone, 50);
  if (!fullName) throw new Error("Lead name is required.");
  if (!email && !phone) throw new Error("Lead email or phone is required.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Lead email is invalid.");
  return { fullName, email: email || undefined, phone: phone || undefined };
}

export function validatePartnerLeadDraft(input: PartnerLeadDraftInput): ValidatedPartnerLeadDraft {
  const partnerId = normalisePartnerId(input.partnerId);
  if (!partnerId) throw new Error("An active-format MMS Partner ID is required to register a lead.");
  if (!input.consentAccepted) throw new Error("Marketing / PDPA consent is mandatory before lead registration.");
  if (input.consentVersion !== PARTNER_LEAD_CONSENT_VERSION) {
    throw new Error("Lead consent version does not match the current controlled consent version.");
  }
  requireTimestamp(input.consentCapturedAt, "consentCapturedAt");
  requireTimestamp(input.registeredAt, "registeredAt");
  if (Date.parse(input.consentCapturedAt) > Date.parse(input.registeredAt)) {
    throw new Error("Lead consent cannot be captured after registration.");
  }

  return {
    partnerId,
    contact: validateContact(input.contact),
    source: cleanText(input.source, 120) || undefined,
    campaign: cleanText(input.campaign, 120) || undefined,
    consentVersion: input.consentVersion,
    consentCapturedAt: input.consentCapturedAt,
    registeredAt: input.registeredAt,
  };
}

export function registerPartnerLead(input: PartnerLeadRegistrationInput): PartnerLeadRegistration {
  if (!/^[A-Za-z0-9_-]{6,80}$/.test(input.leadId.trim())) throw new Error("Lead ID is invalid.");
  const draft = validatePartnerLeadDraft(input);

  return {
    lead: {
      leadId: input.leadId.trim(),
      currentPartnerId: draft.partnerId,
      registeredByPartnerId: draft.partnerId,
      registeredAt: draft.registeredAt,
      stage: "Registered",
      source: draft.source,
      campaign: draft.campaign,
      duplicateStatus: "Unchecked",
      consentCapturedAt: draft.consentCapturedAt,
    },
    contact: draft.contact,
    consentVersion: draft.consentVersion,
  };
}

export function applyDuplicateDecision(
  lead: CommercialLead,
  decision: PartnerLeadDuplicateDecision,
): CommercialLead {
  requireTimestamp(decision.checkedAt, "checkedAt");
  if (!decision.checkedBy.trim()) throw new Error("Duplicate-check actor is required.");
  const matchedLeadIds = [...new Set(decision.matchedLeadIds.map((id) => id.trim()).filter(Boolean))];
  if (decision.status === "Clear" && matchedLeadIds.length > 0) {
    throw new Error("A Clear duplicate decision must not retain matched Lead IDs.");
  }
  if (decision.status !== "Clear" && matchedLeadIds.length === 0) {
    throw new Error("A duplicate decision requires at least one matched Lead ID.");
  }

  const duplicateStatus = decision.status === "Clear"
    ? "Clear"
    : decision.status === "Possible Duplicate"
      ? "Possible Duplicate"
      : "Confirmed Duplicate";

  return {
    ...lead,
    duplicateStatus,
    stage: decision.status === "Confirmed Duplicate" ? "Duplicate" : lead.stage,
  };
}

export function assertLeadCanProgress(lead: CommercialLead): void {
  if (!lead.consentCapturedAt) throw new Error("Lead cannot progress without recorded marketing / PDPA consent.");
  if (lead.duplicateStatus === "Unchecked" || lead.duplicateStatus === "Possible Duplicate") {
    throw new Error("Lead cannot progress until duplicate review is cleared.");
  }
  if (lead.duplicateStatus === "Confirmed Duplicate" || lead.stage === "Duplicate") {
    throw new Error("Confirmed duplicate leads cannot progress as a new lead.");
  }
}

export function validateLeadOwnershipEvent(event: LeadOwnershipEvent): void {
  if (!event.eventId.trim() || !event.leadId.trim()) throw new Error("Ownership event and Lead IDs are required.");
  if (!normalisePartnerId(event.newPartnerId)) throw new Error("New ownership Partner ID is invalid.");
  if (event.previousPartnerId && !normalisePartnerId(event.previousPartnerId)) {
    throw new Error("Previous ownership Partner ID is invalid.");
  }
  if (event.previousPartnerId && normalisePartnerId(event.previousPartnerId) === normalisePartnerId(event.newPartnerId)) {
    throw new Error("Ownership transfer must change the Partner owner.");
  }
  if (!event.reason.trim()) throw new Error("Ownership-transfer reason is required.");
  if (!event.approvedBy.trim()) throw new Error("Ownership-transfer approver is required.");
  requireTimestamp(event.occurredAt, "occurredAt");
}

export const PROHIBITED_PARTNER_LEAD_FIELDS = [
  "diagnosis",
  "diagnoses",
  "treatment recommendation",
  "treatment recommendations",
  "test result",
  "test results",
  "medication",
  "medications",
  "imaging",
  "doctor note",
  "doctor notes",
] as const;

function normalizedPayloadKey(key: string): string {
  return key.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

export function assertCommercialLeadPayloadOnly(payload: Record<string, unknown>): void {
  const walk = (value: unknown): void => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      const normalized = normalizedPayloadKey(key);
      const prohibited = PROHIBITED_PARTNER_LEAD_FIELDS.find((field) => normalized === field);
      if (prohibited) throw new Error(`Clinical field '${prohibited}' is prohibited in the Partner Lead Registry.`);
      walk(nested);
    }
  };
  walk(payload);
}
