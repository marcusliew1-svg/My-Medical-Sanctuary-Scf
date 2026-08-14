export type LedgerEntryType = "Commission accrued" | "Commission approved" | "Payout" | "Reversal" | "Recovery";

export type CommissionLedgerEntry = {
  id: string;
  commissionReference: string;
  type: LedgerEntryType;
  amount: number;
  currency: "MYR";
  createdAt: string;
  note: string;
};

export function buildCancellationReversal(input: {
  commissionReference: string;
  commissionPaid: boolean;
  commissionAmount: number;
  cancelledAt: string;
}): CommissionLedgerEntry[] {
  const entries: CommissionLedgerEntry[] = [
    {
      id: `${input.commissionReference}-REV`,
      commissionReference: input.commissionReference,
      type: "Reversal",
      amount: -Math.abs(input.commissionAmount),
      currency: "MYR",
      createdAt: input.cancelledAt,
      note: "Membership cancelled/refunded. Commission entitlement reduced to zero.",
    },
  ];

  if (input.commissionPaid) {
    entries.push({
      id: `${input.commissionReference}-REC`,
      commissionReference: input.commissionReference,
      type: "Recovery",
      amount: Math.abs(input.commissionAmount),
      currency: "MYR",
      createdAt: input.cancelledAt,
      note: "Commission had already been paid and is recoverable by set-off or repayment.",
    });
  }

  return entries;
}

export function calculateLedgerBalance(entries: CommissionLedgerEntry[]) {
  return entries.reduce((total, entry) => total + entry.amount, 0);
}
