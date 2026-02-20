/**
 * Mortgage and Loan Calculations
 */

export interface MortgageRepayment {
  monthlyRepayment: number;
  totalRepayment: number;
  totalInterest: number;
  principalAmount: number;
}

export interface LMICalculation {
  lmiRequired: boolean;
  lmiAmount: number;
  lvr: number;
  reason: string;
}

/**
 * Calculate monthly mortgage repayment (Principal + Interest)
 */
export function calculateMortgageRepayment(
  principal: number,
  annualInterestRate: number,
  loanTermYears: number
): MortgageRepayment {
  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  if (monthlyRate === 0) {
    // Interest-free loan
    const monthlyRepayment = principal / numberOfPayments;
    return {
      monthlyRepayment: Math.round(monthlyRepayment),
      totalRepayment: Math.round(principal),
      totalInterest: 0,
      principalAmount: principal,
    };
  }

  // Standard mortgage formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const monthlyRepayment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalRepayment = monthlyRepayment * numberOfPayments;
  const totalInterest = totalRepayment - principal;

  return {
    monthlyRepayment: Math.round(monthlyRepayment),
    totalRepayment: Math.round(totalRepayment),
    totalInterest: Math.round(totalInterest),
    principalAmount: principal,
  };
}

/**
 * Calculate interest-only repayment
 */
export function calculateInterestOnlyRepayment(
  principal: number,
  annualInterestRate: number
): number {
  const monthlyRate = annualInterestRate / 100 / 12;
  return Math.round(principal * monthlyRate);
}

/**
 * Calculate Lenders Mortgage Insurance (LMI)
 * LMI is typically required when LVR > 80%
 */
export function calculateLMI(
  loanAmount: number,
  propertyValue: number
): LMICalculation {
  const lvr = (loanAmount / propertyValue) * 100;

  if (lvr <= 80) {
    return {
      lmiRequired: false,
      lmiAmount: 0,
      lvr: Math.round(lvr * 10) / 10,
      reason: 'LVR ≤ 80% - No LMI required',
    };
  }

  // LMI calculation approximation (varies by lender)
  // Typical rates: 80-85% = 1.5%, 85-90% = 2.5%, 90-95% = 4%, 95%+ = 6%
  let lmiRate: number;
  if (lvr <= 85) {
    lmiRate = 0.015;
  } else if (lvr <= 90) {
    lmiRate = 0.025;
  } else if (lvr <= 95) {
    lmiRate = 0.04;
  } else {
    lmiRate = 0.06;
  }

  const lmiAmount = Math.round(loanAmount * lmiRate);

  return {
    lmiRequired: true,
    lmiAmount,
    lvr: Math.round(lvr * 10) / 10,
    reason: `LVR ${Math.round(lvr)}% - LMI required at ~${lmiRate * 100}% of loan`,
  };
}

/**
 * Calculate maximum borrowing capacity
 * Based on income and expenses
 */
export function calculateBorrowingCapacity(
  annualIncome: number,
  monthlyExpenses: number,
  interestRate: number,
  loanTermYears: number = 30
): number {
  // Use 30% of gross income as maximum repayment (conservative)
  const maxMonthlyRepayment = (annualIncome / 12) * 0.3 - monthlyExpenses;

  if (maxMonthlyRepayment <= 0) {
    return 0;
  }

  // Reverse mortgage calculation to find principal
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  const maxLoan =
    (maxMonthlyRepayment * (Math.pow(1 + monthlyRate, numberOfPayments) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));

  return Math.round(maxLoan);
}

/**
 * Calculate upfront costs for purchasing a property
 */
export interface UpfrontCosts {
  stampDuty: number;
  legalFees: number;
  inspectionFees: number;
  valuationFee: number;
  loanApplicationFee: number;
  lmi: number;
  mortgageRegistration: number;
  transferFee: number;
  totalUpfront: number;
}

export function calculateUpfrontCosts(
  propertyValue: number,
  stampDuty: number,
  lmi: number
): UpfrontCosts {
  const legalFees = 2500; // Typical conveyancing fees
  const inspectionFees = 850; // Building + pest inspection
  const valuationFee = 500;
  const loanApplicationFee = 600;
  const mortgageRegistration = 150;
  const transferFee = propertyValue < 1000000 ? 1500 : 2000;

  const totalUpfront =
    stampDuty +
    legalFees +
    inspectionFees +
    valuationFee +
    loanApplicationFee +
    lmi +
    mortgageRegistration +
    transferFee;

  return {
    stampDuty,
    legalFees,
    inspectionFees,
    valuationFee,
    loanApplicationFee,
    lmi,
    mortgageRegistration,
    transferFee,
    totalUpfront: Math.round(totalUpfront),
  };
}
