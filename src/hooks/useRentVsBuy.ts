import { useMemo } from 'react';
import { useInvestmentStore } from '@/stores/investmentStore';
import { usePropertyStore } from '@/stores/propertyStore';
import { calculateRentVsBuyQuick } from '@/utils/financial/rentVsBuy';
import type { RentVsBuyQuickResult } from '@/types/rentVsBuy';

export function useRentVsBuyQuick(): RentVsBuyQuickResult {
  const { inputs } = useInvestmentStore();
  const { selectedProperty } = usePropertyStore();
  const { acquisition, financing, rental, investor, growth } = inputs;

  return useMemo(() => {
    const propertyValue = selectedProperty?.propertyValue ?? acquisition.purchasePrice;
    const weeklyRent = rental.currentWeeklyRent ?? rental.weeklyRent;

    const depositRequired = financing.depositIsPercent
      ? Math.round(propertyValue * financing.depositAmount / 100)
      : financing.depositAmount;

    return calculateRentVsBuyQuick({
      propertyValue,
      currentWeeklyRent: weeklyRent,
      annualIncome: investor.annualIncome,
      depositAmount: depositRequired,
      isFirstHomeBuyer: acquisition.isFirstHomeBuyer,
      interestRate: financing.interestRate,
      capitalGrowthRate: growth.capitalGrowthRate,
      rentGrowthRate: growth.rentGrowthRate,
    });
  }, [selectedProperty, acquisition, financing, rental, investor, growth]);
}
