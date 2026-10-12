import { NextRequest, NextResponse } from "next/server";
import {
  MMS_OWNER_RECOVERY_TOKEN_COOKIE,
  getOperatorIdentityUser,
  operatorIdentityConfigured,
  operatorMetadataFromUser,
  signOutOperatorIdentity,
  verifyOwnerRecoveryToken,
} from "@/lib/operatorIdentity";
import { operatorRequestOriginAllowed } from "@/lib/operatorSecurity";
import { bodyTooLarge, publicRequestClientKey, readPublicForm } from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
const recoveryCookiePath = "/api/operations/password-reset";

function fail(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/operations/password-reset?error=invalid_link", request.url), 303);
  response.cookies.set({ name: MMS_OWNER_RECOVERY_TOKEN_COOKIE, value: "", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: recoveryCookiePath, maxAge: 0 });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request) || !operatorRequestOriginAllowed(request)) return fail(request);
  const rate = checkInMemoryRateLimit(`owner-recovery-verify:${publicRequestClientKey(request)}`, { limit: 8, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) {
    const response = fail(request);
    response.headers.set("Retry-After", String(Math.ceil((rate.resetAt - Date.now()) / 1000)));
    return response;
  }
  let form: Record<string, string>;
  try { form = await readPublicForm(request); } catch { return fail(request); }
  const tokenHash = String(form.token_hash || "");
  if (!operatorIdentityConfigured() || form.type !== "recovery" || !/^[A-Za-z0-9_-]{20,512}$/.test(tokenHash)) return fail(request);

  const identity = await verifyOwnerRecoveryToken(tokenHash);
  if (!identity?.access_token) return fail(request);
  const user = identity.user || await getOperatorIdentityUser(identity.access_token);
  const metadata = user ? operatorMetadataFromUser(user) : null;
  if (!metadata || metadata.roles.length !== 1 || metadata.roles[0] !== "owner") {
    await signOutOperatorIdentity(identity.access_token);
    return fail(request);
  }

  const response = NextResponse.redirect(new URL("/operations/password-reset", request.url), 303);
  response.cookies.set(MMS_OWNER_RECOVERY_TOKEN_COOKIE, identity.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: recoveryCookiePath,
    maxAge: Math.min(600, Math.max(60, identity.expires_in || 600)),
  });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
