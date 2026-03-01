import { usePropertyStore } from '@/stores/propertyStore';
import { BrutalCard, BrutalBadge, BrutalMetric } from '@/components/brutal';
import { X, Bookmark, Share2 } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function PropertyDetails() {
  const { selectedProperty, setSelectedProperty, addToShortlist } = usePropertyStore();

  if (!selectedProperty) return null;

  const handleClose = () => {
    setSelectedProperty(null);
  };

  const handleSave = () => {
    addToShortlist(selectedProperty);
    // TODO: Save to Supabase if authenticated
  };

  return (
    <div className="absolute top-20 sm:top-28 left-2 right-2 sm:left-4 sm:right-auto sm:w-96 z-20">
      <BrutalCard header="PROPERTY DETAILS">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 hover:bg-surface-secondary transition-colors"
        >
          <X size={20} />
        </button>

        {/* Address */}
        <div className="mb-4">
          <div className="font-mono text-xs uppercase text-gray-600 mb-1">
            Address
          </div>
          <div className="font-sans text-sm sm:text-lg font-medium">
            {selectedProperty.address}
          </div>
        </div>

        {/* Lot/DP */}
        {selectedProperty.lotDp && (
          <div className="mb-4">
            <div className="font-mono text-xs uppercase text-gray-600 mb-1">
              Lot/DP
            </div>
            <div className="font-mono text-sm">
              {selectedProperty.lotDp}
            </div>
          </div>
        )}

        {/* Grid Layout for Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {selectedProperty.zone && (
            <div>
              <BrutalMetric
                label="ZONE"
                value={selectedProperty.zone}
                variant="default"
              />
            </div>
          )}

          {selectedProperty.area && (
            <div>
              <BrutalMetric
                label="AREA"
                value={`${formatNumber(selectedProperty.area)} m²`}
                variant="default"
              />
            </div>
          )}
        </div>

        {/* Hazard Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <BrutalBadge variant={selectedProperty.flood ? 'danger' : 'default'}>
            FLOOD: {selectedProperty.flood ? 'YES' : 'NO'}
          </BrutalBadge>
          <BrutalBadge variant={selectedProperty.bushfire ? 'danger' : 'default'}>
            BUSHFIRE: {selectedProperty.bushfire ? 'YES' : 'NO'}
          </BrutalBadge>
          {selectedProperty.heritage && (
            <BrutalBadge variant="warning">HERITAGE</BrutalBadge>
          )}
        </div>

        {/* Value if available */}
        {selectedProperty.propertyValue && (
          <div className="mb-4">
            <BrutalMetric
              label="ESTIMATED VALUE"
              value={`$${formatNumber(selectedProperty.propertyValue)}`}
              variant="default"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t-2 border-black">
          <button
            onClick={handleSave}
            className="flex-1 btn-brutal flex items-center justify-center gap-2"
          >
            <Bookmark size={16} />
            Save
          </button>
          <button
            className="flex-1 btn-brutal flex items-center justify-center gap-2"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </BrutalCard>
    </div>
  );
}
