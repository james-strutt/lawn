/**
 * Mapbox Geocoding API Service
 * Handles address search and reverse geocoding
 */

import axios from 'axios';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';
const GEOCODING_API = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

export interface GeocodingResult {
  id: string;
  type: string;
  place_name: string;
  relevance: number;
  center: [number, number]; // [longitude, latitude]
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    accuracy?: string;
  };
  context?: Array<{
    id: string;
    text: string;
  }>;
}

export interface GeocodingResponse {
  type: string;
  query: string[];
  features: GeocodingResult[];
  attribution: string;
}

class MapboxGeocoderService {
  private token: string;

  constructor(token: string = MAPBOX_TOKEN) {
    this.token = token;
  }

  /**
   * Forward geocoding - Convert address to coordinates
   */
  async forwardGeocode(
    query: string,
    options: {
      country?: string;
      proximity?: [number, number];
      types?: string[];
      limit?: number;
      bbox?: [number, number, number, number];
    } = {}
  ): Promise<GeocodingResponse> {
    const {
      country = 'AU',
      proximity,
      types,
      limit = 5,
      bbox,
    } = options;

    const params: Record<string, any> = {
      access_token: this.token,
      country,
      limit,
    };

    if (proximity) {
      params.proximity = proximity.join(',');
    }

    if (types && types.length > 0) {
      params.types = types.join(',');
    }

    if (bbox) {
      params.bbox = bbox.join(',');
    }

    try {
      const response = await axios.get(
        `${GEOCODING_API}/${encodeURIComponent(query)}.json`,
        { params }
      );

      return response.data;
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  /**
   * Reverse geocoding - Convert coordinates to address
   */
  async reverseGeocode(
    longitude: number,
    latitude: number,
    options: {
      types?: string[];
      limit?: number;
    } = {}
  ): Promise<GeocodingResponse> {
    const { types, limit = 1 } = options;

    const params: Record<string, any> = {
      access_token: this.token,
      limit,
    };

    if (types && types.length > 0) {
      params.types = types.join(',');
    }

    try {
      const response = await axios.get(
        `${GEOCODING_API}/${longitude},${latitude}.json`,
        { params }
      );

      return response.data;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  /**
   * Search NSW addresses specifically
   */
  async searchNSWAddress(query: string): Promise<GeocodingResult[]> {
    // Focus on NSW, Australia
    const nswBbox: [number, number, number, number] = [
      140.999, // min longitude
      -37.505, // min latitude
      153.639, // max longitude
      -28.157, // max latitude
    ];

    const response = await this.forwardGeocode(query, {
      country: 'AU',
      bbox: nswBbox,
      types: ['address', 'place'],
      limit: 10,
    });

    return response.features;
  }

  /**
   * Get address from property coordinates
   */
  async getAddressFromCoordinates(
    longitude: number,
    latitude: number
  ): Promise<string> {
    const response = await this.reverseGeocode(longitude, latitude, {
      types: ['address'],
      limit: 1,
    });

    if (response.features.length > 0) {
      return response.features[0].place_name;
    }

    return 'Address not found';
  }

  /**
   * Validate if coordinates are in NSW
   */
  isInNSW(longitude: number, latitude: number): boolean {
    const nswBounds = {
      minLng: 140.999,
      maxLng: 153.639,
      minLat: -37.505,
      maxLat: -28.157,
    };

    return (
      longitude >= nswBounds.minLng &&
      longitude <= nswBounds.maxLng &&
      latitude >= nswBounds.minLat &&
      latitude <= nswBounds.maxLat
    );
  }
}

export const mapboxGeocoder = new MapboxGeocoderService();
export default mapboxGeocoder;
