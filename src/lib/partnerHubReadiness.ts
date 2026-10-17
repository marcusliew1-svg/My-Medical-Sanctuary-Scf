import { getMmsZohoBoundaryStatus } from "@/lib/mmsZohoBoundary";

export type PartnerHubReadinessCheck = {
  key: string;
  ready: boolean;
  note: string;
  category: "core" | "zoho-live";
};

function configured(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

export function getPartnerHubReadinessChecks(): PartnerHubReadinessCheck[] {
  const hubEnabled = process.env.MMS_PARTNER_HUB_ENABLED === "true";
  const commercialDatabaseEnabled = process.env.MMS_COMMERCIAL_DATABASE_ENABLED === "true";
  const qaBootstrapDisabled = process.env.MMS_PARTNER_HUB_QA_BOOTSTRAP_ENABLED !== "true";
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
      category: "core",
    },
    {
      key: "partner-auth",
      ready: supabaseUrl && supabaseKey,
      note: supabaseUrl && supabaseKey
        ? "Standalone MMS Supabase Auth configuration is present."
        : "Standalone MMS Supabase Auth URL/publishable key is incomplete.",
      category: "core",
    },
    {
      key: "commercial-database",
      ready: commercialDatabaseEnabled && databaseUrl,
      note: commercialDatabaseEnabled && databaseUrl
        ? "MMS commercial database runtime configuration is enabled."
        : "MMS commercial database is not yet enabled with a runtime URL.",
      category: "core",
    },
    {
      key: "internal-service-token",
      ready: internalToken,
      note: internalToken
        ? "Internal MMS commercial service token is configured."
        : "MMS internal service token is not configured.",
      category: "core",
    },
    {
      key: "qa-bootstrap-disabled",
      ready: qaBootstrapDisabled,
      note: qaBootstrapDisabled
        ? "Partner Hub QA bootstrap is disabled."
        : "Partner Hub QA bootstrap is enabled and must be disabled before release readiness.",
      category: "core",
    },
    {
      key: "zoho-organisation-boundary",
      ready: zoho.targetMatchesExpected,
      note: zoho.targetMatchesExpected
        ? "Configured Zoho target exactly matches the independently approved MMS organisation."
        : zoho.reason,
      category: "core",
    },
    {
      key: "zoho-live-write-boundary",
      ready: zoho.readyForLiveWrites,
      note: zoho.reason,
      category: "zoho-live",
    },
  ];
}

export function isPartnerHubEnvironmentReady(): boolean {
  return getPartnerHubReadinessChecks()
    .filter((check) => check.category === "core")
    .every((check) => check.ready);
}

export function summarizePartnerHubReadiness() {
  const checks = getPartnerHubReadinessChecks();
  const coreChecks = checks.filter((check) => check.category === "core");
  const zohoLiveCheck = checks.find((check) => check.key === "zoho-live-write-boundary");
  return {
    ready: coreChecks.every((check) => check.ready),
    coreReady: coreChecks.every((check) => check.ready),
    zohoLiveWriteReady: Boolean(zohoLiveCheck?.ready),
    checks,
  };
}
