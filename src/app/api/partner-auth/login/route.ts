import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { issuePartnerHubSession } from "@/lib/partnerHubSessionIssuer";
import { MMS_PARTNER_SESSION_COOKIE } from "@/lib/partnerHubSession";
import {
  MMS_PARTNER_ACCESS_TOKEN_COOKIE,
  partnerAuthOriginAllowed,
  partnerIdentityConfigured,
  partnerIdentityCookieOptions,
  partnerMetadataFromUser,
  safePartnerNext,
  signInPartnerIdentity,
  signOutPartnerIdentity,
} from "@/lib/partnerIdentity";
import { bodyTooLarge, publicRequestClientKey, readPublicForm } from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

function redirectWithError(request: NextRequest, next: string, error = "invalid_credentials") {
  const url = new URL("/partner-login", request.url);
  url.searchParams.set("next", next);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: NextRequest) {
  const nextFallback = "/partner-hub";
  if (bodyTooLarge(request) || !partnerAuthOriginAllowed(request)) {
    return NextResponse.json({ status: "forbidden", message: "Partner sign-in request was not accepted." }, { status: 403 });
  }
  const rate = checkInMemoryRateLimit(`partner-login:${publicRequestClientKey(request)}`, { limit: 8, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) return redirectWithError(request, nextFallback);

  let form: Record<string, string>;
  try {
    form = await readPublicForm(request);
  } catch {
    return redirectWithError(request, nextFallback);
  }
  const next = safePartnerNext(form.next);
  if (form.website) return redirectWithError(request, next);
  const email = String(form.email || "").trim().toLowerCase();
  const password = String(form.password || "");
  if (!partnerIdentityConfigured()) return redirectWithError(request, next, "auth_unavailable");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !password || password.length > 512) {
    return redirectWithError(request, next);
  }

  const identity = await signInPartnerIdentity(email, password);
  const metadata = identity.status === "ok" && identity.value.user ? partnerMetadataFromUser(identity.value.user) : null;
  if (identity.status !== "ok" || !identity.value.access_token || !metadata) {
    return redirectWithError(request, next, identity.status === "unavailable" ? "auth_unavailable" : undefined);
  }

  const issued = await issuePartnerHubSession({
    partnerId: metadata.partnerId,
    subject: metadata.subject,
    maxAgeSeconds: Math.max(60, identity.value.expires_in || 3600),
  });
  if (issued.status !== "issued") {
    await signOutPartnerIdentity(identity.value.access_token);
    return redirectWithError(request, next, issued.status === "unavailable" ? "auth_unavailable" : undefined);
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(MMS_PARTNER_SESSION_COOKIE, issued.sessionToken, partnerIdentityCookieOptions(issued.maxAge));
  response.cookies.set(MMS_PARTNER_ACCESS_TOKEN_COOKIE, identity.value.access_token, partnerIdentityCookieOptions(issued.maxAge));
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  return response;
}
