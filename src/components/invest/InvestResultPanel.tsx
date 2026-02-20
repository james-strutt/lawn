import { useState } from 'react';
import { BrutalCard } from '@/components/brutal';
import SummaryTab from '@/components/invest/results/SummaryTab';
import CashflowTab from '@/components/invest/results/CashflowTab';
import TaxTab from '@/components/invest/results/TaxTab';
import ProjectionsTab from '@/components/invest/results/ProjectionsTab';
import InvestDisclaimer from '@/components/invest/InvestDisclaimer';
import type { InvestmentSummary, AnnualProjection, InvestmentVerdict, TaxPosition } from '@/types/investment';

type TabId = 'summary' | 'cashflow' | 'tax' | 'projections';

const TABS: { id: TabId; label: string }[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'cashflow', label: 'Cashflow' },
  { id: 'tax', label: 'Tax' },
  { id: 'projections', label: 'Projections' },
];

interface InvestResultPanelProps {
  summary: InvestmentSummary;
  projections: AnnualProjection[];
  verdict: InvestmentVerdict;
  taxPosition: TaxPosition;
}

export default function InvestResultPanel({ summary, projections, verdict, taxPosition }: InvestResultPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('summary');

  return (
    <div className="flex-1 min-w-0">
      <BrutalCard
        header={
          <div className="flex items-center gap-1 -mx-4 -my-3">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 font-mono text-xs uppercase font-bold tracking-wider transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-black'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        }
        headerBg="black"
      >
        {activeTab === 'summary' && (
          <SummaryTab summary={summary} verdict={verdict} />
        )}
        {activeTab === 'cashflow' && (
          <CashflowTab projections={projections} summary={summary} />
        )}
        {activeTab === 'tax' && (
          <TaxTab taxPosition={taxPosition} />
        )}
        {activeTab === 'projections' && (
          <ProjectionsTab projections={projections} summary={summary} />
        )}

        <InvestDisclaimer />
      </BrutalCard>
    </div>
  );
}
