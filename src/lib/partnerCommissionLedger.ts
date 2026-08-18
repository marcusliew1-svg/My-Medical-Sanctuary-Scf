import {
  calculateCommissionMinorUnits,
  normalisePartnerId,
  validateCommissionRule,
  type CommissionRule,
  type PartnerLevel,
} from "@/lib/salesPartnerPolicy";
import type {
  CommercialApplication,
  CommercialMembership,
  CommercialPayment,
} from "@/lib/partnerCommercialModel";

export const COMMISSION_TRANSACTION_STATUSES = [
  "Pending Eligibility",
  "Eligible",
  "Held",
  "Approved",
  "Paid",
  "Reversed",
] as const;
export type CommissionTransactionStatus = (typeof COMMISSION_TRANSACTION_STATUSES)[number];

export type CommissionEligibilityEvidence = {
  checkedBy: string;
  checkedAt: string;
  partnerId: string;
  partnerLevel: PartnerLevel;
  attributionVerified: boolean;
  paymentCleared: boolean;
  membershipActive: boolean;
  cancellationClear: boolean;
  complianceClear: boolean;
  ruleVersion: string;
};

export type CommissionTransaction = {
  transactionId: string;
  partnerId: string;
  applicationId: string;
  paymentId: string;
  membershipId: string;
  memberReference: string;
  membershipCode: CommercialMembership["membershipCode"];
  paymentTransactionReference: string;
  currency: string;
  eligibleRevenueMinorUnits: number;
  commissionRuleVersion: string;
  partnerLevelAtEligibility: PartnerLevel;
  commissionRate: number;
  grossCommissionMinorUnits: number;
  adjustmentMinorUnits: number;
  approvedCommissionMinorUnits: number;
  status: CommissionTransactionStatus;
  eligibility?: CommissionEligibilityEvidence;
  holdReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  payoutBatchId?: string;
  paidBy?: string;
  paidAt?: string;
  payoutReference?: string;
  reversedAt?: string;
  reversalReason?: string;
  clawbackMinorUnits?: number;
};

export type CommissionLedgerEvent = {
  eventId: string;
  transactionId: string;
  previousStatus: CommissionTransactionStatus;
  nextStatus: CommissionTransactionStatus;
  actor: string;
  occurredAt: string;
  reason: string;
};

function requireTimestamp(value: string, field: string): void {
  if (!value || Number.isNaN(Date.parse(value))) throw new Error(`${field} must be a valid timestamp.`);
}

function requireActor(value: string, field: string): string {
  const actor = value.trim();
  if (!actor) throw new Error(`${field} is required for auditability.`);
  return actor;
}

function commissionRateForLevel(rule: CommissionRule, level: PartnerLevel): number {
  validateCommissionRule(rule);
  const rate = rule.ratesByLevel[level];
  if (rate === undefined) throw new Error(`Commission rule ${rule.version} has no approved rate for ${level}.`);
  return rate;
}

