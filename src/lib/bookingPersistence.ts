import { randomUUID } from "node:crypto";
import type { BookingSubmission } from "@/lib/bookingSubmission";
import { createZohoRecord, type ZohoRecord, zohoCrmConfigured } from "@/lib/zohoCrm";

export type BookingPersistenceAvailability =
  | { ready: true; moduleApiName: string; leadSource: string }
  | { ready: false; reason: "production_refused" | "disabled" | "debug" | "unconfigured" };

type RecordWriter = (moduleApiName: string, record: ZohoRecord) => Promise<string>;

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstName: "", lastName: fullName.slice(0, 80) };
  return { firstName: parts.shift()!.slice(0, 40), lastName: parts.join(" ").slice(0, 80) };
}

export function bookingPersistenceAvailability(
  env: NodeJS.ProcessEnv = process.env,
): BookingPersistenceAvailability {
  if (
    env.VERCEL_ENV === "production" ||
    (env.NODE_ENV === "production" && env.VERCEL_ENV !== "preview")
  ) return { ready: false, reason: "production_refused" };
  if (env.MMS_BOOKING_PERSISTENCE_ENABLED !== "true") return { ready: false, reason: "disabled" };
  if (env.MMS_CRM_DEBUG === "true") return { ready: false, reason: "debug" };
  if (!zohoCrmConfigured(env)) return { ready: false, reason: "unconfigured" };

  return {
    ready: true,
    moduleApiName: env.ZOHO_LEADS_MODULE_API_NAME?.trim() || "Leads",
    leadSource: env.MMS_DEFAULT_LEAD_SOURCE?.trim() || "Website Discovery Form",
  };
}

export async function persistBookingToZoho(
  submission: BookingSubmission,
  campaign: Record<string, string>,
  partnerId: string,
  consentTimestamp: string,
  availability: Extract<BookingPersistenceAvailability, { ready: true }>,
  writer: RecordWriter = createZohoRecord,
): Promise<{ reference: string }> {
  const reference = `MMS-ENQ-${new Date(consentTimestamp).toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const { firstName, lastName } = splitName(submission.fullName);
  const description = [
    `MMS discovery enquiry: ${reference}`,
    `Main interest: ${submission.interestedIn}`,
    `Preferred membership: ${submission.preferredMembership}`,
    `Enquiring for: ${submission.enquiringFor}`,
    `Preferred language: ${submission.preferredLanguage}`,
    `Preferred contact method: ${submission.preferredContactMethod}`,
    `Preferred contact time: ${submission.preferredAppointmentDate}`,
    `Source path: ${submission.sourcePath}`,
    `Campaign attribution: ${JSON.stringify(campaign)}`,
    `Authoritative Partner ID: ${partnerId || "None"}`,
    `Consent version: ${submission.consentVersion}`,
    `Consent timestamp: ${consentTimestamp}`,
    `Enquiry message: ${submission.message || "None supplied"}`,
  ].join("\n");

  await writer(availability.moduleApiName, {
    First_Name: firstName || undefined,
    Last_Name: lastName,
    Email: submission.email,
    Phone: submission.mobileNumber.slice(0, 30),
    Mobile: submission.mobileNumber.slice(0, 30),
    Country: submission.country,
    Lead_Source: availability.leadSource,
    Data_Source: "API",
    Description: description.slice(0, 32_000),
  });

  return { reference };
}
