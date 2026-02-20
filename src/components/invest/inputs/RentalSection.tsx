import { BrutalInput, BrutalToggle } from '@/components/brutal';
import { useInvestmentStore } from '@/stores/investmentStore';

export default function RentalSection() {
  const { inputs, setRental } = useInvestmentStore();
  const { rental } = inputs;

  return (
    <div className="space-y-3">
      <BrutalInput
        label="Weekly Rent ($)"
        type="number"
        min={0}
        step={10}
        value={rental.weeklyRent || ''}
        onChange={(e) => setRental({ weeklyRent: Number(e.target.value) })}
        placeholder="550"
      />

      <div className="grid grid-cols-2 gap-3">
        <BrutalInput
          label="Vacancy Rate (%)"
          type="number"
          min={0}
          max={20}
          step={0.5}
          value={rental.vacancyRate || ''}
          onChange={(e) => setRental({ vacancyRate: Number(e.target.value) })}
        />
        <BrutalInput
          label="PM Fee (%)"
          type="number"
          min={0}
          max={15}
          step={0.5}
          value={rental.propertyManagementFee || ''}
          onChange={(e) => setRental({ propertyManagementFee: Number(e.target.value) })}
        />
      </div>

      <BrutalToggle
        label="Has Strata / Body Corp"
        checked={rental.hasStrata}
        onChange={(e) => setRental({ hasStrata: e.target.checked })}
      />
    </div>
  );
}
