import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authorizePartnerHubCapability } from "@/lib/partnerHubAuthorization";

export const dynamic = "force-dynamic";

/**
 * A lightweight bootstrap endpoint for the Partner Hub UI. Capabilities are
 * computed server-side from the authenticated Partner's trusted current state;
 * the frontend may use them to render controls, but every protected route must
 * still enforce its own capability independently.
 */
export async function GET(request: NextRequest) {
  const authorization = await authorizePartnerHubCapability(request, "ACCESS_ACADEMY");
  if (authorization.status === "unauthenticated") {
    return NextResponse.json({ status: "unauthorized", message: "Partner authentication is required." }, { status: 401 });
  }
  if (authorization.status === "forbidden") {
    return NextResponse.json({ status: "forbidden", capabilities: [] }, { status: 403 });
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

  return NextResponse.json(
    {
      status: "ok",
      partnerId: authorization.partnerId,
      stage: authorization.accessState.stage,
      capabilities: authorization.capabilities,
    },
    { headers: { "Cache-Control": "private, no-store, max-age=0", Pragma: "no-cache" } },
  );
}
