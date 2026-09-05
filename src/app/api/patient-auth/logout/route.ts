import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authenticatePatientRequest } from "@/lib/patientRequestAuth";
import { MMS_PATIENT_ACCESS_TOKEN_COOKIE, MMS_PATIENT_RECOVERY_TOKEN_COOKIE, patientAuthOriginAllowed, signOutPatientIdentity } from "@/lib/patientIdentity";

export async function POST(request: NextRequest) {
  if (!patientAuthOriginAllowed(request)) return NextResponse.json({ status: "forbidden" }, { status: 403 });
  await authenticatePatientRequest(request);
  const token = request.cookies.get(MMS_PATIENT_ACCESS_TOKEN_COOKIE)?.value || "";
  await signOutPatientIdentity(token);
  const response = NextResponse.redirect(new URL("/login?signed_out=1", request.url), 303);
  for (const name of [MMS_PATIENT_ACCESS_TOKEN_COOKIE, MMS_PATIENT_RECOVERY_TOKEN_COOKIE]) response.cookies.set({ name, value: "", httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}
