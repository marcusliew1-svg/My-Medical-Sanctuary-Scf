import { matchMedicineProducts } from "@/lib/healthIntelligence/matching";
import type {
  AuditEvent,
  GenericRelationship,
  MatchResult,
  MedicineProductIdentity,
  PriceObservation,
  PriceSource,
  VerificationEvent,
} from "@/lib/healthIntelligence/types";

export const healthIntelligenceMarkets = [
  {
    id: "market-my",
    countryCode: "MY",
    countryName: "Malaysia",
    currency: "MYR",
  },
  {
    id: "market-th",
    countryCode: "TH",
    countryName: "Thailand",
    currency: "THB",
  },
  {
    id: "market-sg",
    countryCode: "SG",
    countryName: "Singapore",
    currency: "SGD",
  },
  {
    id: "market-id",
    countryCode: "ID",
    countryName: "Indonesia",
    currency: "IDR",
  },
  {
    id: "market-au",
    countryCode: "AU",
    countryName: "Australia",
    currency: "AUD",
  },
  {
    id: "market-us",
    countryCode: "US",
    countryName: "United States",
    currency: "USD",
  },
  {
    id: "market-ae",
    countryCode: "AE",
    countryName: "United Arab Emirates",
    currency: "AED",
  },
] as const;

const common = {
  dosageFormId: "tablet",
  routeId: "oral",
  releaseTypeId: "immediate",
  packSize: 30,
  unitsPerPack: 30,
  combinationProduct: false,
  biologic: false,
  biosimilar: false,
  narrowTherapeuticIndex: false,
  complexInjectable: false,
  specialDevice: false,
  oncologyMedicine: false,
  specialFormulation: false,
  verificationStatus: "verified",
  publicationStatus: "not_eligible",
  dataStatus: "demo",
  verifiedAt: "2026-08-20T10:00:00.000Z",
} as const;

export const demoProducts: MedicineProductIdentity[] = [
  {
    ...common,
    id: "demo-product-a-my",
    productCode: "DEMO-A-MY",
    genericName: "Clarionex",
    brandName: "Northstar A",
    manufacturerName: "Fictional Meridian Labs",
    ingredients: [
      {
        ingredientId: "demo-ingredient-a",
        name: "Clarionex",
        strengthValue: 10,
        strengthUnit: "mg",
      },
    ],
  },
  {
    ...common,
    id: "demo-product-a-th",
    productCode: "DEMO-A-TH",
    genericName: "Clarionex",
    brandName: "Northstar A",
    manufacturerName: "Fictional Meridian Labs",
    ingredients: [
      {
        ingredientId: "demo-ingredient-a",
        name: "Clarionex",
        strengthValue: 10,
        strengthUnit: "mg",
      },
    ],
  },
  {
    ...common,
    id: "demo-product-b",
    productCode: "DEMO-B-GENERIC",
    genericName: "Clarionex",
    brandName: "Harbour B",
    manufacturerName: "Fictional Harbour Generics",
    unitsPerPack: 60,
    packSize: 60,
    ingredients: [
      {
        ingredientId: "demo-ingredient-a",
        name: "Clarionex",
        strengthValue: 10,
        strengthUnit: "mg",
      },
    ],
  },
  {
    ...common,
    id: "demo-product-c",
    productCode: "DEMO-C-MR",
    genericName: "Velorin",
    brandName: "Continuum C",
    manufacturerName: "Fictional Continuum Pharma",
    releaseTypeId: "extended",
    ingredients: [
      {
        ingredientId: "demo-ingredient-c",
        name: "Velorin",
        strengthValue: 20,
        strengthUnit: "mg",
      },
    ],
  },
  {
    ...common,
    id: "demo-product-c-candidate",
    productCode: "DEMO-C-MR-ALT",
    genericName: "Velorin",
    brandName: "Continuum C Alt",
    manufacturerName: "Fictional Alt Pharma",
    releaseTypeId: "extended",
    ingredients: [
      {
        ingredientId: "demo-ingredient-c",
        name: "Velorin",
        strengthValue: 20,
        strengthUnit: "mg",
      },
    ],
  },
  {
    ...common,
    id: "demo-product-d",
    productCode: "DEMO-D-BIOLOGIC",
    genericName: "Lumera-Bio",
    brandName: "Lumera D",
    manufacturerName: "Fictional Biologic Works",
    dosageFormId: "prefilled-syringe",
    routeId: "subcutaneous",
    releaseTypeId: "not-applicable",
    biologic: true,
    specialDevice: true,
    ingredients: [
      {
        ingredientId: "demo-ingredient-d",
        name: "Lumera-Bio",
        strengthValue: 40,
        strengthUnit: "mg/mL",
      },
    ],
    deviceOrPresentation: "single-dose prefilled syringe",
  },
  {
    ...common,
    id: "demo-product-d-biosimilar",
    productCode: "DEMO-D-BIOSIMILAR",
    genericName: "Lumera-Bio",
    brandName: "Lumera D Similar",
    manufacturerName: "Fictional Similar Biologics",
    dosageFormId: "prefilled-syringe",
    routeId: "subcutaneous",
    releaseTypeId: "not-applicable",
    biologic: true,
    biosimilar: true,
    specialDevice: true,
    ingredients: [
      {
        ingredientId: "demo-ingredient-d",
        name: "Lumera-Bio",
        strengthValue: 40,
        strengthUnit: "mg/mL",
      },
    ],
    deviceOrPresentation: "single-dose prefilled syringe",
  },
  {
    ...common,
    id: "demo-product-e",
    productCode: "DEMO-E-PACK",
    genericName: "Serenava",
    brandName: "Serenava E",
    manufacturerName: "Fictional Meridian Labs",
    ingredients: [
      {
        ingredientId: "demo-ingredient-e",
        name: "Serenava",
        strengthValue: 5,
        strengthUnit: "mg",
      },
    ],
  },
  {
    ...common,
    id: "demo-product-e-large",
    productCode: "DEMO-E-PACK-90",
    genericName: "Serenava",
    brandName: "Serenava E",
    manufacturerName: "Fictional Meridian Labs",
    packSize: 90,
    unitsPerPack: 90,
    ingredients: [
      {
        ingredientId: "demo-ingredient-e",
        name: "Serenava",
        strengthValue: 5,
        strengthUnit: "mg",
      },
    ],
  },
];

