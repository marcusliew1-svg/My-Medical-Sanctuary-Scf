export type PartnerRecord = {
  id: string;
  partnerCode: string | null;
  name: string;
  status: "pending" | "certified" | "suspended";
  certificationStatus: "not_started" | "in_progress" | "passed" | "expired";
  tier: string;
  createdAt: string;
  updatedAt: string;
};

export type LeadRecord = {
  id: string;
  ownerPartnerId: string;
  fullName: string;
  mobile: string;
  email?: string;
  source?: string;
  packageInterest?: string;
  stage: "New" | "Contacted" | "Discovery" | "Application" | "Paid" | "Activated" | "Cancelled";
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LeadOwnershipEvent = {
  id: string;
  leadId: string;
  fromPartnerId?: string;
  toPartnerId: string;
  event: "granted" | "transferred" | "released";
  reason: string;
  approvedBy?: string;
  createdAt: string;
};

export type MembershipApplicationRecord = {
  id: string;
  leadId: string;
  partnerId: string;
  packageName: string;
  status:
    | "Draft"
    | "Submitted"
    | "Payment pending"
    | "Payment verified"
    | "Cooling-off"
    | "Activated"
    | "Cancelled"
    | "Refunded";
  paymentReference?: string;
  paymentVerifiedAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type CommissionLedgerEntry = {
  id: string;
  applicationId: string;
  partnerId: string;
  ruleVersion: string;
  kind: "accrual" | "approval" | "payout" | "reversal" | "recovery";
  amountMinor: number;
  currency: "MYR";
  note: string;
  createdAt: string;
};

export interface PartnerHubRepository {
  getPartnerById(id: string): Promise<PartnerRecord | null>;
  findActiveLeadDuplicates(input: { fullName: string; mobile: string; email?: string }): Promise<LeadRecord[]>;
  createLead(input: Omit<LeadRecord, "id" | "createdAt" | "updatedAt">): Promise<LeadRecord>;
  appendOwnershipEvent(input: Omit<LeadOwnershipEvent, "id" | "createdAt">): Promise<LeadOwnershipEvent>;
  createApplication(input: Omit<MembershipApplicationRecord, "id" | "createdAt" | "updatedAt">): Promise<MembershipApplicationRecord>;
  getApplicationById(id: string): Promise<MembershipApplicationRecord | null>;
  updateApplicationStatus(id: string, status: MembershipApplicationRecord["status"]): Promise<MembershipApplicationRecord>;
  appendCommissionLedger(input: Omit<CommissionLedgerEntry, "id" | "createdAt">): Promise<CommissionLedgerEntry>;
  getCommissionLedger(applicationId: string): Promise<CommissionLedgerEntry[]>;
}

/**
 * Production adapters should implement this interface against the MMS source of truth.
 * Do not place Zoho secrets or database credentials in client code.
 * Ledger entries must be append-only; do not expose update/delete methods for commission history.
 */
