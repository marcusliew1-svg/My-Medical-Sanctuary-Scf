import "server-only";

import type { NextRequest } from "next/server";
import {
  getPatientIdentityUser,
  MMS_PATIENT_ACCESS_TOKEN_COOKIE,
  patientClaimsFromUser,
  patientIdentityConfigured,
  patientProfileFromUser,
  type PatientIdentityClaims,
} from "@/lib/patientIdentity";

export type PatientRequestAuthResult =
  | { status: "authenticated"; claims: PatientIdentityClaims; profile: ReturnType<typeof patientProfileFromUser> }
  | { status: "unauthenticated"; reason: string }
  | { status: "forbidden"; reason: string }
  | { status: "unavailable"; reason: string };

export async function authenticatePatientToken(accessToken: string): Promise<PatientRequestAuthResult> {
  if (!patientIdentityConfigured()) return { status: "unavailable", reason: "Patient identity is not configured." };
  if (!accessToken) return { status: "unauthenticated", reason: "Patient session is required." };
  const identity = await getPatientIdentityUser(accessToken);
  if (identity.status === "unavailable") return { status: "unavailable", reason: "Patient identity verification is unavailable." };
  if (identity.status !== "ok") return { status: "unauthenticated", reason: "Patient session is invalid or expired." };
  const claims = patientClaimsFromUser(identity.value);
  if (!claims) return { status: "forbidden", reason: "This identity is not an active patient account." };
  return { status: "authenticated", claims, profile: patientProfileFromUser(identity.value) };
}

export async function authenticatePatientRequest(request: NextRequest): Promise<PatientRequestAuthResult> {
  return authenticatePatientToken(request.cookies.get(MMS_PATIENT_ACCESS_TOKEN_COOKIE)?.value?.trim() || "");
}
