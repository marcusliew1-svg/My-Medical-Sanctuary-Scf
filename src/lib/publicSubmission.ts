import type { NextRequest } from "next/server";

export const MAX_PUBLIC_BODY_BYTES = 32_000;

export function clean(value: unknown, max = 240): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export function bodyTooLarge(request: NextRequest): boolean {
  const length = Number(request.headers.get("content-length") ?? "0");
  return Number.isFinite(length) && length > MAX_PUBLIC_BODY_BYTES;
}

export async function readPublicForm(request: NextRequest): Promise<Record<string, string>> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const raw = (await request.json()) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, clean(value, 2_000)]));
  }

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const entries: [string, string][] = [];
    formData.forEach((value, key) => {
      if (typeof value === "string") entries.push([key, clean(value, 2_000)]);
    });
    return Object.fromEntries(entries);
  }

  throw new Error("unsupported_content_type");
}
