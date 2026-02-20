import type { InvestmentInputs, AnnualProjection } from '@/types/investment';
import { calculateInterestOnlyRepayment } from '@/utils/financial/mortgage';
import { calculateNegativeGearingBenefit } from '@/utils/financial/taxImpact';

/**
 * Generate year-by-year investment projections.
 * Applies capital growth, rent growth, expense inflation, and loan amortisation.
 */
export function generateProjection(
  inputs: InvestmentInputs,
  annualExpenses: number,
  loanAmount: number,
  annualRepayment: number,
  annualDepreciation: number = 0,
): AnnualProjection[] {
  const { acquisition, financing, rental, investor, growth } = inputs;
  const years = growth.projectionYears;
  const projections: AnnualProjection[] = [];

  let propertyValue = acquisition.purchasePrice;
  let currentRent = rental.weeklyRent * 52 * (1 - rental.vacancyRate / 100);
  let currentExpenses = annualExpenses;
  let loanBalance = loanAmount;
  let cumulativeCashflow = 0;

  const isInterestOnly = financing.loanType === 'interestOnly';
  const monthlyRate = financing.interestRate / 100 / 12;

  for (let year = 1; year <= years; year++) {
    // Capital growth
    propertyValue = Math.round(propertyValue * (1 + growth.capitalGrowthRate / 100));

    // Rent growth (applied from year 2)
    if (year > 1) {
      currentRent = Math.round(currentRent * (1 + growth.rentGrowthRate / 100));
      currentExpenses = Math.round(currentExpenses * (1 + growth.expenseInflationRate / 100));
    }

    // Loan interest for the year
    const annualInterest = isInterestOnly
      ? calculateInterestOnlyRepayment(loanBalance, financing.interestRate) * 12
      : calculateAnnualInterest(loanBalance, monthlyRate);

    // Principal reduction for P&I loans
    if (!isInterestOnly && loanBalance > 0) {
      const principalPaid = annualRepayment - annualInterest;
      loanBalance = Math.max(0, Math.round(loanBalance - principalPaid));
    }

    const equity = propertyValue - loanBalance;
    const preTaxCashflow = currentRent - currentExpenses - annualRepayment;

    // Net property income for tax (income minus deductible expenses minus interest minus depreciation)
    const netPropertyIncome = currentRent - currentExpenses - annualInterest - annualDepreciation;

    const taxBenefit = netPropertyIncome < 0
      ? calculateNegativeGearingBenefit(investor.annualIncome, netPropertyIncome, {
          hasHelpDebt: investor.hasHelpDebt,
          hasPrivateHealth: investor.hasPrivateHealth,
        })
      : 0;

    const afterTaxCashflow = preTaxCashflow + taxBenefit;
    cumulativeCashflow += afterTaxCashflow;

    projections.push({
      year,
      propertyValue,
      loanBalance,
      equity,
      annualRent: Math.round(currentRent),
      annualExpenses: Math.round(currentExpenses),
      annualRepayment: Math.round(annualRepayment),
      annualInterest: Math.round(annualInterest),
      preTaxCashflow: Math.round(preTaxCashflow),
      taxBenefit: Math.round(taxBenefit),
      afterTaxCashflow: Math.round(afterTaxCashflow),
      cumulativeCashflow: Math.round(cumulativeCashflow),
      capitalGain: propertyValue - acquisition.purchasePrice,
    });
  }

  return projections;
}

/**
 * Calculate total interest paid in a year for a P&I loan given current balance.
 * Sums monthly interest across 12 months as the balance reduces each month.
 */
function calculateAnnualInterest(balance: number, monthlyRate: number): number {
  if (monthlyRate === 0) return 0;

  let totalInterest = 0;
  let currentBalance = balance;

  // Recalculate monthly payment based on remaining balance/term (approximate using 30yr)
  const remainingPayments = 30 * 12;
  const monthlyPayment =
    (currentBalance * (monthlyRate * Math.pow(1 + monthlyRate, remainingPayments))) /
    (Math.pow(1 + monthlyRate, remainingPayments) - 1);

  for (let month = 0; month < 12; month++) {
    const interestThisMonth = currentBalance * monthlyRate;
    totalInterest += interestThisMonth;
    const principalThisMonth = monthlyPayment - interestThisMonth;
    currentBalance = Math.max(0, currentBalance - principalThisMonth);
  }

  return Math.round(totalInterest);
}

/**
 * Get the loan balance remaining after N years of P&I repayments.
 */
export function getLoanBalanceAfterYears(
  principal: number,
  annualRate: number,
  loanTermYears: number,
  yearsElapsed: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = loanTermYears * 12;
  const paymentsMade = yearsElapsed * 12;

  if (monthlyRate === 0) {
    return Math.max(0, principal - (principal / totalPayments) * paymentsMade);
  }

  const monthlyPayment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1);

  // Remaining balance formula
  const balance =
    principal * Math.pow(1 + monthlyRate, paymentsMade) -
    monthlyPayment * ((Math.pow(1 + monthlyRate, paymentsMade) - 1) / monthlyRate);

  return Math.max(0, Math.round(balance));
}
