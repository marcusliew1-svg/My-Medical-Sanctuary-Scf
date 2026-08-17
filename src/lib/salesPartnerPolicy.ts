export const PARTNER_STAGES = [
  "Applicant",
  "Under Review",
  "Approved",
  "Agreement Pending",
  "Training",
  "Active",
  "Suspended",
  "Inactive",
  "Rejected",
] as const;

export type PartnerStage = (typeof PARTNER_STAGES)[number];

export const PARTNER_LEVELS = ["Associate", "Senior", "Elite", "Chairman"] as const;
export type PartnerLevel = (typeof PARTNER_LEVELS)[number];

export const DRAFT_COMMISSION_POLICY = {
  baseRate: 0.10,
  upgradedBaseRate: 0.15,
  personalTargetRate: 0.18,
  groupTargetRate: 0.23,
  eligibleRenewalResidualRate: 0.02,
} as const;

export type ActivationChecklist = {
  approved: boolean;
  agreementCompleted: boolean;
  coreTrainingCompleted: boolean;
  complianceAcknowledged: boolean;
};

export type ActivationCheck = {
  canActivate: boolean;
  missing: Array<keyof ActivationChecklist>;
};

export function checkPartnerActivation(checklist: ActivationChecklist): ActivationCheck {
  const missing = (Object.entries(checklist) as Array<[keyof ActivationChecklist, boolean]>)
    .filter(([, complete]) => !complete)
    .map(([key]) => key);

  return { canActivate: missing.length === 0, missing };
}

export function partnerLevelForVerifiedMonthlyMemberships(count: number): PartnerLevel {
  const verifiedCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  if (verifiedCount >= 16) return "Elite";
  if (verifiedCount >= 6) return "Senior";
  return "Associate";
}

export function formatPartnerId(sequence: number): string {
  if (!Number.isInteger(sequence) || sequence < 1001) {
    throw new Error("Partner sequence must be an integer of 1001 or greater.");
  }
  return `MMSP-${sequence}`;
}

export function normalisePartnerId(value: string | null | undefined): string {
  const candidate = String(value || "").trim().toUpperCase();
  return /^MMSP-\d{4,}$/.test(candidate) ? candidate : "";
}

export function calculateCommissionMinorUnits(clearedAmountMinorUnits: number, commissionRate: number): number {
  if (!Number.isInteger(clearedAmountMinorUnits) || clearedAmountMinorUnits < 0) {
    throw new Error("Cleared amount must be a non-negative integer in minor currency units.");
  }
  if (!Number.isFinite(commissionRate) || commissionRate < 0 || commissionRate > 1) {
    throw new Error("Commission rate must be between 0 and 1.");
  }
  return Math.round(clearedAmountMinorUnits * commissionRate);
}

export type CommissionLedgerRow = {
  partnerId: string;
  memberReference: string;
  membershipCode: "ASCEND" | "EVOLVE" | "ETERNA" | "PINNACLE";
  transactionReference: string;
  clearedAmountMinorUnits: number;
  commissionRate: number;
  grossCommissionMinorUnits: number;
  adjustmentMinorUnits: number;
  approvedCommissionMinorUnits: number;
  payoutStatus: "Pending" | "Approved" | "Held" | "Paid" | "Reversed";
  payoutCycle?: string;
  paidAt?: string;
  notes?: string;
};

// Important: this file defines calculation and lifecycle rules only. Partner IDs must be
// allocated by a transactional system of record to avoid duplicates, and payout timing
// remains governed by the final approved MMS commission policy.