import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { financeApiConfigured, isValidFinanceBearerToken } from "@/lib/internalApiAuth";
import { markCommissionPaid } from "@/lib/partnerCommissionLedger";
import { partnerCommissionStore, partnerCommissionStoreAvailable } from "@/lib/partnerCommissionStore";

function cleanString(value: unknown, max = 200): string {
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
    return NextResponse.json(
      { status: "ledger_unavailable", message: "Commission ledger persistence is not configured." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ status: "invalid", message: "A JSON request body is required." }, { status: 400 });
  }

  const transactionId = cleanString(body.transactionId, 100);
  const payoutBatchId = cleanString(body.payoutBatchId, 100);
  const payoutReference = cleanString(body.payoutReference, 180);
  const paidBy = cleanString(body.paidBy, 160);
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(transactionId) || !payoutBatchId || !payoutReference || !paidBy) {
    return NextResponse.json(
      { status: "invalid", message: "transactionId, payoutBatchId, payoutReference and paidBy are required." },
      { status: 400 },
    );
  }

  const store = partnerCommissionStore();
  const recordResult = await store.get(transactionId);
  if (recordResult.status === "unavailable") {
    return NextResponse.json({ status: "ledger_unavailable", message: recordResult.reason }, { status: 503 });
  }
  if (recordResult.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: recordResult.reason }, { status: 409 });
  }
  if (!recordResult.value) {
    return NextResponse.json({ status: "not_found", message: "Commission transaction was not found." }, { status: 404 });
  }

  try {
    const paidAt = new Date().toISOString();
    const transition = markCommissionPaid({
      transaction: recordResult.value.transaction,
      payoutBatchId,
      payoutReference,
      paidBy,
      paidAt,
    });
    const saved = await store.saveTransition(transition);
    if (saved.status === "unavailable") {
      return NextResponse.json({ status: "ledger_unavailable", message: saved.reason }, { status: 503 });
    }
    if (saved.status === "conflict") {
      return NextResponse.json({ status: "conflict", message: saved.reason }, { status: 409 });
    }
    return NextResponse.json({
      status: "paid",
      transactionId,
      approvedCommissionMinorUnits: saved.value.transaction.approvedCommissionMinorUnits,
      currency: saved.value.transaction.currency,
      payoutBatchId,
      payoutReference,
      paidAt,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "invalid_state", message: error instanceof Error ? error.message : "Commission payout failed." },
      { status: 409 },
    );
  }
}
