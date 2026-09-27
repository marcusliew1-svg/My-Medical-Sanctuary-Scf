import { randomUUID } from "node:crypto";
import type { BookingSubmission } from "@/lib/bookingSubmission";
import { createZohoRecord, type ZohoRecord } from "@/lib/zohoCrm";
import {
  zohoDayOneCommercialReadiness,
  type ZohoCommercialFieldMapping,
} from "@/lib/zohoCommercialConfiguration";

export type BookingPersistenceAvailability =
  | { ready: true; moduleApiName: string; leadSource: string; ownerId: string; fieldMapping: ZohoCommercialFieldMapping }
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
  if (env.VERCEL_ENV === "production" && env.MMS_BOOKING_PRODUCTION_APPROVED !== "true")
    return { ready: false, reason: "production_refused" };
  if (env.NODE_ENV === "production" && !env.VERCEL_ENV)
    return { ready: false, reason: "production_refused" };
  if (env.MMS_BOOKING_PERSISTENCE_ENABLED !== "true") return { ready: false, reason: "disabled" };
  if (env.MMS_CRM_DEBUG === "true") return { ready: false, reason: "debug" };
  const zoho = zohoDayOneCommercialReadiness(env);
  if (!zoho.ready || !zoho.fieldMapping) return { ready: false, reason: "unconfigured" };

  return {
    ready: true,
    moduleApiName: env.ZOHO_LEADS_MODULE_API_NAME!.trim(),
    leadSource: env.MMS_DEFAULT_LEAD_SOURCE?.trim() || "Website Discovery Form",
    ownerId: env.ZOHO_CRM_OWNER_ID!.trim(),
    fieldMapping: zoho.fieldMapping,
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
  const fields = availability.fieldMapping;
  const record: ZohoRecord = {
    [fields.firstName]: firstName || undefined,
    [fields.lastName]: lastName,
    [fields.email]: submission.email,
    [fields.mobile]: submission.mobileNumber.slice(0, 30),
    [fields.country]: submission.country,
    [fields.preferredLanguage]: submission.preferredLanguage,
    [fields.source]: availability.leadSource,
    [fields.utmSource]: campaign.utm_source || undefined,
    [fields.utmMedium]: campaign.utm_medium || undefined,
    [fields.utmCampaign]: campaign.utm_campaign || undefined,
    [fields.partnerId]: partnerId || undefined,
    [fields.landingPage]: submission.sourcePath,
    [fields.broadInterestCategory]: submission.interestedIn,
    [fields.programmeInterest]: submission.preferredMembership,
    [fields.preferredContactChannel]: submission.preferredContactMethod,
    [fields.assignedOwner]: { id: availability.ownerId },
    [fields.nextAction]: "Clinic Manager administrative review",
    [fields.leadStatus]: "New Enquiry",
    [fields.contactConsentTimestamp]: consentTimestamp,
    [fields.contactConsentVersion]: submission.consentVersion,
    [fields.doNotContact]: false,
    [fields.idempotencyKey]: reference,
  };

  await writer(availability.moduleApiName, record);

  return { reference };
}
