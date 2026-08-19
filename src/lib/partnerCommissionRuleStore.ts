import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";
import { postgresPartnerCommissionRuleStore } from "@/lib/partnerCommissionRulePostgres";
import type { CommissionRule } from "@/lib/salesPartnerPolicy";

export type ApprovedCommissionRule = CommissionRule & {
  status: "Approved";
  approvedBy: string;
  approvedAt: string;
};

export type PartnerCommissionRuleStoreResult<T> =
  | { status: "ok"; value: T }
  | { status: "unavailable"; reason: string }
  | { status: "not_found"; reason: string }
  | { status: "conflict"; reason: string };

export type PartnerCommissionRuleStore = {
  getEffectiveRule(at: string): Promise<PartnerCommissionRuleStoreResult<ApprovedCommissionRule>>;
  getByVersion(version: string): Promise<PartnerCommissionRuleStoreResult<ApprovedCommissionRule>>;
};

export const PARTNER_COMMISSION_RULE_STORE_REQUIREMENTS = Object.freeze([
  "Only Finance-approved commission rules may be returned as effective.",
  "Every rule must have a unique immutable version and effective date range.",
  "Overlapping effective rule windows must be rejected.",
  "Published sales retain the exact rule version applied at eligibility even after later policy changes.",
  "Rates and promotion thresholds must not be inferred from website copy or historical draft documents.",
]);

export function partnerCommissionRuleStoreAvailable(): boolean {
  return mmsCommercialDatabaseClientAvailable();
}

export function partnerCommissionRuleStore(): PartnerCommissionRuleStore {
  if (mmsCommercialDatabaseClientAvailable()) {
    return postgresPartnerCommissionRuleStore(mmsCommercialDatabaseClient());
  }

  const unavailable = <T>(): PartnerCommissionRuleStoreResult<T> => ({
    status: "unavailable",
    reason:
      "Approved commission-rule registry is not configured. Finance must publish a versioned effective-dated rule before commission can be calculated.",
  });

  return {
    async getEffectiveRule() {
      return unavailable();
    },
    async getByVersion() {
      return unavailable();
    },
  };
}
