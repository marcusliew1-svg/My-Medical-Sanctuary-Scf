import { NextRequest, NextResponse } from "next/server";
import { unavailableFeatureForPath } from "@/lib/featureGates";
import { MMS_PARTNER_REFERRAL_COOKIE } from "@/lib/referralTracking";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

export function middleware(request: NextRequest) {
  const unavailableFeature = unavailableFeatureForPath(request.nextUrl.pathname);
  if (unavailableFeature) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-MMS-Feature": unavailableFeature,
      },
    });
  }

  const response = NextResponse.next();
  const referral = normalisePartnerId(request.nextUrl.searchParams.get("ref"));

  if (!referral) return response;

  response.cookies.set({
    name: MMS_PARTNER_REFERRAL_COOKIE,
    value: referral,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
