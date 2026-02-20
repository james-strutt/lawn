/**
 * NPV, IRR, and Payback Period calculations.
 * Ported from landiq_labs yieldCalculations.ts.
 */

export function calculateNPV(
  cashflows: number[],
  discountRate: number,
  initialInvestment: number
): number {
  let npv = -initialInvestment;

  for (let i = 0; i < cashflows.length; i++) {
    const cashflow = cashflows[i] ?? 0;
    npv += cashflow / Math.pow(1 + discountRate, i + 1);
  }

  return npv;
}

export function calculateIRR(
  cashflows: number[],
  initialInvestment: number,
  maxIterations: number = 1000,
  tolerance: number = 0.00001
): number | null {
  const allCashflows = [-initialInvestment, ...cashflows];

  let lowerRate = -0.99;
  let upperRate = 10;
  let midRate = 0;

  for (let i = 0; i < maxIterations; i++) {
    midRate = (lowerRate + upperRate) / 2;
    const npv = allCashflows.reduce(
      (sum, cf, index) => sum + cf / Math.pow(1 + midRate, index),
      0
    );

    if (Math.abs(npv) < tolerance) {
      return midRate;
    }

    if (npv > 0) {
      lowerRate = midRate;
    } else {
      upperRate = midRate;
    }

    if (upperRate - lowerRate < tolerance) {
      return midRate;
    }
  }

  return null;
}

export function calculatePaybackPeriod(
  initialInvestment: number,
  annualCashflows: number[]
): number | null {
  let cumulativeCashflow = 0;

  for (let i = 0; i < annualCashflows.length; i++) {
    const currentCashflow = annualCashflows[i] ?? 0;
    cumulativeCashflow += currentCashflow;

    if (cumulativeCashflow >= initialInvestment && currentCashflow > 0) {
      const previousCumulative = cumulativeCashflow - currentCashflow;
      const remainingToRecover = initialInvestment - previousCumulative;
      const fractionOfYear = remainingToRecover / currentCashflow;
      return i + fractionOfYear;
    }
  }

  return null;
}
