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

export const SALES_PARTNER_AGREEMENT_VERSION = "MMS-SPA-2026-08-v1";
export const SALES_PARTNER_CORE_TRAINING_VERSION = "MMS-SP-TRAINING-2026-08-v1";

/**
 * Commercial rates are intentionally not hard-coded here.
 * Finance must publish an approved, effective-dated rule set and each sale must retain
 * the exact rule version used to determine eligibility and commission.
 */
export const DRAFT_COMMISSION_POLICY = {
  ruleVersionRequired: true,
  payoutCadence: "weekly batch",
  ordinaryMaximumDaysAfterClearedPayment: 14,
  cancellationTreatment: "zero commission; 100% clawback where commission has already been paid",
  payoutRule:
    "Eligible commission becomes payable only after customer funds have cleared and cancellation, refund, chargeback, compliance and attribution checks are satisfied. Approved commission is processed in the next MMS weekly payout batch, ordinarily within 14 calendar days after cleared payment.",
} as const;

export type CommissionRule = {
  version: string;
  effectiveFrom: string;
  effectiveTo?: string;
  ratesByLevel: Partial<Record<PartnerLevel, number>>;
  eligibleRenewalResidualRate?: number;
  notes?: string;
};

export function validateCommissionRule(rule: CommissionRule): void {
  if (!rule.version.trim()) throw new Error("Commission rule version is required.");
  if (!rule.effectiveFrom.trim()) throw new Error("Commission rule effective date is required.");

  for (const [level, rate] of Object.entries(rule.ratesByLevel)) {
    if (!Number.isFinite(rate) || Number(rate) < 0 || Number(rate) > 1) {
      throw new Error(`Commission rate for ${level} must be between 0 and 1.`);
    }
  }

  if (
    rule.eligibleRenewalResidualRate !== undefined &&
    (!Number.isFinite(rule.eligibleRenewalResidualRate) ||
      rule.eligibleRenewalResidualRate < 0 ||
      rule.eligibleRenewalResidualRate > 1)
  ) {
    throw new Error("Renewal residual rate must be between 0 and 1.");
  }
}

export type ActivationChecklist = {
  approved: boolean;
  kycDueDiligenceCompleted: boolean;
  agreementCompleted: boolean;
  coreTrainingCompleted: boolean;
  quizPassed: boolean;
  certificationIssued: boolean;
  partnerCodeIssued: boolean;
  crmAccessEnabled: boolean;
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

export function referralUrlForPartner(siteUrl: string, partnerId: string): string {
  const normalised = normalisePartnerId(partnerId);
  if (!normalised) throw new Error("A valid MMS Partner ID is required.");
  const url = new URL(siteUrl);
  url.searchParams.set("ref", normalised);
  return url.toString();
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
  commissionRuleVersion: string;
  commissionRate: number;
  grossCommissionMinorUnits: number;
  adjustmentMinorUnits: number;
  approvedCommissionMinorUnits: number;
  payoutStatus: "Pending" | "Approved" | "Held" | "Paid" | "Reversed";
  cancelledAt?: string;
  clawbackMinorUnits?: number;
  eligibilityCheckedAt?: string;
  approvedAt?: string;
  payoutCycle?: string;
  paidAt?: string;
  notes?: string;
};

export type CancellationAdjustment = {
  approvedCommissionMinorUnits: 0;
  payoutStatus: "Reversed";
  clawbackMinorUnits: number;
};

export function cancellationAdjustmentForCommission(row: CommissionLedgerRow): CancellationAdjustment {
  const alreadyPaid = row.payoutStatus === "Paid";
  return {
    approvedCommissionMinorUnits: 0,
    payoutStatus: "Reversed",
    clawbackMinorUnits: alreadyPaid ? Math.max(0, row.approvedCommissionMinorUnits) : 0,
  };
}

// Important: this file defines calculation and lifecycle rules only. Partner IDs must be
// allocated by a transactional system of record to avoid duplicates. Commercial commission
// rates must come from an approved, effective-dated CommissionRule and the exact rule version
// must be persisted on each ledger row. No automatic downline/equaliser/breakaway logic is
// enabled here.