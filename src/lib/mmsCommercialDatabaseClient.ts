import { mmsCommercialDatabaseReadiness } from "@/lib/mmsCommercialDatabaseConfig";

export type MmsCommercialQueryResult<Row extends Record<string, unknown> = Record<string, unknown>> = {
  rows: Row[];
  rowCount: number;
};

export type MmsCommercialTransaction = {
  query<Row extends Record<string, unknown> = Record<string, unknown>>(
    text: string,
    values?: readonly unknown[],
  ): Promise<MmsCommercialQueryResult<Row>>;
};

export type MmsCommercialDatabaseClient = MmsCommercialTransaction & {
  transaction<T>(work: (tx: MmsCommercialTransaction) => Promise<T>): Promise<T>;
};

export const MMS_COMMERCIAL_DATABASE_CLIENT_REQUIREMENTS = Object.freeze([
  "The database client must use a server-side PostgreSQL connection credential and must never expose it to browser code.",
  "Multi-record commercial state changes must execute inside a real PostgreSQL transaction.",
  "The application database role must have only the MMS commercial privileges required by the server adapters.",
  "The database client must reject unsafe dynamic schema/table identifiers; identifiers are selected from trusted server configuration only.",
  "Errors returned to public or Partner-facing APIs must not include SQL text, connection details, credentials or database hostnames.",
  "Clinical/patient infrastructure and iPivot database infrastructure must never be used as the MMS commercial database client.",
]);

export function mmsCommercialDatabaseClientAvailable(): boolean {
  // Configuration is necessary but not sufficient. This remains false until a
  // dedicated MMS PostgreSQL driver/provider is installed and wired. Do not
  // treat a configured URL alone as proof that persistence is operational.
  return false;
}

/**
 * Deliberately fail closed until the repository has a vetted PostgreSQL driver
 * and a dedicated MMS database instance. Store adapters may depend on this
 * interface now without silently creating browser/Zoho/in-memory fallbacks.
 */
export function mmsCommercialDatabaseClient(): MmsCommercialDatabaseClient {
  const readiness = mmsCommercialDatabaseReadiness();
  const reason = readiness.readyForAdapters
    ? "MMS commercial PostgreSQL driver/provider is not wired yet."
    : readiness.blockers.join(" ") || "MMS commercial database is unavailable.";

  const unavailable = async (): Promise<never> => {
    throw new Error(reason);
  };

  return {
    async query() {
      return unavailable();
    },
    async transaction() {
      return unavailable();
    },
  };
}
