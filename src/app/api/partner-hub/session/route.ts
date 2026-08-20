import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authenticatePartnerHubRequest } from "@/lib/partnerHubRequestAuth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await authenticatePartnerHubRequest(request);
  if (auth.status === "unavailable") {
    return NextResponse.json(
      { status: "hub_unavailable", authenticated: false, message: auth.reason },
      { status: 503, headers: { "Cache-Control": "private, no-store, max-age=0" } },
    );
  }
  if (auth.status === "unauthenticated") {
    return NextResponse.json(
      { status: "unauthenticated", authenticated: false },
      { status: 401, headers: { "Cache-Control": "private, no-store, max-age=0" } },
    );
  }

  return NextResponse.json(
    {
      status: "ok",
      authenticated: true,
      session: {
        partnerId: auth.claims.partnerId,
        expiresAt: auth.claims.expiresAt,
        authenticationMethod: auth.claims.authenticationMethod,
        assuranceLevel: auth.claims.assuranceLevel,
      },
    },
    { headers: { "Cache-Control": "private, no-store, max-age=0", Pragma: "no-cache" } },
  );
}
