import type { CommissionLedgerRow } from "./salesPartnerPolicy";

export const LEAD_STAGES = [
  "Registered",
  "Accepted",
  "Contacted",
  "Qualified",
  "Application",
  "Payment Pending",
  "Payment Verified",
  "Activated",
  "Closed",
  "Lost",
  "Withdrawn",
  "Duplicate",
  "Rejected",
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

export const APPLICATION_STAGES = [
  "Draft",
  "Submitted",
  "Under Review",
  "Documents Outstanding",
  "Approved",
  "Payment Pending",
  "Paid",
  "Activated",
  "Withdrawn",
  "Rejected",
] as const;
export type ApplicationStage = (typeof APPLICATION_STAGES)[number];

export const PAYMENT_STAGES = [
  "Pending",
  "Submitted",
  "Cleared",
  "Failed",
  "Refunded",
  "Partially Refunded",
  "Chargeback",
] as const;
export type PaymentStage = (typeof PAYMENT_STAGES)[number];

export const MEMBERSHIP_STAGES = ["Pending Activation", "Active", "Cancelled", "Expired"] as const;
export type MembershipStage = (typeof MEMBERSHIP_STAGES)[number];

export type PartnerCommercialReference = {
  partnerId: string;
  partnerRecordId?: string;
};

export type CommercialLead = {
  leadId: string;
  currentPartnerId: string;
  registeredByPartnerId: string;
  registeredAt: string;
  stage: LeadStage;
  source?: string;
  campaign?: string;
  duplicateStatus?: "Unchecked" | "Clear" | "Possible Duplicate" | "Confirmed Duplicate";
  consentCapturedAt?: string;
  lastActivityAt?: string;
  nextActionAt?: string;
};

export type LeadOwnershipEvent = {
  eventId: string;
  leadId: string;
  previousPartnerId?: string;
  newPartnerId: string;
  reason: string;
  approvedBy: string;
  occurredAt: string;
};

export type MembershipCode = "ASCEND" | "EVOLVE" | "ETERNA" | "PINNACLE";

export type CommercialApplication = {
  applicationId: string;
  leadId: string;
  partnerId: string;
  membershipCode: MembershipCode;
  stage: ApplicationStage;
  submittedAt?: string;
  approvedAt?: string;
  activatedAt?: string;
};

export type CommercialPayment = {
  paymentId: string;
  applicationId: string;
  transactionReference: string;
  amountMinorUnits: number;
  currency: string;
  stage: PaymentStage;
  submittedAt?: string;
  clearedAt?: string;
  refundAmountMinorUnits?: number;
};

export type CommercialMembership = {
  membershipId: string;
  applicationId: string;
  memberReference: string;
  membershipCode: MembershipCode;
  status: MembershipStage;
  activatedAt?: string;
  cancelledAt?: string;
};

export function canActivateMembership(payment: CommercialPayment, application: CommercialApplication): boolean {
  return payment.applicationId === application.applicationId && payment.stage === "Cleared" && application.stage === "Paid";
}

export function createLeadOwnershipTransfer(params: {
  eventId: string;
  lead: CommercialLead;
  newPartnerId: string;
  reason: string;
  approvedBy: string;
  occurredAt: string;
}): { lead: CommercialLead; event: LeadOwnershipEvent } {
  const { eventId, lead, newPartnerId, reason, approvedBy, occurredAt } = params;
  const nextPartnerId = newPartnerId.trim().toUpperCase();
  if (!nextPartnerId) throw new Error("New partner ID is required.");
  if (!reason.trim()) throw new Error("Ownership transfer reason is required.");
  if (!approvedBy.trim()) throw new Error("Ownership transfer approver is required.");

  const event: LeadOwnershipEvent = {
    eventId,
    leadId: lead.leadId,
    previousPartnerId: lead.currentPartnerId,
    newPartnerId: nextPartnerId,
    reason: reason.trim(),
    approvedBy: approvedBy.trim(),
    occurredAt,
  };

  return {
    lead: { ...lead, currentPartnerId: nextPartnerId },
    event,
  };
}

export function commissionEligibleForCommercialState(params: {
  payment: CommercialPayment;
  membership: CommercialMembership;
}): boolean {
  const { payment, membership } = params;
  return payment.stage === "Cleared" && membership.status === "Active" && !membership.cancelledAt;
}

export function validateCommissionLedgerAttribution(params: {
  ledger: CommissionLedgerRow;
  application: CommercialApplication;
  payment: CommercialPayment;
  membership: CommercialMembership;
}): void {
  const { ledger, application, payment, membership } = params;
  if (!ledger.commissionRuleVersion.trim()) throw new Error("Commission rule version is required.");
  if (ledger.partnerId !== application.partnerId) throw new Error("Commission partner does not match application attribution.");
  if (ledger.transactionReference !== payment.transactionReference) throw new Error("Commission transaction does not match payment.");
  if (ledger.memberReference !== membership.memberReference) throw new Error("Commission member does not match membership.");
  if (ledger.membershipCode !== membership.membershipCode) throw new Error("Commission membership code does not match membership.");
}

// This model is commercial only. Do not add diagnoses, treatment recommendations,
// test results, medication, imaging, doctor notes, or other clinical data to these records.
