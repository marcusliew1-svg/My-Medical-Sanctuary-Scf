import "server-only";

import type { NextRequest } from "next/server";
import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

export const MMS_PARTNER_ACCESS_TOKEN_COOKIE = "mms_partner_access_token";
export const MMS_PARTNER_RECOVERY_TOKEN_COOKIE = "mms_partner_recovery_token";

export type PartnerIdentityUser = {
  id: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
};

export type PartnerIdentitySession = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user?: PartnerIdentityUser;
};

type IdentityResult<T> =
  | { status: "ok"; value: T }
  | { status: "invalid" }
  | { status: "unavailable" };

function config() {
  const url = process.env.MMS_PARTNER_SUPABASE_URL?.trim().replace(/\/$/, "") || "";
  const key = process.env.MMS_PARTNER_SUPABASE_PUBLISHABLE_KEY?.trim() || "";
  return { url, key };
}

export function partnerIdentityConfigured(): boolean {
  const { url, key } = config();
  return process.env.MMS_PARTNER_HUB_ENABLED === "true" && Boolean(url && key);
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
  if (!partnerIdentityConfigured()) return { status: "unavailable" };
  try {
    const response = await fetch(`${url}/auth/v1/${path}`, { ...init, cache: "no-store" });
    if (!response.ok) return response.status >= 500 ? { status: "unavailable" } : { status: "invalid" };
    return { status: "ok", value: (await response.json()) as T };
  } catch {
    return { status: "unavailable" };
  }
}

export function partnerMetadataFromUser(user: PartnerIdentityUser): { partnerId: string; subject: string } | null {
  // Authorization must use server-controlled app_metadata. user_metadata is intentionally ignored.
  const rawPartnerId = typeof user.app_metadata?.partner_id === "string" ? user.app_metadata.partner_id : null;
  const partnerId = normalisePartnerId(rawPartnerId);
  if (!partnerId || !/^[A-Za-z0-9-]{2,160}$/.test(user.id)) return null;
  return { partnerId, subject: user.id };
}

export function safePartnerNext(value: string | null | undefined, fallback = "/partner-hub"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  if (!(value === "/partner-hub" || value.startsWith("/partner-hub/"))) return fallback;
  return value;
}

export function partnerAuthOriginAllowed(request: NextRequest): boolean {
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

export function partnerIdentityCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

export async function signInPartnerIdentity(email: string, password: string): Promise<IdentityResult<PartnerIdentitySession>> {
  return authRequest<PartnerIdentitySession>("token?grant_type=password", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
}

export async function getPartnerIdentityUser(accessToken: string): Promise<IdentityResult<PartnerIdentityUser>> {
  if (!accessToken) return { status: "invalid" };
  return authRequest<PartnerIdentityUser>("user", {
    method: "GET",
    headers: authHeaders(accessToken),
  });
}

export async function signOutPartnerIdentity(accessToken: string): Promise<void> {
  if (!accessToken || !partnerIdentityConfigured()) return;
  const { url } = config();
  await fetch(`${url}/auth/v1/logout`, {
    method: "POST",
    headers: authHeaders(accessToken),
    cache: "no-store",
  }).catch(() => undefined);
}

export async function requestPartnerPasswordRecovery(email: string, redirectTo: string): Promise<void> {
  const { url } = config();
  if (!partnerIdentityConfigured()) return;
  await fetch(`${url}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email }),
    cache: "no-store",
  }).catch(() => undefined);
}

export async function verifyPartnerAuthTokenHash(
  tokenHash: string,
  type: "recovery" | "signup" | "email_change",
): Promise<IdentityResult<PartnerIdentitySession>> {
  return authRequest<PartnerIdentitySession>("verify", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ token_hash: tokenHash, type }),
  });
}

export async function updatePartnerPassword(accessToken: string, password: string): Promise<IdentityResult<PartnerIdentityUser>> {
  return authRequest<PartnerIdentityUser>("user", {
    method: "PUT",
    headers: authHeaders(accessToken),
    body: JSON.stringify({ password }),
  });
}
