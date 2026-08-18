import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { LEAD_STAGES, type LeadStage } from "@/lib/partnerCommercialModel";
import { createPartnerLeadLifecycleEvent } from "@/lib/partnerLeadLifecycle";
import { partnerLeadRegistryStore, partnerLeadRegistryStoreAvailable } from "@/lib/partnerLeadRegistryStore";

const MAX_BODY_BYTES = 8_000;
const leadStages = new Set<string>(LEAD_STAGES);

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isLeadStage(value: unknown): value is LeadStage {
  return typeof value === "string" && leadStages.has(value);
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
  const nextStage = body.nextStage;
  const actor = cleanString(body.actor, 160);
  const reason = cleanString(body.reason, 500);

  if (!/^[A-Za-z0-9_-]{6,80}$/.test(leadId) || !isLeadStage(nextStage) || !actor) {
    return NextResponse.json({ status: "invalid", message: "Lead-transition fields are missing or invalid." }, { status: 400 });
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

  if (current.value.lead.stage === nextStage) {
    return NextResponse.json({ status: "no_change", leadId, stage: nextStage });
  }

  const occurredAt = new Date().toISOString();
  const eventId = `STAGE-${leadId}-${Date.now()}`;
  let transition;
  try {
    transition = createPartnerLeadLifecycleEvent({
      eventId,
      lead: current.value.lead,
      newStage: nextStage,
      actor,
      reason: reason || undefined,
      occurredAt,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "blocked", message: error instanceof Error ? error.message : "Lead transition is not permitted." },
      { status: 409 },
    );
  }

  const saved = await store.appendLifecycleTransition(transition.lead, transition.event);
  if (saved.status === "unavailable") {
    return NextResponse.json({ status: "registry_unavailable", message: saved.reason }, { status: 503 });
  }
  if (saved.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: saved.reason }, { status: 409 });
  }

  return NextResponse.json({
    status: "updated",
    leadId,
    previousStage: transition.event.previousStage,
    stage: transition.event.newStage,
    eventId: transition.event.eventId,
    occurredAt,
  });
}
