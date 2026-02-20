import { usePropertyStore } from '@/stores/propertyStore';
import { BrutalCard, BrutalButton, BrutalMetric, BrutalBadge } from '@/components/brutal';
import { X } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function PropertyComparison() {
  const { comparisonProperties, removeFromComparison, clearComparison } = usePropertyStore();

  if (comparisonProperties.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t-brutal border-black shadow-brutal-lg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold uppercase">
            Property Comparison ({comparisonProperties.length}/5)
          </h3>
          <BrutalButton onClick={clearComparison} size="sm">
            Clear All
          </BrutalButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {comparisonProperties.map((property) => (
            <BrutalCard key={property.id} header="">
              {/* Remove Button */}
              <button
                onClick={() => removeFromComparison(property.id)}
                className="absolute top-2 right-2 p-1 hover:bg-surface-secondary transition-colors"
              >
                <X size={16} />
              </button>

              {/* Address */}
              <div className="mb-3">
                <div className="font-sans text-sm font-medium line-clamp-2">
                  {property.address}
                </div>
              </div>

              {/* Metrics */}
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

                {/* Hazards */}
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
    </div>
  );
}
