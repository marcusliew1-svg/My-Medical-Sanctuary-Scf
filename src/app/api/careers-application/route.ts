import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isCareerRoleFamily } from "@/lib/careersPolicy";
import {
  bodyTooLarge,
  clean,
  fieldsWithinLimits,
  hasAllowedPublicOrigin,
  hasOnlyFields,
  isEmail,
  isPhone,
  isSafeHttpUrl,
  publicRequestClientKey,
  publicSubmissionErrorStatus,
  readPublicForm,
} from "@/lib/publicSubmission";
import { checkInMemoryRateLimit } from "@/lib/rateLimit";

const careerFields = new Set(["fullName", "email", "mobile", "location", "role", "currentPosition", "yearsExperience", "availability", "expectedSalary", "linkedin", "portfolio", "resumeReference", "privacyConsent", "sourcePath", "website"]);
const careerLimits = { fullName: 120, email: 254, mobile: 60, location: 120, role: 160, currentPosition: 160, yearsExperience: 40, availability: 120, expectedSalary: 80, linkedin: 300, portfolio: 300, resumeReference: 300, privacyConsent: 10, sourcePath: 160, website: 120 };

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request)) {
    return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });
  }

  if (!hasAllowedPublicOrigin(request)) {
    return NextResponse.json({ status: "denied", message: "This request could not be accepted." }, { status: 403 });
  }

  const rateLimit = checkInMemoryRateLimit(`careers:${publicRequestClientKey(request)}`, { limit: 4, windowMs: 15 * 60 * 1000 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ status: "rate_limited", message: "Too many application attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } });
  }

  let form: Record<string, string>;
  try {
    form = await readPublicForm(request);
  } catch (error) {
    const status = publicSubmissionErrorStatus(error);
    return NextResponse.json({ status: "invalid", message: status === 413 ? "Request is too large." : "Unsupported or invalid request format." }, { status });
  }

  if (clean(form.website, 120)) {
    return NextResponse.json({ status: "accepted" }, { status: 202 });
  }

  if (!hasOnlyFields(form, careerFields) || !fieldsWithinLimits(form, careerLimits)) {
    return NextResponse.json({ status: "invalid", message: "One or more application fields are invalid or too long." }, { status: 400 });
  }

  const payload = {
    fullName: clean(form.fullName, 120),
    email: clean(form.email, 254).toLowerCase(),
    mobile: clean(form.mobile, 60),
    location: clean(form.location, 120),
    role: clean(form.role, 160),
    currentPosition: clean(form.currentPosition, 160),
    yearsExperience: clean(form.yearsExperience, 40),
    availability: clean(form.availability, 120),
    expectedSalary: clean(form.expectedSalary, 80),
    linkedin: clean(form.linkedin, 300),
    portfolio: clean(form.portfolio, 300),
    resumeReference: clean(form.resumeReference, 300),
    privacyConsent: clean(form.privacyConsent, 10) === "true",
    sourcePath: clean(form.sourcePath, 160),
  };

  if (
    payload.fullName.length < 2 ||
    !isEmail(payload.email) ||
    !isPhone(payload.mobile) ||
    !payload.location ||
    !isCareerRoleFamily(payload.role) ||
    !payload.privacyConsent ||
    payload.sourcePath !== "/careers" ||
    !isSafeHttpUrl(payload.linkedin) ||
    !isSafeHttpUrl(payload.portfolio)
  ) {
    return NextResponse.json(
      { status: "invalid", message: "Please complete the required applicant, role and consent fields." },
      { status: 400 },
    );
  }

  if (process.env.MMS_CAREERS_APPLICATIONS_ENABLED !== "true") {
    return NextResponse.json(
      { status: "unavailable", message: "Online careers applications are not active yet." },
      { status: 503 },
    );
  }

  // CV upload/storage and Zoho Recruit persistence must be connected before this route can return success.
  return NextResponse.json(
    {
      status: "not_persisted",
      message: "Careers application persistence is not connected yet.",
      acceptedFields: Object.keys(payload),
      targetSystem: process.env.MMS_CAREERS_SYSTEM || null,
    },
    { status: 503 },
  );
}
