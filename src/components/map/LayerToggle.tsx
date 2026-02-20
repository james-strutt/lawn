import { useState } from 'react';
import { useMapStore } from '@/stores/mapStore';
import { MAP_LAYER_GROUPS } from '@/constants/mapLayers';
import type { MapLayerConfig, PointLayerConfig } from '@/constants/mapLayers';
import { Layers, ChevronDown, ChevronRight } from 'lucide-react';

function isPointLayer(layer: MapLayerConfig): layer is PointLayerConfig {
  return layer.type === 'point';
}

export default function LayerToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    layerVisibility,
    layerOpacity,
    expandedGroups,
    toggleLayer,
    setLayerOpacity,
    toggleGroup,
  } = useMapStore();

  const totalActive = Object.values(layerVisibility).filter(Boolean).length;

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border-brutal border-black shadow-brutal px-4 py-3 font-mono text-sm font-bold uppercase hover:bg-surface-secondary transition-colors flex items-center gap-2"
      >
        <Layers size={16} />
        Layers
        {totalActive > 0 && (
          <span className="bg-black text-white text-xs px-1.5 py-0.5 font-mono">
            {totalActive}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border-brutal border-black shadow-brutal-lg z-50">
          {/* Header */}
          <div className="bg-black text-white px-4 py-3 font-mono text-xs font-bold uppercase flex items-center justify-between">
            <span>Map Layers</span>
            {totalActive > 0 && (
              <span className="bg-white text-black text-xs px-1.5 py-0.5 font-mono">
                {totalActive} active
              </span>
            )}
          </div>

          {/* Scrollable Layer Groups */}
          <div className="max-h-[60vh] overflow-y-auto">
            {MAP_LAYER_GROUPS.map((group) => {
              const isExpanded = !!expandedGroups[group.id];
              const activeCount = group.layers.filter(
                (l) => !!layerVisibility[l.id]
              ).length;

              return (
                <div key={group.id} className="border-b border-gray-200 last:border-b-0">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown size={14} className="text-gray-500" />
                      ) : (
                        <ChevronRight size={14} className="text-gray-500" />
                      )}
                      <span className="font-mono text-xs font-bold uppercase">
                        {group.name}
                      </span>
                    </div>
                    {activeCount > 0 && (
                      <span className="bg-brand-accent text-black text-xs px-1.5 py-0.5 font-mono font-bold">
                        {activeCount}
                      </span>
                    )}
                  </button>

                  {/* Expanded Layer List */}
                  {isExpanded && (
                    <div className="pb-2">
                      {group.layers.map((layer) => {
                        const isVisible = !!layerVisibility[layer.id];
                        const currentOpacity = layerOpacity[layer.id] ?? 1.0;

                        return (
                          <div key={layer.id} className="px-4 py-1.5">
                            {/* Layer Row */}
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isVisible}
                                onChange={() => toggleLayer(layer.id)}
                                className="w-4 h-4 border-brutal border-black bg-white cursor-pointer checked:bg-brand-accent checked:border-brand-accent focus:outline-none focus:ring-0 flex-shrink-0"
                              />
                              {isPointLayer(layer) && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-black/20"
                                  style={{ backgroundColor: layer.colour }}
                                />
                              )}
                              <span className="font-mono text-xs truncate">
                                {layer.name}
                              </span>
                            </div>

                            {/* Opacity Slider (shown when layer is on) */}
                            {isVisible && (
                              <div className="flex items-center gap-2 mt-1.5 ml-6">
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={Math.round(currentOpacity * 100)}
                                  onChange={(e) =>
                                    setLayerOpacity(layer.id, Number(e.target.value) / 100)
                                  }
                                  className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-black"
                                />
                                <span className="font-mono text-[10px] text-gray-500 w-8 text-right flex-shrink-0">
                                  {Math.round(currentOpacity * 100)}%
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t-2 border-black px-4 py-3">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full font-mono text-xs uppercase font-bold text-gray-600 hover:text-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
