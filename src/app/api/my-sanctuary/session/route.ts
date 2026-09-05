import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { patientAuthFailure } from "@/lib/patientApiResponse";
import { authenticatePatientRequest } from "@/lib/patientRequestAuth";

export async function GET(request: NextRequest) {
  const auth = await authenticatePatientRequest(request);
  if (auth.status !== "authenticated") return patientAuthFailure(auth);
  return NextResponse.json({ status: "authenticated", patient: { patientId: auth.claims.patientId, email: auth.claims.email, profile: auth.profile } }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
