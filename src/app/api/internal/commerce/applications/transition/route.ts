import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { APPLICATION_STAGES, type ApplicationStage } from "@/lib/partnerCommercialModel";
import { partnerCommerceStore, partnerCommerceStoreAvailable } from "@/lib/partnerCommerceStore";

const MAX_BODY_BYTES = 4_000;
const applicationStages = new Set<string>(APPLICATION_STAGES);
const allowedNextStages = new Set<ApplicationStage>([
  "Under Review",
  "Documents Outstanding",
  "Approved",
  "Payment Pending",
  "Rejected",
  "Withdrawn",
]);

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", message: "Internal commerce controls are not configured." }, { status: 503 });
  }
  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
  }
  if (!partnerCommerceStoreAvailable()) {
    return NextResponse.json({ status: "store_unavailable", message: "MMS commercial workflow persistence is not configured." }, { status: 503 });
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

  const applicationId = cleanString(body.applicationId, 80);
  const expectedStage = cleanString(body.expectedStage, 40);
  const nextStage = cleanString(body.nextStage, 40);
  const actor = cleanString(body.actor, 160);
  const occurredAt = cleanString(body.occurredAt, 80);
  const reason = cleanString(body.reason, 500);

  if (
    !applicationId ||
    !applicationStages.has(expectedStage) ||
    !allowedNextStages.has(nextStage as ApplicationStage) ||
    !actor ||
    !reason ||
    !occurredAt ||
    Number.isNaN(Date.parse(occurredAt))
  ) {
    return NextResponse.json({ status: "invalid", message: "Required application transition fields are missing or invalid." }, { status: 400 });
  }

  const result = await partnerCommerceStore().transitionApplication({
    applicationId,
    expectedStage: expectedStage as ApplicationStage,
    nextStage: nextStage as ApplicationStage,
    actor,
    occurredAt,
    reason,
  });

  if (result.status === "unavailable") {
    return NextResponse.json({ status: "store_unavailable", message: result.reason }, { status: 503 });
  }
  if (result.status === "conflict") {
    return NextResponse.json({ status: "transition_conflict", message: result.reason }, { status: 409 });
  }

  return NextResponse.json({
    status: result.value.replayed ? "already_applied" : "updated",
    replayed: result.value.replayed,
    applicationId: result.value.record.application.applicationId,
    stage: result.value.record.application.stage,
    approvedAt: result.value.record.application.approvedAt || null,
  });
}
