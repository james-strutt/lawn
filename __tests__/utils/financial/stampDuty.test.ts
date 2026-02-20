import { describe, it, expect } from 'vitest';
import {
  calculateStampDuty,
  calculateFHBBenefit,
  calculateStampDutyWithFHB,
} from '../../../src/utils/financial/stampDuty';

describe('NSW Stamp Duty Calculator', () => {
  describe('calculateStampDuty', () => {
    it('calculates stamp duty for $500,000 property', () => {
      const result = calculateStampDuty(500000);
      expect(result.stampDuty).toBe(15732);
      expect(result.actualDuty).toBe(15732);
    });

    it('calculates stamp duty for $850,000 property', () => {
      const result = calculateStampDuty(850000);
      expect(result.stampDuty).toBe(32982);
      expect(result.actualDuty).toBe(32982);
    });

    it('calculates stamp duty for $1,500,000 property', () => {
      const result = calculateStampDuty(1500000);
      expect(result.stampDuty).toBe(62232);
      expect(result.actualDuty).toBe(62232);
    });

    it('returns zero for invalid input', () => {
      const result = calculateStampDuty(0);
      expect(result.stampDuty).toBe(0);
      expect(result.actualDuty).toBe(0);
    });
  });

  describe('calculateFHBBenefit', () => {
    it('provides full exemption for $700,000 FHB property', () => {
      const result = calculateFHBBenefit(700000, true);
      expect(result.eligible).toBe(true);
      expect(result.exemptionAmount).toBeGreaterThan(0);
      expect(result.concessionAmount).toBe(0);
    });

    it('provides full exemption for $800,000 FHB property', () => {
      const result = calculateFHBBenefit(800000, true);
      expect(result.eligible).toBe(true);
      expect(result.exemptionAmount).toBeGreaterThan(0);
    });

    it('provides partial concession for $900,000 FHB property', () => {
      const result = calculateFHBBenefit(900000, true);
      expect(result.eligible).toBe(true);
      expect(result.exemptionAmount).toBe(0);
      expect(result.concessionAmount).toBeGreaterThan(0);
    });

    it('provides no benefit for $1,100,000 FHB property', () => {
      const result = calculateFHBBenefit(1100000, true);
      expect(result.eligible).toBe(false);
      expect(result.exemptionAmount).toBe(0);
      expect(result.concessionAmount).toBe(0);
    });

    it('provides no benefit for non-FHB', () => {
      const result = calculateFHBBenefit(700000, false);
      expect(result.eligible).toBe(false);
    });
  });

  describe('calculateStampDutyWithFHB', () => {
    it('applies FHB exemption correctly', () => {
      const result = calculateStampDutyWithFHB(700000, true);
      expect(result.actualDuty).toBe(0);
      expect(result.fhbExemption).toBeGreaterThan(0);
    });

    it('applies FHB concession correctly', () => {
      const result = calculateStampDutyWithFHB(900000, true);
      expect(result.actualDuty).toBeLessThan(result.stampDuty);
      expect(result.fhbConcession).toBeGreaterThan(0);
    });

    it('does not apply FHB benefit when not eligible', () => {
      const result = calculateStampDutyWithFHB(500000, false);
      expect(result.actualDuty).toBe(result.stampDuty);
      expect(result.fhbExemption).toBe(0);
      expect(result.fhbConcession).toBe(0);
    });
  });
});
