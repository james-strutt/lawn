export type PropertyType = 'house' | 'unit' | 'townhouse' | 'land';
export type LoanType = 'principalAndInterest' | 'interestOnly';
export type InvestmentVerdict = 'strong' | 'consider' | 'caution';

export interface AcquisitionInputs {
  purchasePrice: number;
  propertyType: PropertyType;
  isFirstHomeBuyer: boolean;
  isForeignBuyer: boolean;
}

export interface FinancingInputs {
  depositAmount: number;
  depositIsPercent: boolean;
  interestRate: number;
  loanTermYears: number;
  loanType: LoanType;
}

export interface RentalInputs {
  weeklyRent: number;
  currentWeeklyRent: number;
  vacancyRate: number;
  propertyManagementFee: number;
  hasStrata: boolean;
}

export interface InvestorProfile {
  annualIncome: number;
  hasHelpDebt: boolean;
  hasPrivateHealth: boolean;
}

export interface GrowthAssumptions {
  capitalGrowthRate: number;
  rentGrowthRate: number;
  expenseInflationRate: number;
  projectionYears: number;
}

export interface InvestmentInputs {
  acquisition: AcquisitionInputs;
  financing: FinancingInputs;
  rental: RentalInputs;
  investor: InvestorProfile;
  growth: GrowthAssumptions;
}

export interface ExpenseBreakdown {
  councilRates: number;
  waterRates: number;
  strataFees: number;
  landlordInsurance: number;
  propertyManagement: number;
  repairs: number;
  landTax: number;
  totalAnnual: number;
}

export interface InvestmentSummary {
  grossYield: number;
  netYield: number;
  monthlyCashflow: number;
  annualCashflow: number;
  gearingType: 'positive' | 'neutral' | 'negative';
  loanAmount: number;
  lvr: number;
  stampDuty: number;
  lmiAmount: number;
  totalUpfrontCosts: number;
  depositRequired: number;
  totalCashRequired: number;
  monthlyRepayment: number;
  annualRent: number;
  annualExpenses: number;
  expenses: ExpenseBreakdown;
  taxBenefitAnnual: number;
  afterTaxMonthlyCashflow: number;
  projectedEquity10yr: number;
  marginalTaxRate: number;
}

export interface AnnualProjection {
  year: number;
  propertyValue: number;
  loanBalance: number;
  equity: number;
  annualRent: number;
  annualExpenses: number;
  annualRepayment: number;
  annualInterest: number;
  preTaxCashflow: number;
  taxBenefit: number;
  afterTaxCashflow: number;
  cumulativeCashflow: number;
  capitalGain: number;
}

export interface TaxPosition {
  incomeBeforeProperty: number;
  taxBeforeProperty: number;
  marginalRateBeforeProperty: number;
  propertyIncome: number;
  propertyDeductions: number;
  netPropertyIncome: number;
  incomeAfterProperty: number;
  taxAfterProperty: number;
  marginalRateAfterProperty: number;
  annualTaxSaving: number;
  weeklyTaxSaving: number;
  deductionBreakdown: {
    interest: number;
    depreciation: number;
    expenses: number;
    total: number;
  };
}
