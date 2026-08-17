type ZohoAccessToken = {
  accessToken: string;
  apiDomain: string;
};

export type ZohoRecord = Record<string, unknown>;

const dcAccountsDomains: Record<string, string> = {
  com: "https://accounts.zoho.com",
  us: "https://accounts.zoho.com",
  eu: "https://accounts.zoho.eu",
  in: "https://accounts.zoho.in",
  au: "https://accounts.zoho.com.au",
  "com.au": "https://accounts.zoho.com.au",
  jp: "https://accounts.zoho.jp",
  cn: "https://accounts.zoho.com.cn",
  "com.cn": "https://accounts.zoho.com.cn",
  sa: "https://accounts.zoho.sa",
  ca: "https://accounts.zohocloud.ca",
  "zohocloud.ca": "https://accounts.zohocloud.ca",
};

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}.`);
  return value;
}

function accountsDomain(): string {
  const dc = (process.env.ZOHO_DC || "com").trim().toLowerCase();
  if (dc.startsWith("http://") || dc.startsWith("https://")) return dc.replace(/\/$/, "");
  return dcAccountsDomains[dc] || `https://accounts.zoho.${dc}`;
}

async function getZohoAccessToken(): Promise<ZohoAccessToken> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: requiredEnv("ZOHO_CLIENT_ID"),
    client_secret: requiredEnv("ZOHO_CLIENT_SECRET"),
    refresh_token: requiredEnv("ZOHO_REFRESH_TOKEN"),
  });

  const response = await fetch(`${accountsDomain()}/oauth/v2/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    api_domain?: string;
    error?: string;
  };

  if (!response.ok || !payload.access_token || !payload.api_domain) {
    throw new Error(`Zoho OAuth refresh failed${payload.error ? `: ${payload.error}` : "."}`);
  }

  return { accessToken: payload.access_token, apiDomain: payload.api_domain.replace(/\/$/, "") };
}

export async function createZohoRecord(moduleApiName: string, record: ZohoRecord): Promise<string> {
  const moduleName = moduleApiName.trim();
  if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(moduleName)) {
    throw new Error("Invalid Zoho module API name.");
  }

  const { accessToken, apiDomain } = await getZohoAccessToken();
  const response = await fetch(`${apiDomain}/crm/v8/${moduleName}`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ data: [record] }),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => ({}))) as {
    data?: Array<{
      status?: string;
      code?: string;
      message?: string;
      details?: { id?: string };
    }>;
  };
  const result = payload.data?.[0];

  if (!response.ok || result?.status !== "success" || !result.details?.id) {
    const code = result?.code ? ` (${result.code})` : "";
    throw new Error(`Zoho CRM record creation failed${code}.`);
  }

  return result.details.id;
}

export function zohoCrmConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CLIENT_ID?.trim() &&
      process.env.ZOHO_CLIENT_SECRET?.trim() &&
      process.env.ZOHO_REFRESH_TOKEN?.trim(),
  );
}
