import { NextRequest, NextResponse } from "next/server";
import { operatorIdentityConfigured } from "@/lib/operatorIdentity";

export const dynamic = "force-dynamic";
const cookieName = "mms_operator_invite_token";
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) return NextResponse.json({ status: "forbidden" }, { status: 403 });
  const token = request.cookies.get(cookieName)?.value;
  const body = await request.formData();
  const password = String(body.get("password") || "");
  const confirm = String(body.get("confirm") || "");
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
    response.cookies.delete(cookieName);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch { return NextResponse.json({ status: "unavailable" }, { status: 503 }); }
}
