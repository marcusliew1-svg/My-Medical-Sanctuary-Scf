export type MmsZohoBoundaryStatus = {
  readyForLiveWrites: boolean;
  organisationConfigured: boolean;
  expectedOrganisationConfigured: boolean;
  targetMatchesExpected: boolean;
  credentialsConfigured: boolean;
  debugMode: boolean;
  reason: string;
};

function value(name: string): string {
  return process.env[name]?.trim() || "";
}

export function getMmsZohoBoundaryStatus(): MmsZohoBoundaryStatus {
  const targetOrganisation = value("ZOHO_ORGANIZATION_ID");
  const expectedOrganisation = value("MMS_ZOHO_EXPECTED_ORGANIZATION_ID");
  const organisationConfigured = Boolean(targetOrganisation);
  const expectedOrganisationConfigured = Boolean(expectedOrganisation);
  const targetMatchesExpected =
    organisationConfigured && expectedOrganisationConfigured && targetOrganisation === expectedOrganisation;
  const credentialsConfigured = Boolean(
    value("ZOHO_CLIENT_ID") && value("ZOHO_CLIENT_SECRET") && value("ZOHO_REFRESH_TOKEN"),
  );
  const debugMode = process.env.MMS_CRM_DEBUG !== "false";
  const readyForLiveWrites = targetMatchesExpected && credentialsConfigured && !debugMode;

  let reason = "MMS Zoho live-write boundary is satisfied.";
  if (!organisationConfigured) reason = "MMS Zoho target organisation identifier is not configured.";
  else if (!expectedOrganisationConfigured) reason = "Approved MMS Zoho organisation identifier is not configured independently.";
  else if (!targetMatchesExpected) reason = "Configured Zoho target does not match the independently approved MMS organisation.";
  else if (!credentialsConfigured) reason = "MMS Zoho server credentials are incomplete.";
  else if (debugMode) reason = "MMS CRM remains in safe debug mode; live writes are disabled.";

  return {
    readyForLiveWrites,
    organisationConfigured,
    expectedOrganisationConfigured,
    targetMatchesExpected,
    credentialsConfigured,
    debugMode,
    reason,
  };
}

/**
 * Call immediately before any server-side Zoho write.
 *
 * This guard fails closed unless the configured target organisation exactly
 * matches an independently configured approved MMS organisation identifier,
 * required server credentials are present and CRM debug mode has explicitly
 * been disabled. Never set the approved identifier from browser input.
 */
export function assertMmsZohoLiveWriteBoundary(): void {
  const status = getMmsZohoBoundaryStatus();
  if (!status.readyForLiveWrites) throw new Error(status.reason);
}
