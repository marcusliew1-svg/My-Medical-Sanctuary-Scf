import type { PartnerHubRole } from "@/lib/partnerHubAccess";

export type PartnerHubAuditAction =
  | "partner.certified"
  | "partner.suspended"
  | "lead.registered"
  | "lead.duplicate_blocked"
  | "lead.transferred"
  | "application.submitted"
  | "payment.verified"
  | "compliance.cleared"
  | "commission.qualified"
  | "commission.approved"
  | "commission.paid"
  | "membership.cancelled"
  | "membership.refunded"
  | "commission.reversed"
  | "commission.recovery_created";

export type PartnerHubAuditEvent = {
  id: string;
  action: PartnerHubAuditAction;
  actorUserId: string;
  actorRole: PartnerHubRole;
  entityType: "partner" | "lead" | "application" | "commission";
  entityId: string;
  reason?: string;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: string;
};

export interface PartnerHubAuditRepository {
  appendAuditEvent(input: Omit<PartnerHubAuditEvent, "id" | "createdAt">): Promise<PartnerHubAuditEvent>;
  listAuditEvents(entityType: PartnerHubAuditEvent["entityType"], entityId: string): Promise<PartnerHubAuditEvent[]>;
}

/**
 * Audit history is append-only. Do not expose update/delete methods.
 * Avoid storing clinical data or raw identity documents in audit metadata.
 */
