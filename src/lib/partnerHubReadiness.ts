import { getMmsZohoBoundaryStatus } from "@/lib/mmsZohoBoundary";

export type PartnerHubReadinessCheck = {
  key: string;
  ready: boolean;
  note: string;
};

function configured(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

export function getPartnerHubReadinessChecks(): PartnerHubReadinessCheck[] {
  const hubEnabled = process.env.MMS_PARTNER_HUB_ENABLED === "true";
  const commercialDatabaseEnabled = process.env.MMS_COMMERCIAL_DATABASE_ENABLED === "true";
  const supabaseUrl = configured("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseKey = configured("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  const databaseUrl = configured("MMS_COMMERCIAL_DATABASE_URL");
  const internalToken = configured("MMS_INTERNAL_API_TOKEN");
  const zoho = getMmsZohoBoundaryStatus();

  return [
    {
      key: "partner-hub-gate",
      ready: hubEnabled,
      note: hubEnabled ? "Partner Hub feature gate is enabled." : "Partner Hub feature gate remains disabled.",
    },
    {
      key: "partner-auth",
      ready: supabaseUrl && supabaseKey,
      note: supabaseUrl && supabaseKey
        ? "Standalone MMS Supabase Auth configuration is present."
        : "Standalone MMS Supabase Auth URL/publishable key is incomplete.",
    },
    {
      key: "commercial-database",
      ready: commercialDatabaseEnabled && databaseUrl,
      note: commercialDatabaseEnabled && databaseUrl
        ? "MMS commercial database runtime configuration is enabled."
        : "MMS commercial database is not yet enabled with a runtime URL.",
    },
    {
      key: "internal-service-token",
      ready: internalToken,
      note: internalToken
        ? "Internal MMS commercial service token is configured."
        : "MMS internal service token is not configured.",
    },
    {
      key: "zoho-organisation-boundary",
      ready: zoho.organisationConfigured,
      note: zoho.organisationConfigured
        ? "MMS Zoho organisation identifier is explicitly configured."
        : "MMS Zoho organisation identifier is missing.",
    },
    {
      key: "zoho-live-write-boundary",
      ready: zoho.readyForLiveWrites,
      note: zoho.reason,
    },
  ];
}

export function isPartnerHubEnvironmentReady(): boolean {
  return getPartnerHubReadinessChecks().every((check) => check.ready);
}

export function summarizePartnerHubReadiness() {
  const checks = getPartnerHubReadinessChecks();
  return {
    ready: checks.every((check) => check.ready),
    checks,
  };
}
