import { normalisePartnerId, type PartnerLevel } from "@/lib/salesPartnerPolicy";
import type { CommissionTransaction, CommissionTransactionStatus } from "@/lib/partnerCommissionLedger";
import type { CommercialLead, CommercialMembership } from "@/lib/partnerCommercialModel";

export type PartnerHubCertificationSummary = {
  status: "Not Issued" | "Current" | "Renewal Due" | "Expired";
  issuedAt?: string;
  expiresAt?: string;
  renewalDueAt?: string;
};

export type PartnerHubPartnerSummary = {
  partnerId: string;
  stage: "Active" | "Suspended" | "Inactive";
  level?: PartnerLevel;
  referralUrl?: string;
  certification: PartnerHubCertificationSummary;
};

export type PartnerHubLeadSummary = {
  totalOwned: number;
  registered: number;
  contacted: number;
  qualified: number;
  application: number;
  paymentPending: number;
  paymentVerified: number;
  activated: number;
  closed: number;
};

export type PartnerHubMembershipSummary = {
  active: number;
  cancelled: number;
  expired: number;
};

export type PartnerHubCommissionSummary = {
  currency: string;
  pendingMinorUnits: number;
  eligibleMinorUnits: number;
  heldMinorUnits: number;
  approvedMinorUnits: number;
  paidMinorUnits: number;
  reversedMinorUnits: number;
  clawbackMinorUnits: number;
};

export type PartnerHubDashboard = {
  partner: PartnerHubPartnerSummary;
  leads: PartnerHubLeadSummary;
  memberships: PartnerHubMembershipSummary;
  commissions: PartnerHubCommissionSummary[];
  generatedAt: string;
};

function requirePartnerId(value: string): string {
  const partnerId = normalisePartnerId(value);
  if (!partnerId) throw new Error("A valid MMS Partner ID is required for Partner Hub data.");
  return partnerId;
}

function certificationSummary(input: {
  issuedAt?: string;
  expiresAt?: string;
  renewalDueAt?: string;
  now: string;
}): PartnerHubCertificationSummary {
  if (!input.issuedAt || !input.expiresAt) return { status: "Not Issued" };
  const now = Date.parse(input.now);
  const expires = Date.parse(input.expiresAt);
  const renewal = input.renewalDueAt ? Date.parse(input.renewalDueAt) : Number.NaN;
  if (!Number.isFinite(now) || !Number.isFinite(expires)) throw new Error("Certification timestamps are invalid.");
  if (expires <= now) return { status: "Expired", issuedAt: input.issuedAt, expiresAt: input.expiresAt, renewalDueAt: input.renewalDueAt };
  if (Number.isFinite(renewal) && renewal <= now) {
    return { status: "Renewal Due", issuedAt: input.issuedAt, expiresAt: input.expiresAt, renewalDueAt: input.renewalDueAt };
  }
  return { status: "Current", issuedAt: input.issuedAt, expiresAt: input.expiresAt, renewalDueAt: input.renewalDueAt };
}

export function summarisePartnerHubLeads(partnerIdValue: string, leads: CommercialLead[]): PartnerHubLeadSummary {
  const partnerId = requirePartnerId(partnerIdValue);
  const owned = leads.filter((lead) => normalisePartnerId(lead.currentPartnerId) === partnerId);
  const count = (stage: CommercialLead["stage"]) => owned.filter((lead) => lead.stage === stage).length;
  return {
    totalOwned: owned.length,
    registered: count("Registered") + count("Accepted"),
    contacted: count("Contacted"),
    qualified: count("Qualified"),
    application: count("Application"),
    paymentPending: count("Payment Pending"),
    paymentVerified: count("Payment Verified"),
    activated: count("Activated"),
    closed: count("Closed"),
  };
}

export function summarisePartnerHubMemberships(memberships: CommercialMembership[]): PartnerHubMembershipSummary {
  return {
    active: memberships.filter((membership) => membership.status === "Active").length,
    cancelled: memberships.filter((membership) => membership.status === "Cancelled").length,
    expired: memberships.filter((membership) => membership.status === "Expired").length,
  };
}

