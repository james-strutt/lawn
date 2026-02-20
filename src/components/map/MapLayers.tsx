import { MAP_LAYER_GROUPS } from '@/constants/mapLayers';
import { useMapStore } from '@/stores/mapStore';
import RasterTileLayer from './layers/RasterTileLayer';
import PointFeatureLayer from './layers/PointFeatureLayer';
import SelectedPropertyLayer from './layers/SelectedPropertyLayer';

/**
 * MapLayers Component
 * Orchestrates all map layers based on layer configuration and store state.
 */
export default function MapLayers() {
  const { layerVisibility, layerOpacity } = useMapStore();

  return (
    <>
      {MAP_LAYER_GROUPS.map((group) =>
        group.layers.map((layer) => {
          const visible = !!layerVisibility[layer.id];
          const opacity = layerOpacity[layer.id] ?? 1.0;

          if (layer.type === 'raster') {
            return (
              <RasterTileLayer
                key={layer.id}
                layerId={layer.id}
                mapserverBase={layer.mapserverBase}
                serverLayerId={layer.layerId}
                visible={visible}
                opacity={opacity}
              />
            );
          }

          return (
            <PointFeatureLayer
              key={layer.id}
              layerId={layer.id}
              featureServerUrl={layer.featureServerUrl}
              colour={layer.colour}
              visible={visible}
              opacity={opacity}
            />
          );
        })
      )}
      <SelectedPropertyLayer />
    </>
  );
}
