/**
 * Property depreciation calculations for tax deductions.
 * Ported from landiq_labs taxCalculations.ts.
 */

import type { PropertyType } from '@/types/investment';

const BUILDING_DEPRECIATION_RATE = 0.025; // 2.5% p.a. for buildings constructed after Sept 1987
const DIMINISHING_VALUE_MULTIPLIER = 2; // ATO diminishing value method multiplier
const AVERAGE_PLANT_EFFECTIVE_LIFE = 8; // Average effective life for plant & equipment (years)

interface DepreciationInputs {
  purchasePrice: number;
  propertyType: PropertyType;
  buildingAge?: number;
  plantEquipmentValue?: number;
}

/**
 * Calculate annual depreciation deduction.
 *
 * Building: 2.5% of estimated construction cost
 *   - Houses: 50% of purchase price assumed as construction cost
 *   - Units/townhouses: 70% of purchase price (higher build ratio)
 *   - Land: no building depreciation
 *   - Only eligible if building is less than 40 years old (post-1987)
 *
 * Plant & equipment: diminishing value method
 *   - Rate = 2 / average effective life (8 years) = 25% p.a.
 */
export function calculateAnnualDepreciation({
  purchasePrice,
  propertyType,
  buildingAge,
  plantEquipmentValue,
}: DepreciationInputs): number {
  let annualDepreciation = 0;

  if (propertyType !== 'land') {
    const buildingCostRatio = propertyType === 'house' ? 0.5 : 0.7;
    const estimatedBuildingCost = purchasePrice * buildingCostRatio;
    const effectiveAge = buildingAge ?? 10;

    if (effectiveAge < 40) {
      annualDepreciation += estimatedBuildingCost * BUILDING_DEPRECIATION_RATE;
    }
  }

  if (plantEquipmentValue && plantEquipmentValue > 0) {
    const diminishingValueRate = DIMINISHING_VALUE_MULTIPLIER / AVERAGE_PLANT_EFFECTIVE_LIFE;
    annualDepreciation += plantEquipmentValue * diminishingValueRate;
  }

  return Math.round(annualDepreciation);
}
