import {
  calculateNSWLandTax,
  estimateLandValueFromPropertyValue,
} from '@/utils/financial/taxImpact';

export interface LandTaxCalculationOptions {
  landValue?: number | null;
  purchasePrice?: number;
  isForeignOwner: boolean;
  propertyType?: 'house' | 'unit' | 'townhouse' | 'land';
}

export interface LandTaxCalculationResult {
  landTaxPerYear: number;
  landValue: number;
  isEstimated: boolean;
}

export function calculateLandTaxFromPurchasePrice(
  options: LandTaxCalculationOptions
): LandTaxCalculationResult {
  const { landValue: providedLandValue, purchasePrice, isForeignOwner, propertyType = 'house' } = options;

  let landValue: number;
  let isEstimated: boolean;

  if (providedLandValue && providedLandValue > 0) {
    landValue = providedLandValue;
    isEstimated = false;
  } else if (purchasePrice && purchasePrice > 0) {
    landValue = estimateLandValueFromPropertyValue(purchasePrice, propertyType);
    isEstimated = true;
  } else {
    return {
      landTaxPerYear: 0,
      landValue: 0,
      isEstimated: false,
    };
  }

  const { totalTax } = calculateNSWLandTax(landValue, isForeignOwner, false);

  return {
    landTaxPerYear: totalTax,
    landValue,
    isEstimated,
  };
}
