import { create } from 'zustand';

export interface Property {
  id: string;
  address: string;
  lotDp?: string;
  geometry?: GeoJSON.Geometry;
  propertyValue?: number;
  zone?: string;
  area?: number;
  flood?: boolean;
  bushfire?: boolean;
  heritage?: boolean;
  weeklyRent?: number;
}

interface PropertyState {
  selectedProperty: Property | null;
  shortlistedProperties: Property[];
  comparisonProperties: Property[];
  setSelectedProperty: (property: Property | null) => void;
  addToShortlist: (property: Property) => void;
  removeFromShortlist: (propertyId: string) => void;
  addToComparison: (property: Property) => void;
  removeFromComparison: (propertyId: string) => void;
  clearComparison: () => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  selectedProperty: null,
  shortlistedProperties: [],
  comparisonProperties: [],

  setSelectedProperty: (property) => set({ selectedProperty: property }),

  addToShortlist: (property) =>
    set((state) => ({
      shortlistedProperties: [...state.shortlistedProperties, property],
    })),

  removeFromShortlist: (propertyId) =>
    set((state) => ({
      shortlistedProperties: state.shortlistedProperties.filter((p) => p.id !== propertyId),
    })),

  addToComparison: (property) =>
    set((state) => {
      if (state.comparisonProperties.length >= 5) {
        return state; // Max 5 properties for comparison
      }
      return {
        comparisonProperties: [...state.comparisonProperties, property],
      };
    }),

  removeFromComparison: (propertyId) =>
    set((state) => ({
      comparisonProperties: state.comparisonProperties.filter((p) => p.id !== propertyId),
    })),

  clearComparison: () => set({ comparisonProperties: [] }),
}));
