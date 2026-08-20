import { mmsCommercialDatabaseClient, mmsCommercialDatabaseClientAvailable } from "@/lib/mmsCommercialDatabaseClient";
import { probeMmsCommercialDatabase } from "@/lib/mmsCommercialDatabaseProbe";

export type MmsCommercialDatabaseSmokeTest = {
  status: "ready" | "failed" | "unavailable";
  structuralProbe: Awaited<ReturnType<typeof probeMmsCommercialDatabase>>;
  transactionRoundTrip: boolean;
  leastPrivilege: {
    schemaCreateDenied: boolean;
    partnersDeleteDenied: boolean;
    auditUpdateDenied: boolean;
    auditDeleteDenied: boolean;
  };
  message?: string;
};

export async function runMmsCommercialDatabaseSmokeTest(): Promise<MmsCommercialDatabaseSmokeTest> {
  const structuralProbe = await probeMmsCommercialDatabase();
  if (!mmsCommercialDatabaseClientAvailable()) {
    return {
      status: "unavailable",
      structuralProbe,
      transactionRoundTrip: false,
      leastPrivilege: {
        schemaCreateDenied: false,
        partnersDeleteDenied: false,
        auditUpdateDenied: false,
        auditDeleteDenied: false,
      },
      message: "MMS commercial PostgreSQL runtime client is not operational.",
    };
  }

  if (structuralProbe.status !== "ready") {
    return {
      status: "failed",
      structuralProbe,
      transactionRoundTrip: false,
      leastPrivilege: {
        schemaCreateDenied: false,
        partnersDeleteDenied: false,
        auditUpdateDenied: false,
        auditDeleteDenied: false,
      },
      message: "MMS commercial database structure is incomplete.",
    };
  }

  const client = mmsCommercialDatabaseClient();
  try {
    const transactionRoundTrip = await client.transaction(async (tx) => {
      const result = await tx.query<{ ok: number }>("select 1::int as ok");
      return result.rows[0]?.ok === 1;
    });

    const privileges = await client.query<{
      schema_create: boolean;
      partners_delete: boolean;
      audit_update: boolean;
      audit_delete: boolean;
    }>(`select
      has_schema_privilege(current_user, 'mms_commercial', 'CREATE') as schema_create,
      has_table_privilege(current_user, 'mms_commercial.partners', 'DELETE') as partners_delete,
      has_table_privilege(current_user, 'mms_commercial.partner_audit_events', 'UPDATE') as audit_update,
      has_table_privilege(current_user, 'mms_commercial.partner_audit_events', 'DELETE') as audit_delete`);

    const row = privileges.rows[0];
    const leastPrivilege = {
      schemaCreateDenied: row?.schema_create === false,
      partnersDeleteDenied: row?.partners_delete === false,
      auditUpdateDenied: row?.audit_update === false,
      auditDeleteDenied: row?.audit_delete === false,
    };
    const ready = transactionRoundTrip && Object.values(leastPrivilege).every(Boolean);

    return {
      status: ready ? "ready" : "failed",
      structuralProbe,
      transactionRoundTrip,
      leastPrivilege,
      message: ready ? undefined : "MMS commercial database runtime or least-privilege checks failed.",
    };
  } catch {
    return {
      status: "failed",
      structuralProbe,
      transactionRoundTrip: false,
      leastPrivilege: {
        schemaCreateDenied: false,
        partnersDeleteDenied: false,
        auditUpdateDenied: false,
        auditDeleteDenied: false,
      },
      message: "MMS commercial database smoke test could not be completed.",
    };
  }
}
