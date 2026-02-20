import { BrutalButton, BrutalInput, BrutalToggle, BrutalMetric } from '@/components/brutal';
import { useBottomSheetStore } from '@/stores/bottomSheetStore';
import { useInvestmentStore } from '@/stores/investmentStore';
import { usePropertyStore } from '@/stores/propertyStore';
import { useRentVsBuyQuick } from '@/hooks/useRentVsBuy';
import { formatCurrency } from '@/lib/utils';
import RentVsBuyVerdictCard from './RentVsBuyVerdictCard';

export default function QuickMode() {
  const { setRentVsBuyMode, setSheetState } = useBottomSheetStore();
  const { inputs, setInvestor, setFinancing, setRental, setAcquisition } = useInvestmentStore();
  const { selectedProperty } = usePropertyStore();
  const result = useRentVsBuyQuick();

  const propertyValue = selectedProperty?.propertyValue ?? inputs.acquisition.purchasePrice;
  const depositDisplay = inputs.financing.depositIsPercent
    ? Math.round(propertyValue * inputs.financing.depositAmount / 100)
    : inputs.financing.depositAmount;

  return (
    <div className="p-4 space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <BrutalInput
          label="Annual Income ($)"
          type="number"
          min={0}
          step={5000}
          value={inputs.investor.annualIncome || ''}
          onChange={(e) => setInvestor({ annualIncome: Number(e.target.value) })}
        />
        <BrutalInput
          label="Deposit ($)"
          type="number"
          min={0}
          step={10000}
          value={depositDisplay || ''}
          onChange={(e) => setFinancing({ depositAmount: Number(e.target.value), depositIsPercent: false })}
        />
        <BrutalInput
          label="Current Weekly Rent ($)"
          type="number"
          min={0}
          step={25}
          value={inputs.rental.currentWeeklyRent || ''}
          onChange={(e) => setRental({ currentWeeklyRent: Number(e.target.value) })}
        />
        <div className="flex items-end pb-1">
          <BrutalToggle
            label="First Home Buyer"
            checked={inputs.acquisition.isFirstHomeBuyer}
            onChange={(e) => setAcquisition({ isFirstHomeBuyer: e.target.checked })}
          />
        </div>
      </div>

      {/* Read-only auto-filled */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase text-gray-500 mb-1">Property Value</div>
          <div className="font-mono text-sm font-bold">{formatCurrency(propertyValue)}</div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase text-gray-500 mb-1">Interest Rate</div>
          <div className="font-mono text-sm font-bold">{inputs.financing.interestRate}%</div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase text-gray-500 mb-1">Growth Rate</div>
          <div className="font-mono text-sm font-bold">{inputs.growth.capitalGrowthRate}%</div>
        </div>
      </div>

      {/* Verdict */}
      <RentVsBuyVerdictCard
        verdict={result.verdict}
        confidence={result.confidence}
        reasoning={result.reasoning}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <BrutalMetric
          label="MONTHLY COST (BUY)"
          value={formatCurrency(result.monthlyCostToBuy)}
          variant="default"
        />
        <BrutalMetric
          label="MONTHLY COST (RENT)"
          value={formatCurrency(result.monthlyCostToRent)}
          variant="default"
        />
        <BrutalMetric
          label="5YR NET (BUY)"
          value={formatCurrency(result.fiveYearNetBuy)}
          variant={result.fiveYearNetBuy >= 0 ? 'default' : 'default'}
        />
        <BrutalMetric
          label="5YR NET (RENT)"
          value={formatCurrency(result.fiveYearNetRent)}
          variant="default"
        />
        <BrutalMetric
          label="BREAK-EVEN"
          value={result.breakEvenYears ? `${Math.ceil(result.breakEvenYears)} yrs` : 'N/A'}
          variant="default"
        />
        <BrutalMetric
          label="FHB SAVING"
          value={result.fhbSaving > 0 ? formatCurrency(result.fhbSaving) : '-'}
          variant="default"
        />
      </div>

      {/* Expand to Detailed */}
      <BrutalButton
        onClick={() => {
          setRentVsBuyMode('detailed');
          setSheetState('expanded');
        }}
        className="w-full"
      >
        Show Detailed Analysis
      </BrutalButton>
    </div>
  );
}
