export const crmLeadLifecycle = [
  "New Enquiry",
  "Contact Attempted",
  "Contacted",
  "Qualified",
  "Consultation Requested",
  "Consultation Scheduled",
  "Consultation Completed",
  "Programme Proposed",
  "Decision Pending",
  "Converted",
  "Not Proceeding",
] as const;

export const crmAdministrativeStatuses = [
  "Duplicate",
  "Spam",
  "Unreachable",
  "Follow Up Later",
  "Do Not Contact",
] as const;

export type CrmLeadStatus =
  | (typeof crmLeadLifecycle)[number]
  | (typeof crmAdministrativeStatuses)[number];

export const crmMinimumFields = {
  identity: [
    "crmLeadId", "name", "email", "mobile", "country", "preferredLocation", "preferredLanguage",
  ],
  attribution: [
    "source", "campaign", "utmSource", "utmMedium", "utmCampaign", "referralCode", "partnerId", "landingPage",
  ],
  interest: [
    "broadInterestCategory", "programmeInterest", "treatmentInformationInterest", "preferredContactChannel", "preferredContactTime",
  ],
  workflow: [
    "leadStatus", "assignedClinicManager", "assignedCommercialOwner", "nextAction", "nextActionDue", "lastContact",
    "consultationStatus", "conversionStatus", "reasonLost",
  ],
  compliance: [
    "contactConsentTimestamp", "contactConsentVersion", "marketingConsent", "sourceConsentEvidence", "doNotContact",
  ],
} as const;

export const crmProhibitedClinicalFields = [
  "diagnosis",
  "medicalHistory",
  "medication",
  "labValues",
  "clinicalImages",
  "doctorNotes",
  "treatmentSuitability",
  "prescription",
  "medicalResults",
] as const;

const prohibitedNormalized = new Set(crmProhibitedClinicalFields.map(normalizeFieldName));

export type CrmAdministrativeLead = {
  crmLeadId?: string;
  name: string;
  email?: string;
  mobile?: string;
  country?: string;
  preferredLocation?: string;
  preferredLanguage?: string;
  source: string;
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referralCode?: string;
  partnerId?: string;
  landingPage?: string;
  broadInterestCategory?: string;
  programmeInterest?: string;
  treatmentInformationInterest?: string;
  preferredContactChannel?: string;
  preferredContactTime?: string;
  leadStatus: CrmLeadStatus;
  assignedClinicManager?: string;
  assignedCommercialOwner?: string;
  nextAction?: string;
  nextActionDue?: string;
  lastContact?: string;
  consultationStatus?: string;
  conversionStatus?: string;
  reasonLost?: string;
  contactConsentTimestamp: string;
  contactConsentVersion: string;
  marketingConsent: boolean;
  sourceConsentEvidence: string;
  doNotContact: boolean;
};

export type CrmActor = {
  actorId: string;
  actorType: "operator" | "system";
};

export type CrmTransitionAudit = {
  eventType: "crm_status_transition";
  leadId: string;
  timestamp: string;
  actor: CrmActor;
  previousState: CrmLeadStatus;
  newState: CrmLeadStatus;
  reason: string | null;
  suggestionSource: "human" | "ai_advisory";
  appliedByHuman: boolean;
};

const allowedForwardTransitions: Readonly<Record<(typeof crmLeadLifecycle)[number], readonly CrmLeadStatus[]>> = {
  "New Enquiry": ["Contact Attempted", ...crmAdministrativeStatuses],
  "Contact Attempted": ["Contacted", "Unreachable", "Follow Up Later", "Do Not Contact", "Not Proceeding"],
  Contacted: ["Qualified", "Follow Up Later", "Do Not Contact", "Not Proceeding"],
  Qualified: ["Consultation Requested", "Follow Up Later", "Do Not Contact", "Not Proceeding"],
  "Consultation Requested": ["Consultation Scheduled", "Follow Up Later", "Do Not Contact", "Not Proceeding"],
  "Consultation Scheduled": ["Consultation Completed", "Follow Up Later", "Not Proceeding"],
  "Consultation Completed": ["Programme Proposed", "Not Proceeding"],
  "Programme Proposed": ["Decision Pending", "Converted", "Not Proceeding"],
  "Decision Pending": ["Converted", "Not Proceeding", "Follow Up Later"],
  Converted: [],
  "Not Proceeding": [],
};

