import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { applyCrmQueueAction, type CrmQueueAction } from "@/lib/crmOperationsStore";
import { requireOperatorMutation } from "@/lib/operatorSecurity";

export const dynamic = "force-dynamic";
const CLOSE_STATES = new Set(["Not Proceeding", "Do Not Contact", "Spam", "Duplicate"]);

function parseAction(value: unknown): CrmQueueAction | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  if (body.kind === "assign") return { kind: "assign", ownerId: String(body.ownerId || "") };
  if (body.kind === "contact") return { kind: "contact" };
  if (body.kind === "next_action") return { kind: "next_action", nextAction: String(body.nextAction || ""), nextActionDue: String(body.nextActionDue || "") };
  if (body.kind === "escalate") return { kind: "escalate", reason: String(body.reason || "") };
  if (body.kind === "close" && CLOSE_STATES.has(String(body.status))) {
    return { kind: "close", reason: String(body.reason || ""), status: String(body.status) as Extract<CrmQueueAction, { kind: "close" }>["status"] };
  }
  return null;
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ publicEnquiryId: string }> }) {
  const operator = await requireOperatorMutation(request, { roles: ["operations"] });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const action = parseAction(body);
  if (!action) return NextResponse.json({ status: "invalid", message: "Administrative queue action is invalid." }, { status: 400 });
  const { publicEnquiryId } = await context.params;
  if (!/^MMSE-[a-f0-9]{32}$/.test(publicEnquiryId)) return NextResponse.json({ status: "invalid", message: "CRM enquiry ID is invalid." }, { status: 400 });
  try {
    const approvedAction = action.kind === "assign" && action.ownerId === "self" ? { ...action, ownerId: operator.actor } : action;
    await applyCrmQueueAction({
      publicEnquiryId, action: approvedAction, actorId: operator.actor,
      suggestionSource: body?.applyAiAdvisory === true ? "AI Advisory" : "Human",
    });
    return NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch {
    return NextResponse.json({ status: "error", message: "The administrative CRM action could not be applied safely." }, { status: 409 });
  }
}
