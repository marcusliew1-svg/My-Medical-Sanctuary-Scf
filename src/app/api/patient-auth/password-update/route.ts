import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { MMS_PATIENT_RECOVERY_TOKEN_COOKIE, patientAuthOriginAllowed, signOutPatientIdentity, updatePatientPassword } from "@/lib/patientIdentity";
import { bodyTooLarge, readPublicForm } from "@/lib/publicSubmission";

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request) || !patientAuthOriginAllowed(request)) return NextResponse.json({ status: "forbidden" }, { status: 403 });
  const token = request.cookies.get(MMS_PATIENT_RECOVERY_TOKEN_COOKIE)?.value?.trim() || "";
  if (!token) return NextResponse.redirect(new URL("/patient-password-update?error=invalid_link", request.url), 303);
  let form: Record<string, string>;
  try { form = await readPublicForm(request); } catch { return NextResponse.redirect(new URL("/patient-password-update?error=invalid_password", request.url), 303); }
  const password = String(form.password || "");
  if (password.length < 12 || password.length > 128 || password !== String(form.confirmPassword || "")) return NextResponse.redirect(new URL("/patient-password-update?error=invalid_password", request.url), 303);
  const updated = await updatePatientPassword(token, password);
  if (updated.status !== "ok") return NextResponse.redirect(new URL("/patient-password-update?error=invalid_link", request.url), 303);
  await signOutPatientIdentity(token);
  const response = NextResponse.redirect(new URL("/login?reset=1", request.url), 303);
  response.cookies.set({ name: MMS_PATIENT_RECOVERY_TOKEN_COOKIE, value: "", httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return response;
}
