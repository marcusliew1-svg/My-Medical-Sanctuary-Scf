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

export const dynamic = "force-dynamic";

function redirectWithError(request: NextRequest, next: string, error: string) {
  const url = new URL("/operations/step-up", request.url);
  url.searchParams.set("next", next);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: NextRequest) {
  if (!operatorRequestOriginAllowed(request)) {
    return NextResponse.json({ status: "forbidden", message: "Operator step-up origin is not permitted." }, { status: 403 });
  }
  const form = await request.formData();
  const password = String(form.get("password") || "");
  const next = safeOperatorNext(String(form.get("next") || ""));
  if (!password || password.length > 512) return redirectWithError(request, next, "invalid_credentials");

  const auth = await authenticateOperatorRequest(request);
  if (auth.status !== "authenticated") return redirectWithError(request, next, "session_required");

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
