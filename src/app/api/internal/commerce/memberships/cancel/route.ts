import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";
import { requireOperatorMutation } from "@/lib/operatorSecurity";

const MAX_BODY_BYTES = 4_000;
const ALLOWED_FIELDS = new Set(["applicationId", "reason"]);

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const operator = await requireOperatorMutation(request, { roles: ["operations", "finance"], requireStepUp: true });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });
  if (!mmsCommercialDatabaseClientAvailable()) return NextResponse.json({ status: "store_unavailable", message: "MMS commercial database is not configured." }, { status: 503 });

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });

  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; }
  catch { return NextResponse.json({ status: "invalid", message: "A JSON request body is required." }, { status: 400 }); }

  if (Object.keys(body).some((field) => !ALLOWED_FIELDS.has(field))) return NextResponse.json({ status: "invalid", message: "Only commercial cancellation fields are accepted." }, { status: 400 });

  const applicationId = cleanString(body.applicationId, 80);
  const reason = cleanString(body.reason, 500);
  if (!applicationId || !reason) return NextResponse.json({ status: "invalid", message: "applicationId and reason are required." }, { status: 400 });

  try {
    const result = await mmsCommercialDatabaseClient().query<{
      public_membership_id: string;
      membership_status: string;
      commission_transaction_id: string | null;
      commission_status: string | null;
      clawback_minor_units: number | string;
      replayed: boolean;
    }>(
      "select * from mms_commercial.cancel_membership_and_reverse_commission($1,$2,$3,$4)",
      [applicationId, operator.actor, operator.occurredAt, reason],
    );
    const row = result.rows[0];
    if (!row) return NextResponse.json({ status: "conflict", message: "Membership cancellation did not return durable state." }, { status: 409 });

    return NextResponse.json({
      status: row.replayed ? "already_cancelled" : "cancelled",
      applicationId,
      membershipId: row.public_membership_id,
      membershipStatus: row.membership_status,
      commissionTransactionId: row.commission_transaction_id,
      commissionStatus: row.commission_status,
      clawbackMinorUnits: Number(row.clawback_minor_units || 0),
      cancelledAt: operator.occurredAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "membership_cancellation_failed";
    if (/(not_found|not_allowed|precedes|replay_conflict|conflict)/.test(message)) return NextResponse.json({ status: "conflict", message: "Membership cancellation conflicts with current commercial state." }, { status: 409 });
    return NextResponse.json({ status: "store_unavailable", message: "Membership cancellation could not be persisted." }, { status: 503 });
  }
}
