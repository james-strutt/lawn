import { BrutalInput, BrutalSelect, BrutalToggle } from '@/components/brutal';
import { useInvestmentStore } from '@/stores/investmentStore';
import { calculateStampDutyWithFHB } from '@/utils/financial/stampDuty';
import { formatCurrency } from '@/lib/utils';
import type { PropertyType } from '@/types/investment';

export default function AcquisitionSection() {
  const { inputs, setAcquisition } = useInvestmentStore();
  const { acquisition } = inputs;

  const stampDuty = calculateStampDutyWithFHB(
    acquisition.purchasePrice,
    acquisition.isFirstHomeBuyer
  );

  return (
    <div className="space-y-3">
      <BrutalInput
        label="Purchase Price"
        type="number"
        min={0}
        step={10000}
        value={acquisition.purchasePrice || ''}
        onChange={(e) => setAcquisition({ purchasePrice: Number(e.target.value) })}
        placeholder="850000"
      />

      <BrutalSelect
        label="Property Type"
        value={acquisition.propertyType}
        onChange={(e) => setAcquisition({ propertyType: e.target.value as PropertyType })}
      >
        <option value="house">House</option>
        <option value="unit">Unit / Apartment</option>
        <option value="townhouse">Townhouse</option>
        <option value="land">Vacant Land</option>
      </BrutalSelect>

      <div className="flex items-center gap-6">
        <BrutalToggle
          label="First Home Buyer"
          checked={acquisition.isFirstHomeBuyer}
          onChange={(e) => setAcquisition({ isFirstHomeBuyer: e.target.checked })}
        />
        <BrutalToggle
          label="Foreign Buyer"
          checked={acquisition.isForeignBuyer}
          onChange={(e) => setAcquisition({ isForeignBuyer: e.target.checked })}
        />
      </div>

      <div className="flex items-center justify-between px-3 py-2 bg-surface-secondary border-2 border-black">
        <span className="font-mono text-xs uppercase">Stamp Duty</span>
        <span className="font-mono text-sm font-bold">{formatCurrency(stampDuty.actualDuty)}</span>
      </div>
    </div>
  );
}
