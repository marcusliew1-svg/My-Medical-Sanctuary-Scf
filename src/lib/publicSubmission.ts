import type { NextRequest } from "next/server";

export const MAX_PUBLIC_BODY_BYTES = 32_000;

export class PublicSubmissionError extends Error {
  constructor(
    public readonly status: 400 | 413 | 415,
    message: string,
  ) {
    super(message);
  }
}

export function clean(value: unknown, max = 240): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export function isPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return /^[+\d][\d\s().-]{5,39}$/.test(value) && digits.length >= 6 && digits.length <= 20;
}

export function isSafeHttpUrl(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function hasOnlyFields(fields: Record<string, string>, allowedFields: ReadonlySet<string>): boolean {
  return Object.keys(fields).every((key) => allowedFields.has(key));
}

export function fieldsWithinLimits(
  fields: Record<string, string>,
  limits: Readonly<Record<string, number>>,
): boolean {
  return Object.entries(limits).every(([key, limit]) => (fields[key] ?? "").length <= limit);
}

export function bodyTooLarge(request: NextRequest): boolean {
  const length = Number(request.headers.get("content-length") ?? "0");
  return Number.isFinite(length) && length > MAX_PUBLIC_BODY_BYTES;
}

export function publicRequestClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function hasAllowedPublicOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const requestHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
      || request.headers.get("host")?.trim()
      || new URL(request.url).host;
    return originUrl.host === requestHost;
  } catch {
    return false;
  }
}

export async function readPublicForm(request: NextRequest): Promise<Record<string, string>> {
  const contentType = request.headers.get("content-type") ?? "";

  const body = await request.arrayBuffer();
  if (body.byteLength > MAX_PUBLIC_BODY_BYTES) {
    throw new PublicSubmissionError(413, "Request is too large.");
  }

  if (contentType.includes("application/json")) {
    let raw: unknown;
    try {
      raw = JSON.parse(new TextDecoder().decode(body));
    } catch {
      throw new PublicSubmissionError(400, "The request body is invalid.");
    }
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new PublicSubmissionError(400, "The request body is invalid.");
    }
    return Object.fromEntries(
      Object.entries(raw).map(([key, value]) => [key, typeof value === "string" ? value : ""]),
    );
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(new TextDecoder().decode(body)).entries());
  }

  if (contentType.includes("multipart/form-data")) {
    const formData = await new Request(request.url, {
      method: "POST",
      headers: request.headers,
      body,
    }).formData();
    const entries: [string, string][] = [];
    formData.forEach((value, key) => {
      if (typeof value === "string") entries.push([key, value]);
    });
    return Object.fromEntries(entries);
  }

  throw new PublicSubmissionError(415, "Unsupported request format.");
}

export function publicSubmissionErrorStatus(error: unknown): 400 | 413 | 415 {
  return error instanceof PublicSubmissionError ? error.status : 415;
}
