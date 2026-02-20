/**
 * Self-contained Australian income tax calculations (2025-26 rates).
 * Replaces the broken taxCalculations.ts that imported from non-existent buytorent app.
 */

interface TaxBracket {
  min: number;
  max: number;
  baseTax: number;
  rate: number;
}

// 2025-26 Australian resident tax brackets (Stage 3 tax cuts applied)
const RESIDENT_BRACKETS: TaxBracket[] = [
  { min: 0, max: 18200, baseTax: 0, rate: 0 },
  { min: 18200, max: 45000, baseTax: 0, rate: 0.16 },
  { min: 45000, max: 135000, baseTax: 4288, rate: 0.30 },
  { min: 135000, max: 190000, baseTax: 31288, rate: 0.37 },
  { min: 190000, max: Infinity, baseTax: 51638, rate: 0.45 },
];

const MEDICARE_LEVY_RATE = 0.02;
const MEDICARE_LEVY_LOW_INCOME_THRESHOLD = 26000;
const MEDICARE_LEVY_FULL_THRESHOLD = 32500;

// HELP/HECS repayment thresholds 2025-26
const HELP_THRESHOLDS: { min: number; max: number; rate: number }[] = [
  { min: 0, max: 54435, rate: 0 },
  { min: 54435, max: 62850, rate: 0.01 },
  { min: 62850, max: 66620, rate: 0.02 },
  { min: 66620, max: 70618, rate: 0.025 },
  { min: 70618, max: 74855, rate: 0.03 },
  { min: 74855, max: 79346, rate: 0.035 },
  { min: 79346, max: 84107, rate: 0.04 },
  { min: 84107, max: 89154, rate: 0.045 },
  { min: 89154, max: 94503, rate: 0.05 },
  { min: 94503, max: 100174, rate: 0.055 },
  { min: 100174, max: 106185, rate: 0.06 },
  { min: 106185, max: 112556, rate: 0.065 },
  { min: 112556, max: 119309, rate: 0.07 },
  { min: 119309, max: 126467, rate: 0.075 },
  { min: 126467, max: 134056, rate: 0.08 },
  { min: 134056, max: 142100, rate: 0.085 },
  { min: 142100, max: 150626, rate: 0.09 },
  { min: 150626, max: 159663, rate: 0.095 },
  { min: 159663, max: Infinity, rate: 0.10 },
];

export interface IncomeTaxOptions {
  includeMediacareLevy?: boolean;
  hasHelpDebt?: boolean;
  hasPrivateHealth?: boolean;
}

export interface IncomeTaxResult {
  baseTax: number;
  medicareLevy: number;
  helpRepayment: number;
  totalTax: number;
}

/**
 * Calculate Australian resident income tax for a given taxable income.
 */
export function calculateIncomeTax(
  taxableIncome: number,
  options: IncomeTaxOptions = {}
): IncomeTaxResult {
  const {
    includeMediacareLevy = true,
    hasHelpDebt = false,
  } = options;

  if (taxableIncome <= 0) {
    return { baseTax: 0, medicareLevy: 0, helpRepayment: 0, totalTax: 0 };
  }

  // Base income tax from brackets
  let baseTax = 0;
  for (const bracket of RESIDENT_BRACKETS) {
    if (taxableIncome <= bracket.max) {
      baseTax = bracket.baseTax + (taxableIncome - bracket.min) * bracket.rate;
      break;
    }
  }

  // Medicare levy
  let medicareLevy = 0;
  if (includeMediacareLevy) {
    if (taxableIncome > MEDICARE_LEVY_FULL_THRESHOLD) {
      medicareLevy = taxableIncome * MEDICARE_LEVY_RATE;
    } else if (taxableIncome > MEDICARE_LEVY_LOW_INCOME_THRESHOLD) {
      const phaseInRange = MEDICARE_LEVY_FULL_THRESHOLD - MEDICARE_LEVY_LOW_INCOME_THRESHOLD;
      const incomeAbove = taxableIncome - MEDICARE_LEVY_LOW_INCOME_THRESHOLD;
      medicareLevy = (incomeAbove / phaseInRange) * taxableIncome * MEDICARE_LEVY_RATE;
    }
  }

  // HELP/HECS repayment
  let helpRepayment = 0;
  if (hasHelpDebt) {
    for (const threshold of HELP_THRESHOLDS) {
      if (taxableIncome <= threshold.max) {
        helpRepayment = taxableIncome * threshold.rate;
        break;
      }
    }
  }

  const totalTax = Math.round(baseTax + medicareLevy + helpRepayment);

  return {
    baseTax: Math.round(baseTax),
    medicareLevy: Math.round(medicareLevy),
    helpRepayment: Math.round(helpRepayment),
    totalTax,
  };
}

