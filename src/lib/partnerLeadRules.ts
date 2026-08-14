export type LeadRecord = {
  id: string;
  partnerCode: string;
  fullName: string;
  mobile?: string;
  email?: string;
  createdAt: string;
  status: "Active" | "Transferred" | "Closed";
};

export type DuplicateCheckInput = {
  fullName: string;
  mobile?: string;
  email?: string;
};

export type DuplicateCheckResult = {
  duplicate: boolean;
  matchType: "mobile" | "email" | "name" | "none";
  matchedLeadId?: string;
  message: string;
};

const normalisePhone = (value?: string) => (value ?? "").replace(/\D/g, "");
const normaliseEmail = (value?: string) => (value ?? "").trim().toLowerCase();
const normaliseName = (value?: string) => (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");

export function checkLeadDuplicate(input: DuplicateCheckInput, leads: LeadRecord[]): DuplicateCheckResult {
  const phone = normalisePhone(input.mobile);
  const email = normaliseEmail(input.email);
  const name = normaliseName(input.fullName);

  const activeLeads = leads.filter((lead) => lead.status === "Active");

  if (phone) {
    const match = activeLeads.find((lead) => normalisePhone(lead.mobile) === phone);
    if (match) return { duplicate: true, matchType: "mobile", matchedLeadId: match.id, message: "An active lead already exists with this mobile number." };
  }

  if (email) {
    const match = activeLeads.find((lead) => normaliseEmail(lead.email) === email);
    if (match) return { duplicate: true, matchType: "email", matchedLeadId: match.id, message: "An active lead already exists with this email address." };
  }

  if (name) {
    const match = activeLeads.find((lead) => normaliseName(lead.fullName) === name);
    if (match) return { duplicate: true, matchType: "name", matchedLeadId: match.id, message: "A lead with the same name already exists. Manual review is required before ownership can be granted." };
  }

  return { duplicate: false, matchType: "none", message: "No active duplicate was detected. Lead ownership may proceed subject to partner eligibility." };
}

export function canRegisterLead(partnerCertified: boolean, partnerCodeActive: boolean) {
  if (!partnerCertified) return { allowed: false, reason: "Partner certification is not active." };
  if (!partnerCodeActive) return { allowed: false, reason: "Partner code is not active." };
  return { allowed: true, reason: "Partner is eligible to register commission-bearing leads." };
}
