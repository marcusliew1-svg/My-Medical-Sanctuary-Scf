import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { financeApiConfigured, isValidFinanceBearerToken } from "@/lib/internalApiAuth";
import { approveCommissionTransaction } from "@/lib/partnerCommissionLedger";
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
  const approvedBy = cleanString(body.approvedBy, 160);
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(transactionId) || !approvedBy) {
    return NextResponse.json({ status: "invalid", message: "Valid transactionId and approvedBy values are required." }, { status: 400 });
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
    const approvedAt = new Date().toISOString();
    const transition = approveCommissionTransaction({
      transaction: recordResult.value.transaction,
      approvedBy,
      approvedAt,
    });
    const saved = await store.saveTransition(transition);
    if (saved.status === "unavailable") {
      return NextResponse.json({ status: "ledger_unavailable", message: saved.reason }, { status: 503 });
    }
    if (saved.status === "conflict") {
      return NextResponse.json({ status: "conflict", message: saved.reason }, { status: 409 });
    }
    return NextResponse.json({
      status: "approved",
      transactionId,
      approvedCommissionMinorUnits: saved.value.transaction.approvedCommissionMinorUnits,
      currency: saved.value.transaction.currency,
      approvedAt,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "invalid_state", message: error instanceof Error ? error.message : "Commission approval failed." },
      { status: 409 },
    );
  }
}
