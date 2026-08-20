import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authenticatePartnerHubRequest } from "@/lib/partnerHubRequestAuth";
import { partnerHubCsrfProvider, partnerHubCsrfProviderAvailable } from "@/lib/partnerHubMutationSecurity";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await authenticatePartnerHubRequest(request);
  if (auth.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", message: auth.reason }, { status: 503 });
  }
  if (auth.status === "unauthenticated") {
    return NextResponse.json({ status: "unauthorized", message: "Partner authentication is required." }, { status: 401 });
  }

  if (!partnerHubCsrfProviderAvailable()) {
    return NextResponse.json({ status: "hub_unavailable", message: "Partner Hub CSRF provider is not configured." }, { status: 503 });
  }

  const issued = await partnerHubCsrfProvider().issue({ sessionId: auth.claims.sessionId });
  if (issued.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", message: issued.reason }, { status: 503 });
  }

  return NextResponse.json(
    {
      status: "ok",
      csrfToken: issued.csrfToken,
      expiresAt: issued.expiresAt,
      headerName: "x-mms-csrf-token",
    },
    { headers: { "Cache-Control": "private, no-store, max-age=0", Pragma: "no-cache" } },
  );
}
