import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  MMS_PARTNER_RECOVERY_TOKEN_COOKIE,
  partnerIdentityCookieOptions,
  signOutPartnerIdentity,
  verifyPartnerAuthTokenHash,
} from "@/lib/partnerIdentity";

export const dynamic = "force-dynamic";

const verificationTypes = new Set(["recovery", "signup", "email_change"]);

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash")?.trim() || "";
  const rawType = request.nextUrl.searchParams.get("type")?.trim() || "";
  if (!/^[A-Za-z0-9_-]{20,512}$/.test(tokenHash) || !verificationTypes.has(rawType)) {
    return NextResponse.redirect(new URL("/partner-login?error=invalid_link", request.url), 303);
  }

  const type = rawType as "recovery" | "signup" | "email_change";
  const verified = await verifyPartnerAuthTokenHash(tokenHash, type);
  if (verified.status !== "ok" || !verified.value.access_token) {
    return NextResponse.redirect(new URL("/partner-login?error=invalid_link", request.url), 303);
  }

  if (type === "recovery") {
    const response = NextResponse.redirect(new URL("/partner-password-update", request.url), 303);
    response.cookies.set(
      MMS_PARTNER_RECOVERY_TOKEN_COOKIE,
      verified.value.access_token,
      partnerIdentityCookieOptions(Math.min(600, Math.max(60, verified.value.expires_in || 600))),
    );
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    return response;
  }

  // Verification proves email control only. It never creates a Partner session or approves a Partner record.
  await signOutPartnerIdentity(verified.value.access_token);
  return NextResponse.redirect(new URL("/partner-login?verified=1", request.url), 303);
}
