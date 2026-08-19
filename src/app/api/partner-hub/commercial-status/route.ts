import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authorizePartnerHubCapability } from "@/lib/partnerHubAuthorization";
import { partnerCommerceStore, partnerCommerceStoreAvailable } from "@/lib/partnerCommerceStore";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await authorizePartnerHubCapability(request, "VIEW_MEMBERSHIP_COMMERCIAL_STATUS");
  if (auth.status === "unauthenticated") return NextResponse.json({ status: "unauthorized", message: "Partner authentication is required." }, { status: 401 });
  if (auth.status === "forbidden") return NextResponse.json({ status: "forbidden", message: auth.reason }, { status: 403 });
  if (auth.status === "not_found") return NextResponse.json({ status: "not_found", message: auth.reason }, { status: 404 });
  if (auth.status === "conflict") return NextResponse.json({ status: "conflict", message: auth.reason }, { status: 409 });
  if (auth.status !== "authorized") return NextResponse.json({ status: "hub_unavailable", message: auth.reason }, { status: 503 });

  if (!partnerCommerceStoreAvailable()) {
    return NextResponse.json({ status: "hub_unavailable", message: "Partner commercial status store is not configured." }, { status: 503 });
  }

  const result = await partnerCommerceStore().listApplicationsByPartner(auth.partnerId);
  if (result.status === "unavailable") return NextResponse.json({ status: "hub_unavailable", message: result.reason }, { status: 503 });
  if (result.status === "conflict") return NextResponse.json({ status: "conflict", message: result.reason }, { status: 409 });

  const applications = result.value.map((record) => {
    if (normalisePartnerId(record.application.partnerId) !== auth.partnerId) {
      throw new Error("Partner commerce store returned an application outside authenticated Partner scope.");
    }
    return {
      applicationId: record.application.applicationId,
      leadId: record.application.leadId,
      membershipCode: record.application.membershipCode,
      applicationStage: record.application.stage,
      submittedAt: record.application.submittedAt || null,
      approvedAt: record.application.approvedAt || null,
      activatedAt: record.application.activatedAt || null,
      payment: record.payment ? {
        paymentId: record.payment.paymentId,
        amountMinorUnits: record.payment.amountMinorUnits,
        currency: record.payment.currency,
        stage: record.payment.stage,
        submittedAt: record.payment.submittedAt || null,
        clearedAt: record.payment.clearedAt || null,
        refundAmountMinorUnits: record.payment.refundAmountMinorUnits ?? null,
      } : null,
      membership: record.membership ? {
        membershipId: record.membership.membershipId,
        memberReference: record.membership.memberReference,
        membershipCode: record.membership.membershipCode,
        status: record.membership.status,
        activatedAt: record.membership.activatedAt || null,
        cancelledAt: record.membership.cancelledAt || null,
      } : null,
    };
  });

  return NextResponse.json(
    {
      status: "ok",
      partnerId: auth.partnerId,
      applications,
      note: "Commercial application, payment and membership status only. No clinical information is exposed.",
    },
    { headers: { "Cache-Control": "private, no-store, max-age=0", Pragma: "no-cache" } },
  );
}
