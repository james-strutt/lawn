import { useMemo } from 'react';
import { useInvestmentStore } from '@/stores/investmentStore';
import type {
  InvestmentSummary,
  AnnualProjection,
  InvestmentVerdict,
  TaxPosition,
  ExpenseBreakdown,
} from '@/types/investment';
import { calculateMortgageRepayment, calculateInterestOnlyRepayment, calculateLMI, calculateUpfrontCosts } from '@/utils/financial/mortgage';
import { calculateStampDutyWithFHB } from '@/utils/financial/stampDuty';
import { estimateInvestmentExpenses } from '@/utils/financial/rental';
import { calculateLandTaxFromPurchasePrice } from '@/utils/financial/landTaxCalculation';
import { calculateIncomeTax, getMarginalRate, calculateNegativeGearingBenefit } from '@/utils/financial/taxImpact';
import { generateProjection } from '@/utils/financial/investmentProjection';
import { calculateAnnualDepreciation } from '@/utils/financial/depreciation';

interface InvestmentAnalysisResult {
  summary: InvestmentSummary;
  projections: AnnualProjection[];
  verdict: InvestmentVerdict;
  taxPosition: TaxPosition;
}

export function useInvestmentAnalysis(): InvestmentAnalysisResult {
  const { inputs } = useInvestmentStore();
  const { acquisition, financing, rental, investor, growth } = inputs;

  return useMemo(() => {
    // Deposit
    const depositRequired = financing.depositIsPercent
      ? Math.round(acquisition.purchasePrice * financing.depositAmount / 100)
      : financing.depositAmount;

    const loanAmount = acquisition.purchasePrice - depositRequired;

    // Stamp duty
    const stampDutyResult = calculateStampDutyWithFHB(
      acquisition.purchasePrice,
      acquisition.isFirstHomeBuyer
    );
    const stampDuty = stampDutyResult.actualDuty;

    // LMI
    const lmiResult = calculateLMI(loanAmount, acquisition.purchasePrice);
    const lvr = lmiResult.lvr;

    // Upfront costs
    const upfrontCosts = calculateUpfrontCosts(acquisition.purchasePrice, stampDuty, lmiResult.lmiAmount);
    const totalCashRequired = depositRequired + upfrontCosts.totalUpfront;

    // Monthly repayment
    let monthlyRepayment: number;
    let annualRepayment: number;
    if (financing.loanType === 'interestOnly') {
      monthlyRepayment = calculateInterestOnlyRepayment(loanAmount, financing.interestRate);
      annualRepayment = monthlyRepayment * 12;
    } else {
      const mortgage = calculateMortgageRepayment(loanAmount, financing.interestRate, financing.loanTermYears);
      monthlyRepayment = mortgage.monthlyRepayment;
      annualRepayment = monthlyRepayment * 12;
    }

    // Annual rent (vacancy-adjusted)
    const grossAnnualRent = rental.weeklyRent * 52;
    const annualRent = Math.round(grossAnnualRent * (1 - rental.vacancyRate / 100));

    // Expenses
    const baseExpenses = estimateInvestmentExpenses(
      acquisition.purchasePrice,
      acquisition.propertyType === 'land' ? 'house' : acquisition.propertyType,
      rental.weeklyRent,
      rental.hasStrata
    );

    // Override PM fee with user's input
    const pmFee = Math.round(grossAnnualRent * rental.propertyManagementFee / 100);

    // Land tax
    const landTaxResult = calculateLandTaxFromPurchasePrice({
      purchasePrice: acquisition.purchasePrice,
      isForeignOwner: acquisition.isForeignBuyer,
      propertyType: acquisition.propertyType,
    });

    const expenses: ExpenseBreakdown = {
      councilRates: baseExpenses.councilRates,
      waterRates: baseExpenses.waterRates,
      strataFees: baseExpenses.strataFees,
      landlordInsurance: baseExpenses.landlordInsurance,
      propertyManagement: pmFee,
      repairs: baseExpenses.repairs,
      landTax: landTaxResult.landTaxPerYear,
      totalAnnual: baseExpenses.councilRates + baseExpenses.waterRates + baseExpenses.strataFees +
        baseExpenses.landlordInsurance + pmFee + baseExpenses.repairs + landTaxResult.landTaxPerYear,
    };

    // Yields
    const grossYield = Math.round((grossAnnualRent / acquisition.purchasePrice) * 1000) / 10;
    const netYield = Math.round(((annualRent - expenses.totalAnnual) / acquisition.purchasePrice) * 1000) / 10;

    // Pre-tax cashflow
    const annualCashflow = annualRent - expenses.totalAnnual - annualRepayment;
    const monthlyCashflow = Math.round(annualCashflow / 12);

    // Gearing
    const gearingType = annualCashflow > 500
      ? 'positive' as const
      : annualCashflow < -500
        ? 'negative' as const
        : 'neutral' as const;

    // Tax position
    const annualInterest = financing.loanType === 'interestOnly'
      ? loanAmount * financing.interestRate / 100
      : calculateFirstYearInterest(loanAmount, financing.interestRate, financing.loanTermYears);

    const annualDepreciation = calculateAnnualDepreciation({
      purchasePrice: acquisition.purchasePrice,
      propertyType: acquisition.propertyType,
    });

    const propertyDeductions = annualInterest + expenses.totalAnnual + annualDepreciation;
    const netPropertyIncome = annualRent - propertyDeductions;

    const taxOptions = {
      hasHelpDebt: investor.hasHelpDebt,
      hasPrivateHealth: investor.hasPrivateHealth,
    };

    const taxBeforeProperty = calculateIncomeTax(investor.annualIncome, taxOptions).totalTax;
    const taxAfterProperty = calculateIncomeTax(
      Math.max(0, investor.annualIncome + netPropertyIncome),
      taxOptions
    ).totalTax;

    const taxBenefitAnnual = netPropertyIncome < 0
      ? calculateNegativeGearingBenefit(investor.annualIncome, netPropertyIncome, taxOptions)
      : 0;

    const afterTaxMonthlyCashflow = Math.round((annualCashflow + taxBenefitAnnual) / 12);
    const marginalTaxRate = getMarginalRate(investor.annualIncome);

    const taxPosition: TaxPosition = {
      incomeBeforeProperty: investor.annualIncome,
      taxBeforeProperty,
      marginalRateBeforeProperty: getMarginalRate(investor.annualIncome),
      propertyIncome: annualRent,
      propertyDeductions,
      netPropertyIncome,
      incomeAfterProperty: investor.annualIncome + netPropertyIncome,
      taxAfterProperty,
      marginalRateAfterProperty: getMarginalRate(Math.max(0, investor.annualIncome + netPropertyIncome)),
      annualTaxSaving: taxBenefitAnnual,
      weeklyTaxSaving: Math.round(taxBenefitAnnual / 52),
      deductionBreakdown: {
        interest: Math.round(annualInterest),
        depreciation: annualDepreciation,
        expenses: expenses.totalAnnual,
        total: Math.round(propertyDeductions),
      },
    };

    // Projections
    const projections = generateProjection(inputs, expenses.totalAnnual, loanAmount, annualRepayment, annualDepreciation);

    // 10-year equity
    const projectedEquity10yr = projections.length >= 10
      ? projections[9].equity
      : projections[projections.length - 1]?.equity ?? depositRequired;

    // Summary
    const summary: InvestmentSummary = {
      grossYield,
      netYield,
      monthlyCashflow,
      annualCashflow: Math.round(annualCashflow),
      gearingType,
      loanAmount,
      lvr,
      stampDuty,
      lmiAmount: lmiResult.lmiAmount,
      totalUpfrontCosts: upfrontCosts.totalUpfront,
      depositRequired,
      totalCashRequired,
      monthlyRepayment,
      annualRent,
      annualExpenses: expenses.totalAnnual,
      expenses,
      taxBenefitAnnual,
      afterTaxMonthlyCashflow,
      projectedEquity10yr,
      marginalTaxRate,
    };

    // Verdict
    const verdict = determineVerdict(summary);

    return { summary, projections, verdict, taxPosition };
  }, [inputs, acquisition, financing, rental, investor, growth]);
}

function determineVerdict(summary: InvestmentSummary): InvestmentVerdict {
  let score = 0;

  // Yield scoring
  if (summary.grossYield >= 5) score += 2;
  else if (summary.grossYield >= 4) score += 1;
  else if (summary.grossYield < 3) score -= 1;

  // Cashflow scoring (after tax)
  if (summary.afterTaxMonthlyCashflow >= 0) score += 2;
  else if (summary.afterTaxMonthlyCashflow >= -200) score += 1;
  else if (summary.afterTaxMonthlyCashflow < -500) score -= 1;

  // LVR risk
  if (summary.lvr <= 80) score += 1;
  else if (summary.lvr > 90) score -= 1;

  if (score >= 3) return 'strong';
  if (score >= 1) return 'consider';
  return 'caution';
}

/**
 * Approximate total interest paid in year 1 of a P&I loan.
 */
function calculateFirstYearInterest(
  principal: number,
  annualRate: number,
  _loanTermYears: number,
): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return 0;

  const totalPayments = 30 * 12;
  const monthlyPayment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1);

  let totalInterest = 0;
  let balance = principal;
  for (let m = 0; m < 12; m++) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    balance -= (monthlyPayment - interest);
  }
  return Math.round(totalInterest);
}
