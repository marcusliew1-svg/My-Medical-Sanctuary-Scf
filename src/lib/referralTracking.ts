import { normalisePartnerId } from "@/lib/salesPartnerPolicy";

export const REFERRAL_QUERY_KEY = "ref";

export type ReferralAttribution = {
  partnerId: string;
  sourcePath: string;
  capturedAt: string;
};

export function referralPartnerId(value: string | null | undefined): string {
  return normalisePartnerId(value);
}

export function buildReferralPath(pathname: string, partnerId: string): string {
  const cleanPartnerId = normalisePartnerId(partnerId);
  if (!cleanPartnerId) throw new Error("A valid MMS Partner ID is required.");

  const basePath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const params = new URLSearchParams({ [REFERRAL_QUERY_KEY]: cleanPartnerId });
  return `${basePath}?${params.toString()}`;
}

export function readReferralFromUrl(url: URL): ReferralAttribution | null {
  const partnerId = normalisePartnerId(url.searchParams.get(REFERRAL_QUERY_KEY));
  if (!partnerId) return null;

  return {
    partnerId,
    sourcePath: url.pathname,
    capturedAt: new Date().toISOString(),
  };
}

export function referralCookieValue(attribution: ReferralAttribution): string {
  return JSON.stringify(attribution);
}

// Attribution storage must be written server-side or through a controlled first-party endpoint.
// Do not store customer health information in referral cookies, URLs, QR codes or partner-visible data.
