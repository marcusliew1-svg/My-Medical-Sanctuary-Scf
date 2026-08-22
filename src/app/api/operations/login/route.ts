import { NextRequest, NextResponse } from "next/server";
import { MMS_OPERATOR_SESSION_COOKIE } from "@/lib/operatorSecurity";
import {
  MMS_OPERATOR_ACCESS_TOKEN_COOKIE,
  issueOperatorSession,
  operatorIdentityConfigured,
  operatorIdentityCookieOptions,
  safeOperatorNext,
  signInOperatorIdentity,
} from "@/lib/operatorIdentity";

export const dynamic = "force-dynamic";

function redirectWithError(request: NextRequest, next: string, error: string) {
  const url = new URL("/operations/login", request.url);
  url.searchParams.set("next", next);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const next = safeOperatorNext(String(form.get("next") || ""));

  if (!operatorIdentityConfigured()) return redirectWithError(request, next, "auth_unavailable");
  if (!email || !password || email.length > 320 || password.length > 512) {
    return redirectWithError(request, next, "invalid_credentials");
  }

  const identity = await signInOperatorIdentity(email, password);
  const issued = identity?.user ? issueOperatorSession(identity.user) : null;
  if (!identity?.access_token || !issued) {
    return redirectWithError(request, next, "unauthorised_operator");
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(MMS_OPERATOR_SESSION_COOKIE, issued.token, operatorIdentityCookieOptions(issued.maxAge));
  response.cookies.set(MMS_OPERATOR_ACCESS_TOKEN_COOKIE, identity.access_token, operatorIdentityCookieOptions(Math.min(issued.maxAge, Math.max(60, identity.expires_in || issued.maxAge))));
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  return response;
}
