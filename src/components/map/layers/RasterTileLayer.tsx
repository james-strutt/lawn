import { useEffect, useRef } from 'react';
import { useMapStore } from '@/stores/mapStore';

interface RasterTileLayerProps {
  layerId: string;
  mapserverBase: string;
  serverLayerId: number;
  visible: boolean;
  opacity: number;
}

/**
 * Renders an ArcGIS MapServer layer as raster tiles on a Mapbox GL map.
 * Uses the MapServer /export endpoint to generate tile images.
 */
export default function RasterTileLayer({
  layerId,
  mapserverBase,
  serverLayerId,
  visible,
  opacity,
}: RasterTileLayerProps) {
  const { map, mapLoaded } = useMapStore();
  const addedRef = useRef(false);

  const sourceId = `raster-${layerId}`;
  const mapLayerId = `raster-layer-${layerId}`;

  // Add/remove source and layer
  useEffect(() => {
    if (!map || !mapLoaded) return;

    if (visible && !addedRef.current) {
      const tileUrl =
        `${mapserverBase}/export?` +
        `bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857` +
        `&size=512,512&format=png32&transparent=true&f=image` +
        `&layers=show:${serverLayerId}`;

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'raster',
          tiles: [tileUrl],
          tileSize: 512,
        });
      }

      if (!map.getLayer(mapLayerId)) {
        map.addLayer({
          id: mapLayerId,
          type: 'raster',
          source: sourceId,
          paint: {
            'raster-opacity': opacity,
          },
        });
      }

      addedRef.current = true;
    }

    if (!visible && addedRef.current) {
      try {
        if (map.getLayer(mapLayerId)) map.removeLayer(mapLayerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {
        // Map may be disposed
      }
      addedRef.current = false;
    }
  }, [map, mapLoaded, visible, sourceId, mapLayerId, mapserverBase, serverLayerId, opacity]);

  // Update opacity when it changes
  useEffect(() => {
    if (!map || !mapLoaded || !addedRef.current) return;
    if (map.getLayer(mapLayerId)) {
      map.setPaintProperty(mapLayerId, 'raster-opacity', opacity);
    }
  }, [map, mapLoaded, mapLayerId, opacity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
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
