import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { assertLeadCanProgress } from "@/lib/partnerLeadRegistry";
import { partnerLeadRegistryStore, partnerLeadRegistryStoreAvailable } from "@/lib/partnerLeadRegistryStore";

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET(request: NextRequest) {
  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", message: "Internal Sales Partner controls are not configured." }, { status: 503 });
  }
  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
  }

  const leadId = cleanString(request.nextUrl.searchParams.get("leadId"), 80);
  if (!/^[A-Za-z0-9_-]{6,80}$/.test(leadId)) {
    return NextResponse.json({ status: "invalid", message: "A valid leadId is required." }, { status: 400 });
  }

  if (!partnerLeadRegistryStoreAvailable()) {
    return NextResponse.json(
      { status: "registry_unavailable", message: "Partner Lead Registry persistence is not configured." },
      { status: 503 },
    );
  }

  const store = partnerLeadRegistryStore();
  const result = await store.get(leadId);
  if (result.status === "unavailable") {
    return NextResponse.json({ status: "registry_unavailable", message: result.reason }, { status: 503 });
  }
  if (result.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: result.reason }, { status: 409 });
  }
  if (!result.value) {
    return NextResponse.json({ status: "not_found", message: "Partner lead was not found." }, { status: 404 });
  }

  let canProgress = true;
  let progressBlocker: string | null = null;
  try {
    assertLeadCanProgress(result.value.lead);
  } catch (error) {
    canProgress = false;
    progressBlocker = error instanceof Error ? error.message : "Lead cannot progress.";
  }

  const ownershipEvents = [...result.value.ownershipEvents]
    .sort((left, right) => Date.parse(left.occurredAt) - Date.parse(right.occurredAt))
    .map((event) => ({
      eventId: event.eventId,
      previousPartnerId: event.previousPartnerId || null,
      newPartnerId: event.newPartnerId,
      reason: event.reason,
      approvedBy: event.approvedBy,
      occurredAt: event.occurredAt,
    }));

  const lifecycleEvents = [...result.value.lifecycleEvents]
    .sort((left, right) => Date.parse(left.occurredAt) - Date.parse(right.occurredAt))
    .map((event) => ({
      eventId: event.eventId,
      previousStage: event.previousStage,
      newStage: event.newStage,
      actor: event.actor,
      reason: event.reason || null,
      occurredAt: event.occurredAt,
    }));

  return NextResponse.json({
    status: "ok",
    lead: {
      leadId: result.value.lead.leadId,
      currentPartnerId: result.value.lead.currentPartnerId,
      registeredByPartnerId: result.value.lead.registeredByPartnerId,
      registeredAt: result.value.lead.registeredAt,
      stage: result.value.lead.stage,
      source: result.value.lead.source || null,
      campaign: result.value.lead.campaign || null,
      duplicateStatus: result.value.lead.duplicateStatus || "Unchecked",
      consentCapturedAt: result.value.lead.consentCapturedAt || null,
      consentVersion: result.value.consentVersion,
      canProgress,
      progressBlocker,
      duplicateDecision: result.value.duplicateDecision || null,
      ownershipEvents,
      lifecycleEvents,
    },
  });
}
