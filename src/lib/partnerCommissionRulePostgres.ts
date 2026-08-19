import type { MmsCommercialDatabaseClient } from "@/lib/mmsCommercialDatabaseClient";
import type {
  ApprovedCommissionRule,
  PartnerCommissionRuleStore,
  PartnerCommissionRuleStoreResult,
} from "@/lib/partnerCommissionRuleStore";
import { validateCommissionRule } from "@/lib/salesPartnerPolicy";

function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) throw new Error("Database returned an invalid commission-rule timestamp.");
  return date.toISOString();
}

function mapRule(row: {
  version: string;
  effective_from: unknown;
  effective_to: unknown | null;
  rates_by_level: ApprovedCommissionRule["ratesByLevel"];
  eligible_renewal_residual_rate: number | string | null;
  approved_by: string;
  approved_at: unknown;
  notes: string | null;
}): ApprovedCommissionRule {
  const rule: ApprovedCommissionRule = {
    version: row.version,
    effectiveFrom: iso(row.effective_from),
    effectiveTo: row.effective_to === null ? undefined : iso(row.effective_to),
    ratesByLevel: row.rates_by_level,
    eligibleRenewalResidualRate:
      row.eligible_renewal_residual_rate === null ? undefined : Number(row.eligible_renewal_residual_rate),
    notes: row.notes || undefined,
    status: "Approved",
    approvedBy: row.approved_by,
    approvedAt: iso(row.approved_at),
  };
  validateCommissionRule(rule);
  return rule;
}

function unavailable<T>(): PartnerCommissionRuleStoreResult<T> {
  return { status: "unavailable", reason: "Approved commission-rule database operation is unavailable." };
}

export function postgresPartnerCommissionRuleStore(
  client: MmsCommercialDatabaseClient,
): PartnerCommissionRuleStore {
  const selectColumns = `version,effective_from,effective_to,rates_by_level,eligible_renewal_residual_rate,approved_by,approved_at,notes`;

  return {
    async getEffectiveRule(at) {
      const atDate = new Date(at);
      if (Number.isNaN(atDate.getTime())) return { status: "conflict", reason: "Commission rule effective timestamp is invalid." };
      try {
        const result = await client.query<{
          version: string;
          effective_from: unknown;
          effective_to: unknown | null;
          rates_by_level: ApprovedCommissionRule["ratesByLevel"];
          eligible_renewal_residual_rate: number | string | null;
          approved_by: string;
          approved_at: unknown;
          notes: string | null;
        }>(
          `select ${selectColumns}
             from mms_commercial.commission_rules
            where effective_from <= $1::timestamptz
              and (effective_to is null or effective_to > $1::timestamptz)
            order by effective_from desc
            limit 2`,
          [atDate.toISOString()],
        );
        if (result.rowCount === 0) return { status: "not_found", reason: "No approved commission rule is effective at this time." };
        if (result.rowCount > 1) return { status: "conflict", reason: "Overlapping approved commission rules require Finance review." };
        return { status: "ok", value: mapRule(result.rows[0]) };
      } catch {
        return unavailable();
      }
    },

    async getByVersion(version) {
      const normalized = version.trim();
      if (!normalized) return { status: "not_found", reason: "Commission rule version was not supplied." };
      try {
        const result = await client.query<{
          version: string;
          effective_from: unknown;
          effective_to: unknown | null;
          rates_by_level: ApprovedCommissionRule["ratesByLevel"];
          eligible_renewal_residual_rate: number | string | null;
          approved_by: string;
          approved_at: unknown;
          notes: string | null;
        }>(`select ${selectColumns} from mms_commercial.commission_rules where version = $1 limit 1`, [normalized]);
        if (!result.rows[0]) return { status: "not_found", reason: "Approved commission rule version was not found." };
        return { status: "ok", value: mapRule(result.rows[0]) };
      } catch {
        return unavailable();
      }
    },
  };
}
