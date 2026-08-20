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
export const SALES_PARTNER_ASSESSMENT_VERSION = "MMS-SP-ASSESSMENT-2026-08-v1";

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

/**
 * Partner promotion thresholds are also effective-dated commercial policy. They must not be
 * hard-coded because the operating documents still treat the final promotion criteria as a
 * commercial decision. Chairman is intentionally excluded from automatic assignment.
 */
export type PartnerLevelRule = {
  version: string;
  effectiveFrom: string;
  effectiveTo?: string;
  minimumVerifiedMonthlyMemberships: {
    Associate: number;
    Senior: number;
    Elite: number;
  };
  notes?: string;
};

export function validatePartnerLevelRule(rule: PartnerLevelRule): void {
  if (!rule.version.trim()) throw new Error("Partner level rule version is required.");
  if (!rule.effectiveFrom.trim()) throw new Error("Partner level rule effective date is required.");

  const { Associate, Senior, Elite } = rule.minimumVerifiedMonthlyMemberships;
  for (const [level, threshold] of Object.entries({ Associate, Senior, Elite })) {
    if (!Number.isInteger(threshold) || threshold < 0) {
      throw new Error(`${level} threshold must be a non-negative integer.`);
    }
  }
  if (!(Associate <= Senior && Senior <= Elite)) {
    throw new Error("Partner level thresholds must be ordered Associate <= Senior <= Elite.");
  }
}

export function partnerLevelForVerifiedMonthlyMemberships(
  count: number,
  rule: PartnerLevelRule,
): Exclude<PartnerLevel, "Chairman"> {
  validatePartnerLevelRule(rule);
  const verifiedCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  if (verifiedCount >= rule.minimumVerifiedMonthlyMemberships.Elite) return "Elite";
  if (verifiedCount >= rule.minimumVerifiedMonthlyMemberships.Senior) return "Senior";
  return "Associate";
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

export const PARTNER_STAGE_TRANSITIONS: Readonly<Record<PartnerStage, readonly PartnerStage[]>> = {
  Applicant: ["Under Review", "Rejected"],
  "Under Review": ["Approved", "Rejected"],
  Approved: ["Agreement Pending", "Rejected"],
  "Agreement Pending": ["Training", "Rejected"],
  Training: ["Active", "Rejected"],
  Active: ["Suspended", "Inactive"],
  Suspended: ["Active", "Inactive"],
  Inactive: ["Under Review"],
  Rejected: [],
} as const;

export type PartnerStageTransitionCheck = {
  allowed: boolean;
  reason?: string;
  missingActivationRequirements?: Array<keyof ActivationChecklist>;
};

/**
 * Enforces the commercial onboarding lifecycle. Entering Active is impossible unless the
 * complete activation checklist is satisfied. The same gate is applied when restoring a
 * suspended Partner to Active so CRM access or compliance cannot silently drift out of date.
 */
export function checkPartnerStageTransition(
  currentStage: PartnerStage,
  nextStage: PartnerStage,
  activationChecklist?: ActivationChecklist,
): PartnerStageTransitionCheck {
  if (currentStage === nextStage) {
    return { allowed: true };
  }

  if (!PARTNER_STAGE_TRANSITIONS[currentStage].includes(nextStage)) {
    return {
      allowed: false,
      reason: `Transition from ${currentStage} to ${nextStage} is not permitted.`,
    };
  }

  if (nextStage === "Active") {
    if (!activationChecklist) {
      return {
        allowed: false,
        reason: "Activation checklist is required before a Sales Partner can become Active.",
      };
    }

    const activation = checkPartnerActivation(activationChecklist);
    if (!activation.canActivate) {
      return {
        allowed: false,
        reason: "Sales Partner activation requirements are incomplete.",
        missingActivationRequirements: activation.missing,
      };
    }
  }

  return { allowed: true };
}

export function assertPartnerStageTransition(
  currentStage: PartnerStage,
  nextStage: PartnerStage,
  activationChecklist?: ActivationChecklist,
): void {
  const result = checkPartnerStageTransition(currentStage, nextStage, activationChecklist);
  if (!result.allowed) {
    const missing = result.missingActivationRequirements?.length
      ? ` Missing: ${result.missingActivationRequirements.join(", ")}.`
      : "";
    throw new Error(`${result.reason || "Sales Partner stage transition is not permitted."}${missing}`);
  }
}

export function canIssuePermanentPartnerId(stage: PartnerStage, checklist: Pick<ActivationChecklist, "approved" | "kycDueDiligenceCompleted">): boolean {
  return (
    checklist.approved &&
    checklist.kycDueDiligenceCompleted &&
    (stage === "Approved" || stage === "Agreement Pending" || stage === "Training")
  );
}

export function sellingEnabled(stage: PartnerStage, checklist: ActivationChecklist): boolean {
  return stage === "Active" && checkPartnerActivation(checklist).canActivate;
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
// rates and promotion thresholds must come from approved, effective-dated rules and the exact
// rule version must be retained by the system of record. No automatic downline/equaliser/
// breakaway logic is enabled here.