export function createCommissionTransaction(params: {
  transactionId: string;
  application: CommercialApplication;
  payment: CommercialPayment;
  membership: CommercialMembership;
  partnerLevel: PartnerLevel;
  rule: CommissionRule;
  eligibility: CommissionEligibilityEvidence;
}): { transaction: CommissionTransaction; event: CommissionLedgerEvent } {
  const { transactionId, application, payment, membership, partnerLevel, rule, eligibility } = params;
  const partnerId = normalisePartnerId(application.partnerId);
  if (!partnerId) throw new Error("Application attribution does not contain a valid MMS Partner ID.");
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(transactionId.trim())) throw new Error("Commission transaction ID is invalid.");
  if (payment.applicationId !== application.applicationId || membership.applicationId !== application.applicationId) {
    throw new Error("Application, payment and membership references do not match.");
  }
  if (membership.membershipCode !== application.membershipCode) {
    throw new Error("Membership package does not match the attributed application.");
  }
  if (payment.stage !== "Cleared" || !payment.clearedAt) throw new Error("Commission requires a Finance-cleared payment.");
  if (membership.status !== "Active" || membership.cancelledAt) throw new Error("Commission requires an active, uncancelled membership.");
  if (!eligibility.attributionVerified || !eligibility.paymentCleared || !eligibility.membershipActive || !eligibility.cancellationClear || !eligibility.complianceClear) {
    throw new Error("All commission eligibility controls must be verified before a transaction becomes Eligible.");
  }
  if (normalisePartnerId(eligibility.partnerId) !== partnerId) throw new Error("Eligibility Partner ID does not match application attribution.");
  if (eligibility.partnerLevel !== partnerLevel) throw new Error("Eligibility partner level does not match the supplied level.");
  if (eligibility.ruleVersion !== rule.version) throw new Error("Eligibility rule version does not match the approved commission rule.");
  requireActor(eligibility.checkedBy, "eligibility.checkedBy");
  requireTimestamp(eligibility.checkedAt, "eligibility.checkedAt");
  if (Date.parse(eligibility.checkedAt) < Date.parse(payment.clearedAt)) {
    throw new Error("Commission eligibility cannot be checked before Finance payment clearance.");
  }

  const rate = commissionRateForLevel(rule, partnerLevel);
  const gross = calculateCommissionMinorUnits(payment.amountMinorUnits, rate);
  const transaction: CommissionTransaction = {
    transactionId: transactionId.trim(),
    partnerId,
    applicationId: application.applicationId,
    paymentId: payment.paymentId,
    membershipId: membership.membershipId,
    memberReference: membership.memberReference,
    membershipCode: membership.membershipCode,
    paymentTransactionReference: payment.transactionReference,
    currency: payment.currency.trim().toUpperCase(),
    eligibleRevenueMinorUnits: payment.amountMinorUnits,
    commissionRuleVersion: rule.version,
    partnerLevelAtEligibility: partnerLevel,
    commissionRate: rate,
    grossCommissionMinorUnits: gross,
    adjustmentMinorUnits: 0,
    approvedCommissionMinorUnits: 0,
    status: "Eligible",
    eligibility,
  };

  return {
    transaction,
    event: {
      eventId: `COM-${transaction.transactionId}-${Date.parse(eligibility.checkedAt)}`,
      transactionId: transaction.transactionId,
      previousStatus: "Pending Eligibility",
      nextStatus: "Eligible",
      actor: eligibility.checkedBy.trim(),
      occurredAt: eligibility.checkedAt,
      reason: `Eligibility verified under commission rule ${rule.version}.`,
    },
  };
}

export function holdCommissionTransaction(params: {
  transaction: CommissionTransaction;
  actor: string;
  occurredAt: string;
  reason: string;
}): { transaction: CommissionTransaction; event: CommissionLedgerEvent } {
  const { transaction } = params;
  if (!["Eligible", "Approved"].includes(transaction.status)) throw new Error("Only Eligible or Approved commission can be placed on hold.");
  const actor = requireActor(params.actor, "actor");
  requireTimestamp(params.occurredAt, "occurredAt");
  if (!params.reason.trim()) throw new Error("Commission hold reason is required.");
  return {
    transaction: { ...transaction, status: "Held", holdReason: params.reason.trim() },
    event: {
      eventId: `COM-HOLD-${transaction.transactionId}-${Date.parse(params.occurredAt)}`,
      transactionId: transaction.transactionId,
      previousStatus: transaction.status,
      nextStatus: "Held",
      actor,
      occurredAt: params.occurredAt,
      reason: params.reason.trim(),
    },
  };
}

