import type {
  ApplicationStage,
  CommercialApplication,
  CommercialMembership,
  CommercialPayment,
  MembershipStage,
  PaymentStage,
} from "@/lib/partnerCommercialModel";

export type CommercialWorkflowEvent = {
  eventId: string;
  entityType: "Application" | "Payment" | "Membership";
  entityId: string;
  previousState: string;
  nextState: string;
  actor: string;
  occurredAt: string;
  reason?: string;
};

export type PaymentVerificationEvidence = {
  paymentId: string;
  transactionReference: string;
  verifiedBy: string;
  verifiedAt: string;
  clearedAmountMinorUnits: number;
  currency: string;
  source: "Stripe" | "Bank Transfer" | "Finance Manual Review" | "Other Approved Gateway";
  sourceReference: string;
};

export type MembershipActivationEvidence = {
  membershipId: string;
  applicationId: string;
  paymentId: string;
  activatedBy: string;
  activatedAt: string;
  financeVerifiedAt: string;
};

export const APPLICATION_STAGE_TRANSITIONS: Readonly<Record<ApplicationStage, readonly ApplicationStage[]>> = {
  Draft: ["Submitted", "Withdrawn"],
  Submitted: ["Under Review", "Documents Outstanding", "Withdrawn", "Rejected"],
  "Under Review": ["Documents Outstanding", "Approved", "Rejected", "Withdrawn"],
  "Documents Outstanding": ["Under Review", "Rejected", "Withdrawn"],
  Approved: ["Payment Pending", "Withdrawn"],
  "Payment Pending": ["Paid", "Withdrawn"],
  Paid: ["Activated"],
  Activated: [],
  Withdrawn: [],
  Rejected: [],
};

export const PAYMENT_STAGE_TRANSITIONS: Readonly<Record<PaymentStage, readonly PaymentStage[]>> = {
  Pending: ["Submitted", "Failed"],
  Submitted: ["Cleared", "Failed"],
  Cleared: ["Partially Refunded", "Refunded", "Chargeback"],
  Failed: [],
  Refunded: [],
  "Partially Refunded": ["Refunded", "Chargeback"],
  Chargeback: [],
};

export const MEMBERSHIP_STAGE_TRANSITIONS: Readonly<Record<MembershipStage, readonly MembershipStage[]>> = {
  "Pending Activation": ["Active", "Cancelled"],
  Active: ["Cancelled", "Expired"],
  Cancelled: [],
  Expired: [],
};

const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

function requireTimestamp(value: string, field: string): void {
  if (!value || Number.isNaN(Date.parse(value))) throw new Error(`${field} must be a valid timestamp.`);
}

function requireNotMateriallyFutureTimestamp(value: string, field: string, now = Date.now()): void {
  requireTimestamp(value, field);
  if (Date.parse(value) > now + MAX_CLOCK_SKEW_MS) throw new Error(`${field} cannot be materially in the future.`);
}

function requireActor(value: string, field = "actor"): void {
  if (!value.trim()) throw new Error(`${field} is required for auditability.`);
}

function validCurrency(value: string): string {
  const currency = value.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Currency must be a valid three-letter code.");
  return currency;
}

export function assertApplicationStageTransition(current: ApplicationStage, next: ApplicationStage): void {
  if (current === next) return;
  if (!APPLICATION_STAGE_TRANSITIONS[current].includes(next)) {
    throw new Error(`Application transition from ${current} to ${next} is not permitted.`);
  }
}

export function assertPaymentStageTransition(current: PaymentStage, next: PaymentStage): void {
  if (current === next) return;
  if (!PAYMENT_STAGE_TRANSITIONS[current].includes(next)) {
    throw new Error(`Payment transition from ${current} to ${next} is not permitted.`);
  }
}

export function assertMembershipStageTransition(current: MembershipStage, next: MembershipStage): void {
  if (current === next) return;
  if (!MEMBERSHIP_STAGE_TRANSITIONS[current].includes(next)) {
    throw new Error(`Membership transition from ${current} to ${next} is not permitted.`);
  }
}

export function validatePaymentVerificationEvidence(
  payment: CommercialPayment,
  evidence: PaymentVerificationEvidence,
): void {
  if (payment.paymentId !== evidence.paymentId) throw new Error("Payment verification evidence does not match the payment ID.");
  if (payment.transactionReference !== evidence.transactionReference) {
    throw new Error("Payment verification transaction reference does not match the payment record.");
  }
  requireActor(evidence.verifiedBy, "verifiedBy");
  requireNotMateriallyFutureTimestamp(evidence.verifiedAt, "verifiedAt");
  if (payment.submittedAt) {
    requireTimestamp(payment.submittedAt, "payment.submittedAt");
    if (Date.parse(evidence.verifiedAt) < Date.parse(payment.submittedAt)) {
      throw new Error("Payment verification cannot precede payment submission.");
    }
  }
  if (!Number.isInteger(evidence.clearedAmountMinorUnits) || evidence.clearedAmountMinorUnits <= 0) {
    throw new Error("Cleared amount must be a positive integer in minor currency units.");
  }
  if (evidence.clearedAmountMinorUnits !== payment.amountMinorUnits) {
    throw new Error("Full payment clearance requires the verified cleared amount to equal the payment amount.");
  }
  if (validCurrency(evidence.currency) !== validCurrency(payment.currency)) {
    throw new Error("Payment verification currency does not match the payment record.");
  }
  if (!evidence.sourceReference.trim()) throw new Error("Payment verification source reference is required.");
}

