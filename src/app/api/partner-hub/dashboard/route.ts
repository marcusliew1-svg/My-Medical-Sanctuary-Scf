import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authenticatePartnerHubRequest, partnerIdFromAuthenticatedSession } from "@/lib/partnerHubRequestAuth";
import { partnerHubStore, partnerHubStoreAvailable } from "@/lib/partnerHubStore";

export const dynamic = "force-dynamic";

/**
 * Partner-facing API boundary. The Partner ID is derived exclusively from the
 * verified server-side session. This route intentionally has no partnerId query
 * parameter and remains fail-closed while the identity/session and Hub stores
 * are unavailable.
 */
export async function GET(request: NextRequest) {
  const auth = await authenticatePartnerHubRequest(request);
  if (auth.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", message: auth.reason }, { status: 503 });
  }
  if (auth.status === "unauthenticated") {
    return NextResponse.json({ status: "unauthorized", message: "Partner authentication is required." }, { status: 401 });
  }

  if (!partnerHubStoreAvailable()) {
    return NextResponse.json(
      { status: "hub_unavailable", message: "Partner Hub commercial data store is not configured." },
      { status: 503 },
    );
  }

  const partnerId = partnerIdFromAuthenticatedSession(auth);
  const result = await partnerHubStore().getDashboard(partnerId);
  if (result.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", message: result.reason }, { status: 503 });
  }
  if (result.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: result.reason }, { status: 409 });
  }
  if (!result.value) {
    return NextResponse.json({ status: "not_found", message: "Partner Hub account was not found." }, { status: 404 });
  }
  if (result.value.partner.partnerId !== partnerId) {
    console.error("MMS Partner Hub scope violation", { authenticatedPartnerId: partnerId });
    return NextResponse.json({ status: "scope_violation", message: "Partner Hub account scope mismatch." }, { status: 409 });
  }

  return NextResponse.json(
    { status: "ok", dashboard: result.value },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        Pragma: "no-cache",
      },
    },
  );
}