/**
 * Get the marginal tax rate for a given taxable income (excluding Medicare).
 */
export function getMarginalRate(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  for (const bracket of RESIDENT_BRACKETS) {
    if (taxableIncome <= bracket.max) {
      return bracket.rate;
    }
  }
  return RESIDENT_BRACKETS[RESIDENT_BRACKETS.length - 1].rate;
}

/**
 * Calculate the tax saving from negative gearing.
 * When a property runs at a net loss, that loss reduces taxable income,
 * producing a tax saving at the investor's marginal rate.
 */
export function calculateNegativeGearingBenefit(
  annualIncome: number,
  propertyNetLoss: number,
  options: IncomeTaxOptions = {}
): number {
  if (propertyNetLoss >= 0) return 0;

  const taxWithoutProperty = calculateIncomeTax(annualIncome, options).totalTax;
  const taxWithProperty = calculateIncomeTax(
    Math.max(0, annualIncome + propertyNetLoss),
    options
  ).totalTax;

  return Math.max(0, taxWithoutProperty - taxWithProperty);
}

// --- NSW Land Tax (self-contained, replacing broken buytorent import) ---

const NSW_LAND_TAX_THRESHOLD = 1075000;
const NSW_LAND_TAX_PREMIUM_THRESHOLD = 6680000;
const NSW_LAND_TAX_GENERAL_RATE = 0.016;
const NSW_LAND_TAX_PREMIUM_RATE = 0.02;
const NSW_FOREIGN_SURCHARGE_RATE = 0.04;

interface LandTaxResult {
  generalTax: number;
  foreignSurcharge: number;
  totalTax: number;
}

/**
 * Calculate NSW land tax for a given land value.
 */
export function calculateNSWLandTax(
  landValue: number,
  isForeignOwner: boolean = false,
  _isPrimaryResidence: boolean = false
): LandTaxResult {
  if (landValue <= NSW_LAND_TAX_THRESHOLD) {
    const foreignSurcharge = isForeignOwner
      ? Math.round(landValue * NSW_FOREIGN_SURCHARGE_RATE)
      : 0;
    return { generalTax: 0, foreignSurcharge, totalTax: foreignSurcharge };
  }

  let generalTax: number;
  if (landValue <= NSW_LAND_TAX_PREMIUM_THRESHOLD) {
    generalTax = 100 + (landValue - NSW_LAND_TAX_THRESHOLD) * NSW_LAND_TAX_GENERAL_RATE;
  } else {
    const generalPortion = (NSW_LAND_TAX_PREMIUM_THRESHOLD - NSW_LAND_TAX_THRESHOLD) * NSW_LAND_TAX_GENERAL_RATE;
    const premiumPortion = (landValue - NSW_LAND_TAX_PREMIUM_THRESHOLD) * NSW_LAND_TAX_PREMIUM_RATE;
    generalTax = 100 + generalPortion + premiumPortion;
  }

  const foreignSurcharge = isForeignOwner
    ? Math.round(landValue * NSW_FOREIGN_SURCHARGE_RATE)
    : 0;

  generalTax = Math.round(generalTax);
  return {
    generalTax,
    foreignSurcharge,
    totalTax: generalTax + foreignSurcharge,
  };
}

/**
 * Estimate land value from purchase price based on property type.
 * Units have lower land component than houses.
 */
export function estimateLandValueFromPropertyValue(
  purchasePrice: number,
  propertyType: 'house' | 'unit' | 'townhouse' | 'land' = 'house'
): number {
  const landRatios: Record<string, number> = {
    house: 0.55,
    townhouse: 0.45,
    unit: 0.30,
    land: 1.0,
  };
  return Math.round(purchasePrice * (landRatios[propertyType] ?? 0.55));
}
