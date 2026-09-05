import "server-only";

import type { NextRequest } from "next/server";

export const MMS_PATIENT_ACCESS_TOKEN_COOKIE = "mms_patient_access_token";
export const MMS_PATIENT_RECOVERY_TOKEN_COOKIE = "mms_patient_recovery_token";

export type PatientIdentityUser = {
  id: string;
  email?: string;
  email_confirmed_at?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
};

export type PatientIdentitySession = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user?: PatientIdentityUser;
};

export type PatientIdentityClaims = {
  patientId: string;
  subject: string;
  customerReference: string | null;
  email: string | null;
};

type IdentityResult<T> =
  | { status: "ok"; value: T }
  | { status: "invalid" }
  | { status: "unavailable" };

function config() {
  const url = process.env.MMS_PATIENT_SUPABASE_URL?.trim().replace(/\/$/, "") || "";
  const key = process.env.MMS_PATIENT_SUPABASE_PUBLISHABLE_KEY?.trim() || "";
  return { url, key };
}

export function patientIdentityConfigured(): boolean {
  const { url, key } = config();
  return process.env.MMS_PATIENT_PORTAL_ENABLED === "true" && Boolean(url && key);
}

export function patientRegistrationEnabled(): boolean {
  return patientIdentityConfigured() && process.env.MMS_PATIENT_REGISTRATION_ENABLED === "true";
}

function authHeaders(accessToken?: string): Record<string, string> {
  const { key } = config();
  return {
    apikey: key,
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

async function authRequest<T>(path: string, init: RequestInit): Promise<IdentityResult<T>> {
  const { url } = config();
  if (!patientIdentityConfigured()) return { status: "unavailable" };
  try {
    const response = await fetch(`${url}/auth/v1/${path}`, { ...init, cache: "no-store" });
    if (!response.ok) return response.status >= 500 ? { status: "unavailable" } : { status: "invalid" };
    return { status: "ok", value: (await response.json()) as T };
  } catch {
    return { status: "unavailable" };
  }
}

function safeReference(value: unknown): string | null {
  return typeof value === "string" && /^[A-Za-z0-9_-]{4,160}$/.test(value.trim()) ? value.trim() : null;
}

export function patientClaimsFromUser(user: PatientIdentityUser): PatientIdentityClaims | null {
  const metadata = user.app_metadata || {};
  const accountType = metadata.account_type;
  const hasConflictingRole = Boolean(
    metadata.partner_id || metadata.operator_id || metadata.operator_roles || metadata.health_intelligence_roles,
  );
  if (accountType !== "patient" || hasConflictingRole || !user.email_confirmed_at) return null;
  if (!/^[A-Za-z0-9-]{2,160}$/.test(user.id)) return null;
  return {
    patientId: user.id,
    subject: user.id,
    customerReference: safeReference(metadata.customer_reference),
    email: typeof user.email === "string" ? user.email.slice(0, 254) : null,
  };
}

export function patientProfileFromUser(user: PatientIdentityUser) {
  const profile = user.user_metadata || {};
  return {
    fullName: typeof profile.full_name === "string" ? profile.full_name.slice(0, 120) : "",
    mobile: typeof profile.mobile === "string" ? profile.mobile.slice(0, 40) : "",
    country: typeof profile.country === "string" ? profile.country.slice(0, 80) : "",
    preferredLocation: typeof profile.preferred_location === "string" ? profile.preferred_location.slice(0, 40) : "",
    communicationPreference: typeof profile.communication_preference === "string" ? profile.communication_preference.slice(0, 40) : "",
  };
}

export function safePatientNext(value: string | null | undefined, fallback = "/my-sanctuary"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  if (!(value === "/my-sanctuary" || value.startsWith("/my-sanctuary/"))) return fallback;
  return value;
}

export function patientAuthOriginAllowed(request: NextRequest): boolean {
  const origin = request.headers.get("origin")?.trim();
  if (!origin) return false;
  try {
    const requestHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
      || request.headers.get("host")?.trim()
      || new URL(request.url).host;
    return new URL(origin).host === requestHost;
  } catch {
    return false;
  }
}

export function patientIdentityCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

export function patientSessionMaxAge(identityExpiresIn?: number): number {
  const configured = Number(process.env.MMS_PATIENT_SESSION_MAX_AGE_SECONDS || 3600);
  const bounded = Number.isFinite(configured) ? Math.min(Math.max(Math.floor(configured), 300), 3600) : 3600;
  return Math.min(bounded, Math.max(60, Math.floor(identityExpiresIn || bounded)));
}

export async function registerPatientIdentity(input: {
  email: string;
  password: string;
  emailRedirectTo: string;
  profile: Record<string, string>;
}): Promise<IdentityResult<PatientIdentitySession>> {
  if (!patientRegistrationEnabled()) return { status: "unavailable" };
  return authRequest<PatientIdentitySession>(`signup?redirect_to=${encodeURIComponent(input.emailRedirectTo)}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email: input.email, password: input.password, data: input.profile }),
  });
}

export async function signInPatientIdentity(email: string, password: string): Promise<IdentityResult<PatientIdentitySession>> {
  return authRequest<PatientIdentitySession>("token?grant_type=password", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
}

export async function getPatientIdentityUser(accessToken: string): Promise<IdentityResult<PatientIdentityUser>> {
  if (!accessToken) return { status: "invalid" };
  return authRequest<PatientIdentityUser>("user", { method: "GET", headers: authHeaders(accessToken) });
}

export async function updatePatientIdentityProfile(
  accessToken: string,
  profile: Record<string, string>,
): Promise<IdentityResult<PatientIdentityUser>> {
  return authRequest<PatientIdentityUser>("user", {
    method: "PUT",
    headers: authHeaders(accessToken),
    body: JSON.stringify({ data: profile }),
  });
}

export async function signOutPatientIdentity(accessToken: string): Promise<void> {
  if (!accessToken || !patientIdentityConfigured()) return;
  const { url } = config();
  await fetch(`${url}/auth/v1/logout`, {
    method: "POST",
    headers: authHeaders(accessToken),
    cache: "no-store",
  }).catch(() => undefined);
}

export async function requestPatientPasswordRecovery(email: string, redirectTo: string): Promise<void> {
  const { url } = config();
  if (!patientIdentityConfigured()) return;
  await fetch(`${url}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email }),
    cache: "no-store",
  }).catch(() => undefined);
}

export async function verifyPatientAuthTokenHash(
  tokenHash: string,
  type: "recovery" | "signup" | "email_change",
): Promise<IdentityResult<PatientIdentitySession>> {
  return authRequest<PatientIdentitySession>("verify", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ token_hash: tokenHash, type }),
  });
}

export async function updatePatientPassword(
  accessToken: string,
  password: string,
): Promise<IdentityResult<PatientIdentityUser>> {
  return authRequest<PatientIdentityUser>("user", {
    method: "PUT",
    headers: authHeaders(accessToken),
    body: JSON.stringify({ password }),
  });
}
