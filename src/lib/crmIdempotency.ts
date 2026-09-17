import { createHash } from "node:crypto";

function normalizedEmail(value?: string): string {
  return value?.trim().toLowerCase() || "";
}

function normalizedMobile(value?: string): string {
  return value?.replace(/\D/g, "") || "";
}

export function crmContactFingerprint(input: { email?: string; mobile?: string }): string {
  const email = normalizedEmail(input.email);
  const mobile = normalizedMobile(input.mobile);
  if (!email && !mobile) throw new Error("A CRM contact fingerprint requires email or mobile.");
  return createHash("sha256").update(`${email}|${mobile}`).digest("hex");
}

export function crmIdempotencyKey(input: {
  source: string;
  sourceRequestId: string;
  email?: string;
  mobile?: string;
}): string {
  const source = input.source.trim().toLowerCase();
  const requestId = input.sourceRequestId.trim();
  if (!source || !requestId) throw new Error("CRM source and source request ID are required.");
  return `mms-crm-${createHash("sha256")
    .update(`${source}|${requestId}|${crmContactFingerprint(input)}`)
    .digest("hex")}`;
}

export class SyntheticCrmIdempotencyStore {
  private readonly results = new Map<string, string>();

  resultFor(key: string): string | null {
    return this.results.get(key) || null;
  }

  record(key: string, crmLeadId: string): void {
    const current = this.results.get(key);
    if (current && current !== crmLeadId) throw new Error("CRM idempotency conflict.");
    this.results.set(key, crmLeadId);
  }
}
