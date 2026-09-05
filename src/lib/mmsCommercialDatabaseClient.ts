import "server-only";
import pg from "pg";
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

type PgQueryResult = {
  rows: Record<string, unknown>[];
  rowCount: number | null;
};

type PgPoolClient = {
  query(text: string, values?: readonly unknown[]): Promise<PgQueryResult>;
  release(): void;
};

type PgPool = {
  query(text: string, values?: readonly unknown[]): Promise<PgQueryResult>;
  connect(): Promise<PgPoolClient>;
};

type PgModule = {
  Pool: new (config: {
    connectionString: string;
    max: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
    application_name: string;
  }) => PgPool;
};

const PgPool = (pg as unknown as PgModule).Pool;
let cachedPool: PgPool | null = null;

function pool(): PgPool {
  if (cachedPool) return cachedPool;
  const readiness = mmsCommercialDatabaseReadiness();
  if (!readiness.readyForAdapters) {
    throw new Error(readiness.blockers.join(" ") || "MMS commercial database configuration is unavailable.");
  }

  const connectionString = process.env.MMS_COMMERCIAL_DATABASE_URL?.trim() || "";
  cachedPool = new PgPool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 8_000,
    application_name: "mms-commercial-web",
  });
  return cachedPool;
}

function normalizedResult<Row extends Record<string, unknown>>(result: PgQueryResult): MmsCommercialQueryResult<Row> {
  return {
    rows: result.rows as Row[],
    rowCount: result.rowCount ?? result.rows.length,
  };
}

export function mmsCommercialDatabaseClientAvailable(): boolean {
  return mmsCommercialDatabaseReadiness().readyForAdapters;
}

/**
 * Runtime PostgreSQL provider for the dedicated MMS commercial datastore.
 * node-postgres is loaded only on the server. When the dependency or database
 * configuration is absent the entire persistence layer remains fail-closed.
 */
export function mmsCommercialDatabaseClient(): MmsCommercialDatabaseClient {
  if (!mmsCommercialDatabaseClientAvailable()) {
    const readiness = mmsCommercialDatabaseReadiness();
    const reason = !readiness.readyForAdapters
      ? readiness.blockers.join(" ") || "MMS commercial database is unavailable."
      : "MMS commercial PostgreSQL runtime dependency is unavailable.";
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

  return {
    async query<Row extends Record<string, unknown> = Record<string, unknown>>(
      text: string,
      values?: readonly unknown[],
    ): Promise<MmsCommercialQueryResult<Row>> {
      const result = await pool().query(text, values);
      return normalizedResult<Row>(result);
    },

    async transaction<T>(work: (tx: MmsCommercialTransaction) => Promise<T>): Promise<T> {
      const connection = await pool().connect();
      try {
        await connection.query("begin");
        const tx: MmsCommercialTransaction = {
          async query<Row extends Record<string, unknown> = Record<string, unknown>>(
            text: string,
            values?: readonly unknown[],
          ): Promise<MmsCommercialQueryResult<Row>> {
            return normalizedResult<Row>(await connection.query(text, values));
          },
        };
        const result = await work(tx);
        await connection.query("commit");
        return result;
      } catch (error) {
        try {
          await connection.query("rollback");
        } catch {
          // Preserve the original failure; never leak connection or SQL details.
        }
        throw error;
      } finally {
        connection.release();
      }
    },
  };
}
