import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";
import type { CommercialLead, LeadOwnershipEvent } from "@/lib/partnerCommercialModel";
import type {
  PartnerLeadContact,
  PartnerLeadDuplicateDecision,
  PartnerLeadRegistration,
} from "@/lib/partnerLeadRegistry";
import type { PartnerLeadLifecycleEvent } from "@/lib/partnerLeadLifecycle";
import { postgresPartnerLeadRegistryStore } from "@/lib/partnerLeadRegistryPostgres";

export type PartnerLeadRegistryRecord = PartnerLeadRegistration & {
  duplicateDecision?: PartnerLeadDuplicateDecision;
  ownershipEvents: LeadOwnershipEvent[];
  lifecycleEvents: PartnerLeadLifecycleEvent[];
};

export type PartnerLeadRegistryStoreResult<T> =
  | { status: "ok"; value: T }
  | { status: "unavailable"; reason: string }
  | { status: "conflict"; reason: string };

export type IdempotentPartnerLeadCreateInput = {
  idempotencyKey: string;
  partnerId: string;
  contact: PartnerLeadContact;
  source?: string;
  campaign?: string;
  consentVersion: string;
  consentCapturedAt: string;
  registeredAt: string;
};

export type PartnerLeadRegistryStore = {
  /** Legacy/internal pre-allocation hook. Partner-facing registration must use createIdempotent. */
  allocateLeadId(idempotencyKey: string): Promise<PartnerLeadRegistryStoreResult<string>>;
  create(registration: PartnerLeadRegistration): Promise<PartnerLeadRegistryStoreResult<PartnerLeadRegistryRecord>>;
  createIdempotent(params: IdempotentPartnerLeadCreateInput): Promise<PartnerLeadRegistryStoreResult<PartnerLeadRegistryRecord>>;
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
  "Partner-facing create must be atomic and idempotent for a stable client/request key.",
  "Duplicate search and create must not have a race window that can bypass duplicate review.",
  "Duplicate search must use normalized email and phone values.",
  "Ownership transfers must append immutable events; prior events may never be rewritten or deleted.",
  "Lead lifecycle transitions must append immutable events; current stage must be derived from the latest valid lifecycle event.",
  "Current owner must be derived from the latest valid ownership event or initial registration.",
  "Marketing/PDPA consent version and timestamp must be retained with the lead.",
  "Clinical data must never be stored in the Partner Lead Registry.",
]);

export function partnerLeadRegistryStoreAvailable(): boolean {
  return mmsCommercialDatabaseClientAvailable();
}

export function partnerLeadRegistryStore(): PartnerLeadRegistryStore {
  if (mmsCommercialDatabaseClientAvailable()) {
    return postgresPartnerLeadRegistryStore(mmsCommercialDatabaseClient());
  }

  const unavailable = <T>(): PartnerLeadRegistryStoreResult<T> => ({
    status: "unavailable",
    reason:
      "Partner Lead Registry persistence is not configured. Provision the dedicated MMS commercial PostgreSQL client before accepting partner lead registrations.",
  });

  return {
    async allocateLeadId() {
      return unavailable();
    },
    async create() {
      return unavailable();
    },
    async createIdempotent() {
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
