import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

export type PartnerLeadStage = "Registered" | "Accepted" | "Contacted" | "Qualified" | "Lost" | "Withdrawn";

export type PartnerLeadStageTransitionResult =
  | {
      status: "transitioned";
      leadId: string;
      previousStage: string;
      nextStage: string;
      replayed: boolean;
    }
  | { status: "conflict"; reason: string }
  | { status: "unavailable"; reason: string };

function safeReason(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  const known = [
    "invalid_partner_lead_stage_transition_input",
    "terminal_lead_stage_cannot_have_next_action",
    "lead_next_action_precedes_transition",
    "partner_not_found",
    "partner_not_selling_eligible",
    "partner_certification_not_current",
    "lead_not_owned_by_partner",
    "lead_stage_transition_replay_conflict",
    "lead_stage_conflict",
    "lead_stage_transition_precedes_last_activity",
    "lead_stage_locked_after_application",
    "lead_stage_transition_not_allowed",
    "lead_duplicate_review_not_clear",
  ];
  return known.find((code) => message.includes(code)) || "partner_lead_stage_transition_conflict";
}

export async function transitionPartnerLeadStage(params: {
  partnerId: string;
  leadId: string;
  expectedStage: string;
  nextStage: string;
  occurredAt: string;
  nextActionAt?: string;
}): Promise<PartnerLeadStageTransitionResult> {
  const partnerId = normalisePartnerId(params.partnerId);
  if (!partnerId) return { status: "conflict", reason: "A valid permanent MMS Partner ID is required." };
  if (!mmsCommercialDatabaseClientAvailable()) {
    return { status: "unavailable", reason: "Dedicated MMS commercial PostgreSQL runtime is not operational." };
  }

  try {
    const result = await mmsCommercialDatabaseClient().query<{
      public_lead_id: string;
      previous_stage: string;
      next_stage: string;
      replayed: boolean;
    }>(
      `select * from mms_commercial.transition_partner_lead_stage($1,$2,$3,$4,$5::timestamptz,$6::timestamptz)`,
      [
        partnerId,
        params.leadId.trim(),
        params.expectedStage.trim(),
        params.nextStage.trim(),
        params.occurredAt,
        params.nextActionAt || null,
      ],
    );
    const row = result.rows[0];
    if (!row) return { status: "conflict", reason: "Partner lead stage transition returned no result." };
    return {
      status: "transitioned",
      leadId: row.public_lead_id,
      previousStage: row.previous_stage,
      nextStage: row.next_stage,
      replayed: Boolean(row.replayed),
    };
  } catch (error) {
    return { status: "conflict", reason: safeReason(error) };
  }
}
