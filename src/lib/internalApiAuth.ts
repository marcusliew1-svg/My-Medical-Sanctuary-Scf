import { createHash, timingSafeEqual } from "node:crypto";

function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

export function internalApiConfigured(): boolean {
  return Boolean(process.env.MMS_INTERNAL_API_TOKEN?.trim());
}

export function isValidInternalBearerToken(authorizationHeader: string | null): boolean {
  const configuredToken = process.env.MMS_INTERNAL_API_TOKEN?.trim() || "";
  if (!configuredToken || !authorizationHeader) return false;

  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  const suppliedToken = match?.[1]?.trim() || "";
  if (!suppliedToken) return false;

  return timingSafeEqual(sha256(configuredToken), sha256(suppliedToken));
}
