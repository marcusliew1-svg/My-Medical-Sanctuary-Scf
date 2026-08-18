import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

const PARTNER_ID_EVENT_START = "[MMS_PARTNER_ID_ISSUANCE_EVENT]";
const PARTNER_ID_EVENT_END = "[/MMS_PARTNER_ID_ISSUANCE_EVENT]";

export type PartnerIdIssuanceEvent = {
  partnerId: string;
  applicantRecordId: string;
  allocationReference: string;
  allocatorBackend: string;
  actor: string;
  issuedAt: string;
};

function validTimestamp(value: string): boolean {
  return Boolean(value) && !Number.isNaN(Date.parse(value));
}

export function buildPartnerIdIssuanceDescription(
  existingDescription: string,
  event: PartnerIdIssuanceEvent,
): string {
  const partnerId = normalisePartnerId(event.partnerId);
  if (!partnerId) throw new Error("A valid permanent MMS Partner ID is required.");
  if (!/^\d+$/.test(event.applicantRecordId)) throw new Error("A valid applicant CRM record ID is required.");
  if (!event.allocationReference.trim()) throw new Error("Partner ID allocation reference is required.");
  if (!event.allocatorBackend.trim()) throw new Error("Partner ID allocator backend is required.");
  if (!event.actor.trim()) throw new Error("Partner ID issuance actor is required.");
  if (!validTimestamp(event.issuedAt)) throw new Error("Partner ID issuance timestamp is required.");

  const block = [
    PARTNER_ID_EVENT_START,
    `Partner ID: ${partnerId}`,
    `Applicant Record ID: ${event.applicantRecordId}`,
    `Allocation Reference: ${event.allocationReference.trim()}`,
    `Allocator Backend: ${event.allocatorBackend.trim()}`,
    `Actor: ${event.actor.trim()}`,
    `Timestamp: ${event.issuedAt}`,
    PARTNER_ID_EVENT_END,
  ].join("\n");

  const description = [existingDescription.trim(), block].filter(Boolean).join("\n\n");
  if (description.length > 32_000) {
    throw new Error("Partner ID issuance audit history is too large for CRM Description storage.");
  }
  return description;
}
