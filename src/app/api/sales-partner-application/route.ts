import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
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
    country: clean(form.country, 80),
    city: clean(form.city, 80),
    nationality: clean(form.nationality, 80),
    occupation: clean(form.occupation, 120),
    salesBackground: clean(form.salesBackground, 1_500),
    relevantExperience: clean(form.relevantExperience, 1_500),
    preferredTerritory: clean(form.preferredTerritory, 120),
    expectedMonthlyActivity: clean(form.expectedMonthlyActivity, 80),
    introducer: clean(form.introducer, 120),
    complianceDeclaration: clean(form.complianceDeclaration, 10) === "true",
    privacyConsent: clean(form.privacyConsent, 10) === "true",
    sourcePath: clean(form.sourcePath, 160),
  };

  if (
    payload.fullName.length < 2 ||
    !isEmail(payload.email) ||
    payload.mobile.length < 6 ||
    !payload.country ||
    !payload.salesBackground ||
    !payload.complianceDeclaration ||
    !payload.privacyConsent
  ) {
    return NextResponse.json(
      { status: "invalid", message: "Please complete the required professional and consent fields." },
      { status: 400 },
    );
  }

  if (process.env.MMS_SALES_PARTNER_APPLICATIONS_ENABLED !== "true") {
    return NextResponse.json(
      { status: "unavailable", message: "Online Sales Partner applications are not active yet." },
      { status: 503 },
    );
  }

  // The route intentionally does not claim success until the approved Zoho module/workflow is connected.
  return NextResponse.json(
    {
      status: "not_persisted",
      message: "Sales Partner application persistence is not connected yet.",
      acceptedFields: Object.keys(payload),
      targetModule: process.env.MMS_SALES_PARTNER_MODULE_API_NAME || null,
    },
    { status: 503 },
  );
}
