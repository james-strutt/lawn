import { BrutalInput, BrutalSelect, BrutalToggle } from '@/components/brutal';
import { useInvestmentStore } from '@/stores/investmentStore';
import { calculateLMI } from '@/utils/financial/mortgage';
import { formatCurrency } from '@/lib/utils';
import type { LoanType } from '@/types/investment';

export default function FinancingSection() {
  const { inputs, setFinancing } = useInvestmentStore();
  const { financing, acquisition } = inputs;

  const depositDollars = financing.depositIsPercent
    ? Math.round(acquisition.purchasePrice * financing.depositAmount / 100)
    : financing.depositAmount;
  const loanAmount = acquisition.purchasePrice - depositDollars;
  const lmi = calculateLMI(loanAmount, acquisition.purchasePrice);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <BrutalInput
            label={`Deposit (${financing.depositIsPercent ? '%' : '$'})`}
            type="number"
            min={0}
            step={financing.depositIsPercent ? 1 : 10000}
            value={financing.depositAmount || ''}
            onChange={(e) => setFinancing({ depositAmount: Number(e.target.value) })}
          />
        </div>
        <div className="pt-6">
          <BrutalToggle
            label="%"
            checked={financing.depositIsPercent}
            onChange={(e) => setFinancing({ depositIsPercent: e.target.checked })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <BrutalInput
          label="Interest Rate (%)"
          type="number"
          min={0}
          max={15}
          step={0.1}
          value={financing.interestRate || ''}
          onChange={(e) => setFinancing({ interestRate: Number(e.target.value) })}
        />
        <BrutalSelect
          label="Loan Term"
          value={financing.loanTermYears}
          onChange={(e) => setFinancing({ loanTermYears: Number(e.target.value) })}
        >
          <option value={10}>10 years</option>
          <option value={15}>15 years</option>
          <option value={20}>20 years</option>
          <option value={25}>25 years</option>
          <option value={30}>30 years</option>
        </BrutalSelect>
      </div>

      <BrutalSelect
        label="Repayment Type"
        value={financing.loanType}
        onChange={(e) => setFinancing({ loanType: e.target.value as LoanType })}
      >
        <option value="principalAndInterest">Principal & Interest</option>
        <option value="interestOnly">Interest Only</option>
      </BrutalSelect>

      <div className="space-y-1">
        <div className="flex items-center justify-between px-3 py-2 bg-surface-secondary border-2 border-black">
          <span className="font-mono text-xs uppercase">LVR</span>
          <span className={`font-mono text-sm font-bold ${lmi.lvr > 80 ? 'text-semantic-warning' : 'text-semantic-positive'}`}>
            {lmi.lvr}%
          </span>
        </div>
        {lmi.lmiRequired && (
          <div className="flex items-center justify-between px-3 py-2 bg-semantic-warning/10 border-2 border-semantic-warning">
            <span className="font-mono text-xs uppercase">LMI</span>
            <span className="font-mono text-sm font-bold text-semantic-warning">
              {formatCurrency(lmi.lmiAmount)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
