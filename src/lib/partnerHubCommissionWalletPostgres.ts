import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";
import type { PartnerHubCommissionSummary } from "@/lib/partnerHubDashboard";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

export type PartnerCommissionWallet = {
  partnerId: string;
  commissions: PartnerHubCommissionSummary[];
  generatedAt: string;
};

export type PartnerCommissionWalletResult =
  | { status: "ok"; value: PartnerCommissionWallet | null }
  | { status: "unavailable"; reason: string }
  | { status: "conflict"; reason: string };

function minorUnits(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error("Commission aggregate is outside the supported minor-unit range.");
  }
  return parsed;
}

export async function loadPartnerCommissionWallet(partnerIdValue: string): Promise<PartnerCommissionWalletResult> {
  const partnerId = normalisePartnerId(partnerIdValue);
  if (!partnerId) return { status: "conflict", reason: "A valid permanent MMS Partner ID is required." };
  if (!mmsCommercialDatabaseClientAvailable()) {
    return { status: "unavailable", reason: "MMS commercial database persistence is not configured." };
  }

  try {
    const client = mmsCommercialDatabaseClient();
    const partner = await client.query<{ id: string; partner_code: string }>(
      `select id::text, partner_code
         from mms_commercial.partners
        where upper(partner_code)=upper($1)
        limit 1`,
      [partnerId],
    );
    const row = partner.rows[0];
    if (!row || normalisePartnerId(row.partner_code) !== partnerId) return { status: "ok", value: null };

    const aggregates = await client.query<{
      currency: string;
      pending_minor_units: unknown;
      eligible_minor_units: unknown;
      held_minor_units: unknown;
      approved_minor_units: unknown;
      paid_minor_units: unknown;
      reversed_minor_units: unknown;
      clawback_minor_units: unknown;
    }>(
      `select upper(c.currency) as currency,
              sum(case when c.status='Pending Eligibility' then greatest(0,c.gross_commission_minor_units) else 0 end)::bigint as pending_minor_units,
              sum(case when c.status='Eligible' then greatest(0,c.gross_commission_minor_units+c.adjustment_minor_units) else 0 end)::bigint as eligible_minor_units,
              sum(case when c.status='Held' then greatest(0,c.gross_commission_minor_units+c.adjustment_minor_units) else 0 end)::bigint as held_minor_units,
              sum(case when c.status='Approved' then greatest(0,c.approved_commission_minor_units) else 0 end)::bigint as approved_minor_units,
              sum(case when c.status='Paid' then greatest(0,c.approved_commission_minor_units) else 0 end)::bigint as paid_minor_units,
              sum(case when c.status='Reversed' then greatest(0,c.gross_commission_minor_units) else 0 end)::bigint as reversed_minor_units,
              sum(greatest(0,coalesce(c.clawback_minor_units,0)))::bigint as clawback_minor_units
         from mms_commercial.commission_transactions c
        where c.partner_id=$1::uuid
        group by upper(c.currency)
        order by upper(c.currency)`,
      [row.id],
    );

    const commissions: PartnerHubCommissionSummary[] = aggregates.rows.map((aggregate) => {
      const currency = String(aggregate.currency || "").trim().toUpperCase();
      if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Commission transaction currency is invalid.");
      return {
        currency,
        pendingMinorUnits: minorUnits(aggregate.pending_minor_units),
        eligibleMinorUnits: minorUnits(aggregate.eligible_minor_units),
        heldMinorUnits: minorUnits(aggregate.held_minor_units),
        approvedMinorUnits: minorUnits(aggregate.approved_minor_units),
        paidMinorUnits: minorUnits(aggregate.paid_minor_units),
        reversedMinorUnits: minorUnits(aggregate.reversed_minor_units),
        clawbackMinorUnits: minorUnits(aggregate.clawback_minor_units),
      };
    });

    return {
      status: "ok",
      value: { partnerId, commissions, generatedAt: new Date().toISOString() },
    };
  } catch {
    return { status: "unavailable", reason: "Partner commission wallet database read is unavailable." };
  }
}

// Partner-facing commission wallet reads intentionally aggregate only the amounts needed for
// the read-only wallet. Payment references, Finance actors, payout references and other
// internal ledger metadata are not selected into the Partner-facing request path.
