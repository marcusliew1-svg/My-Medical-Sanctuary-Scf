import { NextResponse } from "next/server";
import { canRegisterLead, checkLeadDuplicate, type LeadRecord } from "@/lib/partnerLeadRules";

const demoLeads: LeadRecord[] = [
  { id: "LD-260814-001", partnerCode: "MMS-P-0001", fullName: "Daniel Lim", mobile: "+60123456789", email: "daniel@example.com", createdAt: "2026-08-14T09:42:00+08:00", status: "Active" },
  { id: "LD-260813-014", partnerCode: "MMS-P-0001", fullName: "Mei Chen", mobile: "+60129876543", email: "mei@example.com", createdAt: "2026-08-13T16:18:00+08:00", status: "Active" },
];

export async function POST(request: Request) {
  const body = await request.json();
  const eligibility = canRegisterLead(Boolean(body.partnerCertified), Boolean(body.partnerCodeActive));
  if (!eligibility.allowed) return NextResponse.json({ ok: false, eligibility }, { status: 403 });

  if (!body.fullName || typeof body.fullName !== "string") {
    return NextResponse.json({ ok: false, message: "Prospect full name is required." }, { status: 400 });
  }

  const duplicate = checkLeadDuplicate({ fullName: body.fullName, mobile: body.mobile, email: body.email }, demoLeads);
  return NextResponse.json({ ok: !duplicate.duplicate, duplicate, eligibility });
}
