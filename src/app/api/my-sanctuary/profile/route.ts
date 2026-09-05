import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { patientAuthFailure } from "@/lib/patientApiResponse";
import { authenticatePatientRequest } from "@/lib/patientRequestAuth";
import { patientAuthOriginAllowed, MMS_PATIENT_ACCESS_TOKEN_COOKIE, patientProfileFromUser, updatePatientIdentityProfile } from "@/lib/patientIdentity";
import { bodyTooLarge, fieldsWithinLimits, hasOnlyFields, isPhone, readPublicForm } from "@/lib/publicSubmission";

const fields = new Set(["fullName", "mobile", "country", "preferredLocation", "communicationPreference"]);
const limits = { fullName: 120, mobile: 40, country: 80, preferredLocation: 40, communicationPreference: 40 };
const locations = new Set(["Bangsar", "SS2", "No preference"]);
const contact = new Set(["Email", "WhatsApp", "Phone"]);

export async function GET(request: NextRequest) {
  const auth = await authenticatePatientRequest(request);
  if (auth.status !== "authenticated") return patientAuthFailure(auth);
  return NextResponse.json({ status: "ok", profile: auth.profile }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}

export async function PUT(request: NextRequest) {
  const auth = await authenticatePatientRequest(request);
  if (auth.status !== "authenticated") return patientAuthFailure(auth);
  if (bodyTooLarge(request) || !patientAuthOriginAllowed(request)) return NextResponse.json({ status: "forbidden" }, { status: 403 });
  let form: Record<string, string>;
  try { form = await readPublicForm(request); } catch { return NextResponse.json({ status: "invalid" }, { status: 400 }); }
  const fullName = String(form.fullName || "").trim();
  const mobile = String(form.mobile || "").trim();
  const country = String(form.country || "").trim();
  if (!hasOnlyFields(form, fields) || !fieldsWithinLimits(form, limits) || fullName.length < 2 || !isPhone(mobile) || !country || !locations.has(form.preferredLocation) || !contact.has(form.communicationPreference)) return NextResponse.json({ status: "invalid" }, { status: 400 });
  const token = request.cookies.get(MMS_PATIENT_ACCESS_TOKEN_COOKIE)?.value || "";
  const updated = await updatePatientIdentityProfile(token, { full_name: fullName, mobile, country, preferred_location: form.preferredLocation, communication_preference: form.communicationPreference });
  if (updated.status !== "ok") return NextResponse.json({ status: updated.status }, { status: updated.status === "unavailable" ? 503 : 401 });
  return NextResponse.json({ status: "ok", profile: patientProfileFromUser(updated.value) }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
