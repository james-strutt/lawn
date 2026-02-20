/**
 * ArcGIS FeatureServer Response Types
 */

export interface ArcgisFeature {
  type: 'Feature';
  geometry: GeoJSON.Geometry;
  properties: Record<string, any>;
}

export interface ArcgisFeatureResponse {
  type: 'FeatureCollection';
  features: ArcgisFeature[];
}

export interface ArcgisError {
  error: {
    code: number;
    message: string;
    details?: string[];
  };
}
