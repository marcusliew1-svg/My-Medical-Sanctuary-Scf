import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { patientAuthOriginAllowed, patientIdentityConfigured, requestPatientPasswordRecovery } from "@/lib/patientIdentity";
import { bodyTooLarge, publicRequestClientKey, readPublicForm } from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request) || !patientAuthOriginAllowed(request)) return NextResponse.json({ status: "forbidden" }, { status: 403 });
  const generic = () => NextResponse.redirect(new URL("/patient-password-recovery?sent=1", request.url), 303);
  const rate = checkInMemoryRateLimit(`patient-recovery:${publicRequestClientKey(request)}`, { limit: 4, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) return generic();
  let form: Record<string, string> = {};
  try { form = await readPublicForm(request); } catch { return generic(); }
  const email = String(form.email || "").trim().toLowerCase();
  if (!form.website && patientIdentityConfigured() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254) {
    await requestPatientPasswordRecovery(email, new URL("/api/patient-auth/callback?next=/patient-password-update", request.url).toString());
  }
  return generic();
}
