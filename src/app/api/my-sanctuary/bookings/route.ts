import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { patientAuthFailure } from "@/lib/patientApiResponse";
import { authenticatePatientRequest } from "@/lib/patientRequestAuth";

export async function GET(request: NextRequest) {
  const auth = await authenticatePatientRequest(request);
  if (auth.status !== "authenticated") return patientAuthFailure(auth);
  // An approved server-side customer/booking linkage provider is intentionally not connected in T6.3.
  return NextResponse.json({ status: "not_connected", bookings: [] }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
