import type { CommercialMembership, CommercialPayment } from "@/lib/partnerCommercialModel";
import type { CommissionLedgerRow } from "@/lib/salesPartnerPolicy";
import { cancellationAdjustmentForCommission } from "@/lib/salesPartnerPolicy";

export type CommercialAdjustmentReason = "Customer Cancellation" | "Full Refund" | "Chargeback" | "Partial Refund";

export type CommercialAdjustmentDecision =
  | {
      status: "automatic_reversal";
      paymentStage: "Refunded" | "Chargeback";
      membershipStatus: "Cancelled";
      commission: ReturnType<typeof cancellationAdjustmentForCommission>;
      reason: CommercialAdjustmentReason;
    }
  | {
      status: "manual_review";
      reason: "Partial Refund";
      message: string;
    };

export function commercialAdjustmentDecision(params: {
  payment: CommercialPayment;
  membership: CommercialMembership;
  ledger: CommissionLedgerRow;
  reason: CommercialAdjustmentReason;
}): CommercialAdjustmentDecision {
  const { payment, membership, ledger, reason } = params;
  if (payment.applicationId !== membership.applicationId) {
    throw new Error("Payment and membership do not belong to the same application.");
  }
  if (ledger.memberReference !== membership.memberReference || ledger.membershipCode !== membership.membershipCode) {
    throw new Error("Commission ledger does not match the membership being adjusted.");
  }
  if (ledger.transactionReference !== payment.transactionReference) {
    throw new Error("Commission ledger does not match the payment being adjusted.");
  }

  if (reason === "Partial Refund") {
    return {
      status: "manual_review",
      reason,
      message:
        "Automatic partial-refund commission adjustment is disabled until MMS approves a versioned partial-refund formula. Hold the commission item for Finance review.",
    };
  }

  const paymentStage = reason === "Chargeback" ? "Chargeback" : "Refunded";
  return {
    status: "automatic_reversal",
    paymentStage,
    membershipStatus: "Cancelled",
    commission: cancellationAdjustmentForCommission(ledger),
    reason,
  };
}

export function cancellationRequiresZeroCommission(reason: CommercialAdjustmentReason): boolean {
  return reason !== "Partial Refund";
}
