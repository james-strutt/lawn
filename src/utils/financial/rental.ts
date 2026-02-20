/**
 * Rental Yield and Investment Calculations
 */

export interface RentalYieldResult {
  grossYield: number; // %
  netYield: number; // %
  annualRent: number;
  annualExpenses: number;
  annualNetIncome: number;
  cashflowMonthly: number;
  cashflowAnnual: number;
}

export interface InvestmentExpenses {
  councilRates: number;
  waterRates: number;
  strataFees: number;
  landlordInsurance: number;
  propertyManagement: number;
  repairs: number;
  totalAnnual: number;
}

/**
 * Calculate rental yield
 */
export function calculateRentalYield(
  propertyValue: number,
  weeklyRent: number,
  expenses: InvestmentExpenses,
  loanAmount: number = 0,
  interestRate: number = 0
): RentalYieldResult {
  const annualRent = weeklyRent * 52;
  const grossYield = (annualRent / propertyValue) * 100;

  const annualExpenses = expenses.totalAnnual;
  const annualNetIncome = annualRent - annualExpenses;
  const netYield = (annualNetIncome / propertyValue) * 100;

  // Calculate cashflow (rent - expenses - loan repayments)
  let monthlyLoanRepayment = 0;
  if (loanAmount > 0 && interestRate > 0) {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = 30 * 12; // 30 year loan
    monthlyLoanRepayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  const monthlyRent = annualRent / 12;
  const monthlyExpenses = annualExpenses / 12;
  const cashflowMonthly = monthlyRent - monthlyExpenses - monthlyLoanRepayment;
  const cashflowAnnual = cashflowMonthly * 12;

  return {
    grossYield: Math.round(grossYield * 10) / 10,
    netYield: Math.round(netYield * 10) / 10,
    annualRent: Math.round(annualRent),
    annualExpenses: Math.round(annualExpenses),
    annualNetIncome: Math.round(annualNetIncome),
    cashflowMonthly: Math.round(cashflowMonthly),
    cashflowAnnual: Math.round(cashflowAnnual),
  };
}

/**
 * Estimate investment property expenses
 */
export function estimateInvestmentExpenses(
  propertyValue: number,
  propertyType: 'house' | 'unit' | 'townhouse',
  weeklyRent: number,
  hasStrata: boolean = false
): InvestmentExpenses {
  const annualRent = weeklyRent * 52;

  // Council rates: approx $1,500-$3,000/year
  const councilRates = propertyValue < 800000 ? 1500 : 2500;

  // Water rates: approx $800-$1,200/year
  const waterRates = 1000;

  // Strata fees (units/townhouses): $2,000-$8,000/year
  const strataFees = hasStrata
    ? propertyType === 'unit'
      ? 4000
      : 3000
    : 0;

  // Landlord insurance: approx $500-$800/year
  const landlordInsurance = 650;

  // Property management: 7-8% of annual rent
  const propertyManagement = annualRent * 0.075;

  // Repairs & maintenance: 1% of property value per year
  const repairs = propertyValue * 0.01;

  const totalAnnual =
    councilRates +
    waterRates +
    strataFees +
    landlordInsurance +
    propertyManagement +
    repairs;

  return {
    councilRates: Math.round(councilRates),
    waterRates: Math.round(waterRates),
    strataFees: Math.round(strataFees),
    landlordInsurance: Math.round(landlordInsurance),
    propertyManagement: Math.round(propertyManagement),
    repairs: Math.round(repairs),
    totalAnnual: Math.round(totalAnnual),
  };
}

/**
 * Calculate capital growth projection
 */
export function projectCapitalGrowth(
  purchasePrice: number,
  annualGrowthRate: number,
  years: number
): number[] {
  const projections: number[] = [purchasePrice];

  for (let year = 1; year <= years; year++) {
    const previousValue = projections[year - 1];
    const newValue = previousValue * (1 + annualGrowthRate / 100);
    projections.push(Math.round(newValue));
  }

  return projections;
}

/**
 * Calculate break-even rent (to cover all costs)
 */
export function calculateBreakEvenRent(
  loanAmount: number,
  interestRate: number,
  expenses: InvestmentExpenses
): number {
  // Monthly loan repayment
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = 30 * 12;
  const monthlyLoanRepayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  // Monthly expenses
  const monthlyExpenses = expenses.totalAnnual / 12;

  // Total monthly cost
  const totalMonthlyCost = monthlyLoanRepayment + monthlyExpenses;

  // Convert to weekly rent
  const weeklyRent = (totalMonthlyCost * 12) / 52;

  return Math.round(weeklyRent);
}
