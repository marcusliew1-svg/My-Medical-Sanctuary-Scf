import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const CONSENT_VERSION = "MMS-WEB-2026-08-v1";

const limits = {
  fullName: 120,
  mobileNumber: 40,
  email: 254,
  country: 120,
  interestedIn: 120,
  preferredMembership: 80,
  enquiringFor: 80,
  preferredContactTime: 120,
  message: 1500,
  sourcePath: 300,
  website: 200,
} as const;

type BookingForm = {
  fullName: string;
  mobileNumber: string;
  email: string;
  country: string;
  interestedIn: string;
  preferredMembership: string;
  enquiringFor: string;
  preferredContactTime: string;
  message: string;
  website: string;
  consentToContact: string;
  consentVersion: string;
  sourcePath: string;
};

type RawBookingForm = Record<string, unknown>;

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function exceedsLimit(value: string, limit: number) {
  return value.length > limit;
}

async function readBookingForm(request: NextRequest): Promise<RawBookingForm> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const value = (await request.json()) as unknown;
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      throw new Error("Invalid payload");
    }
    return value as RawBookingForm;
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

function normalizeBookingForm(raw: RawBookingForm): BookingForm {
  return {
    fullName: cleanString(raw.fullName),
    mobileNumber: cleanString(raw.mobileNumber),
    email: cleanString(raw.email),
    country: cleanString(raw.country),
    interestedIn: cleanString(raw.interestedIn),
    preferredMembership: cleanString(raw.preferredMembership),
    enquiringFor: cleanString(raw.enquiringFor),
    preferredContactTime: cleanString(raw.preferredContactTime),
    message: cleanString(raw.message),
    website: cleanString(raw.website),
    consentToContact: cleanString(raw.consentToContact),
    consentVersion: cleanString(raw.consentVersion),
    sourcePath: cleanString(raw.sourcePath),
  };
}

function validateBookingForm(form: BookingForm) {
  if (form.website) {
    return "Unable to accept this submission.";
  }

  if (
    !form.fullName ||
    !form.mobileNumber ||
    !form.email ||
    !form.country ||
    !form.interestedIn ||
    !form.preferredMembership ||
    !form.enquiringFor ||
    !form.preferredContactTime ||
    !form.sourcePath
  ) {
    return "Please complete all required fields.";
  }

  if (!isValidEmail(form.email)) {
    return "Please enter a valid email address.";
  }

  if (
    exceedsLimit(form.fullName, limits.fullName) ||
    exceedsLimit(form.mobileNumber, limits.mobileNumber) ||
    exceedsLimit(form.email, limits.email) ||
    exceedsLimit(form.country, limits.country) ||
    exceedsLimit(form.interestedIn, limits.interestedIn) ||
    exceedsLimit(form.preferredMembership, limits.preferredMembership) ||
    exceedsLimit(form.enquiringFor, limits.enquiringFor) ||
    exceedsLimit(form.preferredContactTime, limits.preferredContactTime) ||
    exceedsLimit(form.message, limits.message) ||
    exceedsLimit(form.sourcePath, limits.sourcePath) ||
    exceedsLimit(form.website, limits.website)
  ) {
    return "One or more fields are too long.";
  }

  if (form.consentToContact !== "true" || form.consentVersion !== CONSENT_VERSION) {
    return "Consent is required before MMS can contact the visitor.";
  }

  return null;
}

export async function POST(request: NextRequest) {
  let rawForm: RawBookingForm;

  try {
    rawForm = await readBookingForm(request);
  } catch {
    return NextResponse.json(
      {
        status: "invalid",
        message: "The enquiry payload could not be read.",
      },
      { status: 400 },
    );
  }

  const form = normalizeBookingForm(rawForm);
  const validationError = validateBookingForm(form);

  if (validationError) {
    return NextResponse.json(
      {
        status: "invalid",
        message: validationError,
      },
      { status: 400 },
    );
  }

  const consentTimestamp = new Date().toISOString();
  const zohoLeadPayload = {
    "Full Name": form.fullName,
    Mobile: form.mobileNumber,
    Email: form.email,
    Country: form.country,
    "Interested Service": form.interestedIn,
    "Preferred Membership": form.preferredMembership,
    "Enquiring For": form.enquiringFor,
    "Preferred Contact Time": form.preferredContactTime,
    Source: "Website",
    "Consent to Contact": true,
    "Consent Version": CONSENT_VERSION,
    "Consent Timestamp": consentTimestamp,
    "Source Path": form.sourcePath,
    Message: form.message,
  };

  void zohoLeadPayload;

  return NextResponse.json(
    {
      status: "not_persisted",
      message:
        "Online enquiry capture is not live yet because CRM persistence has not been enabled.",
    },
    { status: 503 },
  );
}
