import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { bodyTooLarge, fieldsWithinLimits, hasOnlyFields, isEmail, isPhone, publicRequestClientKey, readPublicForm } from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";
import { patientAuthOriginAllowed, patientRegistrationEnabled, registerPatientIdentity, signOutPatientIdentity } from "@/lib/patientIdentity";

export const dynamic = "force-dynamic";
const fields = new Set(["fullName", "email", "password", "confirmPassword", "mobile", "country", "preferredLocation", "communicationPreference", "consent", "sourcePath", "website"]);
const limits = { fullName: 120, email: 254, password: 128, confirmPassword: 128, mobile: 40, country: 80, preferredLocation: 40, communicationPreference: 40, consent: 10, sourcePath: 80, website: 120 };
const locations = new Set(["Bangsar", "SS2", "No preference"]);
const contact = new Set(["Email", "WhatsApp", "Phone"]);

function redirect(request: NextRequest, key: string) { return NextResponse.redirect(new URL(`/register?${key}=1`, request.url), 303); }

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request) || !patientAuthOriginAllowed(request)) return NextResponse.json({ status: "forbidden" }, { status: 403 });
  const rate = checkInMemoryRateLimit(`patient-register:${publicRequestClientKey(request)}`, { limit: 4, windowMs: 30 * 60 * 1000 });
  if (!rate.allowed) return redirect(request, "submitted");
  let form: Record<string, string>;
  try { form = await readPublicForm(request); } catch { return redirect(request, "invalid"); }
  if (form.website) return redirect(request, "submitted");
  if (!hasOnlyFields(form, fields) || !fieldsWithinLimits(form, limits)) return redirect(request, "invalid");
  const fullName = String(form.fullName || "").trim();
  const email = String(form.email || "").trim().toLowerCase();
  const mobile = String(form.mobile || "").trim();
  const country = String(form.country || "").trim();
  const password = String(form.password || "");
  const valid = fullName.length >= 2 && isEmail(email) && isPhone(mobile)
    && password.length >= 12 && password === String(form.confirmPassword || "") && Boolean(country)
    && locations.has(form.preferredLocation) && contact.has(form.communicationPreference)
    && form.consent === "true" && form.sourcePath === "/register";
  if (!valid) return redirect(request, "invalid");
  if (!patientRegistrationEnabled()) return redirect(request, "unavailable");
  const callback = new URL("/api/patient-auth/callback", request.url);
  callback.searchParams.set("next", "/login");
  const result = await registerPatientIdentity({
    email, password, emailRedirectTo: callback.toString(),
    profile: { full_name: fullName, mobile, country, preferred_location: form.preferredLocation, communication_preference: form.communicationPreference },
  });
  if (result.status === "ok" && result.value.access_token) await signOutPatientIdentity(result.value.access_token);
  return redirect(request, result.status === "unavailable" ? "unavailable" : "submitted");
}
