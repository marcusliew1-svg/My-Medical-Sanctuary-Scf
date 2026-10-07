import "server-only";
import { randomUUID } from "node:crypto";

const sensitiveKey = /(authorization|cookie|secret|token|password|credential|connection|database[_-]?url|refresh[_-]?token|client[_-]?secret)/i;

function sanitize(value: unknown, depth = 0): unknown {
  if (depth > 3) return "[truncated]";
  if (Array.isArray(value)) return value.slice(0, 25).map((item) => sanitize(item, depth + 1));
  if (value && typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      output[key] = sensitiveKey.test(key) ? "[redacted]" : sanitize(item, depth + 1);
    }
    return output;
  }
  if (typeof value === "string" && value.length > 500) return value.slice(0, 500) + "…";
  return value;
}

export function operationalRequestId(request?: Request): string {
  const inbound = request?.headers.get("x-request-id")?.trim() || "";
  return /^[A-Za-z0-9._:-]{8,128}$/.test(inbound) ? inbound : randomUUID();
}

export function operationalLog(
  level: "info" | "warn" | "error",
  event: string,
  details: Record<string, unknown> = {},
) {
  const record = {
    ts: new Date().toISOString(),
    level,
    service: "mms-web",
    event,
    ...sanitize(details) as Record<string, unknown>,
  };
  const line = JSON.stringify(record);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
}
