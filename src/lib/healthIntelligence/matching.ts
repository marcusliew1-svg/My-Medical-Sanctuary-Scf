import {
  HEALTH_INTELLIGENCE_RULE_VERSION,
  type IngredientComponent,
  type MatchDimension,
  type MatchResult,
  type MedicineProductIdentity,
} from "@/lib/healthIntelligence/types";

const DIMENSION_WEIGHTS = {
  ingredients: 25,
  strength: 20,
  form: 10,
  route: 10,
  release: 10,
  manufacturer: 7,
  brand: 7,
  pack: 6,
  device: 5,
} as const;

function normalized(value: string | undefined): string {
  return (value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizedIngredients(ingredients: IngredientComponent[]): string[] {
  return ingredients
    .map((ingredient) =>
      [
        normalized(ingredient.ingredientId),
        ingredient.strengthValue.toFixed(6),
        normalized(ingredient.strengthUnit),
        normalized(ingredient.saltOrEster),
        ingredient.clinicallyMeaningfulVariant ? "material" : "standard",
      ].join("|"),
    )
    .sort();
}

function sameStringArray(left: string[], right: string[]): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function ingredientNames(product: MedicineProductIdentity): string[] {
  return product.ingredients
    .map((ingredient) => normalized(ingredient.ingredientId))
    .sort();
}

function hardExceptions(
  left: MedicineProductIdentity,
  right: MedicineProductIdentity,
): string[] {
  const codes = new Set<string>();
  if (left.biologic || right.biologic) codes.add("BIOLOGIC_REVIEW_REQUIRED");
  if (left.biosimilar || right.biosimilar)
    codes.add("BIOSIMILAR_REVIEW_REQUIRED");
  if (left.narrowTherapeuticIndex || right.narrowTherapeuticIndex)
    codes.add("NARROW_THERAPEUTIC_INDEX");
  if (left.combinationProduct || right.combinationProduct)
    codes.add("COMBINATION_PRODUCT");
  if (left.complexInjectable || right.complexInjectable)
    codes.add("COMPLEX_INJECTABLE");
  if (left.specialDevice || right.specialDevice)
    codes.add("SPECIAL_DELIVERY_DEVICE");
  if (left.oncologyMedicine || right.oncologyMedicine)
    codes.add("ONCOLOGY_MEDICINE");
  if (left.specialFormulation || right.specialFormulation)
    codes.add("SPECIAL_FORMULATION");
  if (left.releaseTypeId !== "immediate" || right.releaseTypeId !== "immediate")
    codes.add("MODIFIED_RELEASE_REVIEW_REQUIRED");
  if (
    left.ingredients.some((item) => item.clinicallyMeaningfulVariant) ||
    right.ingredients.some((item) => item.clinicallyMeaningfulVariant)
  ) {
    codes.add("CLINICALLY_MEANINGFUL_SALT_OR_ESTER");
  }
  return [...codes];
}

export function matchMedicineProducts(
  left: MedicineProductIdentity,
  right: MedicineProductIdentity,
): MatchResult {
  const ingredientMatch = sameStringArray(
    ingredientNames(left),
    ingredientNames(right),
  );
  const strengthMatch = sameStringArray(
    normalizedIngredients(left.ingredients),
    normalizedIngredients(right.ingredients),
  );
  const dimensions: MatchDimension[] = [
    {
      dimension: "ingredients",
      matches: ingredientMatch,
      weight: DIMENSION_WEIGHTS.ingredients,
    },
    {
      dimension: "strength",
      matches: strengthMatch,
      weight: DIMENSION_WEIGHTS.strength,
    },
    {
      dimension: "form",
      matches: left.dosageFormId === right.dosageFormId,
      weight: DIMENSION_WEIGHTS.form,
    },
    {
      dimension: "route",
      matches: left.routeId === right.routeId,
      weight: DIMENSION_WEIGHTS.route,
    },
    {
      dimension: "release",
      matches: left.releaseTypeId === right.releaseTypeId,
      weight: DIMENSION_WEIGHTS.release,
    },
    {
      dimension: "manufacturer",
      matches:
        normalized(left.manufacturerName) ===
        normalized(right.manufacturerName),
      weight: DIMENSION_WEIGHTS.manufacturer,
    },
    {
      dimension: "brand",
      matches: normalized(left.brandName) === normalized(right.brandName),
      weight: DIMENSION_WEIGHTS.brand,
    },
    {
      dimension: "pack",
      matches:
        left.packSize === right.packSize &&
        left.unitsPerPack === right.unitsPerPack,
      weight: DIMENSION_WEIGHTS.pack,
    },
    {
      dimension: "device",
      matches:
        normalized(left.deviceOrPresentation) ===
        normalized(right.deviceOrPresentation),
      weight: DIMENSION_WEIGHTS.device,
    },
  ];
  const score = dimensions.reduce(
    (total, dimension) => total + (dimension.matches ? dimension.weight : 0),
    0,
  );
  const exceptions = hardExceptions(left, right);

  if (exceptions.length > 0) {
    return {
      classification: "review_required_due_to_exception",
      confidence: "review_required",
      score,
      ruleVersion: HEALTH_INTELLIGENCE_RULE_VERSION,
      dimensions,
      hardExceptionCodes: exceptions,
      explanation:
        "A hard clinical/product exception requires human review. The numerical score cannot override it.",
    };
  }

  const coreEquivalent =
    ingredientMatch &&
    strengthMatch &&
    dimensions.find((d) => d.dimension === "form")?.matches &&
    dimensions.find((d) => d.dimension === "route")?.matches &&
    dimensions.find((d) => d.dimension === "release")?.matches;
  if (!coreEquivalent) {
    return {
      classification: "not_comparable",
      confidence: "not_comparable",
      score,
      ruleVersion: HEALTH_INTELLIGENCE_RULE_VERSION,
      dimensions,
      hardExceptionCodes: [],
      explanation:
        "One or more clinically material identity dimensions differ.",
    };
  }

  const exact = dimensions.every((dimension) => dimension.matches);
  if (exact) {
    return {
      classification: "exact_match",
      confidence: "exact_verified",
      score,
      ruleVersion: HEALTH_INTELLIGENCE_RULE_VERSION,
      dimensions,
      hardExceptionCodes: [],
      explanation:
        "All product identity and pack dimensions match deterministically.",
    };
  }

  return {
    classification: "close_equivalent",
    confidence: "close_verified",
    score,
    ruleVersion: HEALTH_INTELLIGENCE_RULE_VERSION,
    dimensions,
    hardExceptionCodes: [],
    explanation:
      "Core ingredient, strength, form, route and release profile match, but brand, manufacturer, pack or presentation differs. This is not a substitution recommendation.",
  };
}

export function normalizedPrice(
  price: number,
  quantity: number,
): number | null {
  if (
    !Number.isFinite(price) ||
    !Number.isFinite(quantity) ||
    price < 0 ||
    quantity <= 0
  )
    return null;
  return Number((price / quantity).toFixed(6));
}
