import { NextRequest, NextResponse } from "next/server";
import { operatorIdentityConfigured } from "@/lib/operatorIdentity";

export const dynamic = "force-dynamic";
const cookieName = "mms_operator_invite_token";

function fail(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/operations/setup?error=invalid_invitation", request.url), 303);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function GET(request: NextRequest) {
  // Supabase email template must use an explicit token_hash link, never redirect access tokens.
  const hash = request.nextUrl.searchParams.get("token_hash") || "";
  const type = request.nextUrl.searchParams.get("type") || "";
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
