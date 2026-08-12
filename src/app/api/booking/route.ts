import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { zohoLeadFieldMapping } from "@/lib/content";

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
};

async function readBookingForm(request: NextRequest): Promise<BookingForm> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return request.json() as Promise<BookingForm>;
  }

  const formData = await request.formData();

  return {
    fullName: String(formData.get("fullName") ?? ""),
    mobileNumber: String(formData.get("mobileNumber") ?? ""),
    email: String(formData.get("email") ?? ""),
    country: String(formData.get("country") ?? ""),
    preferredLanguage: String(formData.get("preferredLanguage") ?? ""),
    interestedIn: String(formData.get("interestedIn") ?? ""),
    preferredContactMethod: String(formData.get("preferredContactMethod") ?? ""),
    preferredAppointmentDate: String(formData.get("preferredAppointmentDate") ?? ""),
    message: String(formData.get("message") ?? ""),
    consentToContact: String(formData.get("consentToContact") ?? ""),
    consentVersion: String(formData.get("consentVersion") ?? ""),
    sourcePath: String(formData.get("sourcePath") ?? ""),
  };
}

export async function POST(request: NextRequest) {
  const form = await readBookingForm(request);
  const consentGranted = form.consentToContact === "true";
  const consentVersion = form.consentVersion === "MMS-WEB-2026-08-v1" ? form.consentVersion : null;
  const zohoLeadPayload = {
    "Full Name": form.fullName,
    Mobile: form.mobileNumber,
    Email: form.email,
    Country: form.country,
    "Preferred Language": form.preferredLanguage,
    "Interested Service": form.interestedIn,
    "Preferred Contact Method": form.preferredContactMethod,
    "Next Follow-up / Appointment Preference": form.preferredAppointmentDate,
    Source: "Website",
    "Consent to Contact": consentGranted,
    "Consent Version": consentVersion,
    "Consent Timestamp": consentGranted ? new Date().toISOString() : null,
    "Source Path": form.sourcePath,
    Message: form.message,
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