function amountForStatus(transaction: CommissionTransaction, status: CommissionTransactionStatus): number {
  if (transaction.status !== status) return 0;
  if (status === "Pending Eligibility") return Math.max(0, transaction.grossCommissionMinorUnits);
  if (status === "Eligible" || status === "Held") return Math.max(0, transaction.grossCommissionMinorUnits + transaction.adjustmentMinorUnits);
  if (status === "Approved" || status === "Paid") return Math.max(0, transaction.approvedCommissionMinorUnits);
  if (status === "Reversed") {
    return Math.max(
      0,
      transaction.approvedCommissionMinorUnits > 0
        ? transaction.approvedCommissionMinorUnits
        : transaction.grossCommissionMinorUnits + transaction.adjustmentMinorUnits,
    );
  }
  return 0;
}

export function summarisePartnerHubCommissions(
  partnerIdValue: string,
  transactions: CommissionTransaction[],
): PartnerHubCommissionSummary[] {
  const partnerId = requirePartnerId(partnerIdValue);
  const owned = transactions.filter((transaction) => normalisePartnerId(transaction.partnerId) === partnerId);
  const byCurrency = new Map<string, PartnerHubCommissionSummary>();

  for (const transaction of owned) {
    const currency = transaction.currency.trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Commission transaction currency is invalid.");
    const summary = byCurrency.get(currency) || {
      currency,
      pendingMinorUnits: 0,
      eligibleMinorUnits: 0,
      heldMinorUnits: 0,
      approvedMinorUnits: 0,
      paidMinorUnits: 0,
      reversedMinorUnits: 0,
      clawbackMinorUnits: 0,
    };
    summary.pendingMinorUnits += amountForStatus(transaction, "Pending Eligibility");
    summary.eligibleMinorUnits += amountForStatus(transaction, "Eligible");
    summary.heldMinorUnits += amountForStatus(transaction, "Held");
    summary.approvedMinorUnits += amountForStatus(transaction, "Approved");
    summary.paidMinorUnits += amountForStatus(transaction, "Paid");
    summary.reversedMinorUnits += amountForStatus(transaction, "Reversed");
    summary.clawbackMinorUnits += Math.max(0, transaction.clawbackMinorUnits || 0);
    byCurrency.set(currency, summary);
  }

  return [...byCurrency.values()].sort((left, right) => left.currency.localeCompare(right.currency));
}

export function buildPartnerHubDashboard(input: {
  partnerId: string;
  stage: PartnerHubPartnerSummary["stage"];
  level?: PartnerLevel;
  referralUrl?: string;
  certificationIssuedAt?: string;
  certificationExpiresAt?: string;
  certificationRenewalDueAt?: string;
  leads: CommercialLead[];
  memberships: CommercialMembership[];
  commissions: CommissionTransaction[];
  generatedAt: string;
}): PartnerHubDashboard {
  const partnerId = requirePartnerId(input.partnerId);
  if (Number.isNaN(Date.parse(input.generatedAt))) throw new Error("Partner Hub generatedAt must be a valid timestamp.");
  return {
    partner: {
      partnerId,
      stage: input.stage,
      level: input.level,
      referralUrl: input.stage === "Active" ? input.referralUrl : undefined,
      certification: certificationSummary({
        issuedAt: input.certificationIssuedAt,
        expiresAt: input.certificationExpiresAt,
        renewalDueAt: input.certificationRenewalDueAt,
        now: input.generatedAt,
      }),
    },
    leads: summarisePartnerHubLeads(partnerId, input.leads),
    memberships: summarisePartnerHubMemberships(input.memberships),
    commissions: summarisePartnerHubCommissions(partnerId, input.commissions),
    generatedAt: input.generatedAt,
  };
}

// Partner Hub data is commercial only. Do not add diagnosis, test-result, medication,
// imaging, doctor-note, treatment recommendation or other clinical fields here.
