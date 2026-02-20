import { useState } from 'react';
import PropertySearch from '@/components/property/PropertySearch';
import { usePropertyStore } from '@/stores/propertyStore';
import { useInvestmentStore } from '@/stores/investmentStore';
import { BrutalButton } from '@/components/brutal';
import { MapPin, Pencil } from 'lucide-react';

export default function PropertySelector() {
  const [isManual, setIsManual] = useState(false);
  const { selectedProperty } = usePropertyStore();
  const { loadFromProperty } = useInvestmentStore();

  const handleLoadProperty = () => {
    if (selectedProperty) {
      loadFromProperty(selectedProperty);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase font-bold tracking-wider">Property</span>
        <button
          onClick={() => setIsManual(!isManual)}
          className="font-mono text-[10px] uppercase text-brand-accent hover:underline flex items-center gap-1"
        >
          {isManual ? <MapPin size={10} /> : <Pencil size={10} />}
          {isManual ? 'Search' : 'Manual'}
        </button>
      </div>

      {isManual ? (
        <p className="font-mono text-xs text-gray-500">
          Enter price and rent manually below.
        </p>
      ) : (
        <>
          <PropertySearch />
          {selectedProperty && (
            <div className="flex items-center gap-2">
              <div className="flex-1 font-mono text-xs truncate text-gray-600">
                {selectedProperty.address}
              </div>
              <BrutalButton size="sm" onClick={handleLoadProperty}>
                Load
              </BrutalButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}
