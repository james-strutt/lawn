/**
 * Rent vs Buy comparison calculator.
 * Quick mode: simple 5-year comparison with verdict.
 * Detailed mode: extends full investment analysis pipeline.
 */

import type { RentVsBuyQuickInputs, RentVsBuyQuickResult, RentVsBuyVerdict } from '@/types/rentVsBuy';
import { calculateMortgageRepayment, calculateLMI, calculateUpfrontCosts } from '@/utils/financial/mortgage';
import { calculateStampDutyWithFHB } from '@/utils/financial/stampDuty';

const INVESTMENT_RETURN_RATE = 0.07; // Assumed annual return on invested deposit (index fund)
const COUNCIL_RATES_ESTIMATE = 0.003; // ~0.3% of property value p.a.
const INSURANCE_ESTIMATE = 0.002; // ~0.2% of property value p.a.
const MAINTENANCE_ESTIMATE = 0.01; // ~1% of property value p.a.

export function calculateRentVsBuyQuick(inputs: RentVsBuyQuickInputs): RentVsBuyQuickResult {
  const {
    propertyValue,
    currentWeeklyRent,
    annualIncome: _annualIncome,
    depositAmount,
    isFirstHomeBuyer,
    interestRate,
    capitalGrowthRate,
    rentGrowthRate,
  } = inputs;

  const loanAmount = propertyValue - depositAmount;

  // Stamp duty
  const stampDutyResult = calculateStampDutyWithFHB(propertyValue, isFirstHomeBuyer);
  const stampDuty = stampDutyResult.actualDuty;
  const fhbSaving = stampDutyResult.fhbExemption + stampDutyResult.fhbConcession;

  // LMI
  const lmiResult = calculateLMI(loanAmount, propertyValue);

  // Upfront costs
  const upfront = calculateUpfrontCosts(propertyValue, stampDuty, lmiResult.lmiAmount);

  // Monthly mortgage (P&I)
  const mortgage = calculateMortgageRepayment(loanAmount, interestRate, 30);
  const monthlyMortgage = mortgage.monthlyRepayment;

  // Monthly ownership costs (rates, insurance, maintenance)
  const monthlyOwnershipCosts = Math.round(
    (propertyValue * (COUNCIL_RATES_ESTIMATE + INSURANCE_ESTIMATE + MAINTENANCE_ESTIMATE)) / 12
  );

  const monthlyCostToBuy = monthlyMortgage + monthlyOwnershipCosts;
  const monthlyCostToRent = Math.round((currentWeeklyRent * 52) / 12);

  // 5-year projection: buying
  let propertyVal = propertyValue;
  let totalBuyCost = depositAmount + upfront.totalUpfront;
  let loanBal = loanAmount;
  const monthlyRate = interestRate / 100 / 12;

  for (let year = 1; year <= 5; year++) {
    propertyVal = propertyVal * (1 + capitalGrowthRate / 100);

    const yearlyMortgage = monthlyMortgage * 12;
    const yearlyOwnership = monthlyOwnershipCosts * 12;
    totalBuyCost += yearlyMortgage + yearlyOwnership;

    // Approximate principal paid this year
    const yearlyInterest = loanBal * (interestRate / 100);
    const principalPaid = yearlyMortgage - yearlyInterest;
    loanBal = Math.max(0, loanBal - principalPaid);
  }

  const equityAt5 = propertyVal - loanBal;
  const fiveYearNetBuy = Math.round(equityAt5 - totalBuyCost);

  // 5-year projection: renting (invest deposit at market returns)
  let investedCapital = depositAmount + upfront.totalUpfront;
  let totalRentCost = 0;
  let currentRent = currentWeeklyRent * 52;

  for (let year = 1; year <= 5; year++) {
    totalRentCost += currentRent;
    currentRent = currentRent * (1 + rentGrowthRate / 100);
    investedCapital = investedCapital * (1 + INVESTMENT_RETURN_RATE);
  }

  const fiveYearNetRent = Math.round(investedCapital - totalRentCost);

  // Break-even calculation
  const breakEvenYears = calculateBreakEvenYear(
    propertyValue, depositAmount, interestRate, capitalGrowthRate,
    currentWeeklyRent, rentGrowthRate, monthlyMortgage, monthlyOwnershipCosts,
    upfront.totalUpfront, monthlyRate
  );

  // Verdict
  const fiveYearDifference = fiveYearNetBuy - fiveYearNetRent;

  const { verdict, confidence, reasoning } = determineVerdict(
    fiveYearDifference, breakEvenYears, fhbSaving, monthlyCostToBuy, monthlyCostToRent
  );

  return {
    verdict,
    confidence,
    reasoning,
    monthlyCostToBuy,
    monthlyCostToRent,
    fiveYearNetBuy,
    fiveYearNetRent,
    breakEvenYears,
    fhbSaving,
  };
}

