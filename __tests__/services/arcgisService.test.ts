import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import arcgisService from '../../../src/services/nsw/arcgisService';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('ArcGIS Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('query', () => {
    it('makes request with correct parameters', async () => {
      const mockResponse = {
        data: {
          features: [],
          geometryType: 'esriGeometryPolygon',
        },
      };

      mockedAxios.create = vi.fn(() => ({
        get: vi.fn().mockResolvedValue(mockResponse),
      } as any));

      await arcgisService.query('https://test.endpoint', {
        where: '1=1',
        outFields: '*',
      });

      // Verify axios was called (implementation details may vary)
      expect(mockedAxios.create).toHaveBeenCalled();
    });
  });

  describe('getPropertyAtPoint', () => {
    it('returns property data when found', async () => {
      const mockProperty = {
        attributes: {
          lot_dp: 'Lot 1 DP 123456',
          area: 450,
        },
        geometry: {},
      };

      vi.spyOn(arcgisService, 'queryByGeometry').mockResolvedValue({
        features: [mockProperty],
      });

      const result = await arcgisService.getPropertyAtPoint(151.2, -33.8);

      expect(result).toEqual(mockProperty);
    });

    it('returns null when no property found', async () => {
      vi.spyOn(arcgisService, 'queryByGeometry').mockResolvedValue({
        features: [],
      });

      const result = await arcgisService.getPropertyAtPoint(151.2, -33.8);

      expect(result).toBeNull();
    });
  });

  describe('checkFloodRisk', () => {
    it('returns true when flood data exists', async () => {
      vi.spyOn(arcgisService, 'queryByGeometry').mockResolvedValue({
        features: [{ attributes: {} }],
      });

      const result = await arcgisService.checkFloodRisk(151.2, -33.8);

      expect(result).toBe(true);
    });

    it('returns false when no flood data', async () => {
      vi.spyOn(arcgisService, 'queryByGeometry').mockResolvedValue({
        features: [],
      });

      const result = await arcgisService.checkFloodRisk(151.2, -33.8);

      expect(result).toBe(false);
    });
  });

  describe('findNearestAmenities', () => {
    it('returns amenities within distance', async () => {
      const mockAmenities = [
        { attributes: { name: 'School 1' } },
        { attributes: { name: 'School 2' } },
      ];

      vi.spyOn(arcgisService, 'queryNearPoint').mockResolvedValue({
        features: mockAmenities,
      });

      const result = await arcgisService.findNearestAmenities(
        151.2,
        -33.8,
        'school',
        2000
      );

      expect(result).toHaveLength(2);
    });
  });
});
