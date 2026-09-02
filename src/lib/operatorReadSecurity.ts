import "server-only";

import type { NextRequest } from "next/server";
import {
  authenticateOperatorRequest,
  type OperatorRole,
  type OperatorSessionClaims,
} from "@/lib/operatorSecurity";

export type OperatorReadResult =
  | { status: "ok"; claims: OperatorSessionClaims }
  | { status: "unauthorized"; reason: string }
  | { status: "forbidden"; reason: string }
  | { status: "unavailable"; reason: string };

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
  if (!hasRequiredRole(auth.claims, options.roles)) {
    return { status: "forbidden", reason: "Operator role is not permitted for this view." };
  }
  return { status: "ok", claims: auth.claims };
}
