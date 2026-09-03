import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authenticatePartnerHubRequest } from "@/lib/partnerHubRequestAuth";
import { protectPartnerHubMutation } from "@/lib/partnerHubMutationSecurity";
import { MMS_PARTNER_SESSION_COOKIE, partnerHubSessionProvider } from "@/lib/partnerHubSession";
import { MMS_PARTNER_ACCESS_TOKEN_COOKIE, signOutPartnerIdentity } from "@/lib/partnerIdentity";

function clearPartnerCookies(response: NextResponse) {
  for (const name of [MMS_PARTNER_SESSION_COOKIE, MMS_PARTNER_ACCESS_TOKEN_COOKIE]) {
    response.cookies.set({ name, value: "", httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  }
  return response;
}

export async function POST(request: NextRequest) {
  const auth = await authenticatePartnerHubRequest(request);
  const accessToken = request.cookies.get(MMS_PARTNER_ACCESS_TOKEN_COOKIE)?.value || "";
  if (auth.status === "unavailable") {
    await signOutPartnerIdentity(accessToken);
    return clearPartnerCookies(NextResponse.json({ status: "hub_unavailable", message: auth.reason }, { status: 503 }));
  }
  if (auth.status === "unauthenticated") {
    await signOutPartnerIdentity(accessToken);
    return clearPartnerCookies(NextResponse.json({ status: "ok", signedOut: true }));
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

  await signOutPartnerIdentity(accessToken);

  const response = clearPartnerCookies(NextResponse.json({ status: "ok", signedOut: true }));
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}
