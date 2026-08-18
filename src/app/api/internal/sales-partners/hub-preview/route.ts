import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";
import { partnerHubStore, partnerHubStoreAvailable } from "@/lib/partnerHubStore";

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Internal readiness/preview endpoint only. This is deliberately not the
 * Partner-facing Hub route: a shared internal bearer token is not acceptable
 * as Partner authentication.
 */
export async function GET(request: NextRequest) {
  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", message: "Internal Sales Partner controls are not configured." }, { status: 503 });
  }
  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
  }

  const partnerId = normalisePartnerId(cleanString(request.nextUrl.searchParams.get("partnerId"), 40));
  if (!partnerId) {
    return NextResponse.json({ status: "invalid", message: "A valid permanent MMS Partner ID is required." }, { status: 400 });
  }

  if (!partnerHubStoreAvailable()) {
    return NextResponse.json(
      {
        status: "hub_unavailable",
        partnerId,
        message: "Partner Hub data/authentication is not configured yet.",
        partnerFacingAccessEnabled: false,
      },
      { status: 503 },
    );
  }

  const result = await partnerHubStore().getDashboard(partnerId);
  if (result.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", partnerId, message: result.reason, partnerFacingAccessEnabled: false }, { status: 503 });
  }
  if (result.status === "conflict") {
    return NextResponse.json({ status: "conflict", partnerId, message: result.reason }, { status: 409 });
  }
  if (!result.value) {
    return NextResponse.json({ status: "not_found", partnerId, message: "Partner Hub record was not found." }, { status: 404 });
  }

  return NextResponse.json({
    status: "ok",
    partnerFacingAccessEnabled: false,
    note: "Internal preview only until Partner-scoped authentication is implemented.",
    dashboard: result.value,
  });
}
