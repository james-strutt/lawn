/**
 * NSW Land Tax thresholds and rates
 * Updated for 2025-26 financial year
 *
 * Reference: https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/land-tax
 */

export interface LandTaxThreshold {
  min: number;
  max: number;
  rate: number;
  baseTax: number;
}

export const NSW_LAND_TAX_THRESHOLDS_2025: LandTaxThreshold[] = [
  { min: 0, max: 1075000, rate: 0, baseTax: 0 },
  { min: 1075001, max: 6571000, rate: 0.016, baseTax: 100 },
  { min: 6571001, max: Infinity, rate: 0.02, baseTax: 88036 },
];

export const NSW_LAND_TAX_PREMIUM_THRESHOLDS_2025: LandTaxThreshold[] = [
  { min: 0, max: 6571000, rate: 0.016, baseTax: 100 },
  { min: 6571001, max: Infinity, rate: 0.02, baseTax: 88036 },
];

export const NSW_LAND_TAX_FOREIGN_SURCHARGE_RATE = 0.04;

export const NSW_LAND_TAX_CONFIG = {
  generalThreshold: 1075000,
  premiumThreshold: 6571000,
  generalRate: 0.016,
  premiumRate: 0.02,
  foreignSurchargeRate: 0.04,
  baseAmount: 100,
  premiumBaseAmount: 88036,
} as const;

export interface LandTaxExemption {
  type: string;
  description: string;
  applicable: boolean;
}

export const NSW_LAND_TAX_EXEMPTIONS: LandTaxExemption[] = [
  {
    type: 'principalResidence',
    description: 'Land used and occupied as principal place of residence',
    applicable: true,
  },
  {
    type: 'primaryProduction',
    description: 'Land used for primary production (farming)',
    applicable: true,
  },
  {
    type: 'boardingHouse',
    description: 'Registered boarding houses meeting criteria',
    applicable: true,
  },
  {
    type: 'buildToRent',
    description: 'Eligible build-to-rent developments (50% reduction)',
    applicable: true,
  },
  {
    type: 'retirement',
    description: 'Retirement villages and aged care',
    applicable: true,
  },
];

export function calculateNSWLandTax(
  totalLandValue: number,
  isForeignOwner: boolean = false,
  isPrincipalResidence: boolean = false
): {
  baseTax: number;
  foreignSurcharge: number;
  totalTax: number;
  effectiveRate: number;
} {
  if (isPrincipalResidence) {
    return {
      baseTax: 0,
      foreignSurcharge: 0,
      totalTax: 0,
      effectiveRate: 0,
    };
  }

  let baseTax = 0;
  const { generalThreshold, premiumThreshold, generalRate, premiumRate, baseAmount, premiumBaseAmount } =
    NSW_LAND_TAX_CONFIG;

  if (totalLandValue <= generalThreshold) {
    baseTax = 0;
  } else if (totalLandValue <= premiumThreshold) {
    baseTax = baseAmount + (totalLandValue - generalThreshold) * generalRate;
  } else {
    baseTax = premiumBaseAmount + (totalLandValue - premiumThreshold) * premiumRate;
  }

  const foreignSurcharge = isForeignOwner
    ? totalLandValue * NSW_LAND_TAX_FOREIGN_SURCHARGE_RATE
    : 0;

  const totalTax = baseTax + foreignSurcharge;
  const effectiveRate = totalLandValue > 0 ? totalTax / totalLandValue : 0;

  return {
    baseTax: Math.round(baseTax),
    foreignSurcharge: Math.round(foreignSurcharge),
    totalTax: Math.round(totalTax),
    effectiveRate,
  };
}

export function estimateLandValueFromPropertyValue(
  propertyValue: number,
  propertyType: 'house' | 'unit' | 'townhouse' | 'land' = 'house'
): number {
  const landRatios: Record<string, number> = {
    house: 0.55,
    townhouse: 0.35,
    unit: 0.15,
    land: 1.0,
  };

  return Math.round(propertyValue * (landRatios[propertyType] ?? 0.5));
}
