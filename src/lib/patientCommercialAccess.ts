export type PatientCommercialIdentity = {
  subject: string;
  customerReference: string | null;
};

type OwnedCommercialRecord = {
  subject: string;
  customerReference: string | null;
};

export type PatientBookingRecord = OwnedCommercialRecord & {
  publicBookingId: string;
  status: "Received" | "Contacting" | "Scheduled" | "Completed" | "Cancelled";
  submittedAt: string;
  preferredAppointmentDate: string | null;
  mainInterest: string;
  location: string | null;
};

export type PatientMembershipRecord = OwnedCommercialRecord & {
  publicMembershipId: string;
  programmeName: string;
  status: "Pending Activation" | "Active" | "Cancelled" | "Expired";
  startDate: string | null;
  renewalDate: string | null;
  serviceCreditSummary: string | null;
  nextAdministrativeStep: string | null;
};

function belongsToPatient(record: OwnedCommercialRecord, identity: PatientCommercialIdentity): boolean {
  if (record.subject !== identity.subject) return false;
  if (identity.customerReference === null) return record.customerReference === null;
  return record.customerReference === identity.customerReference;
}

export function patientBookingHistory(
  identity: PatientCommercialIdentity,
  records: readonly PatientBookingRecord[],
) {
  return records.filter((record) => belongsToPatient(record, identity)).map((record) => ({
    bookingId: record.publicBookingId,
    status: record.status,
    submittedAt: record.submittedAt,
    preferredAppointmentDate: record.preferredAppointmentDate,
    mainInterest: record.mainInterest,
    location: record.location,
  }));
}

export function patientMembershipStatus(
  identity: PatientCommercialIdentity,
  records: readonly PatientMembershipRecord[],
) {
  return records.filter((record) => belongsToPatient(record, identity)).map((record) => ({
    membershipId: record.publicMembershipId,
    programmeName: record.programmeName,
    status: record.status,
    startDate: record.startDate,
    renewalDate: record.renewalDate,
    serviceCreditSummary: record.serviceCreditSummary,
    nextAdministrativeStep: record.nextAdministrativeStep,
  }));
}

export const PATIENT_COMMERCIAL_BOUNDARY = Object.freeze([
  "My Sanctuary Day-1 contains identity, contact preferences, booking status and programme administration only.",
  "Guest booking remains available and does not require a patient account.",
  "Patient-to-commercial-record linkage must be created and verified by the server.",
  "No clinical dataset, document store or care-plan record is part of this account boundary.",
]);
