import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireOperatorMutation } from "@/lib/operatorSecurity";
import { partnerCommerceStore, partnerCommerceStoreAvailable } from "@/lib/partnerCommerceStore";

const MAX_BODY_BYTES = 4_000;
const ALLOWED_FIELDS = new Set(["applicationId", "transactionReference", "amountMinorUnits", "currency"]);

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const operator = await requireOperatorMutation(request, { roles: ["finance"] });
  if (operator.status === "unavailable") return NextResponse.json({ status: "unavailable", message: operator.reason }, { status: 503 });
  if (operator.status === "unauthorized") return NextResponse.json({ status: "unauthorized", message: operator.reason }, { status: 401 });
  if (operator.status === "forbidden") return NextResponse.json({ status: "forbidden", message: operator.reason }, { status: 403 });
  if (!partnerCommerceStoreAvailable()) {
    return NextResponse.json({ status: "store_unavailable", message: "MMS commercial workflow persistence is not configured." }, { status: 503 });
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });

  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; }
  catch { return NextResponse.json({ status: "invalid", message: "A JSON request body is required." }, { status: 400 }); }

  if (Object.keys(body).some((field) => !ALLOWED_FIELDS.has(field))) {
    return NextResponse.json({ status: "invalid", message: "Payment submission contains unsupported fields." }, { status: 400 });
  }

  const applicationId = cleanString(body.applicationId, 80);
  const transactionReference = cleanString(body.transactionReference, 180);
  const currency = cleanString(body.currency, 3).toUpperCase();
  const amountMinorUnits = body.amountMinorUnits;
  const idempotencyKey = cleanString(request.headers.get("idempotency-key"), 120);

  if (!applicationId || !transactionReference || !/^[A-Z]{3}$/.test(currency) || !Number.isInteger(amountMinorUnits) || (amountMinorUnits as number) <= 0 || !/^[A-Za-z0-9._:-]{16,120}$/.test(idempotencyKey)) {
    return NextResponse.json({ status: "invalid", message: "A valid application, payment reference, amount, currency and Idempotency-Key are required." }, { status: 400 });
  }

  const result = await partnerCommerceStore().recordPaymentSubmission({
    applicationId,
    transactionReference,
    amountMinorUnits: amountMinorUnits as number,
    currency,
    submittedAt: operator.occurredAt,
    recordedBy: operator.actor,
    idempotencyKey,
  });

  if (result.status === "unavailable") return NextResponse.json({ status: "store_unavailable", message: result.reason }, { status: 503 });
  if (result.status === "conflict") return NextResponse.json({ status: "payment_conflict", message: result.reason }, { status: 409 });

  const payment = result.value.record.payment;
  if (!payment) return NextResponse.json({ status: "conflict", message: "Recorded payment could not be reloaded." }, { status: 409 });

  return NextResponse.json({
    status: result.value.replayed ? "already_recorded" : "recorded",
    replayed: result.value.replayed,
    applicationId,
    applicationStage: result.value.record.application.stage,
    payment: {
      paymentId: payment.paymentId,
      transactionReference: payment.transactionReference,
      amountMinorUnits: payment.amountMinorUnits,
      currency: payment.currency,
      stage: payment.stage,
      submittedAt: payment.submittedAt || null,
    },
  }, { status: result.value.replayed ? 200 : 201 });
}
