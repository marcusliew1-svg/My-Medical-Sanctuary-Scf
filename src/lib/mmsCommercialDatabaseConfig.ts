export type MmsCommercialDatabaseReadiness = {
  enabled: boolean;
  configured: boolean;
  schema: string;
  readyForAdapters: boolean;
  blockers: string[];
};

const MMS_COMMERCIAL_SCHEMA = "mms_commercial";

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
  const schema = process.env.MMS_COMMERCIAL_DATABASE_SCHEMA?.trim() || MMS_COMMERCIAL_SCHEMA;
  const blockers: string[] = [];

  if (!enabled) blockers.push("MMS commercial database feature gate is disabled.");
  if (!validPostgresUrl(rawUrl)) blockers.push("A valid server-side PostgreSQL MMS commercial database URL is not configured.");
  if (schema !== MMS_COMMERCIAL_SCHEMA) {
    blockers.push(`MMS commercial database schema must be ${MMS_COMMERCIAL_SCHEMA}; current adapters use that fixed audited schema.`);
  }

  // The SQL migrations and adapters intentionally use one fixed audited schema.
  // Do not accept an arbitrary identifier here: doing so would imply support for
  // a schema that the current SQL and adapters do not actually target.
  const configured = validPostgresUrl(rawUrl) && schema === MMS_COMMERCIAL_SCHEMA;

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
