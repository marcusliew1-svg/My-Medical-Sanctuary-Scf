import { NextRequest, NextResponse } from "next/server";
import { operatorIdentityConfigured } from "@/lib/operatorIdentity";
import { operatorRequestOriginAllowed } from "@/lib/operatorSecurity";
import { bodyTooLarge, publicRequestClientKey, readPublicForm } from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
const cookieName = "mms_operator_invite_token";

function fail(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/operations/setup?error=invalid_invitation", request.url), 303);
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set({ name: cookieName, value: "", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/api/operations/setup", maxAge: 0 });
  return response;
}

export async function POST(request: NextRequest) {
  // Verification is a deliberate same-origin POST so email link scanners cannot consume the invitation.
  if (bodyTooLarge(request) || !operatorRequestOriginAllowed(request)) return fail(request);
  const rate = checkInMemoryRateLimit(`operator-invite:${publicRequestClientKey(request)}`, { limit: 10, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) {
    const response = fail(request);
    response.headers.set("Retry-After", String(Math.ceil((rate.resetAt - Date.now()) / 1000)));
    return response;
  }
  let form: Record<string, string>;
  try { form = await readPublicForm(request); } catch { return fail(request); }
  const hash = form.token_hash || "";
  const type = form.type || "";
  if (!operatorIdentityConfigured() || type !== "invite" || !/^[A-Za-z0-9_-]{20,512}$/.test(hash)) return fail(request);
  const supabase = process.env.MMS_OPERATOR_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.MMS_OPERATOR_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!supabase || !key) return fail(request);
  try {
    const result = await fetch(supabase + "/auth/v1/verify", {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ token_hash: hash, type: "invite" }),
      cache: "no-store",
    });
    if (!result.ok) return fail(request);
    const identity = await result.json() as { access_token?: string; expires_in?: number };
    if (!identity.access_token) return fail(request);
    const response = NextResponse.redirect(new URL("/operations/setup", request.url), 303);
    response.cookies.set(cookieName, identity.access_token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      path: "/api/operations/setup", maxAge: Math.min(600, Math.max(60, identity.expires_in || 600)),
    });
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  } catch { return fail(request); }
}
