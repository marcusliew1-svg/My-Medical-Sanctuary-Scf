import type { CrmAdministrativeLead } from "@/lib/crmDomain";

export const aiOperationsSystemPolicy = `You are the MMS AI Operations Assistant.
You assist authorised staff with commercial and administrative work only.
You must not diagnose, prescribe, determine treatment suitability, interpret medical results or history, answer clinical emergencies, or represent yourself as a clinician.
Your output is advisory. It must never execute an action or overwrite authoritative CRM state. A human operator must review and approve every suggested action or message.
Use only the minimum contact and workflow data necessary. Do not reproduce sensitive free text.`;

export type AiOperationsOutput = {
  kind: "summary" | "follow_up_draft" | "next_action" | "refusal";
  text: string;
  advisory: true;
  requiresHumanApproval: true;
  generatedBy: "mms_ai_operations";
  safetyCategory: "administrative" | "clinical_refusal" | "emergency_refusal";
  createdAt: string;
};

const emergencyPatterns = [
  /\b(emergency|urgent clinical|chest pain|cannot breathe|unconscious|suicid|overdose|stroke)\b/i,
];

const clinicalDecisionPatterns = [
  /\b(diagnos|prescri|dose|medication|lab result|blood result|medical history|doctor note)\b/i,
  /\b(suitable|eligib(?:le|ility)|recommend).{0,40}\b(treatment|therapy|programme|medicine|drug)\b/i,
  /\bwhich (treatment|medicine|drug|therapy)\b/i,
];

export function aiOperationsSafetyCategory(text: string): "administrative" | "clinical_refusal" | "emergency_refusal" {
  if (emergencyPatterns.some((pattern) => pattern.test(text))) return "emergency_refusal";
  if (clinicalDecisionPatterns.some((pattern) => pattern.test(text))) return "clinical_refusal";
  return "administrative";
}

function output(
  kind: AiOperationsOutput["kind"],
  text: string,
  safetyCategory: AiOperationsOutput["safetyCategory"] = "administrative",
  now = new Date().toISOString(),
): AiOperationsOutput {
  return {
    kind,
    text,
    advisory: true,
    requiresHumanApproval: true,
    generatedBy: "mms_ai_operations",
    safetyCategory,
    createdAt: now,
  };
}

export function refuseUnsafeAiOperationsRequest(request: string, now?: string): AiOperationsOutput | null {
  const category = aiOperationsSafetyCategory(request);
  if (category === "administrative") return null;
  if (category === "emergency_refusal") {
    return output(
      "refusal",
      "I cannot assess or manage an urgent clinical issue. Do not use the website support workflow; follow the approved clinical or emergency pathway now.",
      category,
      now,
    );
  }
  return output(
    "refusal",
    "I can help with administrative follow-up only. A qualified clinician must handle diagnosis, treatment advice, medical-result interpretation and suitability decisions.",
    category,
    now,
  );
}

function missingContactDetails(lead: CrmAdministrativeLead): string[] {
  const missing: string[] = [];
  if (!lead.email) missing.push("email");
  if (!lead.mobile) missing.push("mobile");
  if (!lead.preferredContactChannel) missing.push("preferred contact channel");
  if (!lead.preferredContactTime) missing.push("preferred contact time");
  return missing;
}

export function summarizeAdministrativeEnquiry(lead: CrmAdministrativeLead, now?: string): AiOperationsOutput {
  const missing = missingContactDetails(lead);
  const attribution = lead.partnerId ? `Partner referral ${lead.partnerId}` : lead.source;
  const interest = lead.programmeInterest || lead.broadInterestCategory || lead.treatmentInformationInterest || "not specified";
  return output(
    "summary",
    `Administrative enquiry at ${lead.leadStatus}. Source: ${attribution}. Broad interest: ${interest}. Preferred channel: ${lead.preferredContactChannel || "not specified"}. Missing contact details: ${missing.length ? missing.join(", ") : "none"}.`,
    "administrative",
    now,
  );
}

export function draftAdministrativeFollowUp(lead: CrmAdministrativeLead, now?: string): AiOperationsOutput {
  const unsafe = refuseUnsafeAiOperationsRequest(lead.nextAction || "", now);
  if (unsafe) return unsafe;
  const safeInterest = lead.programmeInterest || lead.broadInterestCategory || "your enquiry";
  return output(
    "follow_up_draft",
    `Hello ${lead.name}, thank you for contacting My Medical Sanctuary about ${safeInterest}. A Clinic Manager can help with administrative information and next steps. Please let us know your preferred time and contact channel. This message does not provide medical advice or confirm service availability.`,
    "administrative",
    now,
  );
}

export function suggestAdministrativeNextAction(lead: CrmAdministrativeLead, now?: string): AiOperationsOutput {
  let suggestion = "Review the enquiry and confirm the next administrative action.";
  if (lead.doNotContact || lead.leadStatus === "Do Not Contact") suggestion = "Do not contact. Verify that suppression is recorded in the approved system.";
  else if (!lead.email && !lead.mobile) suggestion = "Escalate for missing contact details; do not attempt CRM outreach.";
  else if (lead.leadStatus === "New Enquiry") suggestion = "Acknowledge the enquiry using the approved channel and assign a Clinic Manager.";
  else if (lead.nextActionDue && Date.parse(lead.nextActionDue) < Date.parse(now || new Date().toISOString())) suggestion = "Review the overdue follow-up and escalate under the approved SLA process.";
  return output("next_action", suggestion, "administrative", now);
}
