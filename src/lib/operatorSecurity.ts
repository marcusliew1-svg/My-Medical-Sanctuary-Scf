import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import {
  MMS_OPERATOR_ACCESS_TOKEN_COOKIE,
  getOperatorIdentityUser,
  operatorMetadataFromUser,
} from "@/lib/operatorIdentity";

export const MMS_OPERATOR_SESSION_COOKIE = "mms_operator_session";

export type OperatorRole = "operations" | "finance" | "admin" | "auditor";

export type OperatorSessionClaims = {
  sessionId: string;
  operatorId: string;
  subject: string;
  roles: OperatorRole[];
  issuedAt: string;
  expiresAt: string;
  stepUpAt?: string;
  authenticationMethod: "oidc" | "sso" | "managed-identity";
};

export type OperatorAuthResult =
  | { status: "authenticated"; claims: OperatorSessionClaims }
  | { status: "unauthenticated"; reason: string }
  | { status: "unavailable"; reason: string };

export type OperatorReadResult =
  | { status: "ok"; claims: OperatorSessionClaims }
  | { status: "unauthorized"; reason: string }
  | { status: "forbidden"; reason: string }
  | { status: "unavailable"; reason: string };

export type OperatorMutationResult =
  | { status: "ok"; claims: OperatorSessionClaims; actor: string; occurredAt: string }
  | { status: "unauthorized"; reason: string }
  | { status: "forbidden"; reason: string }
  | { status: "unavailable"; reason: string };

const ROLE_SET = new Set<OperatorRole>(["operations", "finance", "admin", "auditor"]);
const DEFAULT_STEP_UP_MAX_AGE_SECONDS = 10 * 60;

function base64urlDecode(value: string): Buffer {
  return Buffer.from(value, "base64url");
}

function operatorSessionSecret(): string {
  return process.env.MMS_OPERATOR_SESSION_SECRET?.trim() || "";
}

function operatorAccessEnabled(): boolean {
  return process.env.MMS_OPERATOR_ACCESS_ENABLED === "true";
}

function configuredSiteOrigin(): string {
  const raw = process.env.MMS_SITE_URL?.trim() || "";
  if (!raw) return "";
  try {
    return new URL(raw).origin;
  } catch {
    return "";
  }
}

function parseTimestamp(value: string, field: string): number {
  const timestamp = Date.parse(value);
  if (!value || Number.isNaN(timestamp)) throw new Error(`${field} must be a valid timestamp.`);
  return timestamp;
}

function normaliseClaims(input: unknown, now = Date.now()): OperatorSessionClaims {
  if (!input || typeof input !== "object") throw new Error("Operator session claims are invalid.");
  const claims = input as Partial<OperatorSessionClaims>;
  const sessionId = typeof claims.sessionId === "string" ? claims.sessionId.trim() : "";
  const operatorId = typeof claims.operatorId === "string" ? claims.operatorId.trim() : "";
  const subject = typeof claims.subject === "string" ? claims.subject.trim() : "";
  const issuedAtValue = typeof claims.issuedAt === "string" ? claims.issuedAt : "";
  const expiresAtValue = typeof claims.expiresAt === "string" ? claims.expiresAt : "";
  const roles = Array.isArray(claims.roles) ? claims.roles.filter((role): role is OperatorRole => ROLE_SET.has(role as OperatorRole)) : [];

  if (!/^[A-Za-z0-9_-]{16,200}$/.test(sessionId)) throw new Error("Operator session ID is invalid.");
  if (!/^[A-Za-z0-9._@:+-]{2,160}$/.test(operatorId)) throw new Error("Operator ID is invalid.");
  if (!subject) throw new Error("Operator session subject is required.");
  if (!roles.length || roles.length !== new Set(roles).size) throw new Error("Operator roles are invalid.");
  if (!claims.authenticationMethod || !["oidc", "sso", "managed-identity"].includes(claims.authenticationMethod)) {
    throw new Error("Operator authentication method is invalid.");
  }

  const issuedAt = parseTimestamp(issuedAtValue, "issuedAt");
  const expiresAt = parseTimestamp(expiresAtValue, "expiresAt");
  if (expiresAt <= issuedAt || expiresAt <= now) throw new Error("Operator session has expired.");
  if (issuedAt > now + 5 * 60 * 1000) throw new Error("Operator session issue time is invalid.");

  let stepUpAt: string | undefined;
  if (claims.stepUpAt) {
    const stepUpTimestamp = parseTimestamp(claims.stepUpAt, "stepUpAt");
    if (stepUpTimestamp < issuedAt || stepUpTimestamp > now + 5 * 60 * 1000) throw new Error("Operator step-up time is invalid.");
    stepUpAt = claims.stepUpAt;
  }

  return {
    sessionId,
    operatorId,
    subject,
    roles,
    issuedAt: issuedAtValue,
    expiresAt: expiresAtValue,
    stepUpAt,
    authenticationMethod: claims.authenticationMethod,
  };
}

