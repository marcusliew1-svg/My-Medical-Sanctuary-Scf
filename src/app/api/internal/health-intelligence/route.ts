import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  healthIntelligenceMutationOriginAllowed,
  healthIntelligenceRequestAuthorized,
} from "@/lib/healthIntelligence/auth";
import {
  healthIntelligenceSnapshot,
  reviewHealthIntelligenceRecord,
  type ReviewDecision,
  type ReviewTargetType,
} from "@/lib/healthIntelligence/store";

export const dynamic = "force-dynamic";
const TARGETS = new Set<ReviewTargetType>([
  "medicine_product",
  "price_observation",
  "generic_relationship",
  "match_review",
  "market_registration",
]);
const DECISIONS = new Set<ReviewDecision>([
  "submit_for_review",
  "verify",
  "reject",
  "publish",
  "unpublish",
  "mark_stale",
  "reverify",
]);

function noStore(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" },
  });
}

export async function GET(request: NextRequest) {
  if (!healthIntelligenceRequestAuthorized(request))
    return noStore({ status: "unauthorized" }, 401);
  try {
    return noStore({
      status: "ready",
      snapshot: await healthIntelligenceSnapshot(),
    });
  } catch {
    return noStore(
      {
        status: "unavailable",
        message: "Health Intelligence data is unavailable.",
      },
      503,
    );
  }
}

export async function POST(request: NextRequest) {
  if (!healthIntelligenceRequestAuthorized(request))
    return noStore({ status: "unauthorized" }, 401);
  if (!healthIntelligenceMutationOriginAllowed(request))
    return noStore(
      { status: "forbidden", message: "Mutation origin was not accepted." },
      403,
    );
  const length = Number.parseInt(
    request.headers.get("content-length") || "0",
    10,
  );
  if (length > 8_192)
    return noStore(
      { status: "invalid", message: "Request body is too large." },
      413,
    );
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const targetType = String(body.targetType || "") as ReviewTargetType;
    const decision = String(body.decision || "") as ReviewDecision;
    const targetId = String(body.targetId || "").trim();
    const notes = String(body.notes || "")
      .trim()
      .slice(0, 1_000);
    if (
      !TARGETS.has(targetType) ||
      !DECISIONS.has(decision) ||
      !/^[a-zA-Z0-9-]{8,64}$/.test(targetId)
    ) {
      return noStore(
        { status: "invalid", message: "Invalid review request." },
        400,
      );
    }
    const snapshot = await reviewHealthIntelligenceRecord({
      targetType,
      targetId,
      decision,
      reviewer: "mms-internal-reviewer",
      notes,
    });
    return noStore({ status: "updated", snapshot });
  } catch (error) {
    const message =
      error instanceof Error &&
      error.message.startsWith("Invalid Health Intelligence transition")
        ? error.message
        : "Health Intelligence review could not be completed.";
    return noStore({ status: "conflict", message }, 409);
  }
}
