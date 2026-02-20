import { useEffect, useRef, useCallback } from 'react';
import { useMapStore } from '@/stores/mapStore';
import { proxyFetch } from '@/services/nsw/proxyFetch';

interface PointFeatureLayerProps {
  layerId: string;
  featureServerUrl: string;
  colour: string;
  visible: boolean;
  opacity: number;
}

interface ArcGISPoint {
  x: number;
  y: number;
}

interface ArcGISFeature {
  attributes: Record<string, unknown>;
  geometry: ArcGISPoint;
}

interface ArcGISQueryResponse {
  features?: ArcGISFeature[];
}

function toGeoJSON(features: ArcGISFeature[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: features
      .filter((f) => f.geometry?.x != null && f.geometry?.y != null)
      .map((f) => ({
        type: 'Feature' as const,
        properties: f.attributes ?? {},
        geometry: {
          type: 'Point' as const,
          coordinates: [f.geometry.x, f.geometry.y],
        },
      })),
  };
}

/**
 * Renders point features from an ArcGIS FeatureServer as circles on a Mapbox GL map.
 * Fetches features within the current viewport and refetches on map move.
 */
export default function PointFeatureLayer({
  layerId,
  featureServerUrl,
  colour,
  visible,
  opacity,
}: PointFeatureLayerProps) {
  const { map, mapLoaded } = useMapStore();
  const addedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const sourceId = `point-${layerId}`;
  const mapLayerId = `point-layer-${layerId}`;

  const fetchFeatures = useCallback(async () => {
    if (!map || !visible) return;

    const bounds = map.getBounds();
    if (!bounds) return;

    // Cancel previous in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const params = new URLSearchParams({
      where: '1=1',
      outFields: '*',
      geometry: `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`,
      geometryType: 'esriGeometryEnvelope',
      spatialRel: 'esriSpatialRelIntersects',
      inSR: '4326',
      outSR: '4326',
      f: 'json',
      resultRecordCount: '2000',
    });

    const url = `${featureServerUrl}?${params}`;

    try {
      const data = await proxyFetch<ArcGISQueryResponse>(url, { signal: controller.signal });
      if (!data.features || controller.signal.aborted) return;

      const geojson = toGeoJSON(data.features);
      const source = map.getSource(sourceId);

      if (source && 'setData' in source) {
        (source as mapboxgl.GeoJSONSource).setData(geojson);
      } else if (!source) {
        map.addSource(sourceId, { type: 'geojson', data: geojson });

        map.addLayer({
          id: mapLayerId,
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              8, 2,
              12, 4,
              16, 8,
            ],
            'circle-color': colour,
            'circle-opacity': opacity,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-opacity': opacity * 0.8,
          },
        });

        addedRef.current = true;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      console.error(`Failed to fetch point features for ${layerId}:`, err);
    }
  }, [map, visible, featureServerUrl, sourceId, mapLayerId, layerId, colour, opacity]);

  // Setup / teardown based on visibility
  useEffect(() => {
    if (!map || !mapLoaded) return;

    if (visible) {
      fetchFeatures();

      const onMoveEnd = () => fetchFeatures();
      map.on('moveend', onMoveEnd);
      return () => {
        map.off('moveend', onMoveEnd);
      };
    } else if (addedRef.current) {
      try {
        if (map.getLayer(mapLayerId)) map.removeLayer(mapLayerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {
        // Map may be disposed
      }
      addedRef.current = false;
    }
  }, [map, mapLoaded, visible, fetchFeatures, mapLayerId, sourceId]);

  // Update opacity
  useEffect(() => {
    if (!map || !mapLoaded || !addedRef.current) return;
    if (map.getLayer(mapLayerId)) {
      map.setPaintProperty(mapLayerId, 'circle-opacity', opacity);
      map.setPaintProperty(mapLayerId, 'circle-stroke-opacity', opacity * 0.8);
    }
  }, [map, mapLoaded, mapLayerId, opacity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (!map) return;
      try {
        if (map.getLayer(mapLayerId)) map.removeLayer(mapLayerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {
        // Map may be disposed
      }
      addedRef.current = false;
    };
  }, [map, sourceId, mapLayerId]);

  return null;
}
