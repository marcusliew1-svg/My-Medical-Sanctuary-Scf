import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireOperatorMutation } from "@/lib/operatorSecurity";
import { transferCommercialLeadOwnership } from "@/lib/partnerLeadOwnershipPostgres";

export const dynamic = "force-dynamic";
const MAX_BODY_BYTES = 4_000;
const ALLOWED_FIELDS = new Set(["leadId", "expectedPartnerId", "newPartnerId", "reason"]);

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const operator = await requireOperatorMutation(request, { roles: ["operations"], requireStepUp: true });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });

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
    return NextResponse.json({ status: "invalid", message: "Unexpected lead ownership transfer field." }, { status: 400 });
  }

  const leadId = clean(body.leadId, 100);
  const expectedPartnerId = clean(body.expectedPartnerId, 40);
  const newPartnerId = clean(body.newPartnerId, 40);
  const reason = clean(body.reason, 500);

  if (!leadId || !expectedPartnerId || !newPartnerId || !reason) {
    return NextResponse.json({ status: "invalid", message: "leadId, expectedPartnerId, newPartnerId and reason are required." }, { status: 400 });
  }

  const result = await transferCommercialLeadOwnership({
    leadId,
    expectedPartnerId,
    newPartnerId,
    approvedBy: operator.actor,
    occurredAt: operator.occurredAt,
    reason,
  });

  if (result.status === "unavailable") {
    return NextResponse.json({ status: "unavailable", message: result.reason }, { status: 503 });
  }
  if (result.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: result.reason }, { status: 409 });
  }

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" },
  });
}
