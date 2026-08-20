import { createHash, timingSafeEqual } from "node:crypto";

function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

function bearerToken(authorizationHeader: string | null): string {
  if (!authorizationHeader) return "";
  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || "";
}

function tokenMatches(configuredToken: string, authorizationHeader: string | null): boolean {
  const suppliedToken = bearerToken(authorizationHeader);
  if (!configuredToken || !suppliedToken) return false;
  return timingSafeEqual(sha256(configuredToken), sha256(suppliedToken));
}

export function internalApiConfigured(): boolean {
  return Boolean(process.env.MMS_INTERNAL_API_TOKEN?.trim());
}

export function isValidInternalBearerToken(authorizationHeader: string | null): boolean {
  return tokenMatches(process.env.MMS_INTERNAL_API_TOKEN?.trim() || "", authorizationHeader);
}

/**
 * Finance-sensitive mutations use a separate credential so ordinary internal
 * Sales Partner tooling cannot mark customer funds as cleared.
 */
export function financeApiConfigured(): boolean {
  return Boolean(process.env.MMS_FINANCE_API_TOKEN?.trim());
}

export function isValidFinanceBearerToken(authorizationHeader: string | null): boolean {
  return tokenMatches(process.env.MMS_FINANCE_API_TOKEN?.trim() || "", authorizationHeader);
}
