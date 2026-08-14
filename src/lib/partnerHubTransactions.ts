import type {
  CommissionLedgerEntry,
  LeadOwnershipEvent,
  LeadRecord,
  MembershipApplicationRecord,
  PartnerHubRepository,
} from "@/lib/partnerHubPersistence";

export type AtomicLeadRegistrationInput = {
  partnerId: string;
  fullName: string;
  mobile: string;
  email?: string;
  source?: string;
  packageInterest?: string;
  ownershipReason: string;
};

export type AtomicLeadRegistrationResult =
  | { ok: true; lead: LeadRecord; ownershipEvent: LeadOwnershipEvent }
  | { ok: false; reason: "duplicate"; duplicates: LeadRecord[] };

export interface PartnerHubTransactionalRepository extends PartnerHubRepository {
  registerLeadAtomically(input: AtomicLeadRegistrationInput): Promise<AtomicLeadRegistrationResult>;
  verifyPaymentAtomically(input: {
    applicationId: string;
    paymentReference: string;
    verifiedBy: string;
    verifiedAt: string;
  }): Promise<MembershipApplicationRecord>;
  cancelApplicationAtomically(input: {
    applicationId: string;
    cancelledBy: string;
    cancelledAt: string;
    reason: string;
    commissionAmountMinor: number;
    commissionAlreadyPaid: boolean;
    ruleVersion: string;
  }): Promise<{ application: MembershipApplicationRecord; ledger: CommissionLedgerEntry[] }>;
}

/**
 * These methods are transaction boundaries, not convenience helpers.
 * A production adapter must execute each operation in one database transaction.
 * Never implement duplicate-check and ownership-grant as separate requests.
 */