function normalizeFieldName(value: string): string {
  return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

export function prohibitedCrmFields(value: Record<string, unknown>): string[] {
  return Object.keys(value).filter((key) => prohibitedNormalized.has(normalizeFieldName(key)));
}

export function validateCrmAdministrativeLead(value: Record<string, unknown>): string[] {
  const errors = prohibitedCrmFields(value).map((field) => `${field} is not permitted in the commercial CRM.`);
  if (typeof value.name !== "string" || value.name.trim().length < 2) errors.push("A valid name is required.");
  if (!String(value.email || "").trim() && !String(value.mobile || "").trim()) errors.push("At least one contact method is required.");
  if (!crmLeadLifecycle.includes(value.leadStatus as (typeof crmLeadLifecycle)[number]) &&
      !crmAdministrativeStatuses.includes(value.leadStatus as (typeof crmAdministrativeStatuses)[number])) {
    errors.push("The CRM lead status is invalid.");
  }
  if (!value.contactConsentTimestamp || Number.isNaN(Date.parse(String(value.contactConsentTimestamp)))) {
    errors.push("A valid contact consent timestamp is required.");
  }
  if (typeof value.contactConsentVersion !== "string" || !value.contactConsentVersion.trim()) {
    errors.push("A contact consent version is required.");
  }
  if (typeof value.sourceConsentEvidence !== "string" || !value.sourceConsentEvidence.trim()) {
    errors.push("Source consent evidence is required.");
  }
  return errors;
}

export function canTransitionCrmLead(previousState: CrmLeadStatus, newState: CrmLeadStatus): boolean {
  if (previousState === newState) return false;
  if (crmAdministrativeStatuses.includes(previousState as (typeof crmAdministrativeStatuses)[number])) {
    return previousState === "Follow Up Later" && newState === "Contact Attempted";
  }
  return allowedForwardTransitions[previousState as (typeof crmLeadLifecycle)[number]]?.includes(newState) || false;
}

export function createCrmTransitionAudit(input: {
  leadId: string;
  previousState: CrmLeadStatus;
  newState: CrmLeadStatus;
  actor: CrmActor;
  reason?: string;
  suggestionSource?: "human" | "ai_advisory";
  appliedByHuman: boolean;
  timestamp?: string;
}): CrmTransitionAudit {
  if (!canTransitionCrmLead(input.previousState, input.newState)) throw new Error("CRM state transition is not permitted.");
  if (input.suggestionSource === "ai_advisory" && !input.appliedByHuman) {
    throw new Error("AI advice cannot silently mutate authoritative CRM state.");
  }
  const reason = input.reason?.trim() || null;
  if (["Not Proceeding", "Do Not Contact", "Spam", "Duplicate"].includes(input.newState) && !reason) {
    throw new Error("This CRM state transition requires an administrative reason.");
  }
  return {
    eventType: "crm_status_transition",
    leadId: input.leadId,
    timestamp: input.timestamp || new Date().toISOString(),
    actor: input.actor,
    previousState: input.previousState,
    newState: input.newState,
    reason,
    suggestionSource: input.suggestionSource || "human",
    appliedByHuman: input.appliedByHuman,
  };
}

export type PartnerLeadView = Pick<CrmAdministrativeLead, "crmLeadId" | "leadStatus" | "source" | "partnerId" | "referralCode">;

export function partnerLeadView(lead: CrmAdministrativeLead, requestingPartnerId: string): PartnerLeadView | null {
  if (!lead.partnerId || lead.partnerId !== requestingPartnerId) return null;
  return {
    crmLeadId: lead.crmLeadId,
    leadStatus: lead.leadStatus,
    source: lead.source,
    partnerId: lead.partnerId,
    referralCode: lead.referralCode,
  };
}
