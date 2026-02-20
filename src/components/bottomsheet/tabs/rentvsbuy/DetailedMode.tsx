import { useState } from 'react';
import { BrutalButton, BrutalMetric } from '@/components/brutal';
import { useBottomSheetStore } from '@/stores/bottomSheetStore';
import { useInvestmentAnalysis } from '@/hooks/useInvestmentAnalysis';
import { useRentVsBuyQuick } from '@/hooks/useRentVsBuy';
import { formatCurrency } from '@/lib/utils';
import CollapsibleSection from '@/components/shared/CollapsibleSection';
import AcquisitionSection from '@/components/invest/inputs/AcquisitionSection';
import FinancingSection from '@/components/invest/inputs/FinancingSection';
import RentalSection from '@/components/invest/inputs/RentalSection';
import InvestorProfileSection from '@/components/invest/inputs/InvestorProfileSection';
import GrowthAssumptionsSection from '@/components/invest/inputs/GrowthAssumptionsSection';
import SummaryTab from '@/components/invest/results/SummaryTab';
import CashflowTab from '@/components/invest/results/CashflowTab';
import TaxTab from '@/components/invest/results/TaxTab';
import ProjectionsTab from '@/components/invest/results/ProjectionsTab';
import RentVsBuyVerdictCard from './RentVsBuyVerdictCard';

type DetailedTab = 'summary' | 'cashflow' | 'tax' | 'projections';

const RESULT_TABS: { id: DetailedTab; label: string }[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'cashflow', label: 'Cashflow' },
  { id: 'tax', label: 'Tax' },
  { id: 'projections', label: 'Projections' },
];

export default function DetailedMode() {
  const { setRentVsBuyMode } = useBottomSheetStore();
  const { summary, projections, verdict, taxPosition } = useInvestmentAnalysis();
  const quickResult = useRentVsBuyQuick();
  const [activeResultTab, setActiveResultTab] = useState<DetailedTab>('summary');

  return (
    <div className="p-4 space-y-4">
      {/* Back Button */}
      <BrutalButton onClick={() => setRentVsBuyMode('quick')} size="sm">
        Back to Quick Mode
      </BrutalButton>

      {/* Rent vs Buy Comparison */}
      <RentVsBuyVerdictCard
        verdict={quickResult.verdict}
        confidence={quickResult.confidence}
        reasoning={quickResult.reasoning}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-black p-3">
          <div className="font-mono text-xs uppercase font-bold tracking-wider mb-2 text-center">
            Buy Position
          </div>
          <div className="space-y-2">
            <BrutalMetric
              label="Monthly Cost"
              value={formatCurrency(quickResult.monthlyCostToBuy)}
              variant="default"
            />
            <BrutalMetric
              label="5yr Net"
              value={formatCurrency(quickResult.fiveYearNetBuy)}
              variant="default"
            />
          </div>
        </div>
        <div className="border-2 border-black p-3">
          <div className="font-mono text-xs uppercase font-bold tracking-wider mb-2 text-center">
            Rent Position
          </div>
          <div className="space-y-2">
            <BrutalMetric
              label="Monthly Cost"
              value={formatCurrency(quickResult.monthlyCostToRent)}
              variant="default"
            />
            <BrutalMetric
              label="5yr Net"
              value={formatCurrency(quickResult.fiveYearNetRent)}
              variant="default"
            />
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="border-2 border-black">
        <div className="bg-black text-white px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider">
          Inputs
        </div>
        <CollapsibleSection title="Acquisition" defaultOpen={false}>
          <AcquisitionSection />
        </CollapsibleSection>
        <CollapsibleSection title="Financing" defaultOpen={false}>
          <FinancingSection />
        </CollapsibleSection>
        <CollapsibleSection title="Rental Income" defaultOpen={false}>
          <RentalSection />
        </CollapsibleSection>
        <CollapsibleSection title="Your Situation" defaultOpen={false}>
          <InvestorProfileSection showCurrentRent />
        </CollapsibleSection>
        <CollapsibleSection title="Growth Assumptions" defaultOpen={false}>
          <GrowthAssumptionsSection />
        </CollapsibleSection>
      </div>

      {/* Results Tabs */}
      <div className="border-2 border-black">
        <div className="flex">
          {RESULT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveResultTab(tab.id)}
              className={`flex-1 px-3 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-colors ${
                activeResultTab === tab.id
                  ? 'bg-white text-black'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4">
          {activeResultTab === 'summary' && (
            <SummaryTab summary={summary} verdict={verdict} />
          )}
          {activeResultTab === 'cashflow' && (
            <CashflowTab projections={projections} summary={summary} />
          )}
          {activeResultTab === 'tax' && (
            <TaxTab taxPosition={taxPosition} />
          )}
          {activeResultTab === 'projections' && (
            <ProjectionsTab projections={projections} summary={summary} />
          )}
        </div>
      </div>
    </div>
  );
}
