import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";

export type OperatorCommissionRow = {
  transactionId: string;
  partnerCode: string | null;
  applicationId: string;
  paymentId: string;
  membershipId: string;
  memberReference: string;
  membershipCode: string;
  currency: string;
  eligibleRevenueMinorUnits: number;
  ruleVersion: string;
  partnerLevel: string;
  commissionRate: number;
  grossCommissionMinorUnits: number;
  adjustmentMinorUnits: number;
  approvedCommissionMinorUnits: number;
  status: string;
  holdReason: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  payoutBatchId: string | null;
  paidBy: string | null;
  paidAt: string | null;
  payoutReference: string | null;
  reversedAt: string | null;
  reversalReason: string | null;
  clawbackMinorUnits: number;
  eligibilityCheckedBy: string | null;
  eligibilityCheckedAt: string | null;
  createdAt: string;
};

export type OperatorCommissionEvent = {
  previousStatus: string;
  nextStatus: string;
  actor: string;
  reason: string;
  occurredAt: string;
};

export type OperatorCommissionDetail = {
  transaction: OperatorCommissionRow;
  events: OperatorCommissionEvent[];
};

export type OperatorCommissionSummary = {
  eligible: number;
  held: number;
  approved: number;
  paid: number;
  reversed: number;
};

export type OperatorCommissionCursor = { createdAt: string; publicId: string };
export type OperatorCommissionPage = { items: OperatorCommissionRow[]; nextCursor: string | null };

function requireDatabase() {
  if (!mmsCommercialDatabaseClientAvailable()) throw new Error("MMS commercial database is unavailable.");
  return mmsCommercialDatabaseClient();
}

function numberValue(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function asIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? String(value || "") : parsed.toISOString();
}

function optionalIso(value: unknown): string | null {
  return value == null ? null : asIso(value);
}

function encodeCursor(cursor: OperatorCommissionCursor): string {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}

export function decodeOperatorCommissionCursor(value: string | null): OperatorCommissionCursor | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<OperatorCommissionCursor>;
    if (!parsed.createdAt || !parsed.publicId || Number.isNaN(Date.parse(parsed.createdAt))) return null;
    return { createdAt: parsed.createdAt, publicId: parsed.publicId };
  } catch {
    return null;
  }
}

type DbRow = {
  public_transaction_id: string;
  partner_code: string | null;
  public_application_id: string;
  public_payment_id: string;
  public_membership_id: string;
  member_reference: string;
  membership_code: string;
  currency: string;
  eligible_revenue_minor_units: number | string;
  commission_rule_version: string;
  partner_level_at_eligibility: string;
  commission_rate: number | string;
  gross_commission_minor_units: number | string;
  adjustment_minor_units: number | string;
  approved_commission_minor_units: number | string;
  status: string;
  hold_reason: string | null;
  approved_by: string | null;
  approved_at: unknown;
  payout_batch_id: string | null;
  paid_by: string | null;
  paid_at: unknown;
  payout_reference: string | null;
  reversed_at: unknown;
  reversal_reason: string | null;
  clawback_minor_units: number | string;
  eligibility_checked_by: string | null;
  eligibility_checked_at: unknown;
  created_at: unknown;
};

function project(row: DbRow): OperatorCommissionRow {
  return {
    transactionId: row.public_transaction_id,
    partnerCode: row.partner_code,
    applicationId: row.public_application_id,
    paymentId: row.public_payment_id,
    membershipId: row.public_membership_id,
    memberReference: row.member_reference,
    membershipCode: row.membership_code,
    currency: row.currency,
    eligibleRevenueMinorUnits: numberValue(row.eligible_revenue_minor_units),
    ruleVersion: row.commission_rule_version,
    partnerLevel: row.partner_level_at_eligibility,
    commissionRate: numberValue(row.commission_rate),
    grossCommissionMinorUnits: numberValue(row.gross_commission_minor_units),
    adjustmentMinorUnits: numberValue(row.adjustment_minor_units),
    approvedCommissionMinorUnits: numberValue(row.approved_commission_minor_units),
    status: row.status,
    holdReason: row.hold_reason,
    approvedBy: row.approved_by,
    approvedAt: optionalIso(row.approved_at),
    payoutBatchId: row.payout_batch_id,
    paidBy: row.paid_by,
    paidAt: optionalIso(row.paid_at),
    payoutReference: row.payout_reference,
    reversedAt: optionalIso(row.reversed_at),
    reversalReason: row.reversal_reason,
    clawbackMinorUnits: numberValue(row.clawback_minor_units),
    eligibilityCheckedBy: row.eligibility_checked_by,
    eligibilityCheckedAt: optionalIso(row.eligibility_checked_at),
    createdAt: asIso(row.created_at),
  };
}

