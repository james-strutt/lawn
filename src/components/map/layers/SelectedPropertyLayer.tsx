import { useEffect, useRef } from 'react';
import { useMapStore } from '@/stores/mapStore';
import { usePropertyStore } from '@/stores/propertyStore';

const SOURCE_ID = 'selected-property-source';
const FILL_LAYER_ID = 'selected-property-fill';
const LINE_LAYER_ID = 'selected-property-line';

/**
 * Convert Web Mercator (EPSG:3857) coordinates to WGS84 (EPSG:4326)
 */
function mercatorToWgs84(x: number, y: number): [number, number] {
  const lon = (x * 180) / 20037508.34;
  const lat = (Math.atan(Math.exp((y * Math.PI) / 20037508.34)) * 360) / Math.PI - 90;
  return [lon, lat];
}

/**
 * Convert an ArcGIS-style geometry (with rings) to a GeoJSON Polygon,
 * handling coordinate system conversion if needed.
 */
function toGeoJSON(geometry: any): GeoJSON.Feature | null {
  // Already GeoJSON
  if (geometry?.type === 'Polygon' || geometry?.type === 'MultiPolygon') {
    return { type: 'Feature', properties: {}, geometry };
  }

  // ArcGIS rings format
  if (geometry?.rings) {
    const isMercator =
      geometry.spatialReference?.wkid === 3857 ||
      geometry.spatialReference?.wkid === 102100 ||
      (geometry.rings[0]?.[0] && Math.abs(geometry.rings[0][0][0]) > 180);

    const coordinates = geometry.rings.map((ring: number[][]) =>
      ring.map((point: number[]) =>
        isMercator ? mercatorToWgs84(point[0], point[1]) : [point[0], point[1]]
      )
    );

    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates,
      },
    };
  }

  return null;
}

/**
 * Compute bounding box from GeoJSON coordinates.
 * Returns [west, south, east, north].
 */
function getBounds(feature: GeoJSON.Feature): [number, number, number, number] | null {
  const geom = feature.geometry;
  let coords: number[][] = [];

  if (geom.type === 'Polygon') {
    coords = geom.coordinates.flat();
  } else if (geom.type === 'MultiPolygon') {
    coords = geom.coordinates.flat(2);
  } else {
    return null;
  }

  if (coords.length === 0) return null;

  let west = Infinity, south = Infinity, east = -Infinity, north = -Infinity;
  for (const [lon, lat] of coords) {
    if (lon < west) west = lon;
    if (lon > east) east = lon;
    if (lat < south) south = lat;
    if (lat > north) north = lat;
  }

  return [west, south, east, north];
}

export default function SelectedPropertyLayer() {
  const { map, mapLoaded } = useMapStore();
  const { selectedProperty } = usePropertyStore();
  const prevPropertyId = useRef<string | null>(null);

  useEffect(() => {
    if (!map || !mapLoaded) return;

    // Clean up previous layers/source
    const cleanup = () => {
      try {
        if (map.getLayer(FILL_LAYER_ID)) map.removeLayer(FILL_LAYER_ID);
        if (map.getLayer(LINE_LAYER_ID)) map.removeLayer(LINE_LAYER_ID);
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      } catch {
        // Map may be disposed
      }
    };

    if (!selectedProperty?.geometry) {
      cleanup();
      prevPropertyId.current = null;
      return;
    }

    // Skip if same property already shown
    if (selectedProperty.id === prevPropertyId.current) return;
    prevPropertyId.current = selectedProperty.id;

    const feature = toGeoJSON(selectedProperty.geometry);
    if (!feature) {
      console.warn('Could not convert property geometry to GeoJSON');
      return;
    }

    // Remove old layers first
    cleanup();

    // Add source
    map.addSource(SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [feature],
      },
    });

    // Red fill with low opacity
    map.addLayer({
      id: FILL_LAYER_ID,
      type: 'fill',
      source: SOURCE_ID,
      paint: {
        'fill-color': '#ef4444',
        'fill-opacity': 0.15,
      },
    });

    // Red boundary outline
    map.addLayer({
      id: LINE_LAYER_ID,
      type: 'line',
      source: SOURCE_ID,
      paint: {
        'line-color': '#ef4444',
        'line-width': 3,
        'line-opacity': 0.9,
      },
    });

    // Zoom to fit
    const bounds = getBounds(feature);
    if (bounds) {
      map.fitBounds(bounds as [number, number, number, number], {
        padding: 100,
        maxZoom: 18,
        duration: 1000,
      });
    }
  }, [map, mapLoaded, selectedProperty]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (!map) return;
      try {
        if (map.getLayer(FILL_LAYER_ID)) map.removeLayer(FILL_LAYER_ID);
        if (map.getLayer(LINE_LAYER_ID)) map.removeLayer(LINE_LAYER_ID);
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      } catch {
        // ignore
      }
    };
  }, [map]);

  return null;
}
