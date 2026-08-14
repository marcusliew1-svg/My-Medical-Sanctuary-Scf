export type CommissionLifecycleStatus =
  | "Estimated"
  | "Pending"
  | "Qualified"
  | "Approved"
  | "Payable"
  | "Paid"
  | "Reversed";

const allowedTransitions: Record<CommissionLifecycleStatus, CommissionLifecycleStatus[]> = {
  Estimated: ["Pending", "Reversed"],
  Pending: ["Qualified", "Reversed"],
  Qualified: ["Approved", "Reversed"],
  Approved: ["Payable", "Reversed"],
  Payable: ["Paid", "Reversed"],
  Paid: ["Reversed"],
  Reversed: [],
};

export function canTransitionCommission(from: CommissionLifecycleStatus, to: CommissionLifecycleStatus) {
  return allowedTransitions[from].includes(to);
}

export function requireCommissionTransition(from: CommissionLifecycleStatus, to: CommissionLifecycleStatus) {
  if (!canTransitionCommission(from, to)) {
    throw new Error(`Invalid commission transition: ${from} -> ${to}`);
  }
}

export function cancellationOverridesCommission() {
  return {
    status: "Reversed" as const,
    entitlementMinor: 0,
    reason: "Cancelled or refunded membership has zero commission entitlement.",
  };
}