export const demoSources: PriceSource[] = healthIntelligenceMarkets.map(
  (market, index) => ({
    id: `demo-source-${market.countryCode.toLowerCase()}`,
    sourceCode: `DEMO-SOURCE-${market.countryCode}`,
    sourceName: `Fictional ${market.countryName} reference source`,
    sourceType: index % 2 === 0 ? "pharmacy" : "manually_verified",
    marketId: market.id,
    sourceUrl: "https://example.invalid/demo-source",
    trustLevel: "unknown",
    active: true,
    dataStatus: "demo",
    verificationStatus: "pending_review",
    sourceStatus: "approved",
    visibilityLevel: "public_type_only",
  }),
);

export const demoPriceObservations: PriceObservation[] = [
  ...healthIntelligenceMarkets.map((market, index) => ({
    id: `demo-price-${market.countryCode.toLowerCase()}-current`,
    productId: index === 1 ? "demo-product-a-th" : "demo-product-a-my",
    marketId: market.id,
    sourceId: `demo-source-${market.countryCode.toLowerCase()}`,
    observedLocalPrice: [84, 690, 46, 410000, 72, 128, 350][index],
    currency: market.currency,
    packQuantity: 30,
    comparisonBasis:
      index % 3 === 0
        ? ("retail_cash_price" as const)
        : ("pharmacy_list_price" as const),
    normalizationUnit: "tablet" as const,
    normalizedQuantity: 30,
    observedAt: "2026-08-18T08:00:00.000Z",
    priceVerificationStatus:
      index < 2 ? ("verified" as const) : ("reported" as const),
    recordState:
      index < 2 ? ("verified" as const) : ("pending_review" as const),
    publicationStatus: "not_eligible" as const,
    reviewer: index < 2 ? "demo-reviewer@mms.invalid" : undefined,
    verifiedAt: index < 2 ? "2026-08-20T10:00:00.000Z" : undefined,
    reviewDueAt:
      index === 4 ? "2026-08-01T00:00:00.000Z" : "2026-11-20T00:00:00.000Z",
    dataStatus: "demo" as const,
  })),
  {
    id: "demo-price-my-history",
    productId: "demo-product-a-my",
    marketId: "market-my",
    sourceId: "demo-source-my",
    observedLocalPrice: 79,
    currency: "MYR",
    packQuantity: 30,
    comparisonBasis: "retail_cash_price",
    normalizationUnit: "tablet",
    normalizedQuantity: 30,
    observedAt: "2026-05-18T08:00:00.000Z",
    priceVerificationStatus: "expired",
    recordState: "expired",
    publicationStatus: "unpublished",
    reviewer: "demo-reviewer@mms.invalid",
    verifiedAt: "2026-05-19T08:00:00.000Z",
    validUntil: "2026-08-01T00:00:00.000Z",
    dataStatus: "demo",
  },
];

