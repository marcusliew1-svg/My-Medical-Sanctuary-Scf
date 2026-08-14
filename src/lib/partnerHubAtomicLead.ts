import type { LeadRecord, LeadOwnershipEvent, PartnerHubRepository } from "@/lib/partnerHubPersistence";

export type AtomicLeadRegistrationInput = {
  ownerPartnerId: string;
  fullName: string;
  mobile: string;
  email?: string;
  source?: string;
  packageInterest?: string;
};

export type AtomicLeadRegistrationResult =
  | { ok: true; lead: LeadRecord; ownership: LeadOwnershipEvent }
  | { ok: false; reason: "duplicate"; duplicates: LeadRecord[] };

/**
 * Production repositories must implement this operation inside one database transaction.
 * The duplicate check and ownership grant may not be separated into two independent writes.
 */
export interface AtomicLeadRepository extends PartnerHubRepository {
  registerLeadAtomically(input: AtomicLeadRegistrationInput): Promise<AtomicLeadRegistrationResult>;
}
