import { NSW_API_ENDPOINTS } from './apiEndpoints';

export type MapLayerType = 'raster' | 'point';

export interface RasterLayerConfig {
  id: string;
  name: string;
  type: 'raster';
  mapserverBase: string;
  layerId: number;
}

export interface PointLayerConfig {
  id: string;
  name: string;
  type: 'point';
  featureServerUrl: string;
  colour: string;
}

export type MapLayerConfig = RasterLayerConfig | PointLayerConfig;

export interface MapLayerGroup {
  id: string;
  name: string;
  layers: MapLayerConfig[];
}

export const MAP_LAYER_GROUPS: MapLayerGroup[] = [
  {
    id: 'planning',
    name: 'Planning',
    layers: [
      {
        id: 'land-zoning',
        name: 'Land Zoning',
        type: 'raster',
        mapserverBase: NSW_API_ENDPOINTS.PLANNING_PORTAL_BASE,
        layerId: 19,
      },
      {
        id: 'floor-space-ratio',
        name: 'Floor Space Ratio',
        type: 'raster',
        mapserverBase: NSW_API_ENDPOINTS.PLANNING_PORTAL_BASE,
        layerId: 11,
      },
      {
        id: 'height-of-buildings',
        name: 'Height of Buildings',
        type: 'raster',
        mapserverBase: NSW_API_ENDPOINTS.PLANNING_PORTAL_BASE,
        layerId: 14,
      },
      {
        id: 'land-reservation',
        name: 'Land Reservation',
        type: 'raster',
        mapserverBase: NSW_API_ENDPOINTS.PLANNING_PORTAL_BASE,
        layerId: 24,
      },
      {
        id: 'heritage-items',
        name: 'Heritage Items',
        type: 'raster',
        mapserverBase: NSW_API_ENDPOINTS.PLANNING_EPI_PRIMARY_BASE,
        layerId: 0,
      },
    ],
  },
  {
    id: 'hazards',
    name: 'Hazards',
    layers: [
      {
        id: 'bushfire-prone-land',
        name: 'Bushfire Prone Land',
        type: 'raster',
        mapserverBase: NSW_API_ENDPOINTS.BUSHFIRE_BASE,
        layerId: 229,
      },
      {
        id: 'contaminated-land',
        name: 'Contaminated Land',
        type: 'raster',
        mapserverBase: NSW_API_ENDPOINTS.CONTAMINATION,
        layerId: 0,
      },
      {
        id: 'acid-sulfate-soils',
        name: 'Acid Sulfate Soils',
        type: 'raster',
        mapserverBase: NSW_API_ENDPOINTS.PROTECTION_BASE,
        layerId: 1,
      },
      {
        id: 'biodiversity-values',
        name: 'Biodiversity Values',
        type: 'raster',
        mapserverBase: NSW_API_ENDPOINTS.BIODIVERSITY_VALUES_BASE,
        layerId: 0,
      },
      {
        id: 'threatened-ecology',
        name: 'Threatened Ecology',
        type: 'raster',
        mapserverBase: NSW_API_ENDPOINTS.TEC,
        layerId: 0,
      },
    ],
  },
  {
    id: 'property',
    name: 'Property',
    layers: [
      {
        id: 'property-boundaries',
        name: 'Property Boundaries',
        type: 'raster',
        mapserverBase: NSW_API_ENDPOINTS.CADASTRE_BASE,
        layerId: 9,
      },
      {
        id: 'property-sales',
        name: 'Property Sales',
        type: 'raster',
        mapserverBase: NSW_API_ENDPOINTS.PROPERTY_SALES,
        layerId: 0,
      },
    ],
  },
  {
    id: 'transport',
    name: 'Transport',
    layers: [
      {
        id: 'train-stations',
        name: 'Train Stations',
        type: 'point',
        featureServerUrl: NSW_API_ENDPOINTS.AMENITY_TRAIN_STATION,
        colour: '#F59E0B',
      },
      {
        id: 'light-rail',
        name: 'Light Rail',
        type: 'point',
        featureServerUrl: NSW_API_ENDPOINTS.AMENITY_LIGHT_RAIL,
        colour: '#8B5CF6',
      },
      {
        id: 'ferry-wharves',
        name: 'Ferry Wharves',
        type: 'point',
        featureServerUrl: NSW_API_ENDPOINTS.AMENITY_FERRY_WHARF,
        colour: '#3B82F6',
      },
    ],
  },
  {
    id: 'education',
    name: 'Education',
    layers: [
      {
        id: 'primary-schools',
        name: 'Primary Schools',
        type: 'point',
        featureServerUrl: NSW_API_ENDPOINTS.AMENITY_PRIMARY_SCHOOL,
        colour: '#10B981',
      },
      {
        id: 'high-schools',
        name: 'High Schools',
        type: 'point',
        featureServerUrl: NSW_API_ENDPOINTS.AMENITY_HIGH_SCHOOL,
        colour: '#059669',
      },
      {
        id: 'universities',
        name: 'Universities',
        type: 'point',
        featureServerUrl: NSW_API_ENDPOINTS.AMENITY_UNIVERSITY,
        colour: '#6366F1',
      },
      {
        id: 'tafe',
        name: 'TAFE',
        type: 'point',
        featureServerUrl: NSW_API_ENDPOINTS.AMENITY_TAFE,
        colour: '#8B5CF6',
      },
    ],
  },
  {
    id: 'health-emergency',
    name: 'Health & Emergency',
    layers: [
      {
        id: 'hospitals',
        name: 'Hospitals',
        type: 'point',
        featureServerUrl: NSW_API_ENDPOINTS.AMENITY_HOSPITAL,
        colour: '#EF4444',
      },
      {
        id: 'police-stations',
        name: 'Police Stations',
        type: 'point',
        featureServerUrl: NSW_API_ENDPOINTS.AMENITY_POLICE_STATION,
        colour: '#3B82F6',
      },
      {
        id: 'fire-stations',
        name: 'Fire Stations',
        type: 'point',
        featureServerUrl: NSW_API_ENDPOINTS.AMENITY_FIRE_STATION,
        colour: '#F97316',
      },
      {
        id: 'ambulance-stations',
        name: 'Ambulance Stations',
        type: 'point',
        featureServerUrl: NSW_API_ENDPOINTS.AMENITY_AMBULANCE_STATION,
        colour: '#FBBF24',
      },
    ],
  },
  {
    id: 'amenities',
    name: 'Amenities',
    layers: [
      {
        id: 'parks',
        name: 'Parks',
        type: 'point',
        featureServerUrl: NSW_API_ENDPOINTS.AMENITY_PARK,
        colour: '#22C55E',
      },
      {
        id: 'shopping-centres',
        name: 'Shopping Centres',
        type: 'point',
        featureServerUrl: NSW_API_ENDPOINTS.AMENITY_SHOPPING_CENTRE,
        colour: '#EC4899',
      },
    ],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    layers: [
      {
        id: 'power-lines',
        name: 'Power Lines',
        type: 'raster',
        mapserverBase: NSW_API_ENDPOINTS.POWER_LINES,
        layerId: 0,
      },
      {
        id: 'easements',
        name: 'Easements',
        type: 'raster',
        mapserverBase: NSW_API_ENDPOINTS.EASEMENTS,
        layerId: 0,
      },
      {
        id: 'roads',
        name: 'Roads',
        type: 'raster',
        mapserverBase: NSW_API_ENDPOINTS.ROAD_SEGMENT,
        layerId: 0,
      },
    ],
  },
];

/** Flat lookup of all layer configs by ID */
export const MAP_LAYERS_BY_ID: Record<string, MapLayerConfig> =
  MAP_LAYER_GROUPS.reduce(
    (acc, group) => {
      for (const layer of group.layers) {
        acc[layer.id] = layer;
      }
      return acc;
    },
    {} as Record<string, MapLayerConfig>,
  );
