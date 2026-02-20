import { create } from 'zustand';

export type SheetState = 'hidden' | 'collapsed' | 'peek' | 'expanded';
export type BottomSheetTab = 'overview' | 'rent-vs-buy' | 'calculators' | 'compare';
export type RentVsBuyMode = 'quick' | 'detailed';

interface BottomSheetState {
  sheetState: SheetState;
  activeTab: BottomSheetTab;
  rentVsBuyMode: RentVsBuyMode;
  openSheet: (tab?: BottomSheetTab) => void;
  closeSheet: () => void;
  setSheetState: (state: SheetState) => void;
  setActiveTab: (tab: BottomSheetTab) => void;
  setRentVsBuyMode: (mode: RentVsBuyMode) => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  sheetState: 'hidden',
  activeTab: 'overview',
  rentVsBuyMode: 'quick',

  openSheet: (tab) =>
    set({
      sheetState: 'peek',
      ...(tab ? { activeTab: tab } : {}),
    }),

  closeSheet: () =>
    set({ sheetState: 'hidden' }),

  setSheetState: (sheetState) =>
    set({ sheetState }),

  setActiveTab: (activeTab) =>
    set({ activeTab }),

  setRentVsBuyMode: (rentVsBuyMode) =>
    set({ rentVsBuyMode }),
}));
