import { useState } from 'react';
import { BrutalCard, BrutalInput, BrutalSelect, BrutalMetric } from '@/components/brutal';
import { calculateMortgageRepayment, calculateLMI } from '@/utils/financial/mortgage';
import { formatCurrency } from '@/lib/utils';

export default function MortgageCalculator() {
  const [propertyValue, setPropertyValue] = useState<string>('850000');
  const [deposit, setDeposit] = useState<string>('170000');
  const [interestRate, setInterestRate] = useState<string>('6.5');
  const [loanTerm, setLoanTerm] = useState<string>('30');

  const propValue = parseFloat(propertyValue) || 0;
  const depositAmount = parseFloat(deposit) || 0;
  const loanAmount = propValue - depositAmount;
  const rate = parseFloat(interestRate) || 0;
  const term = parseFloat(loanTerm) || 30;

  const mortgage = calculateMortgageRepayment(loanAmount, rate, term);
  const lmi = calculateLMI(loanAmount, propValue);

  return (
    <BrutalCard header="MORTGAGE CALCULATOR" headerBg="black">
      {/* Inputs */}
      <div className="space-y-4 mb-6">
        <BrutalInput
          label="Property Value"
          type="number"
          value={propertyValue}
          onChange={(e) => setPropertyValue(e.target.value)}
        />

        <BrutalInput
          label="Deposit"
          type="number"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <BrutalInput
            label="Interest Rate (%)"
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />

          <BrutalSelect
            label="Loan Term"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
          >
            <option value="10">10 years</option>
            <option value="15">15 years</option>
            <option value="20">20 years</option>
            <option value="25">25 years</option>
            <option value="30">30 years</option>
          </BrutalSelect>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <BrutalMetric
            label="LOAN AMOUNT"
            value={formatCurrency(loanAmount)}
          />
          <BrutalMetric
            label="LVR"
            value={`${lmi.lvr}%`}
            variant={lmi.lvr > 80 ? 'warning' : 'success'}
          />
        </div>

        <BrutalMetric
          label="MONTHLY REPAYMENT"
          value={formatCurrency(mortgage.monthlyRepayment)}
          detail={`P&I @ ${rate}%`}
        />

        <div className="grid grid-cols-2 gap-4">
          <BrutalMetric
            label="TOTAL INTEREST"
            value={formatCurrency(mortgage.totalInterest)}
            variant="danger"
          />
          <BrutalMetric
            label="TOTAL PAID"
            value={formatCurrency(mortgage.totalRepayment)}
          />
        </div>

        {lmi.lmiRequired && (
          <div className="border-t-2 border-black pt-4">
            <BrutalMetric
              label="LMI REQUIRED"
              value={formatCurrency(lmi.lmiAmount)}
              detail={lmi.reason}
              variant="warning"
            />
          </div>
        )}
      </div>
    </BrutalCard>
  );
}
