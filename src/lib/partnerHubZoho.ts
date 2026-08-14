type ZohoTokenResponse = {
  access_token?: string;
  api_domain?: string;
  expires_in?: number;
  error?: string;
};

type ZohoLeadPayload = {
  Last_Name: string;
  First_Name?: string;
  Email?: string;
  Mobile?: string;
  Lead_Source?: string;
  Description?: string;
  Partner_Code?: string;
  Partner_Lead_ID?: string;
  Package_Interest?: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function getAccountsDomain() {
  const dc = process.env.ZOHO_DC || "com";
  return `https://accounts.zoho.${dc}`;
}

export function isZohoMockMode() {
  return (process.env.MMS_CRM_DEBUG ?? "true").toLowerCase() !== "false";
}

export function assertMmsZohoOrganisationConfigured() {
  const orgId = requireEnv("ZOHO_ORGANIZATION_ID");
  if (!/^\d+$/.test(orgId)) throw new Error("ZOHO_ORGANIZATION_ID must be the confirmed MMS CRM organisation ID");
  return orgId;
}

async function getAccessToken(): Promise<{ accessToken: string; apiDomain: string }> {
  const body = new URLSearchParams({
    refresh_token: requireEnv("ZOHO_REFRESH_TOKEN"),
    client_id: requireEnv("ZOHO_CLIENT_ID"),
    client_secret: requireEnv("ZOHO_CLIENT_SECRET"),
    grant_type: "refresh_token",
  });

  const response = await fetch(`${getAccountsDomain()}/oauth/v2/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const data = (await response.json()) as ZohoTokenResponse;
  if (!response.ok || !data.access_token) {
    throw new Error(`Zoho authentication failed${data.error ? `: ${data.error}` : ""}`);
  }

  return {
    accessToken: data.access_token,
    apiDomain: data.api_domain || `https://www.zohoapis.${process.env.ZOHO_DC || "com"}`,
  };
}

export async function createPartnerLeadInZoho(payload: ZohoLeadPayload) {
  if (isZohoMockMode()) {
    return { mode: "mock" as const, created: false, payload };
  }

  assertMmsZohoOrganisationConfigured();
  const moduleName = process.env.ZOHO_LEADS_MODULE_API_NAME || "Leads";
  const { accessToken, apiDomain } = await getAccessToken();

  const response = await fetch(`${apiDomain}/crm/v6/${moduleName}`, {
    method: "POST",
    headers: {
      authorization: `Zoho-oauthtoken ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ data: [payload] }),
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok) throw new Error("Zoho lead creation failed");
  return { mode: "live" as const, created: true, result };
}

export async function searchPartnerLeadInZoho(criteria: { email?: string; mobile?: string }) {
  if (isZohoMockMode()) return { mode: "mock" as const, matches: [] as unknown[] };

  assertMmsZohoOrganisationConfigured();
  const moduleName = process.env.ZOHO_LEADS_MODULE_API_NAME || "Leads";
  const { accessToken, apiDomain } = await getAccessToken();
  const filters = [
    criteria.email ? `(Email:equals:${criteria.email})` : null,
    criteria.mobile ? `(Mobile:equals:${criteria.mobile})` : null,
  ].filter(Boolean);

  if (!filters.length) return { mode: "live" as const, matches: [] as unknown[] };
  const criteriaValue = filters.length === 1 ? filters[0]! : `(${filters.join("or")})`;
  const url = `${apiDomain}/crm/v6/${moduleName}/search?criteria=${encodeURIComponent(criteriaValue)}`;
  const response = await fetch(url, { headers: { authorization: `Zoho-oauthtoken ${accessToken}` }, cache: "no-store" });
  if (response.status === 204) return { mode: "live" as const, matches: [] as unknown[] };
  if (!response.ok) throw new Error("Zoho duplicate search failed");
  const result = (await response.json()) as { data?: unknown[] };
  return { mode: "live" as const, matches: result.data ?? [] };
}
