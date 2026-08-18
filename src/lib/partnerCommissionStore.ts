import type { CommissionLedgerEvent, CommissionTransaction } from "@/lib/partnerCommissionLedger";

export type PartnerCommissionStoreResult<T> =
  | { status: "ok"; value: T }
  | { status: "unavailable"; reason: string }
  | { status: "conflict"; reason: string };

export type PartnerCommissionRecord = {
  transaction: CommissionTransaction;
  events: CommissionLedgerEvent[];
};

export type PartnerCommissionStore = {
  create(record: PartnerCommissionRecord): Promise<PartnerCommissionStoreResult<PartnerCommissionRecord>>;
  get(transactionId: string): Promise<PartnerCommissionStoreResult<PartnerCommissionRecord | null>>;
  saveTransition(params: {
    transaction: CommissionTransaction;
    event: CommissionLedgerEvent;
  }): Promise<PartnerCommissionStoreResult<PartnerCommissionRecord>>;
};

export const PARTNER_COMMISSION_STORE_REQUIREMENTS = Object.freeze([
  "Each qualifying sale or eligible renewal must create a distinct immutable commission transaction.",
  "The exact approved commission-rule version and partner level used at eligibility must be retained permanently.",
  "Commission approval and payout status must not be editable by Sales Partners.",
  "Every eligibility, hold, approval, payment and reversal change must append an immutable event.",
  "A cancelled membership must result in zero commission and a 100% clawback if commission was already paid.",
  "Partial refund commission treatment must remain on hold until an approved versioned Finance rule exists.",
  "Downline, equaliser and breakaway compensation must not be generated automatically.",
  "Clinical data must never be stored in the commission ledger.",
]);

export function partnerCommissionStoreAvailable(): boolean {
  return false;
}

/**
 * Deliberately fail closed until MMS provisions a dedicated transactional
 * commercial datastore. Finance records and commission events must not use
 * browser storage, Zoho Description text, patient/clinical storage or iPivot.
 */
export function partnerCommissionStore(): PartnerCommissionStore {
  const unavailable = <T>(): PartnerCommissionStoreResult<T> => ({
    status: "unavailable",
    reason:
      "MMS commission-ledger persistence is not configured. Provision a dedicated transactional commercial store before commission approval or payout.",
  });

  return {
    async create() {
      return unavailable();
    },
    async get() {
      return unavailable();
    },
    async saveTransition() {
      return unavailable();
    },
  };
}
