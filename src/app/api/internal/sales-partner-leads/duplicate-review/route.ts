import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { applyDuplicateDecision, type PartnerLeadDuplicateDecision } from "@/lib/partnerLeadRegistry";
import { partnerLeadRegistryStore, partnerLeadRegistryStoreAvailable } from "@/lib/partnerLeadRegistryStore";

const MAX_BODY_BYTES = 8_000;
const duplicateStatuses = new Set<PartnerLeadDuplicateDecision["status"]>([
  "Clear",
  "Possible Duplicate",
  "Confirmed Duplicate",
]);

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanLeadIds(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length > 20) return null;
  const ids = value.map((item) => cleanString(item, 80)).filter(Boolean);
  if (ids.some((id) => !/^[A-Za-z0-9_-]{6,80}$/.test(id))) return null;
  return [...new Set(ids)];
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
  const status = cleanString(body.status, 40) as PartnerLeadDuplicateDecision["status"];
  const matchedLeadIds = cleanLeadIds(body.matchedLeadIds);
  const checkedBy = cleanString(body.checkedBy, 160);

  if (!/^[A-Za-z0-9_-]{6,80}$/.test(leadId) || !duplicateStatuses.has(status) || !matchedLeadIds || !checkedBy) {
    return NextResponse.json({ status: "invalid", message: "Duplicate-review fields are missing or invalid." }, { status: 400 });
  }
  if (matchedLeadIds.includes(leadId)) {
    return NextResponse.json({ status: "invalid", message: "A lead cannot be listed as a duplicate of itself." }, { status: 400 });
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

  const decision: PartnerLeadDuplicateDecision = {
    status,
    matchedLeadIds,
    checkedAt: new Date().toISOString(),
    checkedBy,
  };

  try {
    applyDuplicateDecision(current.value.lead, decision);
  } catch (error) {
    return NextResponse.json(
      { status: "invalid", message: error instanceof Error ? error.message : "Duplicate decision is invalid." },
      { status: 400 },
    );
  }

  const saved = await store.recordDuplicateDecision(leadId, decision);
  if (saved.status === "unavailable") {
    return NextResponse.json({ status: "registry_unavailable", message: saved.reason }, { status: 503 });
  }
  if (saved.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: saved.reason }, { status: 409 });
  }

  return NextResponse.json({
    status: "updated",
    leadId,
    duplicateStatus: saved.value.lead.duplicateStatus,
    leadStage: saved.value.lead.stage,
    checkedAt: decision.checkedAt,
  });
}
