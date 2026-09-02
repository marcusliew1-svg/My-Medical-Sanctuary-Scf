import "server-only";

import { createHmac, randomBytes } from "node:crypto";
import type { OperatorRole, OperatorSessionClaims } from "@/lib/operatorSecurity";

export const MMS_OPERATOR_ACCESS_TOKEN_COOKIE = "mms_operator_access_token";

const OPERATOR_ROLE_SET = new Set<OperatorRole>(["operations", "finance", "admin", "auditor"]);
const DEFAULT_OPERATOR_SESSION_SECONDS = 15 * 60;

export type OperatorIdentityUser = {
  id: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
};

export type OperatorIdentitySession = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user?: OperatorIdentityUser;
};

function config() {
  const url = process.env.MMS_OPERATOR_SUPABASE_URL?.replace(/\/$/, "") || "";
  const key = process.env.MMS_OPERATOR_SUPABASE_PUBLISHABLE_KEY?.trim() || "";
  return { url, key };
}

function sessionSecret() {
  return process.env.MMS_OPERATOR_SESSION_SECRET?.trim() || "";
}

export function operatorIdentityConfigured() {
  const { url, key } = config();
  return process.env.MMS_OPERATOR_ACCESS_ENABLED === "true" && Boolean(url && key) && sessionSecret().length >= 32;
}

function headers(accessToken?: string) {
  const { key } = config();
  return {
    apikey: key,
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

export async function signInOperatorIdentity(email: string, password: string): Promise<OperatorIdentitySession | null> {
  const { url } = config();
  if (!operatorIdentityConfigured()) return null;
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as OperatorIdentitySession;
}

export async function getOperatorIdentityUser(accessToken: string): Promise<OperatorIdentityUser | null> {
  const { url } = config();
  if (!operatorIdentityConfigured() || !accessToken) return null;
  const response = await fetch(`${url}/auth/v1/user`, {
    method: "GET",
    headers: headers(accessToken),
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as OperatorIdentityUser;
}

export async function signOutOperatorIdentity(accessToken: string) {
  const { url } = config();
  if (!operatorIdentityConfigured() || !accessToken) return;
  await fetch(`${url}/auth/v1/logout`, {
    method: "POST",
    headers: headers(accessToken),
    cache: "no-store",
  }).catch(() => undefined);
}

export function operatorMetadataFromUser(user: OperatorIdentityUser) {
  const operatorId = typeof user.app_metadata?.operator_id === "string" ? user.app_metadata.operator_id.trim() : "";
  const rawRoles = Array.isArray(user.app_metadata?.operator_roles) ? user.app_metadata?.operator_roles : [];
  const roles = rawRoles.filter((value): value is OperatorRole => typeof value === "string" && OPERATOR_ROLE_SET.has(value as OperatorRole));
  const uniqueRoles = [...new Set(roles)];

  if (!/^[A-Za-z0-9._@:+-]{2,160}$/.test(operatorId)) return null;
  if (!uniqueRoles.length) return null;
  return { operatorId, roles: uniqueRoles };
}

function operatorSessionSeconds() {
  const raw = Number(process.env.MMS_OPERATOR_SESSION_MAX_AGE_SECONDS || DEFAULT_OPERATOR_SESSION_SECONDS);
  if (!Number.isFinite(raw) || raw <= 0) return DEFAULT_OPERATOR_SESSION_SECONDS;
  return Math.min(Math.max(Math.floor(raw), 300), 3600);
}

export function issueOperatorSession(user: OperatorIdentityUser, options?: { stepUp?: boolean }) {
  const metadata = operatorMetadataFromUser(user);
  const secret = sessionSecret();
  if (!metadata || secret.length < 32) return null;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + operatorSessionSeconds() * 1000);
  const claims: OperatorSessionClaims = {
    sessionId: randomBytes(24).toString("base64url"),
    operatorId: metadata.operatorId,
    subject: user.id,
    roles: metadata.roles,
    issuedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    ...(options?.stepUp ? { stepUpAt: now.toISOString() } : {}),
    authenticationMethod: "managed-identity",
  };

  const payload = Buffer.from(JSON.stringify(claims), "utf8").toString("base64url");
  const signature = createHmac("sha256", secret).update(payload, "utf8").digest("base64url");
  return { token: `${payload}.${signature}`, claims, maxAge: operatorSessionSeconds() };
}

export function operatorIdentityCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

export function safeOperatorNext(value: string | null | undefined, fallback = "/operations") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  if (!(value === "/operations" || value.startsWith("/operations/"))) return fallback;
  return value;
}
