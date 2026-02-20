import { usePropertyStore } from '@/stores/propertyStore';
import StampDutyCalculator from '@/components/financial/StampDutyCalculator';
import MortgageCalculator from '@/components/financial/MortgageCalculator';
import RentalYieldCalculator from '@/components/financial/RentalYieldCalculator';

export default function CalculatorsTab() {
  const { selectedProperty } = usePropertyStore();

  return (
    <div className="p-4 space-y-6" key={selectedProperty?.id ?? 'no-property'}>
      <StampDutyCalculator />
      <MortgageCalculator />
      <RentalYieldCalculator />
    </div>
  );
}
