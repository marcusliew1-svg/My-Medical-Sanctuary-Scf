import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authorizePartnerHubCapability } from "@/lib/partnerHubAuthorization";
import { partnerHubStore } from "@/lib/partnerHubStore";

export const dynamic = "force-dynamic";

function authorizationFailure(
  result: Exclude<Awaited<ReturnType<typeof authorizePartnerHubCapability>>, { status: "authorized" }>,
) {
  if (result.status === "unauthenticated") {
    return NextResponse.json({ status: "unauthorized", message: "Partner authentication is required." }, { status: 401 });
  }
  if (result.status === "forbidden") {
    return NextResponse.json({ status: "forbidden", message: "Dashboard access is not permitted for this Partner account." }, { status: 403 });
  }
  if (result.status === "not_found") {
    return NextResponse.json({ status: "not_found", message: result.reason }, { status: 404 });
  }
  if (result.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: result.reason }, { status: 409 });
  }
  return NextResponse.json({ status: "hub_unavailable", message: result.reason }, { status: 503 });
}

/**
 * Partner-facing API boundary. Partner identity and VIEW_DASHBOARD permission
 * are resolved server-side from the authenticated session plus trusted current
 * Partner access state. The browser cannot select a Partner ID or grant itself
 * capabilities by hiding/showing controls.
 */
export async function GET(request: NextRequest) {
  const authorization = await authorizePartnerHubCapability(request, "VIEW_DASHBOARD");
  if (authorization.status !== "authorized") return authorizationFailure(authorization);

  const result = await partnerHubStore().getDashboard(authorization.partnerId);
  if (result.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", message: result.reason }, { status: 503 });
  }
  if (result.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: result.reason }, { status: 409 });
  }
  if (!result.value) {
    return NextResponse.json({ status: "not_found", message: "Partner Hub account was not found." }, { status: 404 });
  }
  if (result.value.partner.partnerId !== authorization.partnerId) {
    console.error("MMS Partner Hub scope violation", { authenticatedPartnerId: authorization.partnerId });
    return NextResponse.json({ status: "scope_violation", message: "Partner Hub account scope mismatch." }, { status: 409 });
  }

  return NextResponse.json(
    {
      status: "ok",
      capabilities: authorization.capabilities,
      dashboard: result.value,
    },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        Pragma: "no-cache",
      },
    },
  );
}
