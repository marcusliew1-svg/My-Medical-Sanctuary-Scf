export type MmsCommercialDatabaseReadiness = {
  enabled: boolean;
  configured: boolean;
  schema: string;
  readyForAdapters: boolean;
  blockers: string[];
};

function validPostgresUrl(raw: string): boolean {
  if (!raw) return false;
  try {
    const url = new URL(raw);
    return url.protocol === "postgres:" || url.protocol === "postgresql:";
  } catch {
    return false;
  }
}

export function mmsCommercialDatabaseReadiness(): MmsCommercialDatabaseReadiness {
  const enabled = process.env.MMS_COMMERCIAL_DATABASE_ENABLED === "true";
  const rawUrl = process.env.MMS_COMMERCIAL_DATABASE_URL?.trim() || "";
  const schema = process.env.MMS_COMMERCIAL_DATABASE_SCHEMA?.trim() || "mms_commercial";
  const blockers: string[] = [];

  if (!enabled) blockers.push("MMS commercial database feature gate is disabled.");
  if (!validPostgresUrl(rawUrl)) blockers.push("A valid server-side PostgreSQL MMS commercial database URL is not configured.");
  if (!/^[a-z_][a-z0-9_]{0,62}$/.test(schema)) blockers.push("MMS commercial database schema name is invalid.");

  // Configuration alone does not prove the migration exists or that transactional
  // adapters are wired. Those checks are intentionally separate and must pass
  // before any existing fail-closed store is enabled.
  const configured = validPostgresUrl(rawUrl) && /^[a-z_][a-z0-9_]{0,62}$/.test(schema);

  return {
    enabled,
    configured,
    schema,
    readyForAdapters: enabled && configured,
    blockers,
  };
}

export function assertMmsCommercialDatabaseConfiguration(): void {
  const readiness = mmsCommercialDatabaseReadiness();
  if (!readiness.readyForAdapters) {
    throw new Error(readiness.blockers.join(" ") || "MMS commercial database is not ready for adapters.");
  }
}

// Never log or return MMS_COMMERCIAL_DATABASE_URL. It is a server-side credential.
