import { usePropertyStore } from '@/stores/propertyStore';
import { BrutalBadge, BrutalMetric, BrutalButton } from '@/components/brutal';
import { Bookmark, Share2, GitCompareArrows } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/utils';

export default function PropertyOverviewTab() {
  const { selectedProperty, addToShortlist, addToComparison } = usePropertyStore();

  if (!selectedProperty) return null;

  return (
    <div className="p-4 space-y-4">
      {/* Address */}
      <div>
        <div className="font-mono text-xs uppercase text-gray-600 mb-1">Address</div>
        <div className="font-sans text-lg font-medium">{selectedProperty.address}</div>
      </div>

      {/* Lot/DP */}
      {selectedProperty.lotDp && (
        <div>
          <div className="font-mono text-xs uppercase text-gray-600 mb-1">Lot/DP</div>
          <div className="font-mono text-sm">{selectedProperty.lotDp}</div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {selectedProperty.zone && (
          <BrutalMetric label="ZONE" value={selectedProperty.zone} variant="default" />
        )}
        {selectedProperty.area && (
          <BrutalMetric
            label="AREA"
            value={`${formatNumber(selectedProperty.area)} m²`}
            variant="default"
          />
        )}
        {selectedProperty.propertyValue && (
          <BrutalMetric
            label="ESTIMATED VALUE"
            value={formatCurrency(selectedProperty.propertyValue)}
            variant="default"
          />
        )}
        {selectedProperty.weeklyRent && (
          <BrutalMetric
            label="WEEKLY RENT"
            value={`$${formatNumber(selectedProperty.weeklyRent)}/wk`}
            variant="default"
          />
        )}
      </div>

      {/* Hazard Badges */}
      <div className="flex flex-wrap gap-2">
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

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t-2 border-black">
        <BrutalButton
          onClick={() => addToShortlist(selectedProperty)}
          size="sm"
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Bookmark size={16} />
          Save
        </BrutalButton>
        <BrutalButton
          size="sm"
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Share2 size={16} />
          Share
        </BrutalButton>
        <BrutalButton
          onClick={() => addToComparison(selectedProperty)}
          size="sm"
          className="flex-1 flex items-center justify-center gap-2"
        >
          <GitCompareArrows size={16} />
          Compare
        </BrutalButton>
      </div>
    </div>
  );
}
