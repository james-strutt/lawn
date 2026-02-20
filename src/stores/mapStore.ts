import { create } from 'zustand';
import type { Map as MapboxMap } from 'mapbox-gl';

interface MapState {
  map: MapboxMap | null;
  mapLoaded: boolean;
  layerVisibility: Record<string, boolean>;
  layerOpacity: Record<string, number>;
  expandedGroups: Record<string, boolean>;

  setMap: (map: MapboxMap | null) => void;
  setMapLoaded: (loaded: boolean) => void;
  toggleLayer: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  toggleGroup: (groupId: string) => void;
  isLayerVisible: (layerId: string) => boolean;
  getLayerOpacity: (layerId: string) => number;
  isGroupExpanded: (groupId: string) => boolean;
}

export const useMapStore = create<MapState>((set, get) => ({
  map: null,
  mapLoaded: false,
  layerVisibility: {},
  layerOpacity: {},
  expandedGroups: {},

  setMap: (map) => set({ map }),
  setMapLoaded: (loaded) => set({ mapLoaded: loaded }),

  toggleLayer: (layerId) =>
    set((state) => ({
      layerVisibility: {
        ...state.layerVisibility,
        [layerId]: !state.layerVisibility[layerId],
      },
    })),

  setLayerOpacity: (layerId, opacity) =>
    set((state) => ({
      layerOpacity: {
        ...state.layerOpacity,
        [layerId]: opacity,
      },
    })),

  toggleGroup: (groupId) =>
    set((state) => ({
      expandedGroups: {
        ...state.expandedGroups,
        [groupId]: !state.expandedGroups[groupId],
      },
    })),

  isLayerVisible: (layerId) => !!get().layerVisibility[layerId],
  getLayerOpacity: (layerId) => get().layerOpacity[layerId] ?? 1.0,
  isGroupExpanded: (groupId) => !!get().expandedGroups[groupId],
}));
