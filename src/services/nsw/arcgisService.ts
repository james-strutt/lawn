import { NSW_API_ENDPOINTS } from '@/constants/apiEndpoints';
import { proxyFetch } from './proxyFetch';

/**
 * ArcGIS REST API Service
 * Handles queries to NSW government ArcGIS endpoints via CORS proxy
 */

export interface ArcGISQueryParams {
  where?: string;
  geometry?: string;
  geometryType?: 'esriGeometryPoint' | 'esriGeometryPolygon' | 'esriGeometryEnvelope';
  spatialRel?: 'esriSpatialRelIntersects' | 'esriSpatialRelContains' | 'esriSpatialRelWithin';
  outFields?: string;
  returnGeometry?: boolean;
  outSR?: number;
  f?: 'json' | 'geojson';
  resultRecordCount?: number;
  distance?: number;
  units?: string;
}

export interface ArcGISFeature {
  attributes: Record<string, any>;
  geometry?: any;
}

export interface ArcGISQueryResponse {
  features: ArcGISFeature[];
  geometryType?: string;
  spatialReference?: any;
}

class ArcGISService {
  /**
   * Query an ArcGIS FeatureServer or MapServer
   */
  async query(
    endpoint: string,
    params: ArcGISQueryParams = {}
  ): Promise<ArcGISQueryResponse> {
    const defaultParams: Record<string, string> = {
      where: '1=1',
      outFields: '*',
      returnGeometry: 'true',
      outSR: '4326',
      f: 'json',
    };

    // Merge user params, converting all values to strings
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        defaultParams[key] = String(value);
      }
    }

    const queryEndpoint = endpoint.includes('/query')
      ? endpoint
      : `${endpoint}/query`;

    const queryString = new URLSearchParams(defaultParams).toString();
    const url = `${queryEndpoint}?${queryString}`;

    try {
      const data = await proxyFetch<ArcGISQueryResponse>(url);
      // Ensure features array exists even if response lacks it
      if (!data?.features) {
        return { features: [] };
      }
      return data;
    } catch (error) {
      console.error('ArcGIS query error:', error);
      return { features: [] };
    }
  }

  /**
   * Query features by geometry (point, polygon)
   */
  async queryByGeometry(
    endpoint: string,
    geometry: any,
    geometryType: ArcGISQueryParams['geometryType'] = 'esriGeometryPoint',
    additionalParams: Partial<ArcGISQueryParams> = {}
  ): Promise<ArcGISQueryResponse> {
    return this.query(endpoint, {
      geometry: JSON.stringify(geometry),
      geometryType,
      spatialRel: 'esriSpatialRelIntersects',
      ...additionalParams,
    });
  }

  /**
   * Query features by bounding box
   */
  async queryByExtent(
    endpoint: string,
    xmin: number,
    ymin: number,
    xmax: number,
    ymax: number,
    additionalParams: Partial<ArcGISQueryParams> = {}
  ): Promise<ArcGISQueryResponse> {
    const envelope = {
      xmin,
      ymin,
      xmax,
      ymax,
      spatialReference: { wkid: 4326 },
    };

    return this.queryByGeometry(
      endpoint,
      envelope,
      'esriGeometryEnvelope',
      additionalParams
    );
  }

  /**
   * Query features within distance of a point
   */
  async queryNearPoint(
    endpoint: string,
    longitude: number,
    latitude: number,
    distanceMeters: number,
    additionalParams: Partial<ArcGISQueryParams> = {}
  ): Promise<ArcGISQueryResponse> {
    const point = {
      x: longitude,
      y: latitude,
      spatialReference: { wkid: 4326 },
    };

    return this.query(endpoint, {
      geometry: JSON.stringify(point),
      geometryType: 'esriGeometryPoint',
      spatialRel: 'esriSpatialRelIntersects',
      distance: distanceMeters,
      units: 'esriSRUnit_Meter',
      ...additionalParams,
    });
  }

  /**
   * Get property data by coordinates
   */
  async getPropertyAtPoint(
    longitude: number,
    latitude: number
  ): Promise<ArcGISFeature | null> {
    const response = await this.queryByGeometry(
      NSW_API_ENDPOINTS.CADASTRE_LOT,
      { x: longitude, y: latitude, spatialReference: { wkid: 4326 } },
      'esriGeometryPoint'
    );

    return response.features.length > 0 ? response.features[0] : null;
  }

  /**
   * Get zoning for a property
   */
  async getZoning(
    longitude: number,
    latitude: number
  ): Promise<ArcGISFeature | null> {
    const response = await this.queryByGeometry(
      NSW_API_ENDPOINTS.LAND_ZONE,
      { x: longitude, y: latitude, spatialReference: { wkid: 4326 } },
      'esriGeometryPoint'
    );

    return response.features.length > 0 ? response.features[0] : null;
  }

  /**
   * Check flood risk
   */
  async checkFloodRisk(
    longitude: number,
    latitude: number
  ): Promise<boolean> {
    const response = await this.queryByGeometry(
      NSW_API_ENDPOINTS.FLOOD_EXTENTS,
      { x: longitude, y: latitude, spatialReference: { wkid: 4326 } },
      'esriGeometryPoint'
    );

    return response.features.length > 0;
  }

  /**
   * Check bushfire prone land
   */
  async checkBushfireRisk(
    longitude: number,
    latitude: number
  ): Promise<boolean> {
    const response = await this.queryByGeometry(
      NSW_API_ENDPOINTS.BUSHFIRE,
      { x: longitude, y: latitude, spatialReference: { wkid: 4326 } },
      'esriGeometryPoint'
    );

    return response.features.length > 0;
  }

  /**
   * Check heritage items
   */
  async checkHeritage(
    longitude: number,
    latitude: number
  ): Promise<ArcGISFeature | null> {
    const response = await this.queryByGeometry(
      NSW_API_ENDPOINTS.HERITAGE,
      { x: longitude, y: latitude, spatialReference: { wkid: 4326 } },
      'esriGeometryPoint'
    );

    return response.features.length > 0 ? response.features[0] : null;
  }

  /**
   * Find nearest amenities
   */
  async findNearestAmenities(
    longitude: number,
    latitude: number,
    amenityType: 'train' | 'school' | 'hospital' | 'park',
    maxDistance: number = 2000 // meters
  ): Promise<ArcGISFeature[]> {
    const endpointMap = {
      train: NSW_API_ENDPOINTS.TRAIN_STATIONS,
      school: NSW_API_ENDPOINTS.PRIMARY_SCHOOL,
      hospital: NSW_API_ENDPOINTS.HOSPITAL,
      park: NSW_API_ENDPOINTS.PARK,
    };

    const response = await this.queryNearPoint(
      endpointMap[amenityType],
      longitude,
      latitude,
      maxDistance
    );

    return response.features;
  }
}

export const arcgisService = new ArcGISService();
export default arcgisService;
