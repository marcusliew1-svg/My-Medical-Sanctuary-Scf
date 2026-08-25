import { NextRequest, NextResponse } from "next/server";
import {
  MMS_SUPABASE_ACCESS_COOKIE,
  MMS_SUPABASE_REFRESH_COOKIE,
  authCookieOptions,
  safeRelativeNext,
  signInWithPassword,
  supabaseAuthConfigured,
} from "@/lib/supabaseAuth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const next = safeRelativeNext(String(form.get("next") || ""));

  if (!supabaseAuthConfigured()) {
    const redirect = new URL("/partner-login", request.url);
    redirect.searchParams.set("error", "auth_unavailable");
    redirect.searchParams.set("next", next);
    return NextResponse.redirect(redirect, 303);
  }

  if (!email || !password || email.length > 320 || password.length > 512) {
    const redirect = new URL("/partner-login", request.url);
    redirect.searchParams.set("error", "invalid_credentials");
    redirect.searchParams.set("next", next);
    return NextResponse.redirect(redirect, 303);
  }

  const session = await signInWithPassword(email, password);
  if (!session?.access_token || !session.refresh_token) {
    const redirect = new URL("/partner-login", request.url);
    redirect.searchParams.set("error", "invalid_credentials");
    redirect.searchParams.set("next", next);
    return NextResponse.redirect(redirect, 303);
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(MMS_SUPABASE_ACCESS_COOKIE, session.access_token, authCookieOptions(Math.max(60, session.expires_in || 3600)));
  response.cookies.set(MMS_SUPABASE_REFRESH_COOKIE, session.refresh_token, authCookieOptions(60 * 60 * 24 * 30));
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  return response;
}
