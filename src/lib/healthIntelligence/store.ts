import "server-only";
import {
  createDemoHealthIntelligenceSnapshot,
  type HealthIntelligenceSnapshot,
} from "@/lib/healthIntelligence/demoData";
import { assertRecordTransition } from "@/lib/healthIntelligence/verification";
import type {
  AuditEvent,
  RecordState,
  VerificationEvent,
} from "@/lib/healthIntelligence/types";
import { healthIntelligenceDemoModeEnabled } from "@/lib/healthIntelligence/auth";
import {
  mmsCommercialDatabaseClient,
  mmsCommercialDatabaseClientAvailable,
} from "@/lib/mmsCommercialDatabaseClient";

export type ReviewDecision =
  | "submit_for_review"
  | "verify"
  | "reject"
  | "publish"
  | "unpublish"
  | "mark_stale"
  | "reverify";
export type ReviewTargetType =
  | "medicine_product"
  | "price_observation"
  | "generic_relationship"
  | "match_review"
  | "market_registration";
export type ReviewMutation = {
  targetType: ReviewTargetType;
  targetId: string;
  decision: ReviewDecision;
  reviewer: string;
  notes?: string;
};

const DECISION_STATE: Record<ReviewDecision, RecordState> = {
  submit_for_review: "pending_review",
  verify: "verified",
  reject: "rejected",
  publish: "published",
  unpublish: "verified",
  mark_stale: "needs_reverification",
  reverify: "pending_review",
};

const TABLES: Record<ReviewTargetType, { table: string; state: string }> = {
  medicine_product: {
    table: "medicine_products",
    state: "verification_status",
  },
  price_observation: { table: "price_observations", state: "record_state" },
  generic_relationship: {
    table: "generic_relationships",
    state: "verification_status",
  },
  match_review: { table: "match_reviews", state: "verification_status" },
  market_registration: {
    table: "market_registrations",
    state: "verification_status",
  },
};

type DemoGlobal = typeof globalThis & {
  __mmsHealthIntelligenceDemo?: HealthIntelligenceSnapshot;
};
function demoSnapshot(): HealthIntelligenceSnapshot {
  const root = globalThis as DemoGlobal;
  root.__mmsHealthIntelligenceDemo ||= createDemoHealthIntelligenceSnapshot();
  return root.__mmsHealthIntelligenceDemo;
}

function demoMutate(mutation: ReviewMutation): HealthIntelligenceSnapshot {
  const snapshot = demoSnapshot();
  const collection =
    mutation.targetType === "medicine_product"
      ? snapshot.products
      : mutation.targetType === "price_observation"
        ? snapshot.prices
        : mutation.targetType === "generic_relationship"
          ? snapshot.relationships
          : null;
  if (!collection)
    throw new Error(
      "Demo mutation is available only for products, prices and generic relationships.",
    );
  const target = collection.find((item) => item.id === mutation.targetId) as
    | {
        verificationStatus?: RecordState;
        recordState?: RecordState;
        reviewer?: string;
        verifiedAt?: string;
        publicationStatus?: string;
      }
    | undefined;
  if (!target)
    throw new Error("Health Intelligence review target was not found.");
  if (mutation.decision === "publish")
    throw new Error("Demo Health Intelligence records can never be published.");
  const previous =
    target.recordState || target.verificationStatus || "collected";
  const next = DECISION_STATE[mutation.decision];
  assertRecordTransition(previous, next);
  if (target.recordState) target.recordState = next;
  else target.verificationStatus = next;
  if (next === "verified") {
    target.reviewer = mutation.reviewer;
    target.verifiedAt = new Date().toISOString();
  }
  if (mutation.decision === "unpublish")
    target.publicationStatus = "unpublished";
  const occurredAt = new Date().toISOString();
  const verification: VerificationEvent = {
    id: `demo-verification-${Date.now()}`,
    targetType: mutation.targetType,
    targetId: mutation.targetId,
    reviewer: mutation.reviewer,
    decision: mutation.decision,
    reasonNotes: mutation.notes,
    previousState: previous,
    newState: next,
    occurredAt,
    dataStatus: "demo",
  };
  const audit: AuditEvent = {
    id: `demo-audit-${Date.now()}`,
    actor: mutation.reviewer,
    action:
      mutation.decision === "submit_for_review" ||
      mutation.decision === "reverify"
        ? "update"
        : mutation.decision === "mark_stale"
          ? "mark_stale"
          : mutation.decision,
    targetType: mutation.targetType,
    targetId: mutation.targetId,
    occurredAt,
    metadata: {
      previousState: previous,
      newState: next,
      notes: mutation.notes,
      demo: true,
    },
    dataStatus: "demo",
  };
  snapshot.verificationEvents.unshift(verification);
  snapshot.auditEvents.unshift(audit);
  return snapshot;
}

