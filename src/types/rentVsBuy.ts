export type RentVsBuyVerdict = 'buy' | 'rent' | 'close-call';

export interface RentVsBuyQuickInputs {
  propertyValue: number;
  currentWeeklyRent: number;
  annualIncome: number;
  depositAmount: number;
  isFirstHomeBuyer: boolean;
  interestRate: number;
  capitalGrowthRate: number;
  rentGrowthRate: number;
}

export interface RentVsBuyQuickResult {
  verdict: RentVsBuyVerdict;
  confidence: number;
  reasoning: string[];
  monthlyCostToBuy: number;
  monthlyCostToRent: number;
  fiveYearNetBuy: number;
  fiveYearNetRent: number;
  breakEvenYears: number | null;
  fhbSaving: number;
}

export interface RentVsBuyDetailedInputs extends RentVsBuyQuickInputs {
  loanTermYears: number;
  vacancyRate: number;
  propertyManagementFee: number;
  hasStrata: boolean;
  expenseInflationRate: number;
  projectionYears: number;
}

export interface RentVsBuyDetailedResult {
  quick: RentVsBuyQuickResult;
  buyPosition: {
    totalEquityYear5: number;
    totalCostYear5: number;
    netPropertyIncomeYear1: number;
  };
  rentPosition: {
    totalRentPaidYear5: number;
    investedDepositValueYear5: number;
  };
}
