import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { commissionEligibleForCommercialState } from "@/lib/partnerCommercialModel";
import { partnerCommerceStore, partnerCommerceStoreAvailable } from "@/lib/partnerCommerceStore";

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET(request: NextRequest) {
  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", message: "Internal commerce controls are not configured." }, { status: 503 });
  }
  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
  }

  const applicationId = cleanString(request.nextUrl.searchParams.get("applicationId"), 80);
  if (!applicationId) {
    return NextResponse.json({ status: "invalid", message: "A valid applicationId is required." }, { status: 400 });
  }
  if (!partnerCommerceStoreAvailable()) {
    return NextResponse.json(
      { status: "store_unavailable", message: "MMS commercial workflow persistence is not configured." },
      { status: 503 },
    );
  }

  const result = await partnerCommerceStore().getApplication(applicationId);
  if (result.status === "unavailable") {
    return NextResponse.json({ status: "store_unavailable", message: result.reason }, { status: 503 });
  }
  if (result.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: result.reason }, { status: 409 });
  }
  if (!result.value) {
    return NextResponse.json({ status: "not_found", message: "Commercial application was not found." }, { status: 404 });
  }

  const { application, payment, membership, paymentVerification, membershipActivation, events } = result.value;
  const commissionEligible = Boolean(
    payment && membership && commissionEligibleForCommercialState({ payment, membership }),
  );

  const blockers: string[] = [];
  if (!payment) blockers.push("No payment record exists.");
  else if (payment.stage !== "Cleared") blockers.push("Payment has not been Finance-cleared.");
  if (!paymentVerification) blockers.push("Finance payment-verification evidence is missing.");
  if (!membership) blockers.push("No membership record exists.");
  else if (membership.status !== "Active") blockers.push("Membership is not Active.");
  if (!membershipActivation) blockers.push("Membership activation evidence is missing.");
  if (membership?.cancelledAt) blockers.push("Membership is cancelled.");

  return NextResponse.json({
    status: "ok",
    application: {
      applicationId: application.applicationId,
      leadId: application.leadId,
      partnerId: application.partnerId,
      membershipCode: application.membershipCode,
      stage: application.stage,
      submittedAt: application.submittedAt || null,
      approvedAt: application.approvedAt || null,
      activatedAt: application.activatedAt || null,
    },
    payment: payment
      ? {
          paymentId: payment.paymentId,
          transactionReference: payment.transactionReference,
          amountMinorUnits: payment.amountMinorUnits,
          currency: payment.currency,
          stage: payment.stage,
          submittedAt: payment.submittedAt || null,
          clearedAt: payment.clearedAt || null,
        }
      : null,
    membership: membership
      ? {
          membershipId: membership.membershipId,
          memberReference: membership.memberReference,
          membershipCode: membership.membershipCode,
          status: membership.status,
          activatedAt: membership.activatedAt || null,
          cancelledAt: membership.cancelledAt || null,
        }
      : null,
    financeVerified: Boolean(paymentVerification && payment?.stage === "Cleared"),
    membershipActivated: Boolean(membershipActivation && membership?.status === "Active"),
    commissionEligibility: {
      eligible: commissionEligible,
      blockers,
      note: "This is commercial state eligibility only; a CommissionTransaction still requires attribution and an approved rule version before payout approval.",
    },
    auditEventCount: events.length,
  });
}
