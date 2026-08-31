import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { zohoLeadFieldMapping } from "@/lib/content";
import { bodyTooLarge, clean, isEmail, readPublicForm } from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";

type BookingForm = {
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  country?: string;
  preferredLanguage?: string;
  interestedIn?: string;
  preferredContactMethod?: string;
  preferredAppointmentDate?: string;
  message?: string;
  consentToContact?: string;
  consentVersion?: string;
  sourcePath?: string;
  website?: string;
};

async function readBookingForm(request: NextRequest): Promise<BookingForm> {
  const fields = await readPublicForm(request);

  return {
    fullName: fields.fullName,
    mobileNumber: fields.mobileNumber,
    email: fields.email,
    country: fields.country,
    preferredLanguage: fields.preferredLanguage,
    interestedIn: fields.interestedIn,
    preferredContactMethod: fields.preferredContactMethod,
    preferredAppointmentDate: fields.preferredAppointmentDate,
    message: fields.message,
    consentToContact: fields.consentToContact,
    consentVersion: fields.consentVersion,
    sourcePath: fields.sourcePath,
    website: fields.website,
  };
}

function clientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwardedFor || realIp || "unknown";
}

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request)) {
    return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });
  }

  const rateLimit = checkInMemoryRateLimit(`booking:${clientKey(request)}`, {
    limit: 6,
    windowMs: 10 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { status: "rate_limited", message: "Too many enquiry attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  }

  let form: BookingForm;
  try {
    form = await readBookingForm(request);
  } catch {
    return NextResponse.json({ status: "invalid", message: "Unsupported request format." }, { status: 415 });
  }

  const honeypot = clean(form.website, 120);
  if (honeypot) {
    return NextResponse.json({ status: "accepted" }, { status: 202 });
  }

  const fullName = clean(form.fullName, 120);
  const mobileNumber = clean(form.mobileNumber, 40);
  const email = clean(form.email, 254).toLowerCase();
  const country = clean(form.country, 120);
  const interestedIn = clean(form.interestedIn, 160);

  if (fullName.length < 2 || mobileNumber.length < 6 || !isEmail(email) || !country || !interestedIn) {
    return NextResponse.json(
      {
        status: "invalid",
        message: "Please provide a valid name, mobile number, email, location and enquiry interest.",
      },
      { status: 400 },
    );
  }

  const consentGranted = form.consentToContact === "true";
  const consentVersion = form.consentVersion === "MMS-WEB-2026-08-v1" ? form.consentVersion : null;
  const zohoLeadPayload = {
    "Full Name": fullName,
    Mobile: mobileNumber,
    Email: email,
    Country: country,
    "Preferred Language": clean(form.preferredLanguage, 80),
    "Interested Service": interestedIn,
    "Preferred Contact Method": clean(form.preferredContactMethod, 80),
    "Next Follow-up / Appointment Preference": clean(form.preferredAppointmentDate, 160),
    Source: "Website",
    "Consent to Contact": consentGranted,
    "Consent Version": consentVersion,
    "Consent Timestamp": consentGranted ? new Date().toISOString() : null,
    "Source Path": clean(form.sourcePath, 300),
    Message: clean(form.message, 2_000),
  };

  if (!consentGranted || consentVersion == null) {
    return NextResponse.json(
      {
        status: "invalid",
        message: "Consent is required before MMS can contact the visitor.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    status: "placeholder",
    message:
      "Zoho CRM integration-ready route. Add lead creation after Zoho credentials and consent flow are configured.",
    mapping: zohoLeadFieldMapping,
    zohoModule: "Leads",
    acceptedFields: Object.keys(zohoLeadPayload),
  });
}
