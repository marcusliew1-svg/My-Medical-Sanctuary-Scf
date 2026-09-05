import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { bodyTooLarge, publicRequestClientKey, readPublicForm } from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";
import {
  MMS_PATIENT_ACCESS_TOKEN_COOKIE,
  patientAuthOriginAllowed,
  patientClaimsFromUser,
  patientIdentityConfigured,
  patientIdentityCookieOptions,
  patientSessionMaxAge,
  safePatientNext,
  signInPatientIdentity,
  signOutPatientIdentity,
} from "@/lib/patientIdentity";

export const dynamic = "force-dynamic";

function fail(request: NextRequest, next: string, unavailable = false) {
  const url = new URL("/login", request.url);
  url.searchParams.set("next", next);
  url.searchParams.set("error", unavailable ? "auth_unavailable" : "invalid_credentials");
  return NextResponse.redirect(url, 303);
}

export async function POST(request: NextRequest) {
  const fallback = "/my-sanctuary";
  if (bodyTooLarge(request) || !patientAuthOriginAllowed(request)) {
    return NextResponse.json({ status: "forbidden", message: "Sign-in request was not accepted." }, { status: 403 });
  }
  const rate = checkInMemoryRateLimit(`patient-login:${publicRequestClientKey(request)}`, { limit: 8, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) return fail(request, fallback);
  let form: Record<string, string>;
  try { form = await readPublicForm(request); } catch { return fail(request, fallback); }
  const next = safePatientNext(form.next);
  if (form.website) return fail(request, next);
  const email = String(form.email || "").trim().toLowerCase();
  const password = String(form.password || "");
  if (!patientIdentityConfigured()) return fail(request, next, true);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !password || password.length > 512) return fail(request, next);

  const identity = await signInPatientIdentity(email, password);
  const claims = identity.status === "ok" && identity.value.user ? patientClaimsFromUser(identity.value.user) : null;
  if (identity.status !== "ok" || !identity.value.access_token || !claims) {
    if (identity.status === "ok" && identity.value.access_token) await signOutPatientIdentity(identity.value.access_token);
    return fail(request, next, identity.status === "unavailable");
  }
  const maxAge = patientSessionMaxAge(identity.value.expires_in);
  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(MMS_PATIENT_ACCESS_TOKEN_COOKIE, identity.value.access_token, patientIdentityCookieOptions(maxAge));
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}
