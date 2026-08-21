import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { MMS_OPERATOR_SESSION_COOKIE, authenticateOperatorRequest } from "@/lib/operatorSecurity";

export async function POST(request: NextRequest) {
  const auth = await authenticateOperatorRequest(request);
  if (auth.status === "unavailable") return NextResponse.json({ status: "unavailable", message: auth.reason }, { status: 503 });

  const response = NextResponse.json({ status: "signed_out" });
  response.cookies.set({
    name: MMS_OPERATOR_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
