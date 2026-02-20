import { BrutalCard } from '@/components/brutal';
import { useInvestmentStore } from '@/stores/investmentStore';
import { RotateCcw } from 'lucide-react';
import CollapsibleSection from '@/components/shared/CollapsibleSection';
import PropertySelector from '@/components/invest/inputs/PropertySelector';
import AcquisitionSection from '@/components/invest/inputs/AcquisitionSection';
import FinancingSection from '@/components/invest/inputs/FinancingSection';
import RentalSection from '@/components/invest/inputs/RentalSection';
import InvestorProfileSection from '@/components/invest/inputs/InvestorProfileSection';
import GrowthAssumptionsSection from '@/components/invest/inputs/GrowthAssumptionsSection';

export default function InvestInputPanel() {
  const { resetToDefaults } = useInvestmentStore();

  return (
    <div className="w-full lg:w-[380px] lg:flex-shrink-0">
      <BrutalCard
        header={
          <div className="flex items-center justify-between">
            <span>Inputs</span>
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-1 text-[10px] opacity-70 hover:opacity-100 transition-opacity"
              title="Reset to defaults"
            >
              <RotateCcw size={10} />
              Reset
            </button>
          </div>
        }
      >
        <div className="-mx-4 -mb-4">
          <CollapsibleSection title="Property" defaultOpen={true}>
            <PropertySelector />
          </CollapsibleSection>

          <CollapsibleSection title="Acquisition" defaultOpen={true}>
            <AcquisitionSection />
          </CollapsibleSection>

          <CollapsibleSection title="Financing" defaultOpen={true}>
            <FinancingSection />
          </CollapsibleSection>

          <CollapsibleSection title="Rental Income" defaultOpen={true}>
            <RentalSection />
          </CollapsibleSection>

          <CollapsibleSection title="Your Situation" defaultOpen={false}>
            <InvestorProfileSection />
          </CollapsibleSection>

          <CollapsibleSection title="Growth Assumptions" defaultOpen={false}>
            <GrowthAssumptionsSection />
          </CollapsibleSection>
        </div>
      </BrutalCard>
    </div>
  );
}
