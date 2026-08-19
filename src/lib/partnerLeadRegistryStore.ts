import type { CommercialLead, LeadOwnershipEvent } from "@/lib/partnerCommercialModel";
import type {
  PartnerLeadDuplicateDecision,
  PartnerLeadRegistration,
} from "@/lib/partnerLeadRegistry";
import type { PartnerLeadLifecycleEvent } from "@/lib/partnerLeadLifecycle";

export type PartnerLeadRegistryRecord = PartnerLeadRegistration & {
  duplicateDecision?: PartnerLeadDuplicateDecision;
  ownershipEvents: LeadOwnershipEvent[];
  lifecycleEvents: PartnerLeadLifecycleEvent[];
};

export type PartnerLeadRegistryStoreResult<T> =
  | { status: "ok"; value: T }
  | { status: "unavailable"; reason: string }
  | { status: "conflict"; reason: string };

export type PartnerLeadRegistryStore = {
  allocateLeadId(idempotencyKey: string): Promise<PartnerLeadRegistryStoreResult<string>>;
  create(registration: PartnerLeadRegistration): Promise<PartnerLeadRegistryStoreResult<PartnerLeadRegistryRecord>>;
  get(leadId: string): Promise<PartnerLeadRegistryStoreResult<PartnerLeadRegistryRecord | null>>;
  listOwnedByPartner(partnerId: string): Promise<PartnerLeadRegistryStoreResult<PartnerLeadRegistryRecord[]>>;
  findPotentialDuplicates(contact: { email?: string; phone?: string }): Promise<PartnerLeadRegistryStoreResult<string[]>>;
  recordDuplicateDecision(
    leadId: string,
    decision: PartnerLeadDuplicateDecision,
  ): Promise<PartnerLeadRegistryStoreResult<PartnerLeadRegistryRecord>>;
  appendOwnershipTransfer(
    lead: CommercialLead,
    event: LeadOwnershipEvent,
  ): Promise<PartnerLeadRegistryStoreResult<PartnerLeadRegistryRecord>>;
  appendLifecycleTransition(
    lead: CommercialLead,
    event: PartnerLeadLifecycleEvent,
  ): Promise<PartnerLeadRegistryStoreResult<PartnerLeadRegistryRecord>>;
};

export const PARTNER_LEAD_REGISTRY_STORE_REQUIREMENTS = Object.freeze([
  "Lead IDs must be unique and allocated centrally.",
  "Lead ID allocation and create must be idempotent for a stable client/request key.",
  "Partner-facing lead lists must be scoped by the authenticated current owner Partner ID in the datastore query itself.",
  "Duplicate search must use normalized email and phone values.",
  "Ownership transfers must append immutable events; prior events may never be rewritten or deleted.",
  "Lead lifecycle transitions must append immutable events; current stage must be derived from the latest valid lifecycle event.",
  "Current owner must be derived from the latest valid ownership event or initial registration.",
  "Marketing/PDPA consent version and timestamp must be retained with the lead.",
  "Clinical data must never be stored in the Partner Lead Registry.",
]);

export function partnerLeadRegistryStoreAvailable(): boolean {
  return false;
}

/**
 * Deliberately fail closed until MMS has a dedicated commercial datastore or a
 * CRM module whose schema is explicitly approved for the Partner Lead Registry.
 * Do not silently reuse patient/clinical records or iPivot infrastructure.
 */
export function partnerLeadRegistryStore(): PartnerLeadRegistryStore {
  const unavailable = <T>(): PartnerLeadRegistryStoreResult<T> => ({
    status: "unavailable",
    reason:
      "Partner Lead Registry persistence is not configured. Provision a dedicated MMS commercial store before accepting partner lead registrations.",
  });

  return {
    async allocateLeadId() {
      return unavailable();
    },
    async create() {
      return unavailable();
    },
    async get() {
      return unavailable();
    },
    async listOwnedByPartner() {
      return unavailable();
    },
    async findPotentialDuplicates() {
      return unavailable();
    },
    async recordDuplicateDecision() {
      return unavailable();
    },
    async appendOwnershipTransfer() {
      return unavailable();
    },
    async appendLifecycleTransition() {
      return unavailable();
    },
  };
}
