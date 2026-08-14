import type { CommissionLedgerEntry, PartnerHubRepository } from "@/lib/partnerHubPersistence";

export type CommissionSnapshot = {
  applicationId: string;
  partnerId: string;
  balanceMinor: number;
  currency: "MYR";
  entries: CommissionLedgerEntry[];
};

export interface ImmutableCommissionRepository extends PartnerHubRepository {
  getCommissionEntries(applicationId: string): Promise<CommissionLedgerEntry[]>;
  appendCommissionEntries(entries: Array<Omit<CommissionLedgerEntry, "id" | "createdAt">>): Promise<CommissionLedgerEntry[]>;
}

export function calculateCommissionSnapshot(entries: CommissionLedgerEntry[]): CommissionSnapshot | null {
  if (!entries.length) return null;
  const first = entries[0];
  return {
    applicationId: first.applicationId,
    partnerId: first.partnerId,
    currency: "MYR",
    balanceMinor: entries.reduce((sum, entry) => sum + entry.amountMinor, 0),
    entries: [...entries].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  };
}
