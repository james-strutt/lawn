import { describe, it, expect, beforeEach } from 'vitest';
import { useMapStore } from '../../src/stores/mapStore';

describe('Map Store', () => {
  beforeEach(() => {
    useMapStore.setState({
      map: null,
      mapLoaded: false,
      layers: useMapStore.getState().layers,
    });
  });

  describe('setMapLoaded', () => {
    it('sets map loaded state', () => {
      useMapStore.getState().setMapLoaded(true);
      expect(useMapStore.getState().mapLoaded).toBe(true);
    });
  });

  describe('layer visibility', () => {
    it('toggles layer visibility', () => {
      const initialVisibility = useMapStore.getState().layers[1].visible;
      useMapStore.getState().toggleLayer('zoning');

      expect(useMapStore.getState().layers[1].visible).toBe(!initialVisibility);
    });

    it('sets specific layer visibility', () => {
      useMapStore.getState().setLayerVisibility('flood', true);

      const floodLayer = useMapStore.getState().layers.find(l => l.id === 'flood');
      expect(floodLayer?.visible).toBe(true);
    });

    it('toggles layer multiple times', () => {
      useMapStore.getState().toggleLayer('bushfire');
      useMapStore.getState().toggleLayer('bushfire');
      useMapStore.getState().toggleLayer('bushfire');

      const bushfireLayer = useMapStore.getState().layers.find(l => l.id === 'bushfire');
      // Should be opposite of initial state after odd number of toggles
      expect(bushfireLayer?.visible).toBe(true);
    });
  });

  describe('layer management', () => {
    it('has all default layers', () => {
      const layers = useMapStore.getState().layers;

      expect(layers).toHaveLength(7);
      expect(layers.map(l => l.id)).toContain('cadastral');
      expect(layers.map(l => l.id)).toContain('zoning');
      expect(layers.map(l => l.id)).toContain('flood');
      expect(layers.map(l => l.id)).toContain('bushfire');
    });

    it('cadastral layer is visible by default', () => {
      const cadastralLayer = useMapStore.getState().layers.find(l => l.id === 'cadastral');
      expect(cadastralLayer?.visible).toBe(true);
    });

    it('other layers are hidden by default', () => {
      const zoningLayer = useMapStore.getState().layers.find(l => l.id === 'zoning');
      const floodLayer = useMapStore.getState().layers.find(l => l.id === 'flood');

      expect(zoningLayer?.visible).toBe(false);
      expect(floodLayer?.visible).toBe(false);
    });
  });
});
