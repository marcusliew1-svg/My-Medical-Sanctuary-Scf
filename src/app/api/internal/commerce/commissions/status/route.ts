import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { partnerCommissionStore, partnerCommissionStoreAvailable } from "@/lib/partnerCommissionStore";
import { partnerCommissionRuleStoreAvailable } from "@/lib/partnerCommissionRuleStore";

function cleanString(value: unknown, max = 120): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET(request: NextRequest) {
  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", message: "Internal commercial controls are not configured." }, { status: 503 });
  }
  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
  }

  const transactionId = cleanString(request.nextUrl.searchParams.get("transactionId"), 100);
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(transactionId)) {
    return NextResponse.json({ status: "invalid", message: "A valid transactionId is required." }, { status: 400 });
  }
  if (!partnerCommissionStoreAvailable()) {
    return NextResponse.json({
      status: "ledger_unavailable",
      message: "Commission ledger persistence is not configured.",
      commissionRuleRegistryAvailable: partnerCommissionRuleStoreAvailable(),
    }, { status: 503 });
  }

  const result = await partnerCommissionStore().get(transactionId);
  if (result.status === "unavailable") {
    return NextResponse.json({ status: "ledger_unavailable", message: result.reason }, { status: 503 });
  }
  if (result.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: result.reason }, { status: 409 });
  }
  if (!result.value) {
    return NextResponse.json({ status: "not_found", message: "Commission transaction was not found." }, { status: 404 });
  }

  const transaction = result.value.transaction;
  const events = [...result.value.events].sort((left, right) => Date.parse(left.occurredAt) - Date.parse(right.occurredAt));
  return NextResponse.json({
    status: "ok",
    commissionRuleRegistryAvailable: partnerCommissionRuleStoreAvailable(),
    transaction: {
      transactionId: transaction.transactionId,
      partnerId: transaction.partnerId,
      applicationId: transaction.applicationId,
      paymentId: transaction.paymentId,
      membershipId: transaction.membershipId,
      memberReference: transaction.memberReference,
      membershipCode: transaction.membershipCode,
      currency: transaction.currency,
      eligibleRevenueMinorUnits: transaction.eligibleRevenueMinorUnits,
      commissionRuleVersion: transaction.commissionRuleVersion,
      partnerLevelAtEligibility: transaction.partnerLevelAtEligibility,
      commissionRate: transaction.commissionRate,
      grossCommissionMinorUnits: transaction.grossCommissionMinorUnits,
      adjustmentMinorUnits: transaction.adjustmentMinorUnits,
      approvedCommissionMinorUnits: transaction.approvedCommissionMinorUnits,
      status: transaction.status,
      holdReason: transaction.holdReason || null,
      payoutBatchId: transaction.payoutBatchId || null,
      payoutReference: transaction.payoutReference || null,
      approvedAt: transaction.approvedAt || null,
      paidAt: transaction.paidAt || null,
      reversedAt: transaction.reversedAt || null,
      reversalReason: transaction.reversalReason || null,
      clawbackMinorUnits: transaction.clawbackMinorUnits || 0,
    },
    events,
  });
}
