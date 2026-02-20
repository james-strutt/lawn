import { describe, it, expect, beforeEach } from 'vitest';
import { usePropertyStore } from '../../src/stores/propertyStore';

describe('Property Store', () => {
  beforeEach(() => {
    // Reset store before each test
    usePropertyStore.setState({
      selectedProperty: null,
      shortlistedProperties: [],
      comparisonProperties: [],
    });
  });

  describe('setSelectedProperty', () => {
    it('sets the selected property', () => {
      const property = {
        id: '1',
        address: '123 Test St',
        zone: 'R2',
      };

      usePropertyStore.getState().setSelectedProperty(property);

      expect(usePropertyStore.getState().selectedProperty).toEqual(property);
    });

    it('clears the selected property when set to null', () => {
      const property = {
        id: '1',
        address: '123 Test St',
      };

      usePropertyStore.getState().setSelectedProperty(property);
      usePropertyStore.getState().setSelectedProperty(null);

      expect(usePropertyStore.getState().selectedProperty).toBeNull();
    });
  });

  describe('shortlist management', () => {
    it('adds property to shortlist', () => {
      const property = {
        id: '1',
        address: '123 Test St',
      };

      usePropertyStore.getState().addToShortlist(property);

      expect(usePropertyStore.getState().shortlistedProperties).toHaveLength(1);
      expect(usePropertyStore.getState().shortlistedProperties[0]).toEqual(property);
    });

    it('removes property from shortlist', () => {
      const property = {
        id: '1',
        address: '123 Test St',
      };

      usePropertyStore.getState().addToShortlist(property);
      usePropertyStore.getState().removeFromShortlist('1');

      expect(usePropertyStore.getState().shortlistedProperties).toHaveLength(0);
    });

    it('adds multiple properties to shortlist', () => {
      const property1 = { id: '1', address: '123 Test St' };
      const property2 = { id: '2', address: '456 Test Ave' };

      usePropertyStore.getState().addToShortlist(property1);
      usePropertyStore.getState().addToShortlist(property2);

      expect(usePropertyStore.getState().shortlistedProperties).toHaveLength(2);
    });
  });

  describe('comparison management', () => {
    it('adds property to comparison', () => {
      const property = {
        id: '1',
        address: '123 Test St',
      };

      usePropertyStore.getState().addToComparison(property);

      expect(usePropertyStore.getState().comparisonProperties).toHaveLength(1);
    });

    it('limits comparison to 5 properties', () => {
      for (let i = 1; i <= 6; i++) {
        usePropertyStore.getState().addToComparison({
          id: `${i}`,
          address: `${i} Test St`,
        });
      }

      expect(usePropertyStore.getState().comparisonProperties).toHaveLength(5);
    });

    it('removes property from comparison', () => {
      const property = {
        id: '1',
        address: '123 Test St',
      };

      usePropertyStore.getState().addToComparison(property);
      usePropertyStore.getState().removeFromComparison('1');

      expect(usePropertyStore.getState().comparisonProperties).toHaveLength(0);
    });

    it('clears all comparison properties', () => {
      usePropertyStore.getState().addToComparison({ id: '1', address: '123 Test St' });
      usePropertyStore.getState().addToComparison({ id: '2', address: '456 Test Ave' });
      usePropertyStore.getState().clearComparison();

      expect(usePropertyStore.getState().comparisonProperties).toHaveLength(0);
    });
  });
});
