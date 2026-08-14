export type ReadinessCheck = {
  key: string;
  ready: boolean;
  note: string;
};

export function getPartnerHubReadiness(): ReadinessCheck[] {
  const demo = (process.env.MMS_PARTNER_HUB_DEMO ?? "false").toLowerCase() === "true";
  const crmDebug = (process.env.MMS_CRM_DEBUG ?? "true").toLowerCase() === "true";
  const hasZohoOrg = Boolean(process.env.ZOHO_ORGANIZATION_ID);
  const hasAuthProvider = Boolean(process.env.MMS_PARTNER_HUB_AUTH_PROVIDER);
  const hasDatabase = Boolean(process.env.MMS_PARTNER_HUB_DATABASE_URL);
  const hasPaymentSource = Boolean(process.env.MMS_PARTNER_HUB_PAYMENT_SOURCE);

  return [
    { key: "demo-disabled", ready: !demo, note: demo ? "Demo session mode is enabled." : "Demo session mode is disabled." },
    { key: "identity-provider", ready: hasAuthProvider, note: hasAuthProvider ? "Production identity provider configured." : "Production identity provider is not configured." },
    { key: "database", ready: hasDatabase, note: hasDatabase ? "Commercial persistence configuration present." : "Persistent commercial database is not configured." },
    { key: "zoho-org", ready: hasZohoOrg, note: hasZohoOrg ? "MMS Zoho organisation identifier configured." : "MMS Zoho organisation identifier missing." },
    { key: "crm-live", ready: !crmDebug, note: crmDebug ? "CRM remains in safe mock/debug mode." : "CRM live-write mode enabled." },
    { key: "payment-source", ready: hasPaymentSource, note: hasPaymentSource ? "Payment verification source configured." : "Live payment verification source is not configured." },
  ];
}

export function isPartnerHubProductionReady() {
  return getPartnerHubReadiness().every((check) => check.ready);
}
