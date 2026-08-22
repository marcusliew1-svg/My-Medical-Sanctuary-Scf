export type MmsZohoBoundaryStatus = {
  readyForLiveWrites: boolean;
  organisationConfigured: boolean;
  credentialsConfigured: boolean;
  debugMode: boolean;
  reason: string;
};

function value(name: string): string {
  return process.env[name]?.trim() || "";
}

export function getMmsZohoBoundaryStatus(): MmsZohoBoundaryStatus {
  const organisationConfigured = Boolean(value("ZOHO_ORGANIZATION_ID"));
  const credentialsConfigured = Boolean(
    value("ZOHO_CLIENT_ID") && value("ZOHO_CLIENT_SECRET") && value("ZOHO_REFRESH_TOKEN"),
  );
  const debugMode = process.env.MMS_CRM_DEBUG !== "false";
  const readyForLiveWrites = organisationConfigured && credentialsConfigured && !debugMode;

  let reason = "MMS Zoho live-write boundary is satisfied.";
  if (!organisationConfigured) reason = "MMS Zoho organisation identifier is not configured.";
  else if (!credentialsConfigured) reason = "MMS Zoho server credentials are incomplete.";
  else if (debugMode) reason = "MMS CRM remains in safe debug mode; live writes are disabled.";

  return {
    readyForLiveWrites,
    organisationConfigured,
    credentialsConfigured,
    debugMode,
    reason,
  };
}

/**
 * Call immediately before any server-side Zoho write.
 *
 * This guard exists to prevent an MMS deployment from writing to an unintended
 * Zoho organisation. It deliberately fails closed unless the MMS organisation
 * identifier and all server-side credentials are configured and CRM debug mode
 * has been explicitly disabled.
 */
export function assertMmsZohoLiveWriteBoundary(): void {
  const status = getMmsZohoBoundaryStatus();
  if (!status.readyForLiveWrites) throw new Error(status.reason);
}
