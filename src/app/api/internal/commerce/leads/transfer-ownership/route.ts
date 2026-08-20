import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { transferCommercialLeadOwnership } from "@/lib/partnerLeadOwnershipPostgres";

export const dynamic = "force-dynamic";
const MAX_BODY_BYTES = 4_000;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", message: "Internal MMS commercial controls are not configured." }, { status: 503 });
  }
  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
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

  const leadId = clean(body.leadId, 100);
  const expectedPartnerId = clean(body.expectedPartnerId, 40);
  const newPartnerId = clean(body.newPartnerId, 40);
  const approvedBy = clean(body.approvedBy, 160);
  const reason = clean(body.reason, 500);
  const occurredAt = clean(body.occurredAt, 60);

  if (!leadId || !expectedPartnerId || !newPartnerId || !approvedBy || !reason || Number.isNaN(Date.parse(occurredAt))) {
    return NextResponse.json({ status: "invalid", message: "leadId, expectedPartnerId, newPartnerId, approvedBy, occurredAt and reason are required." }, { status: 400 });
  }

  const result = await transferCommercialLeadOwnership({
    leadId,
    expectedPartnerId,
    newPartnerId,
    approvedBy,
    occurredAt: new Date(occurredAt).toISOString(),
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
