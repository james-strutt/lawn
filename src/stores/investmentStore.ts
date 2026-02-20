import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  InvestmentInputs,
  AcquisitionInputs,
  FinancingInputs,
  RentalInputs,
  InvestorProfile,
  GrowthAssumptions,
} from '@/types/investment';
import type { Property } from '@/stores/propertyStore';

const DEFAULT_ACQUISITION: AcquisitionInputs = {
  purchasePrice: 850000,
  propertyType: 'house',
  isFirstHomeBuyer: false,
  isForeignBuyer: false,
};

const DEFAULT_FINANCING: FinancingInputs = {
  depositAmount: 20,
  depositIsPercent: true,
  interestRate: 6.5,
  loanTermYears: 30,
  loanType: 'principalAndInterest',
};

const DEFAULT_RENTAL: RentalInputs = {
  weeklyRent: 550,
  currentWeeklyRent: 550,
  vacancyRate: 3,
  propertyManagementFee: 7.5,
  hasStrata: false,
};

const DEFAULT_INVESTOR: InvestorProfile = {
  annualIncome: 100000,
  hasHelpDebt: false,
  hasPrivateHealth: false,
};

const DEFAULT_GROWTH: GrowthAssumptions = {
  capitalGrowthRate: 4,
  rentGrowthRate: 3,
  expenseInflationRate: 2.5,
  projectionYears: 10,
};

const DEFAULT_INPUTS: InvestmentInputs = {
  acquisition: DEFAULT_ACQUISITION,
  financing: DEFAULT_FINANCING,
  rental: DEFAULT_RENTAL,
  investor: DEFAULT_INVESTOR,
  growth: DEFAULT_GROWTH,
};

interface InvestmentState {
  inputs: InvestmentInputs;
  setAcquisition: (data: Partial<AcquisitionInputs>) => void;
  setFinancing: (data: Partial<FinancingInputs>) => void;
  setRental: (data: Partial<RentalInputs>) => void;
  setInvestor: (data: Partial<InvestorProfile>) => void;
  setGrowth: (data: Partial<GrowthAssumptions>) => void;
  loadFromProperty: (property: Property) => void;
  resetToDefaults: () => void;
}

export const useInvestmentStore = create<InvestmentState>()(
  persist(
    (set) => ({
      inputs: DEFAULT_INPUTS,

      setAcquisition: (data) =>
        set((state) => ({
          inputs: {
            ...state.inputs,
            acquisition: { ...state.inputs.acquisition, ...data },
          },
        })),

      setFinancing: (data) =>
        set((state) => ({
          inputs: {
            ...state.inputs,
            financing: { ...state.inputs.financing, ...data },
          },
        })),

      setRental: (data) =>
        set((state) => ({
          inputs: {
            ...state.inputs,
            rental: { ...state.inputs.rental, ...data },
          },
        })),

      setInvestor: (data) =>
        set((state) => ({
          inputs: {
            ...state.inputs,
            investor: { ...state.inputs.investor, ...data },
          },
        })),

      setGrowth: (data) =>
        set((state) => ({
          inputs: {
            ...state.inputs,
            growth: { ...state.inputs.growth, ...data },
          },
        })),

      loadFromProperty: (property) =>
        set((state) => ({
          inputs: {
            ...state.inputs,
            acquisition: {
              ...state.inputs.acquisition,
              purchasePrice: property.propertyValue ?? state.inputs.acquisition.purchasePrice,
            },
            rental: {
              ...state.inputs.rental,
              weeklyRent: property.weeklyRent ?? state.inputs.rental.weeklyRent,
              hasStrata: false,
            },
          },
        })),

      resetToDefaults: () => set({ inputs: DEFAULT_INPUTS }),
    }),
    { name: 'lawn-investment-storage' }
  )
);