async function postgresSnapshot(): Promise<HealthIntelligenceSnapshot> {
  const db = mmsCommercialDatabaseClient();
  const [
    markets,
    products,
    ingredients,
    sources,
    prices,
    relationships,
    matches,
    verificationEvents,
    auditEvents,
  ] = await Promise.all([
    db.query<any>(
      'select id,country_code as "countryCode",country_name as "countryName",default_currency as currency from mms_commercial.health_intelligence_markets order by country_name',
    ),
    db.query<any>(
      `select p.id::text,p.product_code as "productCode",p.generic_name as "genericName",coalesce(b.name,'') as "brandName",coalesce(m.name,'') as "manufacturerName",p.dosage_form_id as "dosageFormId",p.route_id as "routeId",p.release_type_id as "releaseTypeId",p.pack_size::float8 as "packSize",p.units_per_pack::float8 as "unitsPerPack",p.device_or_presentation as "deviceOrPresentation",p.combination_product as "combinationProduct",p.biologic,p.biosimilar,p.narrow_therapeutic_index as "narrowTherapeuticIndex",p.complex_injectable as "complexInjectable",p.special_device as "specialDevice",p.oncology_medicine as "oncologyMedicine",p.special_formulation as "specialFormulation",p.verification_status as "verificationStatus",p.publication_status as "publicationStatus",p.data_status as "dataStatus",p.verified_at as "verifiedAt",p.valid_until as "validUntil",p.review_due_at as "reviewDueAt" from mms_commercial.medicine_products p left join mms_commercial.brands b on b.id=p.brand_id left join mms_commercial.manufacturers m on m.id=p.manufacturer_id order by p.created_at desc`,
    ),
    db.query<any>(
      `select i.product_id::text as "productId",i.active_ingredient_id::text as "ingredientId",a.canonical_name as name,i.strength_value::float8 as "strengthValue",i.strength_unit as "strengthUnit",i.salt_or_ester as "saltOrEster",i.clinically_meaningful_variant as "clinicallyMeaningfulVariant" from mms_commercial.medicine_product_ingredients i join mms_commercial.active_ingredients a on a.id=i.active_ingredient_id order by i.sequence_number`,
    ),
    db.query<any>(
      `select id::text,source_code as "sourceCode",source_name as "sourceName",source_type as "sourceType",market_id as "marketId",source_url as "sourceUrl",trust_level as "trustLevel",active,data_status as "dataStatus",verification_status as "verificationStatus",verified_at as "verifiedAt",source_status as "sourceStatus",visibility_level as "visibilityLevel" from mms_commercial.price_sources order by source_name`,
    ),
    db.query<any>(
      `select id::text,product_id::text as "productId",market_id as "marketId",source_id::text as "sourceId",observed_local_price::float8 as "observedLocalPrice",currency,pack_quantity::float8 as "packQuantity",comparison_basis as "comparisonBasis",normalization_unit as "normalizationUnit",normalized_quantity::float8 as "normalizedQuantity",observed_at as "observedAt",price_verification_status as "priceVerificationStatus",record_state as "recordState",publication_status as "publicationStatus",reviewer,verified_at as "verifiedAt",valid_until as "validUntil",review_due_at as "reviewDueAt",data_status as "dataStatus" from mms_commercial.price_observations order by observed_at desc`,
    ),
    db.query<any>(
      `select id::text,source_product_id::text as "sourceProductId",candidate_product_id::text as "candidateProductId",relationship_type as "relationshipType",match_confidence as "matchConfidence",verification_status as "verificationStatus",reviewer,review_notes as "reviewNotes",data_status as "dataStatus" from mms_commercial.generic_relationships order by created_at desc`,
    ),
    db.query<any>(
      `select id::text,source_product_id::text as "leftId",candidate_product_id::text as "rightId",jsonb_build_object('classification',classification,'confidence',match_confidence,'score',score,'ruleVersion',rule_version,'hardExceptionCodes',hard_exception_codes,'explanation',explanation->>'summary','dimensions','[]'::jsonb) as result from mms_commercial.match_reviews order by created_at desc`,
    ),
    db.query<any>(
      `select id::text,target_type as "targetType",target_id::text as "targetId",reviewer,decision,reason_notes as "reasonNotes",previous_state as "previousState",new_state as "newState",occurred_at as "occurredAt",data_status as "dataStatus" from mms_commercial.verification_events order by occurred_at desc limit 100`,
    ),
    db.query<any>(
      `select id::text,actor,action,target_type as "targetType",target_id as "targetId",occurred_at as "occurredAt",metadata,data_status as "dataStatus" from mms_commercial.health_intelligence_audit_events order by occurred_at desc limit 100`,
    ),
  ]);
  const ingredientsByProduct = new Map<string, any[]>();
  for (const ingredient of ingredients.rows)
    ingredientsByProduct.set(ingredient.productId, [
      ...(ingredientsByProduct.get(ingredient.productId) || []),
      ingredient,
    ]);
  return {
    markets: markets.rows as any,
    products: products.rows.map((product: any) => ({
      ...product,
      ingredients: ingredientsByProduct.get(product.id) || [],
    })),
    sources: sources.rows as any,
    prices: prices.rows as any,
    relationships: relationships.rows as any,
    matches: matches.rows as any,
    verificationEvents: verificationEvents.rows as any,
    auditEvents: auditEvents.rows as any,
  };
}

