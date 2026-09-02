import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { MMS_OPERATOR_SESSION_COOKIE, operatorRequestOriginAllowed } from "@/lib/operatorSecurity";
import { MMS_OPERATOR_ACCESS_TOKEN_COOKIE, signOutOperatorIdentity } from "@/lib/operatorIdentity";

export async function POST(request: NextRequest) {
  if (!operatorRequestOriginAllowed(request)) {
    return NextResponse.json({ status: "forbidden", message: "Operator sign-out origin is not permitted." }, { status: 403 });
  }
  const accessToken = request.cookies.get(MMS_OPERATOR_ACCESS_TOKEN_COOKIE)?.value || "";
  if (accessToken) await signOutOperatorIdentity(accessToken);

  const response = NextResponse.json({ status: "signed_out" });
  for (const name of [MMS_OPERATOR_SESSION_COOKIE, MMS_OPERATOR_ACCESS_TOKEN_COOKIE]) {
    response.cookies.set({
      name,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });
  }
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  return response;
}
