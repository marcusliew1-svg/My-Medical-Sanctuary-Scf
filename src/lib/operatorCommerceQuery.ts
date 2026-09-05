import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";

export type OperatorDashboardSummary = {
  applicationsNeedingReview: number;
  documentsOutstanding: number;
  paymentsAwaitingClearance: number;
  membershipsAwaitingPreparation: number;
  membershipsAwaitingActivation: number;
};

export type OperatorApplicationRow = {
  applicationId: string;
  stage: string;
  membershipCode: string;
  submittedAt: string | null;
  createdAt: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  partnerCode: string | null;
  paymentStage: string | null;
  membershipStatus: string | null;
};

export type OperatorPaymentRow = {
  paymentId: string;
  applicationId: string;
  stage: string;
  amountMinorUnits: number;
  currency: string;
  transactionReference: string;
  submittedAt: string | null;
  clearedAt: string | null;
  createdAt: string;
  customerName: string;
  partnerCode: string | null;
  verificationSource: string | null;
  verificationReference: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
};

export type OperatorMembershipRow = {
  membershipId: string;
  applicationId: string;
  memberReference: string;
  membershipCode: string;
  status: string;
  activatedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  customerName: string;
  partnerCode: string | null;
  paymentStage: string | null;
};

export type OperatorWorkflowEvent = {
  entityType: string;
  entityPublicId: string;
  previousState: string;
  nextState: string;
  actor: string;
  reason: string | null;
  occurredAt: string;
};

export type OperatorApplicationDetail = {
  application: OperatorApplicationRow;
  events: OperatorWorkflowEvent[];
};

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

type Cursor = { createdAt: string; publicId: string };

function asIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? String(value || "") : parsed.toISOString();
}

function optionalIso(value: unknown): string | null {
  return value == null ? null : asIso(value);
}

function numberValue(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function encodeCursor(cursor: Cursor): string {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}

export function decodeOperatorCursor(value: string | null): Cursor | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<Cursor>;
    if (!parsed.createdAt || !parsed.publicId || Number.isNaN(Date.parse(parsed.createdAt))) return null;
    return { createdAt: parsed.createdAt, publicId: parsed.publicId };
  } catch {
    return null;
  }
}

function requireDatabase() {
  if (!mmsCommercialDatabaseClientAvailable()) throw new Error("MMS commercial database is unavailable.");
  return mmsCommercialDatabaseClient();
}

export async function operatorDashboardSummary(): Promise<OperatorDashboardSummary> {
  const result = await requireDatabase().query<{
    applications_needing_review: number | string;
    documents_outstanding: number | string;
    payments_awaiting_clearance: number | string;
    memberships_awaiting_preparation: number | string;
    memberships_awaiting_activation: number | string;
  }>(`
    select
      (select count(*) from mms_commercial.applications where stage in ('Submitted','Under Review')) as applications_needing_review,
      (select count(*) from mms_commercial.applications where stage = 'Documents Outstanding') as documents_outstanding,
      (select count(*) from mms_commercial.payments where stage = 'Submitted') as payments_awaiting_clearance,
      (
        select count(*)
        from mms_commercial.applications a
        join mms_commercial.payments p on p.application_id = a.id and p.stage = 'Cleared'
        left join mms_commercial.memberships m on m.application_id = a.id
        where a.stage = 'Paid' and m.id is null
      ) as memberships_awaiting_preparation,
      (
        select count(*)
        from mms_commercial.memberships m
        join mms_commercial.applications a on a.id = m.application_id
        join mms_commercial.payments p on p.application_id = a.id and p.stage = 'Cleared'
        where m.status = 'Pending Activation'
      ) as memberships_awaiting_activation
  `);
  const row = result.rows[0];
  return {
    applicationsNeedingReview: numberValue(row?.applications_needing_review),
    documentsOutstanding: numberValue(row?.documents_outstanding),
    paymentsAwaitingClearance: numberValue(row?.payments_awaiting_clearance),
    membershipsAwaitingPreparation: numberValue(row?.memberships_awaiting_preparation),
    membershipsAwaitingActivation: numberValue(row?.memberships_awaiting_activation),
  };
}

