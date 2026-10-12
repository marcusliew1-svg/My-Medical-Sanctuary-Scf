import { NextRequest, NextResponse } from "next/server";
import { MMS_OPERATOR_SESSION_COOKIE, operatorRequestOriginAllowed } from "@/lib/operatorSecurity";
import {
  MMS_OPERATOR_ACCESS_TOKEN_COOKIE,
  issueOperatorSession,
  operatorIdentityConfigured,
  operatorIdentityCookieOptions,
  safeOperatorNext,
  signInOperatorIdentity,
} from "@/lib/operatorIdentity";
import { bodyTooLarge, publicRequestClientKey, readPublicForm } from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

function redirectWithError(request: NextRequest, next: string, error: string) {
  const url = new URL("/operations/login", request.url);
  url.searchParams.set("next", next);
  url.searchParams.set("error", error);
  const response = NextResponse.redirect(url, 303);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  return response;
}

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request) || !operatorRequestOriginAllowed(request)) {
    return NextResponse.json({ status: "forbidden", message: "Operator sign-in origin is not permitted." }, { status: 403 });
  }
  const rate = checkInMemoryRateLimit(`operator-login:${publicRequestClientKey(request)}`, { limit: 8, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) {
    const response = redirectWithError(request, "/operations", "invalid_credentials");
    response.headers.set("Retry-After", String(Math.ceil((rate.resetAt - Date.now()) / 1000)));
    return response;
  }

  let form: Record<string, string>;
  try { form = await readPublicForm(request); } catch { return redirectWithError(request, "/operations", "invalid_credentials"); }
  const email = String(form.username || form.email || "").trim().toLowerCase();
  const password = String(form.password || "");
  const next = safeOperatorNext(form.next);

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
