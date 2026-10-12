import { NextRequest, NextResponse } from "next/server";
import {
  MMS_OWNER_RECOVERY_TOKEN_COOKIE,
  signOutOperatorIdentity,
  updateOwnerPassword,
} from "@/lib/operatorIdentity";
import { operatorRequestOriginAllowed } from "@/lib/operatorSecurity";
import { bodyTooLarge, publicRequestClientKey, readPublicForm } from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
const recoveryCookiePath = "/api/operations/password-reset";

function redirectError(request: NextRequest, error: string, clear = false) {
  const response = NextResponse.redirect(new URL(`/operations/password-reset?error=${error}`, request.url), 303);
  if (clear) response.cookies.set({ name: MMS_OWNER_RECOVERY_TOKEN_COOKIE, value: "", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: recoveryCookiePath, maxAge: 0 });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request) || !operatorRequestOriginAllowed(request)) {
    return NextResponse.json({ status: "forbidden" }, { status: 403 });
  }
  const rate = checkInMemoryRateLimit(`owner-password-reset:${publicRequestClientKey(request)}`, { limit: 6, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) {
    const response = redirectError(request, "try_later");
    response.headers.set("Retry-After", String(Math.ceil((rate.resetAt - Date.now()) / 1000)));
    return response;
  }
  const accessToken = request.cookies.get(MMS_OWNER_RECOVERY_TOKEN_COOKIE)?.value?.trim() || "";
  if (!accessToken) return redirectError(request, "invalid_link", true);

  let form: Record<string, string>;
  try { form = await readPublicForm(request); } catch { form = {}; }
  const password = String(form.password || "");
  const confirmation = String(form.confirmPassword || "");
  if (password.length < 12 || password.length > 128 || password !== confirmation) return redirectError(request, "invalid_password");

  const updated = await updateOwnerPassword(accessToken, password);
  if (updated === "invalid_session") return redirectError(request, "invalid_link", true);
  if (updated === "rejected") return redirectError(request, "password_rejected");
  if (updated === "unavailable") return redirectError(request, "unavailable");
  await signOutOperatorIdentity(accessToken);
  const response = NextResponse.redirect(new URL("/operations/login?reset=1&next=/owner", request.url), 303);
  response.cookies.set({ name: MMS_OWNER_RECOVERY_TOKEN_COOKIE, value: "", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: recoveryCookiePath, maxAge: 0 });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  return response;
}
