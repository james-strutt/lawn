import { describe, it, expect } from 'vitest';
import {
  calculateRentalYield,
  estimateInvestmentExpenses,
  calculateBreakEvenRent,
} from '../../../src/utils/financial/rental';

describe('Rental Yield Calculator', () => {
  describe('estimateInvestmentExpenses', () => {
    it('estimates expenses for a house', () => {
      const result = estimateInvestmentExpenses(800000, 'house', 600, false);

      expect(result.councilRates).toBeGreaterThan(0);
      expect(result.waterRates).toBeGreaterThan(0);
      expect(result.strataFees).toBe(0); // No strata for house
      expect(result.landlordInsurance).toBeGreaterThan(0);
      expect(result.propertyManagement).toBeGreaterThan(0);
      expect(result.repairs).toBeGreaterThan(0);
      expect(result.totalAnnual).toBeGreaterThan(0);
    });

    it('estimates expenses for a unit with strata', () => {
      const result = estimateInvestmentExpenses(600000, 'unit', 500, true);

      expect(result.strataFees).toBeGreaterThan(0);
      expect(result.totalAnnual).toBeGreaterThan(0);
    });

    it('estimates higher expenses for higher value properties', () => {
      const result1 = estimateInvestmentExpenses(600000, 'house', 500, false);
      const result2 = estimateInvestmentExpenses(1200000, 'house', 800, false);

      expect(result2.totalAnnual).toBeGreaterThan(result1.totalAnnual);
    });
  });

  describe('calculateRentalYield', () => {
    it('calculates positive yield for good rental', () => {
      const expenses = estimateInvestmentExpenses(800000, 'house', 650, false);
      const result = calculateRentalYield(800000, 650, expenses);

      expect(result.grossYield).toBeGreaterThan(0);
      expect(result.netYield).toBeGreaterThan(0);
      expect(result.annualRent).toBe(650 * 52);
      expect(result.annualNetIncome).toBeGreaterThan(0);
    });

    it('calculates cashflow with loan', () => {
      const expenses = estimateInvestmentExpenses(800000, 'house', 650, false);
      const result = calculateRentalYield(800000, 650, expenses, 640000, 6.5);

      expect(result.cashflowMonthly).toBeLessThan(0); // Likely negative with loan
      expect(result.cashflowAnnual).toBe(result.cashflowMonthly * 12);
    });

    it('shows higher yield for higher rent relative to price', () => {
      const expenses1 = estimateInvestmentExpenses(800000, 'house', 500, false);
      const expenses2 = estimateInvestmentExpenses(800000, 'house', 700, false);

      const result1 = calculateRentalYield(800000, 500, expenses1);
      const result2 = calculateRentalYield(800000, 700, expenses2);

      expect(result2.grossYield).toBeGreaterThan(result1.grossYield);
    });
  });

  describe('calculateBreakEvenRent', () => {
    it('calculates weekly rent needed to break even', () => {
      const expenses = estimateInvestmentExpenses(800000, 'house', 600, false);
      const breakEvenRent = calculateBreakEvenRent(640000, 6.5, expenses);

      expect(breakEvenRent).toBeGreaterThan(0);
      expect(breakEvenRent).toBeGreaterThan(600); // Should be higher than typical rent
    });

    it('increases with higher loan amount', () => {
      const expenses = estimateInvestmentExpenses(800000, 'house', 600, false);
      const rent1 = calculateBreakEvenRent(500000, 6.5, expenses);
      const rent2 = calculateBreakEvenRent(700000, 6.5, expenses);

      expect(rent2).toBeGreaterThan(rent1);
    });
  });
});
