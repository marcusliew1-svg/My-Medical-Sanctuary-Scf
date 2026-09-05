import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  healthIntelligenceMutationOriginAllowed,
  healthIntelligenceOperationsRole,
  healthIntelligenceRequestAuthorized,
} from "@/lib/healthIntelligence/auth";
import { validateObservationCsv } from "@/lib/healthIntelligence/csvImport";
import {
  createCandidateSource,
  createOperationalObservation,
  operationsSnapshot,
  resolveOperationalObservationIdentity,
  transitionOperationalObservation,
  updateSourceGovernance,
} from "@/lib/healthIntelligence/operationsStore";
import {
  roleCan,
  type OperationsRole,
} from "@/lib/healthIntelligence/operations";

export const dynamic = "force-dynamic";
const response = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(request: NextRequest) {
  if (!healthIntelligenceRequestAuthorized(request))
    return response({ status: "unauthorized" }, 401);
  try {
    return response({ status: "ready", snapshot: await operationsSnapshot() });
  } catch {
    return response({ status: "unavailable" }, 503);
  }
}

export async function POST(request: NextRequest) {
  if (!healthIntelligenceRequestAuthorized(request))
    return response({ status: "unauthorized" }, 401);
  if (!healthIntelligenceMutationOriginAllowed(request))
    return response({ status: "forbidden" }, 403);
  if (Number(request.headers.get("content-length") || 0) > 1_100_000)
    return response({ status: "too_large" }, 413);
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const action = String(body.action || "");
    const role = healthIntelligenceOperationsRole(request);
    if (!role) return response({ status: "unauthorized" }, 401);
    const actor = role;
    const requireCapability = (
      capability: Parameters<typeof roleCan>[1],
    ): OperationsRole => {
      if (!roleCan(role, capability)) throw new Error("Role not permitted.");
      return role;
    };
    if (action === "csv_dry_run")
      return (
        requireCapability("collect"),
        response({
          status: "preview",
          preview: validateObservationCsv(String(body.csv || "")),
        })
      );
    if (action === "create_source") {
      requireCapability("collect");
      return response({
        status: "created",
        snapshot: await createCandidateSource(body.source as never, actor),
      });
    }
    if (action === "source_governance") {
      requireCapability("review");
      return response({
        status: "updated",
        snapshot: await updateSourceGovernance(
          String(body.sourceId),
          body.sourceStatus as never,
          body.trustLevel as never,
          String(body.reason || ""),
          actor,
        ),
      });
    }
    if (action === "create_observation") {
      requireCapability("collect");
      const result = await createOperationalObservation(
        body.observation as never,
        actor,
      );
      return response({ status: "created", ...result });
    }
    if (action === "resolve_observation_identity") {
      requireCapability("review");
      return response({
        status: "updated",
        snapshot: await resolveOperationalObservationIdentity(
          String(body.observationId),
          String(body.matchedProductId),
          actor,
          String(body.reason || "Exact product identity reviewed"),
        ),
      });
    }
    if (action === "transition_observation") {
      const stage = String(body.stage);
      requireCapability(
        stage === "publication_approved" ? "publish" : "review",
      );
      return response({
        status: "updated",
        snapshot: await transitionOperationalObservation(
          String(body.observationId),
          stage as never,
          actor,
          String(body.reason || ""),
        ),
      });
    }
    return response({ status: "invalid" }, 400);
  } catch (error) {
    return response(
      {
        status: "conflict",
        message: error instanceof Error ? error.message : "Operation failed.",
      },
      409,
    );
  }
}
