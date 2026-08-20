import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authenticatePartnerHubRequest } from "@/lib/partnerHubRequestAuth";
import { protectPartnerHubMutation } from "@/lib/partnerHubMutationSecurity";
import { MMS_PARTNER_SESSION_COOKIE, partnerHubSessionProvider } from "@/lib/partnerHubSession";

export async function POST(request: NextRequest) {
  const auth = await authenticatePartnerHubRequest(request);
  if (auth.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", message: auth.reason }, { status: 503 });
  }
  if (auth.status === "unauthenticated") {
    const response = NextResponse.json({ status: "ok", signedOut: true });
    response.cookies.set({ name: MMS_PARTNER_SESSION_COOKIE, value: "", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
    return response;
  }

  const security = await protectPartnerHubMutation(request, auth.claims);
  if (security.status === "forbidden") {
    return NextResponse.json({ status: "forbidden", message: security.reason }, { status: 403 });
  }
  if (security.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", message: security.reason }, { status: 503 });
  }

  const revoked = await partnerHubSessionProvider().revoke(auth.claims.sessionId);
  if (revoked.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", message: "Unable to revoke Partner session." }, { status: 503 });
  }

  const response = NextResponse.json({ status: "ok", signedOut: true });
  response.cookies.set({
    name: MMS_PARTNER_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}
