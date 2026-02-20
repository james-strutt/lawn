/**
 * NSW Stamp Duty Calculator
 * Based on 2025-26 rates
 * Includes First Home Buyer (FHB) exemptions and concessions
 */

export interface StampDutyResult {
  stampDuty: number;
  fhbExemption: number;
  fhbConcession: number;
  actualDuty: number;
  bracket: string;
  calculation: string[];
}

export interface FHBEligibility {
  eligible: boolean;
  exemptionAmount: number;
  concessionAmount: number;
  reason?: string;
}

// NSW Stamp Duty Rates 2025-26 (Non-FHB)
const STAMP_DUTY_BRACKETS = [
  { min: 0, max: 16000, base: 0, rate: 1.25 },
  { min: 16000, max: 35000, base: 200, rate: 1.50 },
  { min: 35000, max: 93000, base: 485, rate: 1.75 },
  { min: 93000, max: 351000, base: 1500, rate: 3.50 },
  { min: 351000, max: 1224000, base: 10532, rate: 4.50 },
  { min: 1224000, max: Infinity, base: 49812, rate: 5.50 },
];

// FHB Exemption: Full exemption up to $800,000
const FHB_FULL_EXEMPTION_THRESHOLD = 800000;

// FHB Concession: Partial concession from $800,001 to $1,000,000
const FHB_CONCESSION_MIN = 800001;
const FHB_CONCESSION_MAX = 1000000;

/**
 * Calculate NSW stamp duty (non-FHB)
 */
export function calculateStampDuty(propertyValue: number): StampDutyResult {
  if (propertyValue <= 0) {
    return {
      stampDuty: 0,
      fhbExemption: 0,
      fhbConcession: 0,
      actualDuty: 0,
      bracket: 'N/A',
      calculation: ['Property value must be greater than 0'],
    };
  }

  const bracket = STAMP_DUTY_BRACKETS.find(
    (b) => propertyValue > b.min && propertyValue <= b.max
  );

  if (!bracket) {
    return {
      stampDuty: 0,
      fhbExemption: 0,
      fhbConcession: 0,
      actualDuty: 0,
      bracket: 'Unknown',
      calculation: ['Error: Property value out of range'],
    };
  }

  const excess = propertyValue - bracket.min;
  const stampDuty = bracket.base + (excess * bracket.rate) / 100;

  const calculation = [
    `Property value: $${propertyValue.toLocaleString()}`,
    `Bracket: $${bracket.min.toLocaleString()} - ${bracket.max === Infinity ? '∞' : `$${bracket.max.toLocaleString()}`}`,
    `Base duty: $${bracket.base.toLocaleString()}`,
    `Excess over $${bracket.min.toLocaleString()}: $${excess.toLocaleString()}`,
    `Rate on excess: ${bracket.rate}%`,
    `Duty on excess: $${((excess * bracket.rate) / 100).toLocaleString()}`,
    `Total stamp duty: $${Math.round(stampDuty).toLocaleString()}`,
  ];

  return {
    stampDuty: Math.round(stampDuty),
    fhbExemption: 0,
    fhbConcession: 0,
    actualDuty: Math.round(stampDuty),
    bracket: `$${bracket.min.toLocaleString()} - ${bracket.max === Infinity ? '∞' : `$${bracket.max.toLocaleString()}`}`,
    calculation,
  };
}

/**
 * Check FHB eligibility and calculate exemption/concession
 */
export function calculateFHBBenefit(
  propertyValue: number,
  isFHB: boolean,
  isNewHome: boolean = false
): FHBEligibility {
  if (!isFHB) {
    return {
      eligible: false,
      exemptionAmount: 0,
      concessionAmount: 0,
      reason: 'Not a first home buyer',
    };
  }

  // Full exemption for properties up to $800,000
  if (propertyValue <= FHB_FULL_EXEMPTION_THRESHOLD) {
    const standardDuty = calculateStampDuty(propertyValue).stampDuty;
    return {
      eligible: true,
      exemptionAmount: standardDuty,
      concessionAmount: 0,
    };
  }

  // Partial concession for properties $800,001 to $1,000,000
  if (propertyValue >= FHB_CONCESSION_MIN && propertyValue <= FHB_CONCESSION_MAX) {
    const standardDuty = calculateStampDuty(propertyValue).stampDuty;
    // Linear taper: 100% saving at $800k, 0% saving at $1M
    const concessionPercentage =
      ((FHB_CONCESSION_MAX - propertyValue) / (FHB_CONCESSION_MAX - FHB_FULL_EXEMPTION_THRESHOLD)) * 100;
    const concessionAmount = (standardDuty * concessionPercentage) / 100;

    return {
      eligible: true,
      exemptionAmount: 0,
      concessionAmount: Math.round(concessionAmount),
    };
  }

  // No benefit for properties over $1,000,000
  return {
    eligible: false,
    exemptionAmount: 0,
    concessionAmount: 0,
    reason: 'Property value exceeds $1,000,000 FHB threshold',
  };
}

/**
 * Calculate stamp duty with FHB benefits applied
 */
export function calculateStampDutyWithFHB(
  propertyValue: number,
  isFHB: boolean = false,
  isNewHome: boolean = false
): StampDutyResult {
  const standardResult = calculateStampDuty(propertyValue);
  const fhbBenefit = calculateFHBBenefit(propertyValue, isFHB, isNewHome);

  if (!fhbBenefit.eligible) {
    return standardResult;
  }

  const actualDuty = standardResult.stampDuty - fhbBenefit.exemptionAmount - fhbBenefit.concessionAmount;

  const calculation = [
    ...standardResult.calculation,
    '',
    '--- FIRST HOME BUYER BENEFIT ---',
    fhbBenefit.exemptionAmount > 0
      ? `Full exemption: -$${fhbBenefit.exemptionAmount.toLocaleString()}`
      : `Concession: -$${fhbBenefit.concessionAmount.toLocaleString()}`,
    `Final stamp duty: $${Math.round(actualDuty).toLocaleString()}`,
  ];

  return {
    stampDuty: standardResult.stampDuty,
    fhbExemption: fhbBenefit.exemptionAmount,
    fhbConcession: fhbBenefit.concessionAmount,
    actualDuty: Math.round(actualDuty),
    bracket: standardResult.bracket,
    calculation,
  };
}

/**
 * Calculate mortgage registration fee (NSW)
 */
export function calculateMortgageRegistration(loanAmount: number): number {
  // NSW mortgage registration fee: approximately $150 + 0.4% of loan amount
  const baseFee = 150;
  const variableFee = loanAmount * 0.004;
  return Math.round(baseFee + variableFee);
}

/**
 * Calculate transfer fee (NSW)
 */
export function calculateTransferFee(propertyValue: number): number {
  // NSW transfer fee is approximately $500-$10,000 depending on value
  if (propertyValue < 200000) return 500;
  if (propertyValue < 500000) return 1000;
  if (propertyValue < 1000000) return 1500;
  if (propertyValue < 2000000) return 2000;
  if (propertyValue < 5000000) return 5000;
  return 10000;
}
