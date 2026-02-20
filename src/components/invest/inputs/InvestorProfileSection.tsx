import { BrutalInput, BrutalToggle } from '@/components/brutal';
import { useInvestmentStore } from '@/stores/investmentStore';

interface InvestorProfileSectionProps {
  showCurrentRent?: boolean;
}

export default function InvestorProfileSection({ showCurrentRent = false }: InvestorProfileSectionProps) {
  const { inputs, setInvestor, setRental } = useInvestmentStore();
  const { investor, rental } = inputs;

  return (
    <div className="space-y-3">
      <BrutalInput
        label="Annual Income ($)"
        type="number"
        min={0}
        step={5000}
        value={investor.annualIncome || ''}
        onChange={(e) => setInvestor({ annualIncome: Number(e.target.value) })}
        placeholder="100000"
      />

      {showCurrentRent && (
        <BrutalInput
          label="Current Weekly Rent ($)"
          type="number"
          min={0}
          step={25}
          value={rental.currentWeeklyRent || ''}
          onChange={(e) => setRental({ currentWeeklyRent: Number(e.target.value) })}
          placeholder="550"
        />
      )}

      <div className="flex items-center gap-6">
        <BrutalToggle
          label="HELP/HECS Debt"
          checked={investor.hasHelpDebt}
          onChange={(e) => setInvestor({ hasHelpDebt: e.target.checked })}
        />
        <BrutalToggle
          label="Private Health"
          checked={investor.hasPrivateHealth}
          onChange={(e) => setInvestor({ hasPrivateHealth: e.target.checked })}
        />
      </div>
    </div>
  );
}