function verifySignedSessionToken(token: string): OperatorSessionClaims {
  const secret = operatorSessionSecret();
  if (secret.length < 32) throw new Error("Operator session secret is not configured securely.");
  const [payloadEncoded, signatureEncoded, ...rest] = token.split(".");
  if (!payloadEncoded || !signatureEncoded || rest.length) throw new Error("Operator session token is malformed.");

  const supplied = base64urlDecode(signatureEncoded);
  const expected = createHmac("sha256", secret).update(payloadEncoded, "utf8").digest();
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) throw new Error("Operator session signature is invalid.");

  let payload: unknown;
  try {
    payload = JSON.parse(base64urlDecode(payloadEncoded).toString("utf8"));
  } catch {
    throw new Error("Operator session payload is invalid.");
  }
  return normaliseClaims(payload);
}

function rolesMatch(left: OperatorRole[], right: OperatorRole[]) {
  if (left.length !== right.length) return false;
  const a = [...left].sort();
  const b = [...right].sort();
  return a.every((role, index) => role === b[index]);
}

export function operatorSessionProviderAvailable(): boolean {
  return operatorAccessEnabled() && operatorSessionSecret().length >= 32;
}

export async function authenticateOperatorRequest(request: NextRequest): Promise<OperatorAuthResult> {
  if (!operatorAccessEnabled()) return { status: "unavailable", reason: "MMS operator access is disabled." };
  if (!operatorSessionProviderAvailable()) return { status: "unavailable", reason: "MMS operator session verification is not configured." };

  const token = request.cookies.get(MMS_OPERATOR_SESSION_COOKIE)?.value?.trim() || "";
  const accessToken = request.cookies.get(MMS_OPERATOR_ACCESS_TOKEN_COOKIE)?.value?.trim() || "";
  if (!token || !accessToken) return { status: "unauthenticated", reason: "Operator session is required." };

  try {
    const claims = verifySignedSessionToken(token);
    const user = await getOperatorIdentityUser(accessToken);
    const metadata = user ? operatorMetadataFromUser(user) : null;
    if (!user || !metadata) return { status: "unauthenticated", reason: "Operator identity is invalid or revoked." };
    if (user.id !== claims.subject || metadata.operatorId !== claims.operatorId || !rolesMatch(metadata.roles, claims.roles)) {
      return { status: "unauthenticated", reason: "Operator authorization has changed. Sign in again." };
    }
    return { status: "authenticated", claims };
  } catch {
    return { status: "unauthenticated", reason: "Operator session is invalid or expired." };
  }
}

function hasRequiredRole(claims: OperatorSessionClaims, allowedRoles: readonly OperatorRole[]): boolean {
  if (claims.roles.includes("admin")) return true;
  return allowedRoles.some((role) => claims.roles.includes(role));
}

export async function requireOperatorRead(
  request: NextRequest,
  options: { roles: readonly OperatorRole[] },
): Promise<OperatorReadResult> {
  const auth = await authenticateOperatorRequest(request);
  if (auth.status === "unavailable") return { status: "unavailable", reason: auth.reason };
  if (auth.status !== "authenticated") return { status: "unauthorized", reason: auth.reason };
  if (!hasRequiredRole(auth.claims, options.roles)) return { status: "forbidden", reason: "Operator role is not permitted for this view." };
  return { status: "ok", claims: auth.claims };
}

function hasRecentStepUp(claims: OperatorSessionClaims, now = Date.now()): boolean {
  if (!claims.stepUpAt) return false;
  const maxAgeSecondsRaw = Number(process.env.MMS_OPERATOR_STEP_UP_MAX_AGE_SECONDS || DEFAULT_STEP_UP_MAX_AGE_SECONDS);
  const maxAgeSeconds = Number.isFinite(maxAgeSecondsRaw) && maxAgeSecondsRaw > 0 ? Math.min(maxAgeSecondsRaw, 3600) : DEFAULT_STEP_UP_MAX_AGE_SECONDS;
  const stepUpAt = Date.parse(claims.stepUpAt);
  return !Number.isNaN(stepUpAt) && stepUpAt <= now && now - stepUpAt <= maxAgeSeconds * 1000;
}

function sameOriginMutationAllowed(request: NextRequest): boolean {
  const allowedOrigin = configuredSiteOrigin();
  if (!allowedOrigin) return false;
  const origin = request.headers.get("origin")?.trim() || "";
  if (!origin || origin !== allowedOrigin) return false;
  const fetchSite = request.headers.get("sec-fetch-site")?.trim().toLowerCase() || "";
  return !fetchSite || fetchSite === "same-origin" || fetchSite === "same-site";
}

export async function requireOperatorMutation(
  request: NextRequest,
  options: { roles: readonly OperatorRole[]; requireStepUp?: boolean },
): Promise<OperatorMutationResult> {
  const auth = await authenticateOperatorRequest(request);
  if (auth.status === "unavailable") return { status: "unavailable", reason: auth.reason };
  if (auth.status !== "authenticated") return { status: "unauthorized", reason: auth.reason };
  if (auth.claims.roles.includes("auditor") && auth.claims.roles.length === 1) {
    return { status: "forbidden", reason: "Auditor access is read-only." };
  }
  if (!hasRequiredRole(auth.claims, options.roles)) return { status: "forbidden", reason: "Operator role is not permitted for this action." };
  if (!sameOriginMutationAllowed(request)) return { status: "forbidden", reason: "Operator mutation origin is not permitted." };
  if (options.requireStepUp && !hasRecentStepUp(auth.claims)) return { status: "forbidden", reason: "Recent step-up authentication is required." };

  return {
    status: "ok",
    claims: auth.claims,
    actor: auth.claims.operatorId,
    occurredAt: new Date().toISOString(),
  };
}
