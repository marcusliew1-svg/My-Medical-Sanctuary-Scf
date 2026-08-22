import { NextRequest, NextResponse } from "next/server";
import { MMS_PARTNER_REFERRAL_COOKIE } from "@/lib/referralTracking";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

function documentLocale(pathname: string): "en" | "ms" | "zh-CN" | "th" {
  if (pathname === "/ms" || pathname.startsWith("/ms/")) return "ms";
  if (pathname === "/zh" || pathname.startsWith("/zh/")) return "zh-CN";
  if (pathname === "/th" || pathname.startsWith("/th/")) return "th";
  return "en";
}

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-mms-document-locale", documentLocale(request.nextUrl.pathname));

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

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
