import "server-only";
import { matchMedicineProducts } from "@/lib/healthIntelligence/matching";
import { realHealthIntelligenceDataEnabled } from "@/lib/healthIntelligence/ingestion";
import { healthIntelligenceSnapshot } from "@/lib/healthIntelligence/store";
import { pricePublicationEligibility } from "@/lib/healthIntelligence/verification";
import type {
  GenericRelationship,
  MedicineProductIdentity,
  PriceObservation,
  PriceSource,
} from "@/lib/healthIntelligence/types";

export type PublicProduct = Pick<
  MedicineProductIdentity,
  | "id"
  | "genericName"
  | "brandName"
  | "manufacturerName"
  | "packSize"
  | "unitsPerPack"
  | "deviceOrPresentation"
  | "ingredients"
  | "combinationProduct"
  | "biologic"
  | "biosimilar"
  | "narrowTherapeuticIndex"
  | "complexInjectable"
  | "specialDevice"
  | "oncologyMedicine"
  | "specialFormulation"
  | "dataStatus"
> & {
  dosageForm: string;
  route: string;
  releaseType: string;
  identityStatus: "verified" | "demo_preview";
};

export type PublicPrice = Pick<
  PriceObservation,
  | "id"
  | "productId"
  | "marketId"
  | "observedLocalPrice"
  | "currency"
  | "packQuantity"
  | "comparisonBasis"
  | "normalizationUnit"
  | "normalizedQuantity"
  | "observedAt"
  | "verifiedAt"
  | "dataStatus"
> & {
  sourceType?: PriceSource["sourceType"];
  sourceName?: string;
  publication: "verified_public" | "demo_preview";
  comparisonStatus: "verified_exact" | "demo_preview";
};

export type PublicGenericCandidate = {
  relationshipId: string;
  sourceProductId: string;
  candidate: PublicProduct;
  relationship: GenericRelationship["relationshipType"];
  patientLabel:
    | "potential_direct_generic"
    | "professional_review_required"
    | "not_suitable_for_automatic_comparison";
  dataStatus: "live" | "demo";
};

export type PublicReadModel = {
  markets: Array<{
    id: string;
    countryCode: string;
    countryName: string;
    currency: string;
  }>;
  products: PublicProduct[];
  prices: PublicPrice[];
  genericCandidates: PublicGenericCandidate[];
};

const label = (value: string) => value.replaceAll("-", " ");

function publicProduct(
  product: MedicineProductIdentity,
  realDataEnabled: boolean,
): PublicProduct | null {
  if (product.dataStatus !== "demo" && !realDataEnabled) return null;
  if (
    product.verificationStatus !== "verified" &&
    product.dataStatus !== "demo"
  )
    return null;
  return {
    id: product.id,
    genericName: product.genericName,
    brandName: product.brandName,
    manufacturerName: product.manufacturerName,
    dosageForm: label(product.dosageFormId),
    route: label(product.routeId),
    releaseType: label(product.releaseTypeId),
    packSize: product.packSize,
    unitsPerPack: product.unitsPerPack,
    deviceOrPresentation: product.deviceOrPresentation,
    ingredients: product.ingredients,
    combinationProduct: product.combinationProduct,
    biologic: product.biologic,
    biosimilar: product.biosimilar,
    narrowTherapeuticIndex: product.narrowTherapeuticIndex,
    complexInjectable: product.complexInjectable,
    specialDevice: product.specialDevice,
    oncologyMedicine: product.oncologyMedicine,
    specialFormulation: product.specialFormulation,
    dataStatus: product.dataStatus,
    identityStatus: product.dataStatus === "demo" ? "demo_preview" : "verified",
  };
}

export async function publicHealthIntelligenceReadModel(): Promise<PublicReadModel> {
  const snapshot = await healthIntelligenceSnapshot();
  const realDataEnabled = realHealthIntelligenceDataEnabled();
  const products = snapshot.products
    .map((product) => publicProduct(product, realDataEnabled))
    .filter((item): item is PublicProduct => Boolean(item));
  const productById = new Map(products.map((product) => [product.id, product]));
  const sourceById = new Map(
    snapshot.sources.map((source) => [source.id, source]),
  );
  const prices = snapshot.prices.flatMap((observation) => {
    if (observation.dataStatus !== "demo" && !realDataEnabled) return [];
    const product = productById.get(observation.productId);
    const source = observation.sourceId
      ? sourceById.get(observation.sourceId)
      : undefined;
    if (!product) return [];
    const eligibility = pricePublicationEligibility({
      observation,
      source,
      productIdentityVerified: product.identityStatus === "verified",
    });
    const demoPreview = observation.dataStatus === "demo";
    if (!eligibility.eligible && !demoPreview) return [];
    return [
      {
        id: observation.id,
        productId: observation.productId,
        marketId: observation.marketId,
        observedLocalPrice: observation.observedLocalPrice,
        currency: observation.currency,
        packQuantity: observation.packQuantity,
        comparisonBasis: observation.comparisonBasis,
        normalizationUnit: observation.normalizationUnit,
        normalizedQuantity: observation.normalizedQuantity,
        observedAt: observation.observedAt,
        verifiedAt: observation.verifiedAt,
        dataStatus: observation.dataStatus,
      sourceType:
        demoPreview || source?.visibilityLevel !== "internal_only"
          ? source?.sourceType
          : undefined,
      sourceName:
        demoPreview ||
        source?.visibilityLevel === "public_full" ||
        source?.visibilityLevel === "public_name_only"
          ? source?.sourceName
          : undefined,
        publication: demoPreview
          ? ("demo_preview" as const)
          : ("verified_public" as const),
        comparisonStatus: demoPreview
          ? ("demo_preview" as const)
          : ("verified_exact" as const),
      },
    ];
  });

  const genericCandidates = snapshot.relationships.flatMap((relationship) => {
    const candidate = productById.get(relationship.candidateProductId);
    if (!candidate) return [];
    const source = productById.get(relationship.sourceProductId);
    if (!source) return [];
    return [
      {
        relationshipId: relationship.id,
        sourceProductId: relationship.sourceProductId,
        candidate,
        relationship: relationship.relationshipType,
        patientLabel:
          relationship.relationshipType === "potential_generic_match"
            ? ("potential_direct_generic" as const)
            : relationship.relationshipType ===
                "not_suitable_for_automatic_comparison"
              ? ("not_suitable_for_automatic_comparison" as const)
              : ("professional_review_required" as const),
        dataStatus: relationship.dataStatus,
      },
    ];
  });

  return {
    markets: snapshot.markets.map((market) => ({ ...market })),
    products,
    prices,
    genericCandidates,
  };
}

export function publicSearchProducts(
  products: PublicProduct[],
  query: string,
): PublicProduct[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return products;
  return products.filter((product) => {
    const haystack = [
      product.brandName,
      product.genericName,
      product.manufacturerName,
      product.dosageForm,
      product.releaseType,
      ...product.ingredients.map(
        (item) => `${item.name} ${item.strengthValue}${item.strengthUnit}`,
      ),
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export function publicMatch(left: PublicProduct, right: PublicProduct) {
  return matchMedicineProducts(
    left as unknown as MedicineProductIdentity,
    right as unknown as MedicineProductIdentity,
  );
}
