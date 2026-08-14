export type PartnerStatus = "pending" | "certified" | "suspended";
export type LeadStage = "New" | "Contacted" | "Discovery" | "Application" | "Paid" | "Activated" | "Cancelled";
export type CommissionStatus = "Estimated" | "Pending" | "Qualified" | "Approved" | "Payable" | "Paid" | "Reversed";

export const partnerSummary = {
  name: "Demo Partner",
  code: "MMS-P-0001",
  status: "certified" as PartnerStatus,
  tier: "Associate Partner",
  certification: "Active",
  nextPayout: "15 Sep 2026",
};

export const dashboardMetrics = [
  { label: "Open leads", value: "18", note: "6 need follow-up" },
  { label: "Applications", value: "5", note: "2 awaiting documents" },
  { label: "Activated members", value: "3", note: "Current month" },
  { label: "Estimated commission", value: "RM 4,888", note: "Subject to payment, cooling-off and no cancellation" },
];

export const sampleLeads = [
  { id: "LD-260814-001", name: "Daniel Lim", package: "Ascend", stage: "Discovery" as LeadStage, ownerSince: "14 Aug 2026, 09:42" },
  { id: "LD-260813-014", name: "Mei Chen", package: "Evolve", stage: "Application" as LeadStage, ownerSince: "13 Aug 2026, 16:18" },
  { id: "LD-260812-008", name: "Adrian Tan", package: "Pinnacle", stage: "Paid" as LeadStage, ownerSince: "12 Aug 2026, 11:05" },
];

export const academyModules = [
  { title: "MMS Foundations", status: "Completed", duration: "18 min" },
  { title: "Membership Packages", status: "Completed", duration: "24 min" },
  { title: "Approved Claims & Compliance", status: "Required", duration: "20 min" },
  { title: "Lead Registration SOP", status: "Required", duration: "12 min" },
  { title: "Using Ling for Partners", status: "Coming next", duration: "15 min" },
];

export const commissionRules = {
  cancellationRule: "No commission is earned on a cancelled membership. If commission was already paid, the commission attributable to the cancelled/refunded sale is reversed and recoverable by set-off or repayment.",
  payoutRule: "Commission can move to payable only after verified payment, the applicable cooling-off period, compliance clearance and confirmation that the membership has not been cancelled or refunded.",
  versioningRule: "Every sale stores the exact commission-rule version used when the sale was qualified. Future rule changes do not recalculate historical transactions.",
};

export const sampleCommissions = [
  { reference: "CM-260814-001", member: "Daniel Lim", package: "Ascend", amount: "RM 888.80", status: "Estimated" as CommissionStatus },
  { reference: "CM-260813-004", member: "Mei Chen", package: "Evolve", amount: "RM 2,888.80", status: "Pending" as CommissionStatus },
  { reference: "CM-260812-002", member: "Adrian Tan", package: "Pinnacle", amount: "RM 12,888.80", status: "Qualified" as CommissionStatus },
];