async function postgresMutate(
  mutation: ReviewMutation,
): Promise<HealthIntelligenceSnapshot> {
  const target = TABLES[mutation.targetType];
  const db = mmsCommercialDatabaseClient();
  await db.transaction(async (tx) => {
    const currentResult = await tx.query<{
      current_state: RecordState;
      data_status: "demo" | "live";
    }>(
      `select ${target.state} as current_state,data_status from mms_commercial.${target.table} where id=$1::uuid for update`,
      [mutation.targetId],
    );
    const current = currentResult.rows[0];
    if (!current)
      throw new Error("Health Intelligence review target was not found.");
    const next = DECISION_STATE[mutation.decision];
    assertRecordTransition(current.current_state, next);
    if (
      mutation.decision === "publish" &&
      mutation.targetType === "price_observation"
    ) {
      const eligibility = await tx.query<{
        eligible: boolean;
        reasons: string[];
      }>(
        "select eligible,reasons from mms_commercial.health_intelligence_price_publication_eligibility($1::uuid)",
        [mutation.targetId],
      );
      if (!eligibility.rows[0]?.eligible)
        throw new Error(
          `Price is not publishable: ${(eligibility.rows[0]?.reasons || []).join(", ")}`,
        );
    }
    const publication =
      mutation.decision === "publish"
        ? ",publication_status='published'"
        : mutation.decision === "unpublish"
          ? ",publication_status='unpublished'"
          : "";
    const verification =
      next === "verified" ? ",reviewer=$3,verified_at=now()" : "";
    await tx.query(
      `update mms_commercial.${target.table} set ${target.state}=$2${publication}${verification},updated_at=now() where id=$1::uuid`,
      [mutation.targetId, next, mutation.reviewer],
    );
    await tx.query(
      "insert into mms_commercial.verification_events(target_type,target_id,reviewer,decision,reason_notes,previous_state,new_state,data_status) values($1,$2::uuid,$3,$4,$5,$6,$7,$8)",
      [
        mutation.targetType,
        mutation.targetId,
        mutation.reviewer,
        mutation.decision,
        mutation.notes || null,
        current.current_state,
        next,
        current.data_status,
      ],
    );
    const auditAction =
      mutation.decision === "submit_for_review" ||
      mutation.decision === "reverify"
        ? "update"
        : mutation.decision === "mark_stale"
          ? "mark_stale"
          : mutation.decision;
    await tx.query(
      "insert into mms_commercial.health_intelligence_audit_events(actor,action,target_type,target_id,metadata,data_status) values($1,$2,$3,$4,jsonb_build_object('previousState',$5,'newState',$6,'notes',$7),$8)",
      [
        mutation.reviewer,
        auditAction,
        mutation.targetType,
        mutation.targetId,
        current.current_state,
        next,
        mutation.notes || null,
        current.data_status,
      ],
    );
  });
  return postgresSnapshot();
}

export async function healthIntelligenceSnapshot(): Promise<HealthIntelligenceSnapshot> {
  if (healthIntelligenceDemoModeEnabled()) return demoSnapshot();
  if (!mmsCommercialDatabaseClientAvailable())
    throw new Error("MMS Health Intelligence database is unavailable.");
  return postgresSnapshot();
}

export async function reviewHealthIntelligenceRecord(
  mutation: ReviewMutation,
): Promise<HealthIntelligenceSnapshot> {
  if (healthIntelligenceDemoModeEnabled()) return demoMutate(mutation);
  if (!mmsCommercialDatabaseClientAvailable())
    throw new Error("MMS Health Intelligence database is unavailable.");
  return postgresMutate(mutation);
}
