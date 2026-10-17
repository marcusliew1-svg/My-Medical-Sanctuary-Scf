import { NextRequest, NextResponse } from "next/server";
import { MMS_PARTNER_REFERRAL_COOKIE } from "@/lib/referralTracking";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";
import {
  MMS_SUPABASE_ACCESS_COOKIE,
  MMS_SUPABASE_REFRESH_COOKIE,
  authCookieOptions,
  getSupabaseUser,
  refreshSupabaseSession,
  supabaseAuthConfigured,
} from "@/lib/supabaseAuth";

function applyReferralCookie(request: NextRequest, response: NextResponse) {
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

function loginRedirect(request: NextRequest, error?: string) {
  const url = request.nextUrl.clone();
  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.pathname = "/partner-login";
  url.search = "";
  url.searchParams.set("next", next);
  if (error) url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const protectedPage = pathname === "/partner-hub" || pathname.startsWith("/partner-hub/");
  const protectedApi = pathname.startsWith("/api/partner-hub/");

  if (!protectedPage && !protectedApi) {
    return applyReferralCookie(request, NextResponse.next());
  }

  if (!supabaseAuthConfigured()) {
    if (protectedApi) return NextResponse.json({ error: "auth_unavailable" }, { status: 503 });
    return loginRedirect(request, "auth_unavailable");
  }

  let accessToken = request.cookies.get(MMS_SUPABASE_ACCESS_COOKIE)?.value || "";
  const refreshToken = request.cookies.get(MMS_SUPABASE_REFRESH_COOKIE)?.value || "";
  let user = accessToken ? await getSupabaseUser(accessToken) : null;
  let refreshed: Awaited<ReturnType<typeof refreshSupabaseSession>> = null;

  if (!user && refreshToken) {
    refreshed = await refreshSupabaseSession(refreshToken);
    if (refreshed?.access_token) {
      accessToken = refreshed.access_token;
      user = refreshed.user || (await getSupabaseUser(accessToken));
      request.cookies.set(MMS_SUPABASE_ACCESS_COOKIE, refreshed.access_token);
      request.cookies.set(MMS_SUPABASE_REFRESH_COOKIE, refreshed.refresh_token);
    }
  }

  if (!user) {
    if (protectedApi) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    return loginRedirect(request);
  }

  const partnerId = normalisePartnerId(
    typeof user.app_metadata?.partner_id === "string" ? user.app_metadata.partner_id : null,
  );
  if (!partnerId) {
    if (protectedApi) return NextResponse.json({ error: "not_authorized" }, { status: 403 });
    return loginRedirect(request, "not_authorized");
  }

  const response = NextResponse.next({ request });
  if (refreshed?.access_token && refreshed.refresh_token) {
    response.cookies.set(MMS_SUPABASE_ACCESS_COOKIE, refreshed.access_token, authCookieOptions(Math.max(60, refreshed.expires_in || 3600)));
    response.cookies.set(MMS_SUPABASE_REFRESH_COOKIE, refreshed.refresh_token, authCookieOptions(60 * 60 * 24 * 30));
  }
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  return applyReferralCookie(request, response);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
