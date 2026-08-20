import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { financeApiConfigured, isValidFinanceBearerToken } from "@/lib/internalApiAuth";
import { partnerCommissionStore, partnerCommissionStoreAvailable } from "@/lib/partnerCommissionStore";

const MAX_BODY_BYTES = 2_000;
const ALLOWED_FIELDS = new Set(["applicationId", "checkedBy"]);

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
    return NextResponse.json({ status: "ledger_unavailable", message: "Commission ledger persistence is not configured." }, { status: 503 });
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ status: "invalid", message: "A JSON request body is required." }, { status: 400 });
  }

  if (Object.keys(body).some((field) => !ALLOWED_FIELDS.has(field))) {
    return NextResponse.json(
      { status: "invalid", message: "Eligibility accepts only applicationId and checkedBy. Rates, Partner level, rule version and eligibility flags are derived by the database." },
      { status: 400 },
    );
  }

  const applicationId = cleanString(body.applicationId, 100);
  const checkedBy = cleanString(body.checkedBy, 160);
  if (!applicationId || !checkedBy) {
    return NextResponse.json({ status: "invalid", message: "Valid applicationId and checkedBy values are required." }, { status: 400 });
  }

  const result = await partnerCommissionStore().evaluateEligibility({
    applicationId,
    checkedBy,
    checkedAt: new Date().toISOString(),
  });
  if (result.status === "unavailable") {
    return NextResponse.json({ status: "ledger_unavailable", message: result.reason }, { status: 503 });
  }
  if (result.status === "conflict") {
    return NextResponse.json({ status: "not_eligible", message: result.reason }, { status: 409 });
  }

  const transaction = result.value.record.transaction;
  return NextResponse.json(
    {
      status: result.value.replayed ? "already_eligible" : "eligible",
      replayed: result.value.replayed,
      transaction: {
        transactionId: transaction.transactionId,
        partnerId: transaction.partnerId,
        applicationId: transaction.applicationId,
        paymentId: transaction.paymentId,
        membershipId: transaction.membershipId,
        membershipCode: transaction.membershipCode,
        currency: transaction.currency,
        eligibleRevenueMinorUnits: transaction.eligibleRevenueMinorUnits,
        commissionRuleVersion: transaction.commissionRuleVersion,
        partnerLevelAtEligibility: transaction.partnerLevelAtEligibility,
        commissionRate: transaction.commissionRate,
        grossCommissionMinorUnits: transaction.grossCommissionMinorUnits,
        commissionStatus: transaction.status,
        checkedAt: transaction.eligibility?.checkedAt || null,
      },
      note: "Commission eligibility is derived from persisted commercial state and the approved effective-dated rule. No recruitment-chain compensation is created.",
    },
    { status: result.value.replayed ? 200 : 201 },
  );
}
