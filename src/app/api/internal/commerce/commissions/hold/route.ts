import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireOperatorMutation } from "@/lib/operatorSecurity";
import type { CommissionLedgerEvent, CommissionTransaction } from "@/lib/partnerCommissionLedger";
import { partnerCommissionStore, partnerCommissionStoreAvailable } from "@/lib/partnerCommissionStore";

const MAX_BODY_BYTES = 2_000;
const ALLOWED_FIELDS = new Set(["transactionId", "action", "reason"]);

function cleanString(value: unknown, max = 300): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const operator = await requireOperatorMutation(request, { roles: ["finance"] });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });
  if (!partnerCommissionStoreAvailable()) return NextResponse.json({ status: "ledger_unavailable", message: "Commission ledger persistence is not configured." }, { status: 503 });

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });

  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; }
  catch { return NextResponse.json({ status: "invalid", message: "A JSON request body is required." }, { status: 400 }); }
  if (Object.keys(body).some((field) => !ALLOWED_FIELDS.has(field))) return NextResponse.json({ status: "invalid", message: "Unexpected commission hold fields were supplied." }, { status: 400 });

  const transactionId = cleanString(body.transactionId, 100);
  const action = cleanString(body.action, 20).toLowerCase();
  const reason = cleanString(body.reason, 300);
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(transactionId) || !["hold", "release"].includes(action) || !reason) {
    return NextResponse.json({ status: "invalid", message: "transactionId, action (hold/release) and reason are required." }, { status: 400 });
  }

  const store = partnerCommissionStore();
  const existingResult = await store.get(transactionId);
  if (existingResult.status === "unavailable") return NextResponse.json({ status: "ledger_unavailable", message: existingResult.reason }, { status: 503 });
  if (existingResult.status === "conflict") return NextResponse.json({ status: "conflict", message: existingResult.reason }, { status: 409 });
  if (!existingResult.value) return NextResponse.json({ status: "not_found", message: "Commission transaction was not found." }, { status: 404 });

  const current = existingResult.value.transaction;
  const actor = operator.actor;
  const occurredAt = operator.occurredAt;

  if (action === "hold") {
    if (current.status === "Held") {
      const latestHold = [...existingResult.value.events].reverse().find((event) => event.nextStatus === "Held");
      if (latestHold?.actor === actor && latestHold.reason === reason) return NextResponse.json({ status: "already_held", transactionId, heldAt: latestHold.occurredAt, reason: latestHold.reason });
      return NextResponse.json({ status: "conflict", message: "Commission is already held under different evidence." }, { status: 409 });
    }
    if (current.status !== "Eligible") return NextResponse.json({ status: "invalid_state", message: "Only Eligible commission can be placed on hold." }, { status: 409 });

    const transaction: CommissionTransaction = { ...current, status: "Held", holdReason: reason };
    const event: CommissionLedgerEvent = { eventId: `COM-HOLD-${transactionId}-${Date.parse(occurredAt)}`, transactionId, previousStatus: "Eligible", nextStatus: "Held", actor, occurredAt, reason };
    const saved = await store.saveTransition({ transaction, event });
    if (saved.status === "unavailable") return NextResponse.json({ status: "ledger_unavailable", message: saved.reason }, { status: 503 });
    if (saved.status === "conflict") return NextResponse.json({ status: "conflict", message: saved.reason }, { status: 409 });
    return NextResponse.json({ status: "held", transactionId, heldAt: occurredAt, reason });
  }

  if (current.status === "Eligible") {
    const latestRelease = [...existingResult.value.events].reverse().find((event) => event.previousStatus === "Held" && event.nextStatus === "Eligible");
    if (latestRelease?.actor === actor && latestRelease.reason === reason) return NextResponse.json({ status: "already_released", transactionId, releasedAt: latestRelease.occurredAt, reason: latestRelease.reason });
    if (latestRelease) return NextResponse.json({ status: "conflict", message: "Commission was already released under different evidence." }, { status: 409 });
    return NextResponse.json({ status: "invalid_state", message: "Only Held commission can be released back to Eligible." }, { status: 409 });
  }

  if (current.status !== "Held") return NextResponse.json({ status: "invalid_state", message: "Only Held commission can be released back to Eligible." }, { status: 409 });

  const transaction: CommissionTransaction = { ...current, status: "Eligible", holdReason: undefined };
  const event: CommissionLedgerEvent = { eventId: `COM-RELEASE-${transactionId}-${Date.parse(occurredAt)}`, transactionId, previousStatus: "Held", nextStatus: "Eligible", actor, occurredAt, reason };
  const saved = await store.saveTransition({ transaction, event });
  if (saved.status === "unavailable") return NextResponse.json({ status: "ledger_unavailable", message: saved.reason }, { status: 503 });
  if (saved.status === "conflict") return NextResponse.json({ status: "conflict", message: saved.reason }, { status: 409 });
  return NextResponse.json({ status: "released", transactionId, releasedAt: occurredAt, reason });
}