export function financeVerifyPayment(params: {
  application: CommercialApplication;
  payment: CommercialPayment;
  evidence: PaymentVerificationEvidence;
}): { application: CommercialApplication; payment: CommercialPayment; events: CommercialWorkflowEvent[] } {
  const { application, payment, evidence } = params;
  if (payment.applicationId !== application.applicationId) {
    throw new Error("Payment does not belong to the application being verified.");
  }
  if (application.stage !== "Payment Pending") {
    throw new Error("Application must be Payment Pending before Finance can mark it Paid.");
  }
  assertPaymentStageTransition(payment.stage, "Cleared");
  assertApplicationStageTransition(application.stage, "Paid");
  validatePaymentVerificationEvidence(payment, evidence);

  const nextPayment: CommercialPayment = { ...payment, stage: "Cleared", clearedAt: evidence.verifiedAt };
  const nextApplication: CommercialApplication = { ...application, stage: "Paid" };
  const suffix = `${evidence.paymentId}-${Date.parse(evidence.verifiedAt)}`;

  return {
    application: nextApplication,
    payment: nextPayment,
    events: [
      {
        eventId: `PAY-${suffix}`,
        entityType: "Payment",
        entityId: payment.paymentId,
        previousState: payment.stage,
        nextState: "Cleared",
        actor: evidence.verifiedBy.trim(),
        occurredAt: evidence.verifiedAt,
        reason: `${evidence.source}: ${evidence.sourceReference.trim()}`,
      },
      {
        eventId: `APP-${application.applicationId}-${Date.parse(evidence.verifiedAt)}`,
        entityType: "Application",
        entityId: application.applicationId,
        previousState: application.stage,
        nextState: "Paid",
        actor: evidence.verifiedBy.trim(),
        occurredAt: evidence.verifiedAt,
        reason: "Application marked Paid only after Finance verified cleared funds.",
      },
    ],
  };
}

export function assertMembershipActivationReady(params: {
  application: CommercialApplication;
  payment: CommercialPayment;
  membership: CommercialMembership;
  evidence: MembershipActivationEvidence;
}): void {
  const { application, payment, membership, evidence } = params;
  if (membership.status !== "Pending Activation") throw new Error("Membership is not pending activation.");
  if (application.applicationId !== membership.applicationId || payment.applicationId !== application.applicationId) {
    throw new Error("Application, payment and membership references do not match.");
  }
  if (membership.membershipCode !== application.membershipCode) {
    throw new Error("Membership package does not match the approved application.");
  }
  if (application.stage !== "Paid") throw new Error("Application must be Paid before membership activation.");
  if (payment.stage !== "Cleared" || !payment.clearedAt) throw new Error("Finance-cleared payment is required before membership activation.");
  if (evidence.membershipId !== membership.membershipId || evidence.applicationId !== application.applicationId || evidence.paymentId !== payment.paymentId) {
    throw new Error("Membership activation evidence references do not match the commercial records.");
  }
  requireActor(evidence.activatedBy, "activatedBy");
  requireNotMateriallyFutureTimestamp(evidence.activatedAt, "activatedAt");
  requireNotMateriallyFutureTimestamp(evidence.financeVerifiedAt, "financeVerifiedAt");
  if (Date.parse(evidence.financeVerifiedAt) !== Date.parse(payment.clearedAt)) {
    throw new Error("Membership activation must retain the exact Finance verification timestamp.");
  }
  if (Date.parse(evidence.activatedAt) < Date.parse(evidence.financeVerifiedAt)) {
    throw new Error("Membership cannot activate before Finance verification.");
  }
}

export function activateCommercialMembership(params: {
  application: CommercialApplication;
  payment: CommercialPayment;
  membership: CommercialMembership;
  evidence: MembershipActivationEvidence;
}): {
  application: CommercialApplication;
  membership: CommercialMembership;
  events: CommercialWorkflowEvent[];
} {
  assertMembershipActivationReady(params);
  assertApplicationStageTransition(params.application.stage, "Activated");
  assertMembershipStageTransition(params.membership.status, "Active");

  const application = { ...params.application, stage: "Activated" as const, activatedAt: params.evidence.activatedAt };
  const membership = { ...params.membership, status: "Active" as const, activatedAt: params.evidence.activatedAt };
  const base = `${params.evidence.applicationId}-${Date.parse(params.evidence.activatedAt)}`;

  return {
    application,
    membership,
    events: [
      {
        eventId: `APP-${base}`,
        entityType: "Application",
        entityId: application.applicationId,
        previousState: params.application.stage,
        nextState: "Activated",
        actor: params.evidence.activatedBy.trim(),
        occurredAt: params.evidence.activatedAt,
        reason: "Membership activated after Finance-cleared payment.",
      },
      {
        eventId: `MEM-${params.membership.membershipId}-${Date.parse(params.evidence.activatedAt)}`,
        entityType: "Membership",
        entityId: membership.membershipId,
        previousState: params.membership.status,
        nextState: "Active",
        actor: params.evidence.activatedBy.trim(),
        occurredAt: params.evidence.activatedAt,
        reason: "Commercial membership activated.",
      },
    ],
  };
}