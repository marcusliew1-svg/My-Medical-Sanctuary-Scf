import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";
import { issuePartnerIdentitySession } from "@/lib/partnerIdentitySession";
import {
  partnerSupabaseAuthConfigured,
  revokeTransientSupabaseSession,
  verifyPartnerPassword,
} from "@/lib/partnerIdentity";
import { MMS_PARTNER_SESSION_COOKIE } from "@/lib/partnerHubSession";
import { mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8_000;

function safeNext(value: string): string {
  if (value === "/partner-hub" || value.startsWith("/partner-hub/")) return value;
  return "/partner-hub";
}

function redirectToLogin(request: NextRequest, error: string, next: string) {
  const url = new URL("/partner-login", request.url);
  url.searchParams.set("error", error);
  url.searchParams.set("next", next);
  return NextResponse.redirect(url, 303);
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    const host = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
      || request.headers.get("host")?.trim()
      || new URL(request.url).host;
    return originUrl.host === host;
  } catch {
    return false;
  }
}

function clientKey(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || "unknown";
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") || "0");
  if ((Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) || !sameOrigin(request)) {
    return NextResponse.json({ status: "invalid", message: "Invalid sign-in request." }, { status: 400 });
  }

  const limit = checkInMemoryRateLimit(`partner-login:${clientKey(request)}`, {
    limit: 8,
    windowMs: 10 * 60 * 1000,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { status: "rate_limited", message: "Too many sign-in attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000))) } },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ status: "invalid", message: "Invalid sign-in request." }, { status: 400 });
  }

  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const website = String(form.get("website") || "").trim();
  const next = safeNext(String(form.get("next") || ""));

  if (website) {
    return redirectToLogin(request, "invalid_credentials", next);
  }

  if (
    process.env.MMS_PARTNER_HUB_ENABLED !== "true"
    || !mmsCommercialDatabaseClientAvailable()
    || !partnerSupabaseAuthConfigured()
  ) {
    return redirectToLogin(request, "auth_unavailable", next);
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || email.length > 254
    || password.length < 8
    || password.length > 512
  ) {
    return redirectToLogin(request, "invalid_credentials", next);
  }

  const identity = await verifyPartnerPassword(email, password);
  if (!identity) {
    return redirectToLogin(request, "invalid_credentials", next);
  }

  try {
    const partnerId = normalisePartnerId(
      typeof identity.user.app_metadata?.partner_id === "string"
        ? identity.user.app_metadata.partner_id
        : null,
    );

    if (!partnerId) {
      return redirectToLogin(request, "not_authorized", next);
    }

    const issued = await issuePartnerIdentitySession({
      partnerId,
      subject: identity.user.id,
      ttlHours: 8,
    });

    if (issued.status === "not_allowed") {
      return redirectToLogin(request, "not_authorized", next);
    }
    if (issued.status !== "issued") {
      return redirectToLogin(request, "auth_unavailable", next);
    }

    const response = NextResponse.redirect(new URL(next, request.url), 303);
    response.cookies.set({
      name: MMS_PARTNER_SESSION_COOKIE,
      value: issued.sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(issued.expiresAt),
    });
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("Pragma", "no-cache");
    return response;
  } finally {
    await revokeTransientSupabaseSession(identity.accessToken);
  }
}
