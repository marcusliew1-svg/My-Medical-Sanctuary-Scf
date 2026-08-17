import { NextRequest, NextResponse } from "next/server";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

export const MMS_PARTNER_REFERRAL_COOKIE = "mms_partner_ref";

export function middleware(request: NextRequest) {
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
