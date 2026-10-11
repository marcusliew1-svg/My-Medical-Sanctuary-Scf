import { NextRequest, NextResponse } from "next/server";
import { operatorIdentityConfigured } from "@/lib/operatorIdentity";
import { operatorRequestOriginAllowed } from "@/lib/operatorSecurity";
import { bodyTooLarge, publicRequestClientKey, readPublicForm } from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
const cookieName = "mms_operator_invite_token";

function clearInviteCookie(response: NextResponse) {
  response.cookies.set({ name: cookieName, value: "", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/api/operations/setup", maxAge: 0 });
}

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request) || !operatorRequestOriginAllowed(request)) return NextResponse.json({ status: "forbidden" }, { status: 403 });
  const rate = checkInMemoryRateLimit(`operator-setup:${publicRequestClientKey(request)}`, { limit: 8, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) return NextResponse.json({ status: "rate_limited" }, { status: 429, headers: { "Retry-After": String(Math.ceil((rate.resetAt - Date.now()) / 1000)) } });
  const token = request.cookies.get(cookieName)?.value;
  let body: Record<string, string>;
  try { body = await readPublicForm(request); } catch { body = {}; }
  const password = String(body.password || "");
  const confirm = String(body.confirm || "");
  const location = new URL("/operations/setup", request.url);
  if (!token || !operatorIdentityConfigured() || password.length < 12 || password.length > 128 || password !== confirm) {
    location.searchParams.set("error", "invalid_request");
    return NextResponse.redirect(location, 303);
  }
  const supabase = process.env.MMS_OPERATOR_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.MMS_OPERATOR_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!supabase || !key) return NextResponse.json({ status: "unavailable" }, { status: 503 });
  try {
    const result = await fetch(supabase + "/auth/v1/user", {
      method: "PUT",
      headers: { apikey: key, Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ password }), cache: "no-store",
    });
    const destination = new URL(result.ok ? "/operations/login?setup=1" : "/operations/setup?error=unable_to_set_password", request.url);
    const response = NextResponse.redirect(destination, 303);
    clearInviteCookie(response);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch { return NextResponse.json({ status: "unavailable" }, { status: 503 }); }
}
