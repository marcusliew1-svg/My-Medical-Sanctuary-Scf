import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  healthIntelligenceMutationOriginAllowed,
  healthIntelligenceOperationsRole,
  healthIntelligenceRequestAuthorized,
} from "@/lib/healthIntelligence/auth";
import { roleCan } from "@/lib/healthIntelligence/operations";
import {
  confirmCsvIngestion,
  createConnectorConfiguration,
  ingestionSnapshot,
  prepareCsvIngestion,
  resolveIngestionRowCandidate,
  updateConnectorActivation,
} from "@/lib/healthIntelligence/ingestionStore";

export const dynamic = "force-dynamic";
const json = (body: unknown, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" },
  });

export async function GET(request: NextRequest) {
  if (!healthIntelligenceRequestAuthorized(request))
    return json({ status: "unauthorized" }, 401);
  try {
    return json({ status: "ready", snapshot: await ingestionSnapshot() });
  } catch {
    return json({ status: "unavailable" }, 503);
  }
}

export async function POST(request: NextRequest) {
  const role = healthIntelligenceOperationsRole(request);
  if (!role) return json({ status: "unauthorized" }, 401);
  if (!healthIntelligenceMutationOriginAllowed(request))
    return json({ status: "forbidden" }, 403);
  if (Number(request.headers.get("content-length") || 0) > 1_100_000)
    return json({ status: "too_large" }, 413);
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const action = String(body.action || "");
    if (action === "prepare_csv") {
      if (!roleCan(role, "collect")) throw new Error("Role not permitted.");
      const result = await prepareCsvIngestion({
        sourceId: String(body.sourceId),
        connectorId: String(body.connectorId),
        filename: String(body.filename || "controlled-import.csv"),
        csv: String(body.csv || ""),
        initiatedBy: role,
        idempotencyKey: String(body.idempotencyKey || "") || undefined,
      });
      return json({ status: "preview", ...result });
    }
    if (action === "resolve_row") {
      if (!roleCan(role, "review")) throw new Error("Role not permitted.");
      return json({
        status: "resolved",
        ...(await resolveIngestionRowCandidate({
          batchId: String(body.batchId),
          rowId: String(body.rowId),
          candidateId: String(body.candidateId),
          actor: role,
        })),
      });
    }
    if (action === "confirm_import") {
      if (!roleCan(role, "collect")) throw new Error("Role not permitted.");
      return json({
        status: "imported",
        ...(await confirmCsvIngestion(
          String(body.batchId),
          body.confirmed === true,
          role,
        )),
      });
    }
    if (action === "create_connector") {
      if (role !== "admin") throw new Error("Admin role required.");
      return json({
        status: "created",
        snapshot: await createConnectorConfiguration(body.connector as never, role),
      });
    }
    if (action === "connector_activation") {
      if (role !== "admin") throw new Error("Admin role required.");
      return json({
        status: "updated",
        snapshot: await updateConnectorActivation(
          String(body.connectorId),
          body.connectorStatus as never,
          role,
          String(body.reason || "Connector governance update"),
        ),
      });
    }
    return json({ status: "invalid" }, 400);
  } catch (error) {
    return json(
      {
        status: "conflict",
        message: error instanceof Error ? error.message : "Ingestion operation failed.",
      },
      409,
    );
  }
}