export async function listOperatorApplications(params: {
  stage?: string;
  search?: string;
  cursor?: Cursor | null;
  limit?: number;
}): Promise<CursorPage<OperatorApplicationRow>> {
  const limit = Math.min(Math.max(params.limit || 50, 1), 100);
  const stage = params.stage?.trim() || null;
  const search = params.search?.trim() ? `%${params.search.trim()}%` : null;
  const cursor = params.cursor || null;
  const result = await requireDatabase().query<{
    public_application_id: string;
    stage: string;
    membership_code: string;
    submitted_at: unknown;
    created_at: unknown;
    full_name: string;
    email_normalized: string | null;
    phone_normalized: string | null;
    partner_code: string | null;
    payment_stage: string | null;
    membership_status: string | null;
  }>(`
    select
      a.public_application_id,
      a.stage,
      a.membership_code,
      a.submitted_at,
      a.created_at,
      l.full_name,
      l.email_normalized,
      l.phone_normalized,
      pt.partner_code,
      p.stage as payment_stage,
      m.status as membership_status
    from mms_commercial.applications a
    join mms_commercial.leads l on l.id = a.lead_id
    join mms_commercial.partners pt on pt.id = a.partner_id
    left join mms_commercial.payments p on p.application_id = a.id
    left join mms_commercial.memberships m on m.application_id = a.id
    where ($1::text is null or a.stage = $1)
      and ($2::text is null or a.public_application_id ilike $2 or l.full_name ilike $2 or coalesce(l.email_normalized,'') ilike $2 or coalesce(l.phone_normalized,'') ilike $2 or coalesce(pt.partner_code,'') ilike $2)
      and ($3::timestamptz is null or (a.created_at, a.public_application_id) < ($3::timestamptz, $4::text))
    order by a.created_at desc, a.public_application_id desc
    limit $5
  `, [stage, search, cursor?.createdAt || null, cursor?.publicId || "", limit + 1]);

  const hasMore = result.rows.length > limit;
  const rows = result.rows.slice(0, limit);
  const items = rows.map((row) => ({
    applicationId: row.public_application_id,
    stage: row.stage,
    membershipCode: row.membership_code,
    submittedAt: optionalIso(row.submitted_at),
    createdAt: asIso(row.created_at),
    customerName: row.full_name,
    customerEmail: row.email_normalized,
    customerPhone: row.phone_normalized,
    partnerCode: row.partner_code,
    paymentStage: row.payment_stage,
    membershipStatus: row.membership_status,
  }));
  const last = items.at(-1);
  return { items, nextCursor: hasMore && last ? encodeCursor({ createdAt: last.createdAt, publicId: last.applicationId }) : null };
}

export async function getOperatorApplicationDetail(applicationId: string): Promise<OperatorApplicationDetail | null> {
  const page = await listOperatorApplications({ search: applicationId, limit: 10 });
  const application = page.items.find((item) => item.applicationId === applicationId);
  if (!application) return null;
  const events = await requireDatabase().query<{
    entity_type: string;
    entity_public_id: string;
    previous_state: string;
    next_state: string;
    actor: string;
    reason: string | null;
    occurred_at: unknown;
  }>(`
    select entity_type, entity_public_id, previous_state, next_state, actor, reason, occurred_at
    from mms_commercial.commercial_workflow_events
    where entity_public_id = $1
       or entity_public_id in (
         select p.public_payment_id from mms_commercial.payments p join mms_commercial.applications a on a.id = p.application_id where a.public_application_id = $1
       )
       or entity_public_id in (
         select m.public_membership_id from mms_commercial.memberships m join mms_commercial.applications a on a.id = m.application_id where a.public_application_id = $1
       )
    order by occurred_at asc, created_at asc
  `, [applicationId]);
  return {
    application,
    events: events.rows.map((row) => ({
      entityType: row.entity_type,
      entityPublicId: row.entity_public_id,
      previousState: row.previous_state,
      nextState: row.next_state,
      actor: row.actor,
      reason: row.reason,
      occurredAt: asIso(row.occurred_at),
    })),
  };
}

