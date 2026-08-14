import type { PartnerHubRole } from "@/lib/partnerHubAccess";

export type PartnerSession = {
  userId: string;
  partnerId?: string;
  role: PartnerHubRole;
  demo: boolean;
};

const allowedRoles: PartnerHubRole[] = ["partner", "sales_admin", "finance", "compliance", "management", "system_admin"];

export function getPartnerSessionFromRequest(request: Request): PartnerSession | null {
  const demoEnabled = (process.env.MMS_PARTNER_HUB_DEMO ?? "false").toLowerCase() === "true";
  if (!demoEnabled) return null;

  // Demo headers are accepted only when the server-side demo flag is explicitly enabled.
  const roleHeader = request.headers.get("x-mms-demo-role") || process.env.MMS_PARTNER_HUB_DEMO_ROLE || "partner";
  const role = allowedRoles.includes(roleHeader as PartnerHubRole) ? (roleHeader as PartnerHubRole) : "partner";
  return {
    userId: request.headers.get("x-mms-demo-user") || "demo-user",
    partnerId: request.headers.get("x-mms-demo-partner") || "PTR-DEMO-001",
    role,
    demo: true,
  };
}

export function requirePartnerSession(request: Request, roles?: PartnerHubRole[]) {
  const session = getPartnerSessionFromRequest(request);
  if (!session) {
    return { ok: false as const, status: 401, error: "Partner Hub authentication is not configured." };
  }
  if (roles && !roles.includes(session.role)) {
    return { ok: false as const, status: 403, error: "You do not have permission for this action." };
  }
  return { ok: true as const, session };
}
