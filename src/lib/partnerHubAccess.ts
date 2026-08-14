export type PartnerHubRole =
  | "partner"
  | "sales_admin"
  | "finance"
  | "compliance"
  | "management"
  | "system_admin";

export type PartnerHubPermission =
  | "lead:create"
  | "lead:read_own"
  | "lead:review_duplicates"
  | "lead:transfer"
  | "application:create"
  | "application:read_own"
  | "application:review"
  | "payment:verify"
  | "commission:read_own"
  | "commission:approve"
  | "commission:payout"
  | "commission:reverse"
  | "material:read_approved"
  | "material:approve"
  | "partner:manage"
  | "rules:manage";

const rolePermissions: Record<PartnerHubRole, PartnerHubPermission[]> = {
  partner: [
    "lead:create",
    "lead:read_own",
    "application:create",
    "application:read_own",
    "commission:read_own",
    "material:read_approved",
  ],
  sales_admin: [
    "lead:review_duplicates",
    "lead:transfer",
    "application:review",
    "partner:manage",
    "material:read_approved",
  ],
  finance: [
    "application:review",
    "payment:verify",
    "commission:approve",
    "commission:payout",
    "commission:reverse",
    "material:read_approved",
  ],
  compliance: [
    "application:review",
    "commission:reverse",
    "material:read_approved",
    "material:approve",
    "partner:manage",
  ],
  management: [
    "lead:review_duplicates",
    "lead:transfer",
    "application:review",
    "payment:verify",
    "commission:approve",
    "commission:payout",
    "commission:reverse",
    "material:read_approved",
    "material:approve",
    "partner:manage",
    "rules:manage",
  ],
  system_admin: [
    "material:read_approved",
    "partner:manage",
  ],
};

export function hasPartnerHubPermission(role: PartnerHubRole, permission: PartnerHubPermission) {
  return rolePermissions[role].includes(permission);
}

export function requirePartnerHubPermission(role: PartnerHubRole, permission: PartnerHubPermission) {
  if (!hasPartnerHubPermission(role, permission)) {
    throw new Error(`Partner Hub access denied: ${role} cannot ${permission}`);
  }
}