function calculateBreakEvenYear(
  propertyValue: number,
  depositAmount: number,
  _interestRate: number,
  capitalGrowthRate: number,
  weeklyRent: number,
  rentGrowthRate: number,
  monthlyMortgage: number,
  monthlyOwnershipCosts: number,
  upfrontCosts: number,
  monthlyRate: number,
): number | null {
  let propertyVal = propertyValue;
  let loanBal = propertyValue - depositAmount;
  let totalBuyCost = depositAmount + upfrontCosts;
  let investedCapital = depositAmount + upfrontCosts;
  let totalRentCost = 0;
  let currentRent = weeklyRent * 52;

  for (let year = 1; year <= 30; year++) {
    propertyVal *= (1 + capitalGrowthRate / 100);
    const yearlyMortgage = monthlyMortgage * 12;
    totalBuyCost += yearlyMortgage + monthlyOwnershipCosts * 12;

    const yearlyInterest = loanBal * monthlyRate * 12;
    loanBal = Math.max(0, loanBal - (yearlyMortgage - yearlyInterest));

    const buyNetPosition = propertyVal - loanBal - totalBuyCost;

    totalRentCost += currentRent;
    currentRent *= (1 + rentGrowthRate / 100);
    investedCapital *= (1 + INVESTMENT_RETURN_RATE);

    const rentNetPosition = investedCapital - totalRentCost;

    if (buyNetPosition >= rentNetPosition) {
      return year;
    }
  }

  return null;
}

function determineVerdict(
  fiveYearDifference: number,
  breakEvenYears: number | null,
  fhbSaving: number,
  monthlyCostToBuy: number,
  monthlyCostToRent: number,
): { verdict: RentVsBuyVerdict; confidence: number; reasoning: string[] } {
  let score = 0;
  const reasoning: string[] = [];

  // 5-year net position comparison
  if (fiveYearDifference > 50000) {
    score += 2;
    reasoning.push('Buying builds significantly more wealth over 5 years');
  } else if (fiveYearDifference > 0) {
    score += 1;
    reasoning.push('Buying builds slightly more wealth over 5 years');
  } else if (fiveYearDifference < -50000) {
    score -= 2;
    reasoning.push('Renting and investing gives better 5-year returns');
  } else {
    score -= 1;
    reasoning.push('Renting and investing gives slightly better 5-year returns');
  }

  // Monthly cost comparison
  if (monthlyCostToBuy < monthlyCostToRent * 1.1) {
    score += 1;
    reasoning.push('Monthly ownership cost is competitive with rent');
  } else if (monthlyCostToBuy > monthlyCostToRent * 1.5) {
    score -= 1;
    reasoning.push('Monthly ownership cost is significantly higher than rent');
  }

  // Break-even timeline
  if (breakEvenYears !== null && breakEvenYears <= 5) {
    score += 1;
    reasoning.push(`Buying breaks even within ${Math.ceil(breakEvenYears)} years`);
  } else if (breakEvenYears !== null && breakEvenYears <= 10) {
    reasoning.push(`Buying breaks even in ~${Math.ceil(breakEvenYears)} years`);
  } else {
    score -= 1;
    reasoning.push('Break-even point is more than 10 years away');
  }

  // FHB bonus
  if (fhbSaving > 0) {
    score += 1;
    reasoning.push(`First home buyer saves $${fhbSaving.toLocaleString()} on stamp duty`);
  }

  let verdict: RentVsBuyVerdict;
  let confidence: number;

  if (score >= 3) {
    verdict = 'buy';
    confidence = Math.min(0.95, 0.6 + score * 0.1);
  } else if (score <= -2) {
    verdict = 'rent';
    confidence = Math.min(0.95, 0.6 + Math.abs(score) * 0.1);
  } else {
    verdict = 'close-call';
    confidence = 0.5;
  }

  return { verdict, confidence, reasoning };
}
