import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { createLeadOwnershipTransfer } from "@/lib/partnerCommercialModel";
import { validateLeadOwnershipEvent } from "@/lib/partnerLeadRegistry";
import { partnerLeadRegistryStore, partnerLeadRegistryStoreAvailable } from "@/lib/partnerLeadRegistryStore";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

const MAX_BODY_BYTES = 8_000;

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", message: "Internal Sales Partner controls are not configured." }, { status: 503 });
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

  const leadId = cleanString(body.leadId, 80);
  const newPartnerId = normalisePartnerId(cleanString(body.newPartnerId, 40));
  const reason = cleanString(body.reason, 500);
  const approvedBy = cleanString(body.approvedBy, 160);

  if (!/^[A-Za-z0-9_-]{6,80}$/.test(leadId) || !newPartnerId || !reason || !approvedBy) {
    return NextResponse.json({ status: "invalid", message: "Ownership-transfer fields are missing or invalid." }, { status: 400 });
  }

  if (!partnerLeadRegistryStoreAvailable()) {
    return NextResponse.json(
      { status: "registry_unavailable", message: "Partner Lead Registry persistence is not configured." },
      { status: 503 },
    );
  }

  const store = partnerLeadRegistryStore();
  const current = await store.get(leadId);
  if (current.status === "unavailable") {
    return NextResponse.json({ status: "registry_unavailable", message: current.reason }, { status: 503 });
  }
  if (current.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: current.reason }, { status: 409 });
  }
  if (!current.value) {
    return NextResponse.json({ status: "not_found", message: "Partner lead was not found." }, { status: 404 });
  }

  if (current.value.lead.currentPartnerId === newPartnerId) {
    return NextResponse.json({ status: "no_change", message: "The lead is already owned by this Partner ID." }, { status: 409 });
  }
  if (current.value.lead.stage === "Duplicate" || current.value.lead.duplicateStatus === "Confirmed Duplicate") {
    return NextResponse.json({ status: "blocked", message: "Confirmed duplicate leads cannot be transferred as active lead records." }, { status: 409 });
  }

  const occurredAt = new Date().toISOString();
  const eventId = `OWN-${leadId}-${Date.now()}`;
  let transfer;
  try {
    transfer = createLeadOwnershipTransfer({
      eventId,
      lead: current.value.lead,
      newPartnerId,
      reason,
      approvedBy,
      occurredAt,
    });
    validateLeadOwnershipEvent(transfer.event);
  } catch (error) {
    return NextResponse.json(
      { status: "invalid", message: error instanceof Error ? error.message : "Ownership transfer is invalid." },
      { status: 400 },
    );
  }

  const saved = await store.appendOwnershipTransfer(transfer.lead, transfer.event);
  if (saved.status === "unavailable") {
    return NextResponse.json({ status: "registry_unavailable", message: saved.reason }, { status: 503 });
  }
  if (saved.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: saved.reason }, { status: 409 });
  }

  return NextResponse.json({
    status: "transferred",
    leadId,
    previousPartnerId: transfer.event.previousPartnerId || null,
    newPartnerId: transfer.event.newPartnerId,
    eventId: transfer.event.eventId,
    occurredAt,
  });
}
