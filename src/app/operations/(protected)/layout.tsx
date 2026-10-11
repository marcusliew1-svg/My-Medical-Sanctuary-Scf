import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { authenticateOperatorRequest, MMS_OPERATOR_SESSION_COOKIE } from "@/lib/operatorSecurity";
import { MMS_OPERATOR_ACCESS_TOKEN_COOKIE } from "@/lib/operatorIdentity";

export const dynamic = "force-dynamic";

// Route group wraps only protected operations pages, not login/setup flows.
export default async function ProtectedOperationsLayout({ children }: { children: ReactNode }) {
  const jar = await cookies();
  const session = jar.get(MMS_OPERATOR_SESSION_COOKIE)?.value;
  const accessToken = jar.get(MMS_OPERATOR_ACCESS_TOKEN_COOKIE)?.value;
  if (!session || !accessToken) redirect("/operations/login");
  const request = new NextRequest("https://mms-operator.internal/operations", {
    headers: { cookie: MMS_OPERATOR_SESSION_COOKIE + "=" + session + "; " + MMS_OPERATOR_ACCESS_TOKEN_COOKIE + "=" + accessToken },
  });
  const auth = await authenticateOperatorRequest(request);
  if (auth.status !== "authenticated") redirect("/operations/login");
  if (!auth.claims.roles.some(role => ["admin", "operations", "finance", "auditor"].includes(role))) {
    redirect("/owner");
  }
  return <>{children}</>;
}
