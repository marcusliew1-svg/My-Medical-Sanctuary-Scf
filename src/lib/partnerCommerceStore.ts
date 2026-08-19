import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";
import { postgresPartnerCommerceStore } from "@/lib/partnerCommercePostgres";
import type {
  CommercialApplication,
  CommercialMembership,
  CommercialPayment,
} from "@/lib/partnerCommercialModel";
import type {
  CommercialWorkflowEvent,
  MembershipActivationEvidence,
  PaymentVerificationEvidence,
} from "@/lib/partnerCommerceWorkflow";

export type PartnerCommerceRecord = {
  application: CommercialApplication;
  payment?: CommercialPayment;
  membership?: CommercialMembership;
  paymentVerification?: PaymentVerificationEvidence;
  membershipActivation?: MembershipActivationEvidence;
  events: CommercialWorkflowEvent[];
};

export type PartnerCommerceStoreResult<T> =
  | { status: "ok"; value: T }
  | { status: "unavailable"; reason: string }
  | { status: "conflict"; reason: string };

export type PartnerCommerceStore = {
  createApplication(application: CommercialApplication): Promise<PartnerCommerceStoreResult<PartnerCommerceRecord>>;
  getApplication(applicationId: string): Promise<PartnerCommerceStoreResult<PartnerCommerceRecord | null>>;
  listApplicationsByPartner(partnerId: string): Promise<PartnerCommerceStoreResult<PartnerCommerceRecord[]>>;
  savePaymentVerification(params: {
    application: CommercialApplication;
    payment: CommercialPayment;
    evidence: PaymentVerificationEvidence;
    events: CommercialWorkflowEvent[];
  }): Promise<PartnerCommerceStoreResult<PartnerCommerceRecord>>;
  saveMembershipActivation(params: {
    application: CommercialApplication;
    membership: CommercialMembership;
    evidence: MembershipActivationEvidence;
    events: CommercialWorkflowEvent[];
  }): Promise<PartnerCommerceStoreResult<PartnerCommerceRecord>>;
};

export const PARTNER_COMMERCE_STORE_REQUIREMENTS = Object.freeze([
  "Applications, payments and memberships must use centrally unique durable IDs.",
  "Partner-facing commerce reads must be scoped by the authenticated permanent MMS Partner ID and must never expose another Partner's applications.",
  "Payment clearance evidence may only be written by the Finance-authorized service path.",
  "Application Paid and Payment Cleared must be persisted atomically from the same Finance verification.",
  "Every state change must append an immutable workflow event.",
  "Payment transaction references and Finance source references must be durable and auditable.",
  "Membership activation must retain the exact Finance verification timestamp used for clearance.",
  "Commission eligibility must be evaluated only from persisted cleared-payment and active-membership state.",
  "Clinical data must never be stored in this commercial workflow store.",
]);

export function partnerCommerceStoreAvailable(): boolean {
  return mmsCommercialDatabaseClientAvailable();
}

export function partnerCommerceStore(): PartnerCommerceStore {
  if (mmsCommercialDatabaseClientAvailable()) {
    return postgresPartnerCommerceStore(mmsCommercialDatabaseClient());
  }

  const unavailable = <T>(): PartnerCommerceStoreResult<T> => ({
    status: "unavailable",
    reason:
      "MMS commercial workflow persistence is not configured. Provision the dedicated MMS commercial PostgreSQL client before accepting payment-verification or membership-activation writes.",
  });

  return {
    async createApplication() {
      return unavailable();
    },
    async getApplication() {
      return unavailable();
    },
    async listApplicationsByPartner() {
      return unavailable();
    },
    async savePaymentVerification() {
      return unavailable();
    },
    async saveMembershipActivation() {
      return unavailable();
    },
  };
}
