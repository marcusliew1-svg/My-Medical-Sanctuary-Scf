import { normalizedPrice } from "@/lib/healthIntelligence/matching";
import type { PublicPrice } from "@/lib/healthIntelligence/publicReadModel";

export type ComparisonResult = {
  compatible: boolean;
  normalizedLocalPrice: number | null;
  observedDifferencePercent: number | null;
  message: string;
};

const compatibleBases = new Set([
  "retail_cash_price",
  "pharmacy_list_price",
  "manufacturer_list_price",
]);

export function comparePublishedPrices(
  base: PublicPrice,
  candidate: PublicPrice,
): ComparisonResult {
  if (
    base.publication !== "verified_public" ||
    candidate.publication !== "verified_public"
  ) {
    return {
      compatible: false,
      normalizedLocalPrice: null,
      observedDifferencePercent: null,
      message: "Demonstration data is not current market pricing.",
    };
  }
  if (
    !base.comparisonBasis ||
    !candidate.comparisonBasis ||
    !compatibleBases.has(base.comparisonBasis) ||
    !compatibleBases.has(candidate.comparisonBasis) ||
    base.comparisonBasis !== candidate.comparisonBasis
  ) {
    return {
      compatible: false,
      normalizedLocalPrice: null,
      observedDifferencePercent: null,
      message:
        "These observations use different price bases and are not directly comparable.",
    };
  }
  const baseUnit = normalizedPrice(
    base.observedLocalPrice,
    base.normalizedQuantity || base.packQuantity,
  );
  const candidateUnit = normalizedPrice(
    candidate.observedLocalPrice,
    candidate.normalizedQuantity || candidate.packQuantity,
  );
  if (baseUnit === null || candidateUnit === null || baseUnit === 0) {
    return {
      compatible: false,
      normalizedLocalPrice: candidateUnit,
      observedDifferencePercent: null,
      message: "A unit comparison is not available for these observations.",
    };
  }
  return {
    compatible: true,
    normalizedLocalPrice: candidateUnit,
    observedDifferencePercent: Number(
      (((candidateUnit - baseUnit) / baseUnit) * 100).toFixed(1),
    ),
    message:
      "Observed price difference based on compatible published observations.",
  };
}
