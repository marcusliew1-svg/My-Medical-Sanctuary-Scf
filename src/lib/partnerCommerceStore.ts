import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";
import { postgresPartnerCommerceStore } from "@/lib/partnerCommercePostgres";
import type {
  ApplicationStage,
  CommercialApplication,
  CommercialMembership,
  CommercialPayment,
  MembershipCode,
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

export type PartnerApplicationSubmission = {
  partnerId: string;
  leadId: string;
  membershipCode: MembershipCode;
  idempotencyKey: string;
  submittedAt: string;
};

export type PartnerApplicationSubmissionResult = {
  record: PartnerCommerceRecord;
  replayed: boolean;
};

export type ApplicationTransitionInput = {
  applicationId: string;
  expectedStage: ApplicationStage;
  nextStage: ApplicationStage;
  actor: string;
  occurredAt: string;
  reason: string;
};

export type ApplicationTransitionResult = {
  record: PartnerCommerceRecord;
  replayed: boolean;
};

export type PaymentSubmissionInput = {
  applicationId: string;
  transactionReference: string;
  amountMinorUnits: number;
  currency: string;
  submittedAt: string;
  recordedBy: string;
  idempotencyKey: string;
};

export type PaymentSubmissionResult = {
  record: PartnerCommerceRecord;
  replayed: boolean;
};

export type MembershipPreparationInput = {
  applicationId: string;
  memberReference: string;
  preparedBy: string;
  preparedAt: string;
};

export type MembershipPreparationResult = {
  record: PartnerCommerceRecord;
  replayed: boolean;
};

export type PartnerCommerceStoreResult<T> =
  | { status: "ok"; value: T }
  | { status: "unavailable"; reason: string }
  | { status: "conflict"; reason: string };

export type PartnerCommerceStore = {
  createApplication(application: CommercialApplication): Promise<PartnerCommerceStoreResult<PartnerCommerceRecord>>;
  submitPartnerApplication(params: PartnerApplicationSubmission): Promise<PartnerCommerceStoreResult<PartnerApplicationSubmissionResult>>;
  transitionApplication(params: ApplicationTransitionInput): Promise<PartnerCommerceStoreResult<ApplicationTransitionResult>>;
  recordPaymentSubmission(params: PaymentSubmissionInput): Promise<PartnerCommerceStoreResult<PaymentSubmissionResult>>;
  prepareMembership(params: MembershipPreparationInput): Promise<PartnerCommerceStoreResult<MembershipPreparationResult>>;
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
  "Partner-facing application submission must be atomic, idempotent and scoped to an owned Qualified lead.",
  "Only an Active, selling-enabled, CRM-enabled Partner with current certification may submit a new application.",
  "Application review transitions must use an explicit expected state and append an immutable workflow event.",
  "A lead may not have two simultaneous non-terminal commercial applications.",
  "Payment submission must be server-side, idempotent, tied to a Payment Pending application and append an immutable workflow event.",
  "Pending membership preparation must be server-side, idempotent and allowed only after Finance-cleared payment evidence exists.",
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
      "MMS commercial workflow persistence is not configured. Provision the dedicated MMS commercial PostgreSQL client before accepting Partner application or Finance workflow writes.",
  });

  return {
    async createApplication() { return unavailable(); },
    async submitPartnerApplication() { return unavailable(); },
    async transitionApplication() { return unavailable(); },
    async recordPaymentSubmission() { return unavailable(); },
    async prepareMembership() { return unavailable(); },
    async getApplication() { return unavailable(); },
    async listApplicationsByPartner() { return unavailable(); },
    async savePaymentVerification() { return unavailable(); },
    async saveMembershipActivation() { return unavailable(); },
  };
}
