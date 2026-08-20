import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

export type LeadOwnershipTransferResult =
  | {
      status: "transferred";
      leadId: string;
      previousPartnerId: string;
      newPartnerId: string;
      replayed: boolean;
    }
  | { status: "conflict"; reason: string }
  | { status: "unavailable"; reason: string };

function safeReason(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  const known = [
    "invalid_lead_ownership_transfer_input",
    "lead_ownership_transfer_same_partner",
    "lead_not_found",
    "lead_ownership_expected_owner_conflict",
    "lead_ownership_locked_after_application",
    "lead_ownership_transfer_stage_locked",
    "new_partner_not_found",
    "new_partner_not_selling_eligible",
    "new_partner_certification_not_current",
  ];
  return known.find((code) => message.includes(code)) || "lead_ownership_transfer_conflict";
}

export async function transferCommercialLeadOwnership(params: {
  leadId: string;
  expectedPartnerId: string;
  newPartnerId: string;
  approvedBy: string;
  occurredAt: string;
  reason: string;
}): Promise<LeadOwnershipTransferResult> {
  const expectedPartnerId = normalisePartnerId(params.expectedPartnerId);
  const newPartnerId = normalisePartnerId(params.newPartnerId);
  if (!expectedPartnerId || !newPartnerId) {
    return { status: "conflict", reason: "A valid current and new MMS Partner ID are required." };
  }
  if (!mmsCommercialDatabaseClientAvailable()) {
    return { status: "unavailable", reason: "Dedicated MMS commercial PostgreSQL runtime is not operational." };
  }

  try {
    const result = await mmsCommercialDatabaseClient().query<{
      public_lead_id: string;
      previous_partner_code: string;
      new_partner_code: string;
      replayed: boolean;
    }>(
      `select * from mms_commercial.transfer_lead_ownership($1,$2,$3,$4,$5::timestamptz,$6)`,
      [params.leadId.trim(), expectedPartnerId, newPartnerId, params.approvedBy.trim(), params.occurredAt, params.reason.trim()],
    );
    const row = result.rows[0];
    if (!row) return { status: "conflict", reason: "Lead ownership transfer returned no result." };
    return {
      status: "transferred",
      leadId: row.public_lead_id,
      previousPartnerId: row.previous_partner_code,
      newPartnerId: row.new_partner_code,
      replayed: Boolean(row.replayed),
    };
  } catch (error) {
    return { status: "conflict", reason: safeReason(error) };
  }
}
