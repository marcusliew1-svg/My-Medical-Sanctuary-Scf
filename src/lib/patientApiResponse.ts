import { NextResponse } from "next/server";
import type { PatientRequestAuthResult } from "@/lib/patientRequestAuth";

export function patientAuthFailure(auth: Exclude<PatientRequestAuthResult, { status: "authenticated" }>) {
  const status = auth.status === "forbidden" ? 403 : auth.status === "unavailable" ? 503 : 401;
  return NextResponse.json({ status: auth.status, message: auth.reason }, { status, headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