const BASE_SELECT = `
  select
    c.public_transaction_id,
    pt.partner_code,
    a.public_application_id,
    p.public_payment_id,
    m.public_membership_id,
    c.member_reference,
    c.membership_code,
    c.currency,
    c.eligible_revenue_minor_units,
    c.commission_rule_version,
    c.partner_level_at_eligibility,
    c.commission_rate,
    c.gross_commission_minor_units,
    c.adjustment_minor_units,
    c.approved_commission_minor_units,
    c.status,
    c.hold_reason,
    c.approved_by,
    c.approved_at,
    c.payout_batch_id,
    c.paid_by,
    c.paid_at,
    c.payout_reference,
    c.reversed_at,
    c.reversal_reason,
    c.clawback_minor_units,
    c.eligibility_checked_by,
    c.eligibility_checked_at,
    c.created_at
  from mms_commercial.commission_transactions c
  join mms_commercial.partners pt on pt.id = c.partner_id
  join mms_commercial.applications a on a.id = c.application_id
  join mms_commercial.payments p on p.id = c.payment_id
  join mms_commercial.memberships m on m.id = c.membership_id
`;

export async function commissionSummary(): Promise<OperatorCommissionSummary> {
  const result = await requireDatabase().query<{ eligible: number | string; held: number | string; approved: number | string; paid: number | string; reversed: number | string }>(`
    select
      count(*) filter (where status = 'Eligible') as eligible,
      count(*) filter (where status = 'Held') as held,
      count(*) filter (where status = 'Approved') as approved,
      count(*) filter (where status = 'Paid') as paid,
      count(*) filter (where status = 'Reversed') as reversed
    from mms_commercial.commission_transactions
  `);
  const row = result.rows[0];
  return {
    eligible: numberValue(row?.eligible),
    held: numberValue(row?.held),
    approved: numberValue(row?.approved),
    paid: numberValue(row?.paid),
    reversed: numberValue(row?.reversed),
  };
}

export async function listOperatorCommissions(params: {
  status?: string;
  search?: string;
  ruleVersion?: string;
  currency?: string;
  cursor?: OperatorCommissionCursor | null;
  limit?: number;
}): Promise<OperatorCommissionPage> {
  const limit = Math.min(Math.max(params.limit || 50, 1), 100);
  const status = params.status?.trim() || null;
  const search = params.search?.trim() ? `%${params.search.trim()}%` : null;
  const ruleVersion = params.ruleVersion?.trim() || null;
  const currency = params.currency?.trim().toUpperCase() || null;
  const cursor = params.cursor || null;
  const result = await requireDatabase().query<DbRow>(`${BASE_SELECT}
    where ($1::text is null or c.status = $1)
      and ($2::text is null or c.public_transaction_id ilike $2 or a.public_application_id ilike $2 or p.public_payment_id ilike $2 or m.public_membership_id ilike $2 or c.member_reference ilike $2 or coalesce(pt.partner_code,'') ilike $2)
      and ($3::text is null or c.commission_rule_version = $3)
      and ($4::text is null or c.currency = $4)
      and ($5::timestamptz is null or (c.created_at, c.public_transaction_id) < ($5::timestamptz, $6::text))
    order by c.created_at desc, c.public_transaction_id desc
    limit $7
  `, [status, search, ruleVersion, currency, cursor?.createdAt || null, cursor?.publicId || "", limit + 1]);

  const hasMore = result.rows.length > limit;
  const items = result.rows.slice(0, limit).map(project);
  const last = items.at(-1);
  return { items, nextCursor: hasMore && last ? encodeCursor({ createdAt: last.createdAt, publicId: last.transactionId }) : null };
}

export async function getOperatorCommissionDetail(transactionId: string): Promise<OperatorCommissionDetail | null> {
  const result = await requireDatabase().query<DbRow>(`${BASE_SELECT} where c.public_transaction_id = $1 limit 1`, [transactionId]);
  const row = result.rows[0];
  if (!row) return null;
  const events = await requireDatabase().query<{ previous_status: string; next_status: string; actor: string; reason: string; occurred_at: unknown }>(`
    select e.previous_status, e.next_status, e.actor, e.reason, e.occurred_at
    from mms_commercial.commission_events e
    join mms_commercial.commission_transactions c on c.id = e.commission_transaction_id
    where c.public_transaction_id = $1
    order by e.occurred_at asc, e.created_at asc
  `, [transactionId]);
  return {
    transaction: project(row),
    events: events.rows.map((event) => ({ previousStatus: event.previous_status, nextStatus: event.next_status, actor: event.actor, reason: event.reason, occurredAt: asIso(event.occurred_at) })),
  };
}
