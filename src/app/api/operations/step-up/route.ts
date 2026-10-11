import { NextRequest, NextResponse } from "next/server";
import { MMS_OPERATOR_SESSION_COOKIE, authenticateOperatorRequest, operatorRequestOriginAllowed } from "@/lib/operatorSecurity";
import {
  MMS_OPERATOR_ACCESS_TOKEN_COOKIE,
  getOperatorIdentityUser,
  issueOperatorSession,
  operatorIdentityCookieOptions,
  safeOperatorNext,
  signInOperatorIdentity,
} from "@/lib/operatorIdentity";
import { bodyTooLarge, publicRequestClientKey, readPublicForm } from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

function redirectWithError(request: NextRequest, next: string, error: string) {
  const url = new URL("/operations/step-up", request.url);
  url.searchParams.set("next", next);
  url.searchParams.set("error", error);
  const response = NextResponse.redirect(url, 303);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  return response;
}

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request) || !operatorRequestOriginAllowed(request)) {
    return NextResponse.json({ status: "forbidden", message: "Operator step-up origin is not permitted." }, { status: 403 });
  }
  const auth = await authenticateOperatorRequest(request);
  if (auth.status !== "authenticated") return redirectWithError(request, "/operations", "session_required");
  const rate = checkInMemoryRateLimit(`operator-step-up:${auth.claims.sessionId}:${publicRequestClientKey(request)}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) {
    const response = redirectWithError(request, "/operations", "invalid_credentials");
    response.headers.set("Retry-After", String(Math.ceil((rate.resetAt - Date.now()) / 1000)));
    return response;
  }

  let form: Record<string, string>;
  try { form = await readPublicForm(request); } catch { return redirectWithError(request, "/operations", "invalid_credentials"); }
  const password = String(form.password || "");
  const next = safeOperatorNext(form.next);
  if (!password || password.length > 512) return redirectWithError(request, next, "invalid_credentials");

  const currentAccessToken = request.cookies.get(MMS_OPERATOR_ACCESS_TOKEN_COOKIE)?.value || "";
  const currentUser = currentAccessToken ? await getOperatorIdentityUser(currentAccessToken) : null;
  if (!currentUser?.email || currentUser.id !== auth.claims.subject) return redirectWithError(request, next, "session_required");

  const identity = await signInOperatorIdentity(currentUser.email, password);
  if (!identity?.user || identity.user.id !== currentUser.id || !identity.access_token) {
    return redirectWithError(request, next, "invalid_credentials");
  }

  const issued = issueOperatorSession(identity.user, { stepUp: true });
  if (!issued) return redirectWithError(request, next, "unauthorised_operator");

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(MMS_OPERATOR_SESSION_COOKIE, issued.token, operatorIdentityCookieOptions(issued.maxAge));
  response.cookies.set(MMS_OPERATOR_ACCESS_TOKEN_COOKIE, identity.access_token, operatorIdentityCookieOptions(Math.min(issued.maxAge, Math.max(60, identity.expires_in || issued.maxAge))));
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  return response;
}
