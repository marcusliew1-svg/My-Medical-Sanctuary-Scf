import {
  bookingContactMethods,
  bookingEnquiringFor,
  bookingInterests,
  bookingLocales,
  bookingMembershipOptions,
  type BookingContactMethod,
  type BookingEnquiringFor,
  type BookingInterest,
  type BookingLocale,
  type BookingMembership,
} from "@/lib/bookingOptions";
import { clean, isEmail, isPhone } from "@/lib/publicSubmission";
import { referralPartnerId } from "@/lib/referralTracking";

export const BOOKING_CONSENT_VERSION = "MMS-WEB-2026-08-v1";

const fieldLimits = {
  fullName: 120,
  mobileNumber: 40,
  email: 254,
  country: 120,
  preferredLanguage: 8,
  interestedIn: 80,
  preferredMembership: 40,
  enquiringFor: 40,
  preferredContactMethod: 40,
  preferredAppointmentDate: 120,
  message: 1_500,
  consentToContact: 8,
  consentVersion: 40,
  sourcePath: 300,
  sourceQuery: 1_200,
  website: 120,
} as const;

export const bookingAllowedFields = new Set([
  ...Object.keys(fieldLimits),
]);

const interestValues = new Set<string>(bookingInterests.map((option) => option.value));
const membershipValues = new Set<string>(bookingMembershipOptions.map((option) => option.value));
const enquiringForValues = new Set<string>(bookingEnquiringFor.map((option) => option.value));
const contactMethodValues = new Set<string>(bookingContactMethods);
const localeValues = new Set<string>(bookingLocales);
const sourceQueryKeys = new Set(["ref", "utm_source", "utm_medium", "utm_campaign", "utm_content", "locale"]);
const sourceValuePattern = /^[\p{L}\p{N} ._~+\-:/]{1,200}$/u;

export type BookingSubmission = {
  fullName: string;
  mobileNumber: string;
  email: string;
  country: string;
  preferredLanguage: BookingLocale;
  interestedIn: BookingInterest;
  preferredMembership: BookingMembership;
  enquiringFor: BookingEnquiringFor;
  preferredContactMethod: BookingContactMethod;
  preferredAppointmentDate: string;
  message: string;
  consentToContact: true;
  consentVersion: typeof BOOKING_CONSENT_VERSION;
  sourcePath: string;
  sourceQuery: string;
};

export type BookingValidationResult =
  | { ok: true; value: BookingSubmission; campaign: Record<string, string> }
  | { ok: false; message: string };

function hasControlCharacters(value: string): boolean {
  return /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value);
}

function validateSourceQuery(value: string): Record<string, string> | null {
  const params = new URLSearchParams(value);
  const campaign: Record<string, string> = {};

  for (const [key, rawValue] of params) {
    const normalizedValue = rawValue.trim();
    if (!sourceQueryKeys.has(key) || !sourceValuePattern.test(normalizedValue)) return null;
    if (key === "ref" && !referralPartnerId(normalizedValue)) return null;
    if (key === "locale" && !localeValues.has(normalizedValue)) return null;
    campaign[key] = normalizedValue;
  }

  return campaign;
}

export function validateBookingSubmission(raw: Record<string, string>): BookingValidationResult {
  if (Object.keys(raw).some((key) => !bookingAllowedFields.has(key))) {
    return { ok: false, message: "The enquiry contains unsupported fields." };
  }

  for (const [key, limit] of Object.entries(fieldLimits)) {
    const value = raw[key] ?? "";
    if (value.length > limit || hasControlCharacters(value)) {
      return { ok: false, message: "One or more fields are invalid or too long." };
    }
  }

  const fullName = clean(raw.fullName);
  const mobileNumber = clean(raw.mobileNumber);
  const email = clean(raw.email).toLowerCase();
  const country = clean(raw.country);
  const preferredLanguage = clean(raw.preferredLanguage || "en");
  const interestedIn = clean(raw.interestedIn);
  const preferredMembership = clean(raw.preferredMembership);
  const enquiringFor = clean(raw.enquiringFor);
  const preferredContactMethod = clean(raw.preferredContactMethod || "not_specified");
  const preferredAppointmentDate = clean(raw.preferredAppointmentDate);
  const message = clean(raw.message, fieldLimits.message);
  const sourcePath = clean(raw.sourcePath);
  const sourceQuery = clean(raw.sourceQuery, fieldLimits.sourceQuery);

  if (fullName.length < 2 || !isEmail(email) || !isPhone(mobileNumber) || !country) {
    return { ok: false, message: "Please provide a valid name, mobile number, email and location." };
  }

  if (!interestValues.has(interestedIn)) return { ok: false, message: "Please choose a valid main interest." };
  if (!membershipValues.has(preferredMembership)) return { ok: false, message: "Please choose a valid membership preference." };
  if (!enquiringForValues.has(enquiringFor)) return { ok: false, message: "Please choose who the enquiry is for." };
  if (!contactMethodValues.has(preferredContactMethod)) return { ok: false, message: "Please choose a valid contact method." };
  if (!localeValues.has(preferredLanguage)) return { ok: false, message: "The selected language is invalid." };
  if (!/^\/[A-Za-z0-9/._~%-]*$/.test(sourcePath) || sourcePath.includes("//")) {
    return { ok: false, message: "The enquiry source is invalid." };
  }

  const campaign = validateSourceQuery(sourceQuery);
  if (!campaign) return { ok: false, message: "The enquiry attribution is invalid." };

  if (raw.consentToContact !== "true" || raw.consentVersion !== BOOKING_CONSENT_VERSION) {
    return { ok: false, message: "Consent is required before MMS can contact you." };
  }

  return {
    ok: true,
    value: {
      fullName,
      mobileNumber,
      email,
      country,
      preferredLanguage: preferredLanguage as BookingLocale,
      interestedIn: interestedIn as BookingInterest,
      preferredMembership: preferredMembership as BookingMembership,
      enquiringFor: enquiringFor as BookingEnquiringFor,
      preferredContactMethod: preferredContactMethod as BookingContactMethod,
      preferredAppointmentDate,
      message,
      consentToContact: true,
      consentVersion: BOOKING_CONSENT_VERSION,
      sourcePath,
      sourceQuery,
    },
    campaign,
  };
}

