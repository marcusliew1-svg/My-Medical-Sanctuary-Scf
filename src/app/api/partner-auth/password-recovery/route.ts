import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  partnerAuthOriginAllowed,
  partnerIdentityConfigured,
  requestPartnerPasswordRecovery,
} from "@/lib/partnerIdentity";
import { bodyTooLarge, publicRequestClientKey, readPublicForm } from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

function genericResponse(request: NextRequest) {
  return NextResponse.redirect(new URL("/partner-password-recovery?sent=1", request.url), 303);
}

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request) || !partnerAuthOriginAllowed(request)) {
    return NextResponse.json({ status: "forbidden", message: "Password recovery request was not accepted." }, { status: 403 });
  }
  const rate = checkInMemoryRateLimit(`partner-recovery:${publicRequestClientKey(request)}`, { limit: 4, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) return genericResponse(request);

  let form: Record<string, string> = {};
  try {
    form = await readPublicForm(request);
  } catch {
    return genericResponse(request);
  }
  if (form.website) return genericResponse(request);
  const email = String(form.email || "").trim().toLowerCase();
  if (partnerIdentityConfigured() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254) {
    const callback = new URL("/api/partner-auth/callback", request.url);
    callback.searchParams.set("next", "/partner-password-update");
    await requestPartnerPasswordRecovery(email, callback.toString());
  }
  return genericResponse(request);
}
