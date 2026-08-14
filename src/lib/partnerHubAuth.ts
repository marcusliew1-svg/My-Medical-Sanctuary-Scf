import type { PartnerRole } from "@/lib/partnerHubPersistence";

export type PartnerSession = {
  userId: string;
  partnerId?: string;
  role: PartnerRole;
  demo: boolean;
};

const allowedRoles: PartnerRole[] = ["Partner", "SalesAdmin", "Finance", "Compliance", "Management", "SystemAdmin"];

export function getPartnerSessionFromRequest(request: Request): PartnerSession | null {
  const demoEnabled = (process.env.MMS_PARTNER_HUB_DEMO ?? "false").toLowerCase() === "true";
  if (!demoEnabled) return null;

  // Demo headers are accepted only when the server-side demo flag is explicitly enabled.
  const roleHeader = request.headers.get("x-mms-demo-role") || process.env.MMS_PARTNER_HUB_DEMO_ROLE || "Partner";
  const role = allowedRoles.includes(roleHeader as PartnerRole) ? (roleHeader as PartnerRole) : "Partner";
  return {
    userId: request.headers.get("x-mms-demo-user") || "demo-user",
    partnerId: request.headers.get("x-mms-demo-partner") || "PTR-DEMO-001",
    role,
    demo: true,
  };
}

export function requirePartnerSession(request: Request, roles?: PartnerRole[]) {
  const session = getPartnerSessionFromRequest(request);
  if (!session) {
    return { ok: false as const, status: 401, error: "Partner Hub authentication is not configured." };
  }
  if (roles && !roles.includes(session.role)) {
    return { ok: false as const, status: 403, error: "You do not have permission for this action." };
  }
  return { ok: true as const, session };
}
