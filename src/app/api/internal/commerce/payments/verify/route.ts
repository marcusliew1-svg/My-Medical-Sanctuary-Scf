import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { financeApiConfigured, isValidFinanceBearerToken } from "@/lib/internalApiAuth";
import { financeVerifyPayment, type PaymentVerificationEvidence } from "@/lib/partnerCommerceWorkflow";
import { partnerCommerceStore, partnerCommerceStoreAvailable } from "@/lib/partnerCommerceStore";

const MAX_BODY_BYTES = 12_000;
const verificationSources = new Set(["Stripe", "Bank Transfer", "Finance Manual Review", "Other Approved Gateway"]);

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  if (!financeApiConfigured()) return NextResponse.json({ status: "unavailable", message: "Finance verification controls are not configured." }, { status: 503 });
  if (!isValidFinanceBearerToken(request.headers.get("authorization"))) return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
  if (!partnerCommerceStoreAvailable()) return NextResponse.json({ status: "store_unavailable", message: "MMS commercial workflow persistence is not configured." }, { status: 503 });

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });

  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; }
  catch { return NextResponse.json({ status: "invalid", message: "A JSON request body is required." }, { status: 400 }); }

  const applicationId = cleanString(body.applicationId, 80);
  const paymentId = cleanString(body.paymentId, 80);
  const transactionReference = cleanString(body.transactionReference, 180);
  const verifiedBy = cleanString(body.verifiedBy, 160);
  const verifiedAt = cleanString(body.verifiedAt, 80);
  const currency = cleanString(body.currency, 3).toUpperCase();
  const source = cleanString(body.source, 60);
  const sourceReference = cleanString(body.sourceReference, 240);
  const clearedAmountMinorUnits = body.clearedAmountMinorUnits;

  if (!applicationId || !paymentId || !transactionReference || !verifiedBy || !verifiedAt || Number.isNaN(Date.parse(verifiedAt)) || !/^[A-Z]{3}$/.test(currency) || !verificationSources.has(source) || !sourceReference || !Number.isInteger(clearedAmountMinorUnits)) {
    return NextResponse.json({ status: "invalid", message: "Required Finance verification fields are missing or invalid." }, { status: 400 });
  }

  const store = partnerCommerceStore();
  const recordResult = await store.getApplication(applicationId);
  if (recordResult.status === "unavailable") return NextResponse.json({ status: "store_unavailable", message: recordResult.reason }, { status: 503 });
  if (recordResult.status === "conflict") return NextResponse.json({ status: "conflict", message: recordResult.reason }, { status: 409 });
  if (!recordResult.value) return NextResponse.json({ status: "not_found", message: "Commercial application was not found." }, { status: 404 });
  if (!recordResult.value.payment) return NextResponse.json({ status: "payment_missing", message: "The application has no payment record to verify." }, { status: 409 });
  if (recordResult.value.payment.paymentId !== paymentId || recordResult.value.payment.transactionReference !== transactionReference) {
    return NextResponse.json({ status: "payment_conflict", message: "Payment identifiers do not match the application payment record." }, { status: 409 });
  }

  const evidence: PaymentVerificationEvidence = {
    paymentId, transactionReference, verifiedBy, verifiedAt,
    clearedAmountMinorUnits: clearedAmountMinorUnits as number,
    currency, source: source as PaymentVerificationEvidence["source"], sourceReference,
  };

  const replayCandidate = recordResult.value.payment.stage === "Cleared" && ["Paid", "Activated"].includes(recordResult.value.application.stage);
  try {
    let application = recordResult.value.application;
    let payment = recordResult.value.payment;
    if (!replayCandidate) {
      const verified = financeVerifyPayment({ application, payment, evidence });
      application = verified.application;
      payment = verified.payment;
    }

    const saveResult = await store.savePaymentVerification({ application, payment, evidence, events: [] });
    if (saveResult.status === "unavailable") return NextResponse.json({ status: "store_unavailable", message: saveResult.reason }, { status: 503 });
    if (saveResult.status === "conflict") return NextResponse.json({ status: "conflict", message: saveResult.reason }, { status: 409 });

    return NextResponse.json({
      status: replayCandidate ? "already_verified" : "verified",
      replayed: replayCandidate,
      applicationId,
      applicationStage: saveResult.value.application.stage,
      paymentId,
      paymentStage: saveResult.value.payment?.stage || payment.stage,
      clearedAt: saveResult.value.payment?.clearedAt || payment.clearedAt,
    });
  } catch (error) {
    return NextResponse.json({ status: "invalid_transition", message: error instanceof Error ? error.message : "Payment verification could not be applied." }, { status: 409 });
  }
}
