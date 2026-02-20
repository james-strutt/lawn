import { useState } from 'react';
import { BrutalCard, BrutalInput, BrutalToggle, BrutalMetric, BrutalButton } from '@/components/brutal';
import { calculateStampDutyWithFHB } from '@/utils/financial/stampDuty';
import { formatCurrency } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function StampDutyCalculator() {
  const [propertyValue, setPropertyValue] = useState<string>('850000');
  const [isFHB, setIsFHB] = useState(false);
  const [isNewHome, setIsNewHome] = useState(false);
  const [showWorking, setShowWorking] = useState(false);

  const value = parseFloat(propertyValue) || 0;
  const result = calculateStampDutyWithFHB(value, isFHB, isNewHome);

  return (
    <BrutalCard header="STAMP DUTY CALCULATOR" headerBg="black">
      {/* Inputs */}
      <div className="space-y-4 mb-6">
        <BrutalInput
          label="Property Value"
          type="number"
          value={propertyValue}
          onChange={(e) => setPropertyValue(e.target.value)}
          placeholder="850000"
        />

        <div className="flex gap-4">
          <BrutalToggle
            label="First Home Buyer"
            checked={isFHB}
            onChange={(e) => setIsFHB(e.target.checked)}
          />
          <BrutalToggle
            label="New Home"
            checked={isNewHome}
            onChange={(e) => setIsNewHome(e.target.checked)}
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <BrutalMetric
            label="STANDARD DUTY"
            value={formatCurrency(result.stampDuty)}
            variant="default"
          />
          <BrutalMetric
            label="ACTUAL DUTY"
            value={formatCurrency(result.actualDuty)}
            variant={result.actualDuty < result.stampDuty ? 'success' : 'default'}
          />
        </div>

        {(result.fhbExemption > 0 || result.fhbConcession > 0) && (
          <div>
            <BrutalMetric
              label="FHB SAVING"
              value={formatCurrency(result.fhbExemption + result.fhbConcession)}
              variant="success"
              detail={
                result.fhbExemption > 0
                  ? 'Full exemption'
                  : 'Partial concession'
              }
            />
          </div>
        )}

        <div className="text-xs font-mono text-gray-600">
          Tax bracket: {result.bracket}
        </div>
      </div>

      {/* Show Working Toggle */}
      <div className="border-t-2 border-black pt-4">
        <BrutalButton
          onClick={() => setShowWorking(!showWorking)}
          size="sm"
          className="w-full flex items-center justify-between"
        >
          <span>☑ Show Working</span>
          {showWorking ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </BrutalButton>

        {showWorking && (
          <div className="mt-4 p-3 bg-surface-secondary border-2 border-black font-mono text-xs space-y-1">
            {result.calculation.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </BrutalCard>
  );
}
