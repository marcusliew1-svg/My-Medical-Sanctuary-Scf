import type { PartnerHubSessionClaims } from "@/lib/partnerHubSession";

export type PartnerIdentityUser = {
  id: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
};

type PartnerIdentityPasswordSession = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user?: PartnerIdentityUser;
};

function config() {
  return {
    url: process.env.MMS_PARTNER_SUPABASE_URL?.trim().replace(/\/$/, "") || "",
    key: process.env.MMS_PARTNER_SUPABASE_PUBLISHABLE_KEY?.trim() || "",
  };
}

export function partnerSupabaseAuthConfigured(): boolean {
  const { url, key } = config();
  return Boolean(
    /^https:\/\/[A-Za-z0-9.-]+\.supabase\.co$/.test(url) &&
    key
  );
}

function headers(accessToken?: string) {
  const { key } = config();
  return {
    apikey: key,
    "content-type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

export async function verifyPartnerPassword(
  email: string,
  password: string,
): Promise<{ user: PartnerIdentityUser; accessToken: string } | null> {
  const { url } = config();
  if (!partnerSupabaseAuthConfigured()) return null;

  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!response.ok) return null;
  const payload = (await response.json().catch(() => ({}))) as PartnerIdentityPasswordSession;
  if (!payload.access_token || !payload.user?.id) return null;

  return { user: payload.user, accessToken: payload.access_token };
}

export async function revokeTransientSupabaseSession(accessToken: string): Promise<void> {
  const { url } = config();
  if (!partnerSupabaseAuthConfigured() || !accessToken) return;

  await fetch(`${url}/auth/v1/logout`, {
    method: "POST",
    headers: headers(accessToken),
    cache: "no-store",
  }).catch(() => undefined);
}

export function partnerIdentitySessionMethod(): PartnerHubSessionClaims["authenticationMethod"] {
  return "managed-identity";
}
