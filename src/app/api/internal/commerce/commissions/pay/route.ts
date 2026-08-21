import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireOperatorMutation } from "@/lib/operatorSecurity";
import { markCommissionPaid } from "@/lib/partnerCommissionLedger";
import { partnerCommissionStore, partnerCommissionStoreAvailable } from "@/lib/partnerCommissionStore";

const MAX_BODY_BYTES = 2_000;
const ALLOWED_FIELDS = new Set(["transactionId", "payoutBatchId", "payoutReference"]);

function cleanString(value: unknown, max = 200): string {
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
  if (Object.keys(body).some((field) => !ALLOWED_FIELDS.has(field))) return NextResponse.json({ status: "invalid", message: "Unexpected commission payout fields were supplied." }, { status: 400 });

  const transactionId = cleanString(body.transactionId, 100);
  const payoutBatchId = cleanString(body.payoutBatchId, 100);
  const payoutReference = cleanString(body.payoutReference, 180);
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(transactionId) || !payoutBatchId || !payoutReference) {
    return NextResponse.json({ status: "invalid", message: "transactionId, payoutBatchId and payoutReference are required." }, { status: 400 });
  }

  const store = partnerCommissionStore();
  const recordResult = await store.get(transactionId);
  if (recordResult.status === "unavailable") return NextResponse.json({ status: "ledger_unavailable", message: recordResult.reason }, { status: 503 });
  if (recordResult.status === "conflict") return NextResponse.json({ status: "conflict", message: recordResult.reason }, { status: 409 });
  if (!recordResult.value) return NextResponse.json({ status: "not_found", message: "Commission transaction was not found." }, { status: 404 });

  const existing = recordResult.value.transaction;
  if (existing.status === "Paid") {
    if (existing.payoutBatchId === payoutBatchId && existing.payoutReference === payoutReference && existing.paidBy === operator.actor && existing.paidAt) {
      return NextResponse.json({ status: "already_paid", transactionId, approvedCommissionMinorUnits: existing.approvedCommissionMinorUnits, currency: existing.currency, payoutBatchId: existing.payoutBatchId, payoutReference: existing.payoutReference, paidAt: existing.paidAt });
    }
    return NextResponse.json({ status: "conflict", message: "Commission was already paid under different payout evidence." }, { status: 409 });
  }

  try {
    const transition = markCommissionPaid({ transaction: existing, payoutBatchId, payoutReference, paidBy: operator.actor, paidAt: operator.occurredAt });
    const saved = await store.saveTransition(transition);
    if (saved.status === "unavailable") return NextResponse.json({ status: "ledger_unavailable", message: saved.reason }, { status: 503 });
    if (saved.status === "conflict") return NextResponse.json({ status: "conflict", message: saved.reason }, { status: 409 });
    return NextResponse.json({ status: "paid", transactionId, approvedCommissionMinorUnits: saved.value.transaction.approvedCommissionMinorUnits, currency: saved.value.transaction.currency, payoutBatchId: saved.value.transaction.payoutBatchId, payoutReference: saved.value.transaction.payoutReference, paidAt: saved.value.transaction.paidAt });
  } catch (error) {
    return NextResponse.json({ status: "invalid_state", message: error instanceof Error ? error.message : "Commission payout failed." }, { status: 409 });
  }
}
