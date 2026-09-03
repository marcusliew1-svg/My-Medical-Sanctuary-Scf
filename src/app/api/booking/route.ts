import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validateBookingSubmission } from "@/lib/bookingSubmission";
import {
  bodyTooLarge,
  clean,
  hasAllowedPublicOrigin,
  publicRequestClientKey,
  publicSubmissionErrorStatus,
  readPublicForm,
} from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";
import { MMS_PARTNER_REFERRAL_COOKIE, referralPartnerId } from "@/lib/referralTracking";

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request)) {
    return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });
  }

  if (!hasAllowedPublicOrigin(request)) {
    return NextResponse.json({ status: "denied", message: "This request could not be accepted." }, { status: 403 });
  }

  const rateLimit = checkInMemoryRateLimit(`booking:${publicRequestClientKey(request)}`, {
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

  let form: Record<string, string>;
  try {
    form = await readPublicForm(request);
  } catch (error) {
    const status = publicSubmissionErrorStatus(error);
    return NextResponse.json(
      { status: "invalid", message: status === 413 ? "Request is too large." : "Unsupported or invalid request format." },
      { status },
    );
  }

  const honeypot = clean(form.website, 120);
  if (honeypot) {
    return NextResponse.json({ status: "accepted" }, { status: 202 });
  }

  const validation = validateBookingSubmission(form);
  if (!validation.ok) {
    return NextResponse.json({ status: "invalid", message: validation.message }, { status: 400 });
  }

  const consentTimestamp = new Date().toISOString();
  const authoritativePartnerId = referralPartnerId(
    request.cookies.get(MMS_PARTNER_REFERRAL_COOKIE)?.value,
  );
  const zohoLeadPayload = {
    "Full Name": validation.value.fullName,
    Mobile: validation.value.mobileNumber,
    Email: validation.value.email,
    Country: validation.value.country,
    "Preferred Language": validation.value.preferredLanguage,
    "Interested Service": validation.value.interestedIn,
    "Preferred Membership": validation.value.preferredMembership,
    "Enquiring For": validation.value.enquiringFor,
    "Preferred Contact Method": validation.value.preferredContactMethod,
    "Next Follow-up / Appointment Preference": validation.value.preferredAppointmentDate,
    Source: "Website",
    "Consent to Contact": true,
    "Consent Version": validation.value.consentVersion,
    "Consent Timestamp": consentTimestamp,
    "Source Path": validation.value.sourcePath,
    "Campaign Attribution": validation.campaign,
    "Authoritative Partner ID": authoritativePartnerId || null,
    Message: validation.value.message,
  };

  // Keep the validated CRM-safe contract ready without claiming persistence before a destination is approved.
  void zohoLeadPayload;

  return NextResponse.json(
    {
      status: "not_persisted",
      message: "Online enquiry capture is temporarily unavailable. Please try again later.",
    },
    { status: 503 },
  );
}
