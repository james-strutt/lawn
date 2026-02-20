/**
 * NSW Government API Service Endpoints
 * Sourced from NSW Spatial Services, Planning Portal, Transport NSW
 */

export const NSW_API_ENDPOINTS = {
  // Administrative Boundaries
  SUBURBS: 'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Administrative_Boundaries/MapServer/0',
  LGA: 'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Administrative_Boundaries/MapServer/1',

  // Property & Cadastre
  PROPERTY: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Land_Parcel_Property_Theme/FeatureServer/12',
  CADASTRE_LOT: 'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Cadastre/MapServer/9',
  LOT: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Land_Parcel_Property_Theme/FeatureServer/8',

  // Property Sales
  PROPERTY_SALES: 'https://maps.six.nsw.gov.au/arcgis/rest/services/public/Valuation/MapServer',

  // Planning Portal
  PLANNING_PORTAL_BASE: 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/ePlanning/Planning_Portal_Principal_Planning/MapServer',
  PLANNING_EPI_PRIMARY_BASE: 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/Planning/EPI_Primary_Planning_Layers/MapServer',
  PROTECTION_BASE: 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/Planning/Protection/MapServer',
  LAND_ZONE: 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/ePlanning/Planning_Portal_Principal_Planning/MapServer/19',
  FSR: 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/ePlanning/Planning_Portal_Principal_Planning/MapServer/11',
  HOB: 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/ePlanning/Planning_Portal_Principal_Planning/MapServer/14',
  LAND_RESERVATION: 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/ePlanning/Planning_Portal_Principal_Planning/MapServer/24',

  // Hazards
  FLOOD_EXTENTS: 'https://portal.data.nsw.gov.au/arcgis/rest/services/Hosted/nsw_1aep_flood_extents/FeatureServer/0',
  BUSHFIRE: 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/ePlanning/Planning_Portal_Hazard/MapServer/229',
  BUSHFIRE_BASE: 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/ePlanning/Planning_Portal_Hazard/MapServer',
  HERITAGE: 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/Planning/EPI_Primary_Planning_Layers/MapServer/0',
  CONTAMINATION: 'https://mapprod2.environment.nsw.gov.au/arcgis/rest/services/EPA/Contaminated_land_notified_sites/MapServer',
  BIODIVERSITY_VALUES_BASE: 'https://www.lmbc.nsw.gov.au/arcgis/rest/services/BV/BiodiversityValues/MapServer',
  TEC: 'https://mapprod1.environment.nsw.gov.au/arcgis/rest/services/EDP/TECs_GreaterSydney/MapServer',

  // Property & Cadastre (MapServer base for raster tiles)
  CADASTRE_BASE: 'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Cadastre/MapServer',

  // Infrastructure
  POWER_LINES: 'https://services.ga.gov.au/gis/rest/services/National_Electricity_Infrastructure/MapServer',
  EASEMENTS: 'https://mapuat3.environment.nsw.gov.au/arcgis/rest/services/Common/Admin_3857/MapServer',
  ROAD_SEGMENT: 'https://portal.data.nsw.gov.au/arcgis/rest/services/RoadSegment/MapServer',

  // Amenities (non-query endpoints)
  TRAIN_STATIONS: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Transport_Facilities/FeatureServer/1',
  LIGHT_RAIL: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Transport_Facilities/FeatureServer/3',
  FERRY_WHARF: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Transport_Facilities/FeatureServer/4',
  PRIMARY_SCHOOL: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Education_Facilities/FeatureServer/0',
  HIGH_SCHOOL: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Education_Facilities/FeatureServer/2',
  HOSPITAL: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Health_Facilities/FeatureServer/1',
  PARK: 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/ePlanning/Planning_Portal_Public_Spaces/MapServer/260',
  SHOPPING_CENTRE: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Retail_Services/FeatureServer/0',

  // Amenities (query endpoints for point feature layers)
  AMENITY_TRAIN_STATION: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Transport_Facilities/FeatureServer/1/query',
  AMENITY_LIGHT_RAIL: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Transport_Facilities/FeatureServer/3/query',
  AMENITY_FERRY_WHARF: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Transport_Facilities/FeatureServer/4/query',
  AMENITY_PRIMARY_SCHOOL: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Education_Facilities/FeatureServer/0/query',
  AMENITY_HIGH_SCHOOL: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Education_Facilities/FeatureServer/2/query',
  AMENITY_UNIVERSITY: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Education_Facilities/FeatureServer/5/query',
  AMENITY_TAFE: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Education_Facilities/FeatureServer/4/query',
  AMENITY_HOSPITAL: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Health_Facilities/FeatureServer/1/query',
  AMENITY_AMBULANCE_STATION: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Health_Facilities/FeatureServer/0/query',
  AMENITY_POLICE_STATION: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Emergency_Service_Facilities/FeatureServer/1/query',
  AMENITY_FIRE_STATION: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Emergency_Service_Facilities/FeatureServer/0/query',
  AMENITY_PARK: 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/ePlanning/Planning_Portal_Public_Spaces/MapServer/260/query',
  AMENITY_SHOPPING_CENTRE: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_FOI_Retail_Services/FeatureServer/0/query',

  // Address Geocoding
  NSW_GEOCODED_ADDRESSING: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Geocoded_Addressing_Theme/FeatureServer/1',
  ADDRESS_POINTS: 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/Common/AddressSearch/MapServer/5',

  // Transport
  TRANSPORT_NSW_TRIP_PLANNER: 'https://api.transport.nsw.gov.au/v1/tp',

  // Development Applications
  DA_API: 'https://api.apps1.nsw.gov.au/eplanning/data/v0/OnlineDA',

  // NSW Planning API (address/lot search, boundaries)
  NSW_PLANNING_API_BASE: 'https://api.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi',

  // Proxy (for CORS)
  PROXY: 'https://proxy-server.jameswilliamstrutt.workers.dev',
} as const;

export type NSWAPIEndpoint = typeof NSW_API_ENDPOINTS[keyof typeof NSW_API_ENDPOINTS];
