import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isCareerRoleFamily } from "@/lib/careersPolicy";
import { bodyTooLarge, clean, isEmail, readPublicForm } from "@/lib/publicSubmission";

export async function POST(request: NextRequest) {
  if (bodyTooLarge(request)) {
    return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });
  }

  let form: Record<string, string>;
  try {
    form = await readPublicForm(request);
  } catch {
    return NextResponse.json({ status: "invalid", message: "Unsupported request format." }, { status: 415 });
  }

  if (clean(form.website, 120)) {
    return NextResponse.json({ status: "accepted" }, { status: 202 });
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
    payload.mobile.length < 6 ||
    !payload.location ||
    !isCareerRoleFamily(payload.role) ||
    !payload.privacyConsent
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
