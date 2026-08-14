export type CommissionEvaluationInput = {
  certifiedPartner: boolean;
  verifiedPayment: boolean;
  coolingOffComplete: boolean;
  complianceCleared: boolean;
  cancelled: boolean;
  refunded: boolean;
  alreadyPaid?: boolean;
};

export type CommissionEvaluation = {
  eligible: boolean;
  status: "Pending" | "Qualified" | "Reversed";
  reason: string;
  recoveryRequired: boolean;
};

export function evaluateCommission(input: CommissionEvaluationInput): CommissionEvaluation {
  if (input.cancelled || input.refunded) {
    return {
      eligible: false,
      status: "Reversed",
      reason: "Cancelled or refunded memberships earn zero commission.",
      recoveryRequired: Boolean(input.alreadyPaid),
    };
  }

  if (!input.certifiedPartner) {
    return {
      eligible: false,
      status: "Pending",
      reason: "Partner is not certified or does not have active commission eligibility.",
      recoveryRequired: false,
    };
  }

  if (!input.verifiedPayment) {
    return {
      eligible: false,
      status: "Pending",
      reason: "Client payment has not been verified.",
      recoveryRequired: false,
    };
  }

  if (!input.coolingOffComplete) {
    return {
      eligible: false,
      status: "Pending",
      reason: "Cooling-off period has not completed.",
      recoveryRequired: false,
    };
  }

  if (!input.complianceCleared) {
    return {
      eligible: false,
      status: "Pending",
      reason: "Compliance clearance is still required.",
      recoveryRequired: false,
    };
  }

  return {
    eligible: true,
    status: "Qualified",
    reason: "Verified payment, cooling-off and compliance conditions are satisfied and the membership remains active.",
    recoveryRequired: false,
  };
}
