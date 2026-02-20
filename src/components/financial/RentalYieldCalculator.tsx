import { useState } from 'react';
import { BrutalCard, BrutalInput, BrutalSelect, BrutalMetric } from '@/components/brutal';
import { calculateRentalYield, estimateInvestmentExpenses } from '@/utils/financial/rental';
import { formatCurrency, formatPercent } from '@/lib/utils';

export default function RentalYieldCalculator() {
  const [propertyValue, setPropertyValue] = useState<string>('850000');
  const [weeklyRent, setWeeklyRent] = useState<string>('650');
  const [propertyType, setPropertyType] = useState<'house' | 'unit' | 'townhouse'>('unit');
  const [loanAmount, setLoanAmount] = useState<string>('680000');
  const [interestRate, setInterestRate] = useState<string>('6.5');

  const propValue = parseFloat(propertyValue) || 0;
  const rent = parseFloat(weeklyRent) || 0;
  const loan = parseFloat(loanAmount) || 0;
  const rate = parseFloat(interestRate) || 0;

  const hasStrata = propertyType === 'unit' || propertyType === 'townhouse';
  const expenses = estimateInvestmentExpenses(propValue, propertyType, rent, hasStrata);
  const yield_data = calculateRentalYield(propValue, rent, expenses, loan, rate);

  return (
    <BrutalCard header="RENTAL YIELD CALCULATOR" headerBg="accent">
      {/* Inputs */}
      <div className="space-y-4 mb-6">
        <BrutalInput
          label="Property Value"
          type="number"
          value={propertyValue}
          onChange={(e) => setPropertyValue(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <BrutalInput
            label="Weekly Rent"
            type="number"
            value={weeklyRent}
            onChange={(e) => setWeeklyRent(e.target.value)}
          />

          <BrutalSelect
            label="Property Type"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value as any)}
          >
            <option value="house">House</option>
            <option value="unit">Unit</option>
            <option value="townhouse">Townhouse</option>
          </BrutalSelect>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <BrutalInput
            label="Loan Amount"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />

          <BrutalInput
            label="Interest Rate (%)"
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <BrutalMetric
            label="GROSS YIELD"
            value={formatPercent(yield_data.grossYield)}
            variant={yield_data.grossYield >= 4 ? 'success' : 'default'}
          />
          <BrutalMetric
            label="NET YIELD"
            value={formatPercent(yield_data.netYield)}
            variant={yield_data.netYield >= 2.5 ? 'success' : 'danger'}
          />
        </div>

        <BrutalMetric
          label="CASHFLOW (MONTHLY)"
          value={formatCurrency(yield_data.cashflowMonthly)}
          variant={yield_data.cashflowMonthly >= 0 ? 'success' : 'danger'}
          detail={yield_data.cashflowMonthly >= 0 ? 'Positive' : 'Negative'}
        />

        <div className="border-t-2 border-black pt-4">
          <div className="font-mono text-xs uppercase text-gray-600 mb-3">
            Annual Breakdown
          </div>

          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Rent:</span>
              <span className="text-semantic-positive">
                +{formatCurrency(yield_data.annualRent)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expenses:</span>
              <span className="text-semantic-negative">
                -{formatCurrency(yield_data.annualExpenses)}
              </span>
            </div>
            <div className="flex justify-between border-t-2 border-black pt-2 font-bold">
              <span>Net Income:</span>
              <span className={yield_data.annualNetIncome >= 0 ? 'text-semantic-positive' : 'text-semantic-negative'}>
                {formatCurrency(yield_data.annualNetIncome)}
              </span>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="border-t-2 border-black pt-4">
          <div className="font-mono text-xs uppercase text-gray-600 mb-3">
            Estimated Expenses
          </div>

          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Council rates:</span>
              <span>{formatCurrency(expenses.councilRates)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Water rates:</span>
              <span>{formatCurrency(expenses.waterRates)}</span>
            </div>
            {expenses.strataFees > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Strata fees:</span>
                <span>{formatCurrency(expenses.strataFees)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Insurance:</span>
              <span>{formatCurrency(expenses.landlordInsurance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Property mgmt:</span>
              <span>{formatCurrency(expenses.propertyManagement)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Repairs:</span>
              <span>{formatCurrency(expenses.repairs)}</span>
            </div>
          </div>
        </div>
      </div>
    </BrutalCard>
  );
}
