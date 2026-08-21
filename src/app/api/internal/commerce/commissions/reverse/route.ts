import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireOperatorMutation } from "@/lib/operatorSecurity";
import { reverseCommissionForCancellation } from "@/lib/partnerCommissionLedger";
import { partnerCommissionStore, partnerCommissionStoreAvailable } from "@/lib/partnerCommissionStore";

const MAX_BODY_BYTES = 2_000;
const ALLOWED_FIELDS = new Set(["transactionId", "reason"]);

function cleanString(value: unknown, max = 300): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const operator = await requireOperatorMutation(request, { roles: ["finance"], requireStepUp: true });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });
  if (!partnerCommissionStoreAvailable()) return NextResponse.json({ status: "ledger_unavailable", message: "Commission ledger persistence is not configured." }, { status: 503 });

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });

  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; }
  catch { return NextResponse.json({ status: "invalid", message: "A JSON request body is required." }, { status: 400 }); }
  if (Object.keys(body).some((field) => !ALLOWED_FIELDS.has(field))) return NextResponse.json({ status: "invalid", message: "Unexpected commission reversal fields were supplied." }, { status: 400 });

  const transactionId = cleanString(body.transactionId, 100);
  const reason = cleanString(body.reason, 300);
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(transactionId) || !reason) return NextResponse.json({ status: "invalid", message: "transactionId and reversal reason are required." }, { status: 400 });

  const store = partnerCommissionStore();
  const existingResult = await store.get(transactionId);
  if (existingResult.status === "unavailable") return NextResponse.json({ status: "ledger_unavailable", message: existingResult.reason }, { status: 503 });
  if (existingResult.status === "conflict") return NextResponse.json({ status: "conflict", message: existingResult.reason }, { status: 409 });
  if (!existingResult.value) return NextResponse.json({ status: "not_found", message: "Commission transaction was not found." }, { status: 404 });

  const existing = existingResult.value;
  if (existing.transaction.status === "Reversed") {
    const reversalEvent = [...existing.events].reverse().find((event) => event.nextStatus === "Reversed");
    if (existing.transaction.reversalReason === reason && existing.transaction.reversedAt && reversalEvent?.actor === operator.actor) {
      return NextResponse.json({ status: "already_reversed", transactionId, approvedCommissionMinorUnits: existing.transaction.approvedCommissionMinorUnits, clawbackMinorUnits: existing.transaction.clawbackMinorUnits || 0, currency: existing.transaction.currency, reversedAt: existing.transaction.reversedAt });
    }
    return NextResponse.json({ status: "conflict", message: "Commission was already reversed under different reversal evidence." }, { status: 409 });
  }

  try {
    const transition = reverseCommissionForCancellation({ transaction: existing.transaction, actor: operator.actor, occurredAt: operator.occurredAt, reason });
    const saved = await store.saveTransition(transition);
    if (saved.status === "unavailable") return NextResponse.json({ status: "ledger_unavailable", message: saved.reason }, { status: 503 });
    if (saved.status === "conflict") return NextResponse.json({ status: "conflict", message: saved.reason }, { status: 409 });
    return NextResponse.json({ status: "reversed", transactionId, approvedCommissionMinorUnits: saved.value.transaction.approvedCommissionMinorUnits, clawbackMinorUnits: saved.value.transaction.clawbackMinorUnits || 0, currency: saved.value.transaction.currency, reversedAt: saved.value.transaction.reversedAt });
  } catch (error) {
    return NextResponse.json({ status: "invalid_state", message: error instanceof Error ? error.message : "Commission reversal failed." }, { status: 409 });
  }
}
