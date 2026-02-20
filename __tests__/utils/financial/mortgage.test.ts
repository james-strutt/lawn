import { describe, it, expect } from 'vitest';
import {
  calculateMortgageRepayment,
  calculateLMI,
  calculateBorrowingCapacity,
} from '../../../src/utils/financial/mortgage';

describe('Mortgage Calculator', () => {
  describe('calculateMortgageRepayment', () => {
    it('calculates monthly repayment for 30-year loan', () => {
      const result = calculateMortgageRepayment(680000, 6.5, 30);

      expect(result.monthlyRepayment).toBeGreaterThan(4000);
      expect(result.monthlyRepayment).toBeLessThan(5000);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.totalRepayment).toBeGreaterThan(result.principalAmount);
    });

    it('calculates repayment for different terms', () => {
      const result15 = calculateMortgageRepayment(680000, 6.5, 15);
      const result30 = calculateMortgageRepayment(680000, 6.5, 30);

      expect(result15.monthlyRepayment).toBeGreaterThan(result30.monthlyRepayment);
      expect(result15.totalInterest).toBeLessThan(result30.totalInterest);
    });

    it('handles interest-free loans', () => {
      const result = calculateMortgageRepayment(100000, 0, 10);

      expect(result.monthlyRepayment).toBe(Math.round(100000 / 120));
      expect(result.totalInterest).toBe(0);
    });
  });

  describe('calculateLMI', () => {
    it('requires no LMI for 80% LVR', () => {
      const result = calculateLMI(640000, 800000);

      expect(result.lmiRequired).toBe(false);
      expect(result.lmiAmount).toBe(0);
      expect(result.lvr).toBe(80);
    });

    it('requires LMI for 85% LVR', () => {
      const result = calculateLMI(680000, 800000);

      expect(result.lmiRequired).toBe(true);
      expect(result.lmiAmount).toBeGreaterThan(0);
      expect(result.lvr).toBe(85);
    });

    it('calculates higher LMI for 95% LVR', () => {
      const result85 = calculateLMI(680000, 800000); // 85%
      const result95 = calculateLMI(760000, 800000); // 95%

      expect(result95.lmiAmount).toBeGreaterThan(result85.lmiAmount);
    });
  });

  describe('calculateBorrowingCapacity', () => {
    it('calculates maximum borrowing based on income', () => {
      const result = calculateBorrowingCapacity(100000, 2000, 6.5, 30);

      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1000000); // Sanity check
    });

    it('returns 0 when expenses exceed serviceable income', () => {
      const result = calculateBorrowingCapacity(50000, 5000, 6.5, 30);

      expect(result).toBe(0);
    });

    it('increases with higher income', () => {
      const result1 = calculateBorrowingCapacity(80000, 2000, 6.5, 30);
      const result2 = calculateBorrowingCapacity(120000, 2000, 6.5, 30);

      expect(result2).toBeGreaterThan(result1);
    });
  });
});
