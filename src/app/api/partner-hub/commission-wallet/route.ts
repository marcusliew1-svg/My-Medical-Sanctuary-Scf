import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authorizePartnerHubCapability } from "@/lib/partnerHubAuthorization";
import { partnerHubStore } from "@/lib/partnerHubStore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authorization = await authorizePartnerHubCapability(request, "VIEW_COMMISSION_WALLET");
  if (authorization.status === "unauthenticated") {
    return NextResponse.json({ status: "unauthorized", message: "Partner authentication is required." }, { status: 401 });
  }
  if (authorization.status === "forbidden") {
    return NextResponse.json({ status: "forbidden", message: "Commission wallet access is not permitted for this Partner account." }, { status: 403 });
  }
  if (authorization.status === "not_found") {
    return NextResponse.json({ status: "not_found", message: authorization.reason }, { status: 404 });
  }
  if (authorization.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: authorization.reason }, { status: 409 });
  }
  if (authorization.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", message: authorization.reason }, { status: 503 });
  }

  const result = await partnerHubStore().getDashboard(authorization.partnerId);
  if (result.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", message: result.reason }, { status: 503 });
  }
  if (result.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: result.reason }, { status: 409 });
  }
  if (!result.value || result.value.partner.partnerId !== authorization.partnerId) {
    return NextResponse.json({ status: "not_found", message: "Partner commission wallet was not found." }, { status: 404 });
  }

  return NextResponse.json(
    {
      status: "ok",
      partnerId: authorization.partnerId,
      commissions: result.value.commissions,
      generatedAt: result.value.generatedAt,
      note: "Commercial commission status only. Approved and Paid values are Finance-controlled and read-only.",
    },
    { headers: { "Cache-Control": "private, no-store, max-age=0", Pragma: "no-cache" } },
  );
}
