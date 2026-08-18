import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { financeApiConfigured, isValidFinanceBearerToken } from "@/lib/internalApiAuth";
import { reverseCommissionForCancellation } from "@/lib/partnerCommissionLedger";
import { partnerCommissionStore, partnerCommissionStoreAvailable } from "@/lib/partnerCommissionStore";

function cleanString(value: unknown, max = 300): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  if (!financeApiConfigured()) {
    return NextResponse.json({ status: "unavailable", message: "Finance controls are not configured." }, { status: 503 });
  }
  if (!isValidFinanceBearerToken(request.headers.get("authorization"))) {
    return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
  }
  if (!partnerCommissionStoreAvailable()) {
    return NextResponse.json({ status: "ledger_unavailable", message: "Commission ledger persistence is not configured." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ status: "invalid", message: "A JSON request body is required." }, { status: 400 });
  }

  const transactionId = cleanString(body.transactionId, 100);
  const actor = cleanString(body.actor, 160);
  const reason = cleanString(body.reason, 300);
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(transactionId) || !actor || !reason) {
    return NextResponse.json({ status: "invalid", message: "transactionId, actor and reversal reason are required." }, { status: 400 });
  }

  const store = partnerCommissionStore();
  const existing = await store.get(transactionId);
  if (existing.status === "unavailable") return NextResponse.json({ status: "ledger_unavailable", message: existing.reason }, { status: 503 });
  if (existing.status === "conflict") return NextResponse.json({ status: "conflict", message: existing.reason }, { status: 409 });
  if (!existing.value) return NextResponse.json({ status: "not_found", message: "Commission transaction was not found." }, { status: 404 });

  try {
    const occurredAt = new Date().toISOString();
    const transition = reverseCommissionForCancellation({ transaction: existing.value.transaction, actor, occurredAt, reason });
    const saved = await store.saveTransition(transition);
    if (saved.status === "unavailable") return NextResponse.json({ status: "ledger_unavailable", message: saved.reason }, { status: 503 });
    if (saved.status === "conflict") return NextResponse.json({ status: "conflict", message: saved.reason }, { status: 409 });
    return NextResponse.json({
      status: "reversed",
      transactionId,
      approvedCommissionMinorUnits: 0,
      clawbackMinorUnits: saved.value.transaction.clawbackMinorUnits || 0,
      currency: saved.value.transaction.currency,
      reversedAt: occurredAt,
    });
  } catch (error) {
    return NextResponse.json({ status: "invalid_state", message: error instanceof Error ? error.message : "Commission reversal failed." }, { status: 409 });
  }
}
