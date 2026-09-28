import { NextRequest, NextResponse } from "next/server";
import {
  MMS_SUPABASE_ACCESS_COOKIE,
  MMS_SUPABASE_REFRESH_COOKIE,
  signOutSupabaseSession,
} from "@/lib/supabaseAuth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(MMS_SUPABASE_ACCESS_COOKIE)?.value || "";
  if (accessToken) await signOutSupabaseSession(accessToken);

  const response = NextResponse.redirect(new URL("/partner-login", request.url), 303);
  response.cookies.set(MMS_SUPABASE_ACCESS_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(MMS_SUPABASE_REFRESH_COOKIE, "", { path: "/", maxAge: 0 });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  return response;
}