export const demoGenericRelationships: GenericRelationship[] = [
  {
    id: "demo-generic-a-b",
    sourceProductId: "demo-product-a-my",
    candidateProductId: "demo-product-b",
    relationshipType: "potential_generic_match",
    matchConfidence: "close_verified",
    verificationStatus: "pending_review",
    reviewNotes:
      "Same fictional ingredient and strength; different manufacturer and pack. Not a substitution recommendation.",
    dataStatus: "demo",
  },
  {
    id: "demo-generic-c",
    sourceProductId: "demo-product-c",
    candidateProductId: "demo-product-c-candidate",
    relationshipType: "possible_equivalent_review_required",
    matchConfidence: "review_required",
    verificationStatus: "pending_review",
    reviewNotes: "Modified-release exception requires professional review.",
    dataStatus: "demo",
  },
  {
    id: "demo-generic-d",
    sourceProductId: "demo-product-d",
    candidateProductId: "demo-product-d-biosimilar",
    relationshipType: "not_suitable_for_automatic_comparison",
    matchConfidence: "review_required",
    verificationStatus: "pending_review",
    reviewNotes:
      "Biologic/biosimilar relationship cannot be treated as simple substitution.",
    dataStatus: "demo",
  },
];

export const demoMatches: Array<{
  id: string;
  leftId: string;
  rightId: string;
  result: MatchResult;
}> = [
  ["demo-match-exact", "demo-product-a-my", "demo-product-a-th"],
  ["demo-match-close", "demo-product-a-my", "demo-product-b"],
  ["demo-match-modified-release", "demo-product-c", "demo-product-c-candidate"],
  ["demo-match-biologic", "demo-product-d", "demo-product-d-biosimilar"],
  ["demo-match-pack", "demo-product-e", "demo-product-e-large"],
].map(([id, leftId, rightId]) => ({
  id,
  leftId,
  rightId,
  result: matchMedicineProducts(
    demoProducts.find((item) => item.id === leftId)!,
    demoProducts.find((item) => item.id === rightId)!,
  ),
}));

export const demoVerificationEvents: VerificationEvent[] = [
  {
    id: "demo-verification-1",
    targetType: "price_observation",
    targetId: "demo-price-my-current",
    reviewer: "demo-reviewer@mms.invalid",
    decision: "verify",
    reasonNotes: "Synthetic workflow example only.",
    previousState: "pending_review",
    newState: "verified",
    occurredAt: "2026-08-20T10:00:00.000Z",
    dataStatus: "demo",
  },
];

export const demoAuditEvents: AuditEvent[] = [
  {
    id: "demo-audit-1",
    actor: "demo-reviewer@mms.invalid",
    action: "verify",
    targetType: "price_observation",
    targetId: "demo-price-my-current",
    occurredAt: "2026-08-20T10:00:00.000Z",
    metadata: {
      previousState: "pending_review",
      newState: "verified",
      demo: true,
    },
    dataStatus: "demo",
  },
];

export type HealthIntelligenceSnapshot = {
  markets: typeof healthIntelligenceMarkets;
  products: MedicineProductIdentity[];
  sources: PriceSource[];
  prices: PriceObservation[];
  relationships: GenericRelationship[];
  matches: typeof demoMatches;
  verificationEvents: VerificationEvent[];
  auditEvents: AuditEvent[];
};

export function createDemoHealthIntelligenceSnapshot(): HealthIntelligenceSnapshot {
  return JSON.parse(
    JSON.stringify({
      markets: healthIntelligenceMarkets,
      products: demoProducts,
      sources: demoSources,
      prices: demoPriceObservations,
      relationships: demoGenericRelationships,
      matches: demoMatches,
      verificationEvents: demoVerificationEvents,
      auditEvents: demoAuditEvents,
    }),
  ) as HealthIntelligenceSnapshot;
}
