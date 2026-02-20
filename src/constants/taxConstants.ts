/**
 * Australian Federal Tax rates and thresholds
 * Tax Year 2025-26
 */

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  baseTax: number;
}

export const TAX_BRACKETS_RESIDENT_2025: readonly TaxBracket[] = [
  { min: 0, max: 18200, rate: 0, baseTax: 0 },
  { min: 18201, max: 45000, rate: 0.16, baseTax: 0 },
  { min: 45001, max: 135000, rate: 0.3, baseTax: 4288 },
  { min: 135001, max: 190000, rate: 0.37, baseTax: 31288 },
  { min: 190001, max: Infinity, rate: 0.45, baseTax: 51638 },
] as const;

export const TAX_BRACKETS_FOREIGN_2025: readonly TaxBracket[] = [
  { min: 0, max: 135000, rate: 0.3, baseTax: 0 },
  { min: 135001, max: 190000, rate: 0.37, baseTax: 40500 },
  { min: 190001, max: Infinity, rate: 0.45, baseTax: 60850 },
] as const;

export const TAX_BRACKETS_WORKING_HOLIDAY_2025: readonly TaxBracket[] = [
  { min: 0, max: 45000, rate: 0.15, baseTax: 0 },
  { min: 45001, max: 135000, rate: 0.3, baseTax: 6750 },
  { min: 135001, max: 190000, rate: 0.37, baseTax: 33750 },
  { min: 190001, max: Infinity, rate: 0.45, baseTax: 54100 },
] as const;

export const MEDICARE_LEVY = {
  standardRate: 0.02,
  lowIncomeThreshold: 26000,
  fullPaymentThreshold: 32500,
} as const;

export interface MedicareLevySurchargeTier {
  min: number;
  max: number;
  rate: number;
}

export const MEDICARE_LEVY_SURCHARGE: readonly MedicareLevySurchargeTier[] = [
  { min: 93000, max: 108000, rate: 0.01 },
  { min: 108001, max: 144000, rate: 0.0125 },
  { min: 144001, max: Infinity, rate: 0.015 },
] as const;

export interface HELPRepaymentThreshold {
  min: number;
  max: number;
  rate: number;
}

export const HELP_REPAYMENT_THRESHOLDS: readonly HELPRepaymentThreshold[] = [
  { min: 0, max: 54435, rate: 0 },
  { min: 54436, max: 62850, rate: 0.01 },
  { min: 62851, max: 66620, rate: 0.02 },
  { min: 66621, max: 70618, rate: 0.025 },
  { min: 70619, max: 74855, rate: 0.03 },
  { min: 74856, max: 79346, rate: 0.035 },
  { min: 79347, max: 84107, rate: 0.04 },
  { min: 84108, max: 89154, rate: 0.045 },
  { min: 89155, max: 94503, rate: 0.05 },
  { min: 94504, max: 100174, rate: 0.055 },
  { min: 100175, max: 106185, rate: 0.06 },
  { min: 106186, max: 112556, rate: 0.065 },
  { min: 112557, max: 119309, rate: 0.07 },
  { min: 119310, max: 126467, rate: 0.075 },
  { min: 126468, max: 134056, rate: 0.08 },
  { min: 134057, max: 142100, rate: 0.085 },
  { min: 142101, max: 150626, rate: 0.09 },
  { min: 150627, max: 159663, rate: 0.095 },
  { min: 159664, max: Infinity, rate: 0.1 },
] as const;

export const DEPRECIATION_RATES = {
  building: {
    postSeptember1987: 0.025,
    preSeptember1987: 0,
  },
  plantEquipment: {
    effectiveLife: {
      airConditioner: 10,
      carpets: 8,
      blindsCurtains: 5,
      hotWaterSystem: 12,
      stove: 12,
      dishwasher: 10,
      rangehood: 10,
      smokeAlarms: 6,
      clothesLine: 5,
      garageDoor: 12,
    } as Record<string, number>,
    diminishingValueMultiplier: 2,
    primeCostDivisor: 1,
  },
} as const;

export const LOW_VALUE_POOL = {
  threshold: 1000,
  firstYearRate: 0.375,
  subsequentRate: 0.1875,
} as const;

export type ResidencyStatus = 'resident' | 'foreignResident' | 'workingHoliday';

export function getTaxBrackets(
  residencyStatus: ResidencyStatus
): readonly TaxBracket[] {
  switch (residencyStatus) {
    case 'resident':
      return TAX_BRACKETS_RESIDENT_2025;
    case 'foreignResident':
      return TAX_BRACKETS_FOREIGN_2025;
    case 'workingHoliday':
      return TAX_BRACKETS_WORKING_HOLIDAY_2025;
  }
}

export function getMarginalRate(
  taxableIncome: number,
  residencyStatus: ResidencyStatus
): number {
  const brackets = getTaxBrackets(residencyStatus);

  for (const bracket of brackets) {
    if (taxableIncome <= bracket.max) {
      return bracket.rate;
    }
  }

  const lastBracket = brackets[brackets.length - 1];
  return lastBracket?.rate ?? 0.45;
}

export function getHELPRepaymentRate(repaymentIncome: number): number {
  for (const threshold of HELP_REPAYMENT_THRESHOLDS) {
    if (repaymentIncome <= threshold.max) {
      return threshold.rate;
    }
  }
  const lastThreshold = HELP_REPAYMENT_THRESHOLDS[HELP_REPAYMENT_THRESHOLDS.length - 1];
  return lastThreshold?.rate ?? 0.1;
}

export function getMedicareLevySurchargeRate(
  taxableIncome: number,
  hasPrivateHealth: boolean
): number {
  if (hasPrivateHealth) {
    return 0;
  }

  for (const tier of MEDICARE_LEVY_SURCHARGE) {
    if (taxableIncome >= tier.min && taxableIncome <= tier.max) {
      return tier.rate;
    }
  }

  return 0;
}
