import {
  mmsCommercialDatabaseClient,
  mmsCommercialDatabaseClientAvailable,
  type MmsCommercialDatabaseClient,
} from "@/lib/mmsCommercialDatabaseClient";

export const MMS_COMMERCIAL_REQUIRED_MIGRATIONS = Object.freeze([
  "0001_mms_commercial_foundation.sql",
  "0002_mms_commercial_atomic_operations.sql",
  "0003_mms_commerce_and_commission_atomic_ops.sql",
]);

export const MMS_COMMERCIAL_REQUIRED_TABLES = Object.freeze([
  "partners",
  "partner_audit_events",
  "partner_training_evidence",
  "partner_assessment_attempts",
  "partner_certifications",
  "partner_sessions",
  "partner_csrf_tokens",
  "leads",
  "lead_duplicate_decisions",
  "lead_ownership_events",
  "lead_lifecycle_events",
  "applications",
  "payments",
  "payment_verifications",
  "memberships",
  "commercial_workflow_events",
  "commission_rules",
  "commission_transactions",
  "commission_events",
  "presentation_assets",
]);

export const MMS_COMMERCIAL_REQUIRED_FUNCTIONS = Object.freeze([
  "allocate_partner_code",
  "issue_partner_code_for_crm_record",
  "register_partner_lead",
  "finance_verify_payment",
  "activate_membership",
  "transition_commission",
]);

export type MmsCommercialDatabaseProbe = {
  status: "ready" | "incomplete" | "unavailable";
  schemaPresent: boolean;
  tables: {
    expected: number;
    present: number;
    missing: string[];
  };
  functions: {
    expected: number;
    present: number;
    missing: string[];
  };
  databaseVersion?: string;
  message?: string;
};

function names(rows: Array<{ name: string }>): Set<string> {
  return new Set(rows.map((row) => String(row.name || "").trim()).filter(Boolean));
}

export async function probeMmsCommercialDatabaseWithClient(
  client: MmsCommercialDatabaseClient,
): Promise<MmsCommercialDatabaseProbe> {
  try {
    const schema = await client.query<{ present: boolean }>(
      `select exists(select 1 from information_schema.schemata where schema_name = 'mms_commercial') as present`,
    );
    const schemaPresent = Boolean(schema.rows[0]?.present);
    if (!schemaPresent) {
      return {
        status: "incomplete",
        schemaPresent: false,
        tables: { expected: MMS_COMMERCIAL_REQUIRED_TABLES.length, present: 0, missing: [...MMS_COMMERCIAL_REQUIRED_TABLES] },
        functions: { expected: MMS_COMMERCIAL_REQUIRED_FUNCTIONS.length, present: 0, missing: [...MMS_COMMERCIAL_REQUIRED_FUNCTIONS] },
        message: "The mms_commercial schema has not been applied.",
      };
    }

    const [tablesResult, functionsResult, versionResult] = await Promise.all([
      client.query<{ name: string }>(
        `select table_name as name
           from information_schema.tables
          where table_schema = 'mms_commercial'
            and table_type = 'BASE TABLE'`,
      ),
      client.query<{ name: string }>(
        `select distinct p.proname as name
           from pg_catalog.pg_proc p
           join pg_catalog.pg_namespace n on n.oid = p.pronamespace
          where n.nspname = 'mms_commercial'`,
      ),
      client.query<{ version: string }>(`select current_setting('server_version') as version`),
    ]);

    const tableNames = names(tablesResult.rows);
    const functionNames = names(functionsResult.rows);
    const missingTables = MMS_COMMERCIAL_REQUIRED_TABLES.filter((name) => !tableNames.has(name));
    const missingFunctions = MMS_COMMERCIAL_REQUIRED_FUNCTIONS.filter((name) => !functionNames.has(name));
    const ready = missingTables.length === 0 && missingFunctions.length === 0;

    return {
      status: ready ? "ready" : "incomplete",
      schemaPresent: true,
      tables: {
        expected: MMS_COMMERCIAL_REQUIRED_TABLES.length,
        present: MMS_COMMERCIAL_REQUIRED_TABLES.length - missingTables.length,
        missing: missingTables,
      },
      functions: {
        expected: MMS_COMMERCIAL_REQUIRED_FUNCTIONS.length,
        present: MMS_COMMERCIAL_REQUIRED_FUNCTIONS.length - missingFunctions.length,
        missing: missingFunctions,
      },
      databaseVersion: versionResult.rows[0]?.version,
      message: ready ? undefined : "One or more required MMS commercial database objects are missing.",
    };
  } catch {
    return {
      status: "unavailable",
      schemaPresent: false,
      tables: { expected: MMS_COMMERCIAL_REQUIRED_TABLES.length, present: 0, missing: [...MMS_COMMERCIAL_REQUIRED_TABLES] },
      functions: { expected: MMS_COMMERCIAL_REQUIRED_FUNCTIONS.length, present: 0, missing: [...MMS_COMMERCIAL_REQUIRED_FUNCTIONS] },
      message: "MMS commercial database structural probe could not be completed.",
    };
  }
}

export async function probeMmsCommercialDatabase(): Promise<MmsCommercialDatabaseProbe> {
  if (!mmsCommercialDatabaseClientAvailable()) {
    return {
      status: "unavailable",
      schemaPresent: false,
      tables: { expected: MMS_COMMERCIAL_REQUIRED_TABLES.length, present: 0, missing: [...MMS_COMMERCIAL_REQUIRED_TABLES] },
      functions: { expected: MMS_COMMERCIAL_REQUIRED_FUNCTIONS.length, present: 0, missing: [...MMS_COMMERCIAL_REQUIRED_FUNCTIONS] },
      message: "MMS commercial PostgreSQL runtime client is not operational.",
    };
  }
  return probeMmsCommercialDatabaseWithClient(mmsCommercialDatabaseClient());
}
