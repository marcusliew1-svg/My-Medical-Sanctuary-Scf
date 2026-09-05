import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { MMS_PATIENT_RECOVERY_TOKEN_COOKIE, patientIdentityCookieOptions, signOutPatientIdentity, verifyPatientAuthTokenHash } from "@/lib/patientIdentity";

const verificationTypes = new Set(["recovery", "signup", "email_change"]);
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash")?.trim() || "";
  const rawType = request.nextUrl.searchParams.get("type")?.trim() || "";
  if (!/^[A-Za-z0-9_-]{20,512}$/.test(tokenHash) || !verificationTypes.has(rawType)) return NextResponse.redirect(new URL("/login?error=invalid_link", request.url), 303);
  const type = rawType as "recovery" | "signup" | "email_change";
  const verified = await verifyPatientAuthTokenHash(tokenHash, type);
  if (verified.status !== "ok" || !verified.value.access_token) return NextResponse.redirect(new URL("/login?error=invalid_link", request.url), 303);
  if (type === "recovery") {
    const response = NextResponse.redirect(new URL("/patient-password-update", request.url), 303);
    response.cookies.set(MMS_PATIENT_RECOVERY_TOKEN_COOKIE, verified.value.access_token, patientIdentityCookieOptions(Math.min(600, Math.max(60, verified.value.expires_in || 600))));
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    return response;
  }
  // Email verification proves email control only; trusted staff must assign the patient account type.
  await signOutPatientIdentity(verified.value.access_token);
  return NextResponse.redirect(new URL("/login?verified=1", request.url), 303);
}
