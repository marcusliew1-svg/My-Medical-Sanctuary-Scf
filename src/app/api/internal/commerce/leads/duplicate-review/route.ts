import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireOperatorMutation } from "@/lib/operatorSecurity";
import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";

export const dynamic = "force-dynamic";
const MAX_BODY_BYTES = 8_000;
const ALLOWED_STATUSES = new Set(["Clear", "Possible Duplicate", "Confirmed Duplicate"]);
const ALLOWED_FIELDS = new Set(["leadId", "status", "matchedLeadIds"]);

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function conflictReason(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  const known = [
    "invalid_lead_duplicate_review_input",
    "clear_duplicate_review_cannot_include_matches",
    "duplicate_review_requires_matches",
    "invalid_duplicate_match_reference",
    "lead_not_found",
    "duplicate_review_locked_after_application",
    "duplicate_match_lead_not_found",
  ];
  return known.find((code) => message.includes(code)) || "lead_duplicate_review_conflict";
}

export async function POST(request: NextRequest) {
  const operator = await requireOperatorMutation(request, { roles: ["operations"] });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });
  if (!mmsCommercialDatabaseClientAvailable()) {
    return NextResponse.json({ status: "unavailable", message: "Dedicated MMS commercial PostgreSQL runtime is not operational." }, { status: 503 });
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ status: "invalid", message: "A JSON request body is required." }, { status: 400 });
  }

  if (Object.keys(body).some((key) => !ALLOWED_FIELDS.has(key))) {
    return NextResponse.json({ status: "invalid", message: "Unexpected duplicate-review field." }, { status: 400 });
  }

  const leadId = clean(body.leadId, 100);
  const status = clean(body.status, 40);
  const matchedLeadIds = Array.isArray(body.matchedLeadIds)
    ? [...new Set(body.matchedLeadIds.map((value) => clean(value, 100)).filter(Boolean))].slice(0, 20)
    : [];

  if (!leadId || !ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ status: "invalid", message: "leadId and a valid status are required." }, { status: 400 });
  }
  if ((status === "Clear" && matchedLeadIds.length > 0) || (status !== "Clear" && matchedLeadIds.length === 0)) {
    return NextResponse.json({ status: "invalid", message: "Duplicate match references do not agree with the selected review status." }, { status: 400 });
  }

  try {
    const result = await mmsCommercialDatabaseClient().query<{
      public_lead_id: string;
      duplicate_status: string;
      lead_stage: string;
      replayed: boolean;
    }>(
      `select * from mms_commercial.review_lead_duplicate_status($1,$2,$3::text[],$4,$5::timestamptz)`,
      [leadId, status, matchedLeadIds, operator.actor, operator.occurredAt],
    );
    const row = result.rows[0];
    if (!row) return NextResponse.json({ status: "conflict", message: "Duplicate review returned no result." }, { status: 409 });
    return NextResponse.json(
      {
        status: "reviewed",
        leadId: row.public_lead_id,
        duplicateStatus: row.duplicate_status,
        leadStage: row.lead_stage,
        replayed: Boolean(row.replayed),
      },
      { headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" } },
    );
  } catch (error) {
    return NextResponse.json({ status: "conflict", message: conflictReason(error) }, { status: 409 });
  }
}
