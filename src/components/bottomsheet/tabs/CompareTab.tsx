import { usePropertyStore } from '@/stores/propertyStore';
import { BrutalCard, BrutalButton, BrutalBadge } from '@/components/brutal';
import { X } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function CompareTab() {
  const { comparisonProperties, removeFromComparison, clearComparison } = usePropertyStore();

  if (comparisonProperties.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="font-mono text-sm uppercase text-gray-600 mb-2">
          No properties to compare
        </div>
        <div className="font-sans text-gray-500">
          Add properties from the Overview tab to compare them side by side
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs uppercase font-bold">
          Comparing {comparisonProperties.length}/5 properties
        </span>
        <BrutalButton onClick={clearComparison} size="sm">
          Clear All
        </BrutalButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {comparisonProperties.map((property) => (
          <BrutalCard key={property.id} header="">
            <button
              onClick={() => removeFromComparison(property.id)}
              className="absolute top-2 right-2 p-1 hover:bg-surface-secondary transition-colors"
            >
              <X size={16} />
            </button>

            <div className="mb-3">
              <div className="font-sans text-sm font-medium line-clamp-2">
                {property.address}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {property.propertyValue && (
                <div>
                  <div className="font-mono uppercase text-gray-600 mb-1">Value</div>
                  <div className="font-mono font-bold">
                    {formatCurrency(property.propertyValue)}
                  </div>
                </div>
              )}

              {property.zone && (
                <div>
                  <div className="font-mono uppercase text-gray-600 mb-1">Zone</div>
                  <div className="font-mono font-bold">{property.zone}</div>
                </div>
              )}

              {property.area && (
                <div>
                  <div className="font-mono uppercase text-gray-600 mb-1">Area</div>
                  <div className="font-mono font-bold">
                    {formatNumber(property.area)} m²
                  </div>
                </div>
              )}

              {property.weeklyRent && (
                <div>
                  <div className="font-mono uppercase text-gray-600 mb-1">Rent</div>
                  <div className="font-mono font-bold">
                    ${formatNumber(property.weeklyRent)}/wk
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                {property.flood && (
                  <BrutalBadge variant="danger" className="text-[10px] px-2 py-0.5">
                    FLOOD
                  </BrutalBadge>
                )}
                {property.bushfire && (
                  <BrutalBadge variant="danger" className="text-[10px] px-2 py-0.5">
                    FIRE
                  </BrutalBadge>
                )}
                {property.heritage && (
                  <BrutalBadge variant="warning" className="text-[10px] px-2 py-0.5">
                    HERITAGE
                  </BrutalBadge>
                )}
              </div>
            </div>
          </BrutalCard>
        ))}
      </div>
    </div>
  );
}