export function approveCommissionTransaction(params: {
  transaction: CommissionTransaction;
  approvedBy: string;
  approvedAt: string;
}): { transaction: CommissionTransaction; event: CommissionLedgerEvent } {
  const { transaction } = params;
  if (transaction.status !== "Eligible") throw new Error("Only Eligible commission can be approved for payout.");
  if (!transaction.eligibility) throw new Error("Commission eligibility evidence is missing.");
  const approvedBy = requireActor(params.approvedBy, "approvedBy");
  requireTimestamp(params.approvedAt, "approvedAt");
  if (Date.parse(params.approvedAt) < Date.parse(transaction.eligibility.checkedAt)) {
    throw new Error("Commission approval cannot precede eligibility verification.");
  }
  const approvedAmount = Math.max(0, transaction.grossCommissionMinorUnits + transaction.adjustmentMinorUnits);
  return {
    transaction: {
      ...transaction,
      approvedCommissionMinorUnits: approvedAmount,
      status: "Approved",
      approvedBy,
      approvedAt: params.approvedAt,
      holdReason: undefined,
    },
    event: {
      eventId: `COM-APPROVE-${transaction.transactionId}-${Date.parse(params.approvedAt)}`,
      transactionId: transaction.transactionId,
      previousStatus: transaction.status,
      nextStatus: "Approved",
      actor: approvedBy,
      occurredAt: params.approvedAt,
      reason: "Commission approved for payout.",
    },
  };
}

export function markCommissionPaid(params: {
  transaction: CommissionTransaction;
  payoutBatchId: string;
  payoutReference: string;
  paidBy: string;
  paidAt: string;
}): { transaction: CommissionTransaction; event: CommissionLedgerEvent } {
  const { transaction } = params;
  if (transaction.status !== "Approved") throw new Error("Only Approved commission can be marked Paid.");
  const paidBy = requireActor(params.paidBy, "paidBy");
  requireTimestamp(params.paidAt, "paidAt");
  if (!params.payoutBatchId.trim() || !params.payoutReference.trim()) throw new Error("Payout batch and payment reference are required.");
  if (transaction.approvedAt && Date.parse(params.paidAt) < Date.parse(transaction.approvedAt)) {
    throw new Error("Commission cannot be paid before approval.");
  }
  return {
    transaction: {
      ...transaction,
      status: "Paid",
      payoutBatchId: params.payoutBatchId.trim(),
      payoutReference: params.payoutReference.trim(),
      paidBy,
      paidAt: params.paidAt,
    },
    event: {
      eventId: `COM-PAID-${transaction.transactionId}-${Date.parse(params.paidAt)}`,
      transactionId: transaction.transactionId,
      previousStatus: transaction.status,
      nextStatus: "Paid",
      actor: paidBy,
      occurredAt: params.paidAt,
      reason: `Paid in batch ${params.payoutBatchId.trim()} (${params.payoutReference.trim()}).`,
    },
  };
}

export function reverseCommissionForCancellation(params: {
  transaction: CommissionTransaction;
  actor: string;
  occurredAt: string;
  reason: string;
}): { transaction: CommissionTransaction; event: CommissionLedgerEvent } {
  const actor = requireActor(params.actor, "actor");
  requireTimestamp(params.occurredAt, "occurredAt");
  if (!params.reason.trim()) throw new Error("Commission reversal reason is required.");
  if (params.transaction.status === "Reversed") throw new Error("Commission is already reversed.");
  const clawback = params.transaction.status === "Paid" ? Math.max(0, params.transaction.approvedCommissionMinorUnits) : 0;
  return {
    transaction: {
      ...params.transaction,
      status: "Reversed",
      approvedCommissionMinorUnits: 0,
      reversedAt: params.occurredAt,
      reversalReason: params.reason.trim(),
      clawbackMinorUnits: clawback,
    },
    event: {
      eventId: `COM-REVERSE-${params.transaction.transactionId}-${Date.parse(params.occurredAt)}`,
      transactionId: params.transaction.transactionId,
      previousStatus: params.transaction.status,
      nextStatus: "Reversed",
      actor,
      occurredAt: params.occurredAt,
      reason: params.reason.trim(),
    },
  };
}

// No downline, equaliser, breakaway or recruitment-chain compensation is implemented here.
// Renewal residuals must be implemented separately only after package utilisation and renewal rules are approved.
