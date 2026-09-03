import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  MMS_PARTNER_RECOVERY_TOKEN_COOKIE,
  partnerAuthOriginAllowed,
  signOutPartnerIdentity,
  updatePartnerPassword,
} from "@/lib/partnerIdentity";
import { bodyTooLarge, readPublicForm } from "@/lib/publicSubmission";

export const dynamic = "force-dynamic";

function redirectError(request: NextRequest, error: string) {
  return NextResponse.redirect(new URL(`/partner-password-update?error=${error}`, request.url), 303);
}

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request) || !partnerAuthOriginAllowed(request)) {
    return NextResponse.json({ status: "forbidden", message: "Password update request was not accepted." }, { status: 403 });
  }
  const recoveryToken = request.cookies.get(MMS_PARTNER_RECOVERY_TOKEN_COOKIE)?.value?.trim() || "";
  if (!recoveryToken) return redirectError(request, "invalid_link");

  let form: Record<string, string>;
  try {
    form = await readPublicForm(request);
  } catch {
    return redirectError(request, "invalid_password");
  }
  const password = String(form.password || "");
  const confirmation = String(form.confirmPassword || "");
  if (password.length < 12 || password.length > 128 || password !== confirmation) {
    return redirectError(request, "invalid_password");
  }

  const updated = await updatePartnerPassword(recoveryToken, password);
  if (updated.status !== "ok") return redirectError(request, "invalid_link");
  await signOutPartnerIdentity(recoveryToken);
  const response = NextResponse.redirect(new URL("/partner-login?reset=1", request.url), 303);
  response.cookies.set({ name: MMS_PARTNER_RECOVERY_TOKEN_COOKIE, value: "", path: "/", maxAge: 0 });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}
