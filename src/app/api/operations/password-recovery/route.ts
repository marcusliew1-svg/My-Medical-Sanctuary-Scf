import { NextRequest, NextResponse } from "next/server";
import { operatorIdentityConfigured, requestOwnerPasswordRecovery } from "@/lib/operatorIdentity";
import { operatorRequestOriginAllowed } from "@/lib/operatorSecurity";
import { bodyTooLarge, publicRequestClientKey, readPublicForm } from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

function redirect(request: NextRequest, state: "sent" | "unavailable") {
  const url = new URL("/operations/password-recovery", request.url);
  url.searchParams.set(state, "1");
  const response = NextResponse.redirect(url, 303);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  return response;
}

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request) || !operatorRequestOriginAllowed(request)) {
    return NextResponse.json({ status: "forbidden" }, { status: 403 });
  }
  const rate = checkInMemoryRateLimit(`owner-recovery:${publicRequestClientKey(request)}`, { limit: 4, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) {
    const response = redirect(request, "sent");
    response.headers.set("Retry-After", String(Math.ceil((rate.resetAt - Date.now()) / 1000)));
    return response;
  }

  let form: Record<string, string>;
  try { form = await readPublicForm(request); } catch { return redirect(request, "sent"); }
  const email = String(form.username || form.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) return redirect(request, "sent");
  if (!operatorIdentityConfigured()) return redirect(request, "unavailable");

  const siteUrl = process.env.MMS_SITE_URL?.trim() || "";
  let redirectTo = "";
  try {
    const parsed = new URL(siteUrl);
    if (parsed.protocol !== "https:" && process.env.NODE_ENV === "production") return redirect(request, "unavailable");
    redirectTo = new URL("/operations/recovery", parsed.origin).toString();
  } catch {
    return redirect(request, "unavailable");
  }

  const accepted = await requestOwnerPasswordRecovery(email, redirectTo);
  return redirect(request, accepted ? "sent" : "unavailable");
}