export async function listOperatorPayments(params: {
  stage?: string;
  search?: string;
  cursor?: Cursor | null;
  limit?: number;
}): Promise<CursorPage<OperatorPaymentRow>> {
  const limit = Math.min(Math.max(params.limit || 50, 1), 100);
  const stage = params.stage?.trim() || null;
  const search = params.search?.trim() ? `%${params.search.trim()}%` : null;
  const cursor = params.cursor || null;
  const result = await requireDatabase().query<{
    public_payment_id: string;
    public_application_id: string;
    stage: string;
    amount_minor_units: number | string;
    currency: string;
    transaction_reference: string;
    submitted_at: unknown;
    cleared_at: unknown;
    created_at: unknown;
    full_name: string;
    partner_code: string | null;
    source: string | null;
    source_reference: string | null;
    verified_by: string | null;
    verified_at: unknown;
  }>(`
    select
      p.public_payment_id,
      a.public_application_id,
      p.stage,
      p.amount_minor_units,
      p.currency,
      p.transaction_reference,
      p.submitted_at,
      p.cleared_at,
      p.created_at,
      l.full_name,
      pt.partner_code,
      pv.source,
      pv.source_reference,
      pv.verified_by,
      pv.verified_at
    from mms_commercial.payments p
    join mms_commercial.applications a on a.id = p.application_id
    join mms_commercial.leads l on l.id = a.lead_id
    join mms_commercial.partners pt on pt.id = a.partner_id
    left join lateral (
      select source, source_reference, verified_by, verified_at
      from mms_commercial.payment_verifications v
      where v.payment_id = p.id
      order by verified_at desc
      limit 1
    ) pv on true
    where ($1::text is null or p.stage = $1)
      and ($2::text is null or p.public_payment_id ilike $2 or a.public_application_id ilike $2 or p.transaction_reference ilike $2 or l.full_name ilike $2 or coalesce(pt.partner_code,'') ilike $2)
      and ($3::timestamptz is null or (p.created_at, p.public_payment_id) < ($3::timestamptz, $4::text))
    order by p.created_at desc, p.public_payment_id desc
    limit $5
  `, [stage, search, cursor?.createdAt || null, cursor?.publicId || "", limit + 1]);

  const hasMore = result.rows.length > limit;
  const items = result.rows.slice(0, limit).map((row) => ({
    paymentId: row.public_payment_id,
    applicationId: row.public_application_id,
    stage: row.stage,
    amountMinorUnits: numberValue(row.amount_minor_units),
    currency: row.currency,
    transactionReference: row.transaction_reference,
    submittedAt: optionalIso(row.submitted_at),
    clearedAt: optionalIso(row.cleared_at),
    createdAt: asIso(row.created_at),
    customerName: row.full_name,
    partnerCode: row.partner_code,
    verificationSource: row.source,
    verificationReference: row.source_reference,
    verifiedBy: row.verified_by,
    verifiedAt: optionalIso(row.verified_at),
  }));
  const last = items.at(-1);
  return { items, nextCursor: hasMore && last ? encodeCursor({ createdAt: last.createdAt, publicId: last.paymentId }) : null };
}

export async function listOperatorMemberships(params: {
  status?: string;
  search?: string;
  cursor?: Cursor | null;
  limit?: number;
}): Promise<CursorPage<OperatorMembershipRow>> {
  const limit = Math.min(Math.max(params.limit || 50, 1), 100);
  const status = params.status?.trim() || null;
  const search = params.search?.trim() ? `%${params.search.trim()}%` : null;
  const cursor = params.cursor || null;
  const result = await requireDatabase().query<{
    public_membership_id: string;
    public_application_id: string;
    member_reference: string;
    membership_code: string;
    status: string;
    activated_at: unknown;
    cancelled_at: unknown;
    created_at: unknown;
    full_name: string;
    partner_code: string | null;
    payment_stage: string | null;
  }>(`
    select
      m.public_membership_id,
      a.public_application_id,
      m.member_reference,
      m.membership_code,
      m.status,
      m.activated_at,
      m.cancelled_at,
      m.created_at,
      l.full_name,
      pt.partner_code,
      p.stage as payment_stage
    from mms_commercial.memberships m
    join mms_commercial.applications a on a.id = m.application_id
    join mms_commercial.leads l on l.id = a.lead_id
    join mms_commercial.partners pt on pt.id = a.partner_id
    left join mms_commercial.payments p on p.application_id = a.id
    where ($1::text is null or m.status = $1)
      and ($2::text is null or m.public_membership_id ilike $2 or a.public_application_id ilike $2 or m.member_reference ilike $2 or l.full_name ilike $2 or coalesce(pt.partner_code,'') ilike $2)
      and ($3::timestamptz is null or (m.created_at, m.public_membership_id) < ($3::timestamptz, $4::text))
    order by m.created_at desc, m.public_membership_id desc
    limit $5
  `, [status, search, cursor?.createdAt || null, cursor?.publicId || "", limit + 1]);

  const hasMore = result.rows.length > limit;
  const items = result.rows.slice(0, limit).map((row) => ({
    membershipId: row.public_membership_id,
    applicationId: row.public_application_id,
    memberReference: row.member_reference,
    membershipCode: row.membership_code,
    status: row.status,
    activatedAt: optionalIso(row.activated_at),
    cancelledAt: optionalIso(row.cancelled_at),
    createdAt: asIso(row.created_at),
    customerName: row.full_name,
    partnerCode: row.partner_code,
    paymentStage: row.payment_stage,
  }));
  const last = items.at(-1);
  return { items, nextCursor: hasMore && last ? encodeCursor({ createdAt: last.createdAt, publicId: last.membershipId }) : null };
}
