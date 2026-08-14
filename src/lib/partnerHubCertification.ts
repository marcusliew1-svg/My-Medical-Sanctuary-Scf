import type { PartnerRecord } from "@/lib/partnerHubPersistence";

export type CertificationDecision = {
  eligible: boolean;
  reason: string;
};

export function evaluatePartnerCertification(partner: PartnerRecord | null): CertificationDecision {
  if (!partner) return { eligible: false, reason: "Partner record not found." };
  if (partner.status === "suspended") return { eligible: false, reason: "Partner is suspended." };
  if (partner.status !== "certified") return { eligible: false, reason: "Partner has not reached certified status." };
  if (partner.certificationStatus !== "passed") return { eligible: false, reason: "Partner certification is not valid." };
  if (!partner.partnerCode) return { eligible: false, reason: "An active Partner Code is required." };
  return { eligible: true, reason: "Partner is certified and commercially active." };
}
