import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authorizePartnerHubCapability } from "@/lib/partnerHubAuthorization";
import { protectPartnerHubMutation } from "@/lib/partnerHubMutationSecurity";
import { transitionPartnerLeadStage } from "@/lib/partnerLeadLifecyclePostgres";

export const dynamic = "force-dynamic";
const MAX_BODY_BYTES = 4_000;
const ALLOWED_FIELDS = new Set(["leadId","expectedStage","nextStage","occurredAt","nextActionAt"]);
const EXPECTED_STAGES = new Set(["Registered","Accepted","Contacted","Qualified"]);
const NEXT_STAGES = new Set(["Accepted","Contacted","Qualified","Lost","Withdrawn"]);

function clean(value: unknown, max = 120): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const auth = await authorizePartnerHubCapability(request, "UPDATE_LEAD_STAGE");
  if (auth.status === "unauthenticated") {
    return NextResponse.json({ status: "unauthorized", message: "Partner authentication is required." }, { status: 401 });
  }
  if (auth.status === "forbidden") {
    return NextResponse.json({ status: "forbidden", message: auth.reason }, { status: 403 });
  }
  if (auth.status === "not_found") {
    return NextResponse.json({ status: "not_found", message: auth.reason }, { status: 404 });
  }
  if (auth.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: auth.reason }, { status: 409 });
  }
  if (auth.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", message: auth.reason }, { status: 503 });
  }

  const security = await protectPartnerHubMutation(request, auth.auth.claims);
  if (security.status === "forbidden") {
    return NextResponse.json({ status: "forbidden", message: security.reason }, { status: 403 });
  }
  if (security.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", message: security.reason }, { status: 503 });
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
    return NextResponse.json({ status: "invalid", message: "Lead stage update contains unsupported fields." }, { status: 400 });
  }

  const leadId = clean(body.leadId, 100);
  const expectedStage = clean(body.expectedStage, 40);
  const nextStage = clean(body.nextStage, 40);
  const occurredAtRaw = clean(body.occurredAt, 80);
  const nextActionAtRaw = clean(body.nextActionAt, 80);
  if (!leadId || !EXPECTED_STAGES.has(expectedStage) || !NEXT_STAGES.has(nextStage) || Number.isNaN(Date.parse(occurredAtRaw))) {
    return NextResponse.json({ status: "invalid", message: "Valid leadId, expectedStage, nextStage and occurredAt are required." }, { status: 400 });
  }
  if (nextActionAtRaw && Number.isNaN(Date.parse(nextActionAtRaw))) {
    return NextResponse.json({ status: "invalid", message: "nextActionAt must be a valid timestamp when supplied." }, { status: 400 });
  }

  const result = await transitionPartnerLeadStage({
    partnerId: auth.partnerId,
    leadId,
    expectedStage,
    nextStage,
    occurredAt: new Date(occurredAtRaw).toISOString(),
    nextActionAt: nextActionAtRaw ? new Date(nextActionAtRaw).toISOString() : undefined,
  });

  if (result.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", message: result.reason }, { status: 503 });
  }
  if (result.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: result.reason }, { status: 409 });
  }

  return NextResponse.json(result, {
    headers: { "Cache-Control": "private, no-store, max-age=0", Pragma: "no-cache" },
  });
}
