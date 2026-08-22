export const MMS_SUPABASE_ACCESS_COOKIE = "mms_supabase_access_token";
export const MMS_SUPABASE_REFRESH_COOKIE = "mms_supabase_refresh_token";

export type SupabaseAuthUser = {
  id: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
};

export type SupabasePasswordSession = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user?: SupabaseAuthUser;
};

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
  return { url, key };
}

export function supabaseAuthConfigured() {
  const { url, key } = config();
  return Boolean(url && key);
}

function authHeaders(accessToken?: string) {
  const { key } = config();
  return {
    apikey: key,
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

export async function signInWithPassword(email: string, password: string): Promise<SupabasePasswordSession | null> {
  const { url } = config();
  if (!supabaseAuthConfigured()) return null;
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as SupabasePasswordSession;
}

export async function refreshSupabaseSession(refreshToken: string): Promise<SupabasePasswordSession | null> {
  const { url } = config();
  if (!supabaseAuthConfigured() || !refreshToken) return null;
  const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as SupabasePasswordSession;
}

export async function getSupabaseUser(accessToken: string): Promise<SupabaseAuthUser | null> {
  const { url } = config();
  if (!supabaseAuthConfigured() || !accessToken) return null;
  const response = await fetch(`${url}/auth/v1/user`, {
    method: "GET",
    headers: authHeaders(accessToken),
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as SupabaseAuthUser;
}

export async function signOutSupabaseSession(accessToken: string) {
  const { url } = config();
  if (!supabaseAuthConfigured() || !accessToken) return;
  await fetch(`${url}/auth/v1/logout`, {
    method: "POST",
    headers: authHeaders(accessToken),
    cache: "no-store",
  }).catch(() => undefined);
}

export function authCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function safeRelativeNext(value: string | null | undefined, fallback = "/partner-hub") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
