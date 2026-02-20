import { BrutalMetric } from '@/components/brutal';
import type { TaxPosition } from '@/types/investment';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface TaxTabProps {
  taxPosition: TaxPosition;
}

export default function TaxTab({ taxPosition }: TaxTabProps) {
  const isNegativelyGeared = taxPosition.netPropertyIncome < 0;

  return (
    <div className="space-y-6">
      {/* Tax Position Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-black p-4">
          <h3 className="font-mono text-xs uppercase font-bold tracking-wider mb-3 text-gray-500">
            Without Property
          </h3>
          <div className="space-y-3">
            <BrutalMetric
              label="Taxable Income"
              value={formatCurrency(taxPosition.incomeBeforeProperty)}
            />
            <BrutalMetric
              label="Tax Payable"
              value={formatCurrency(taxPosition.taxBeforeProperty)}
            />
            <BrutalMetric
              label="Marginal Rate"
              value={formatPercent(taxPosition.marginalRateBeforeProperty * 100)}
            />
          </div>
        </div>

        <div className="border-2 border-black p-4">
          <h3 className="font-mono text-xs uppercase font-bold tracking-wider mb-3">
            With Property
          </h3>
          <div className="space-y-3">
            <BrutalMetric
              label="Taxable Income"
              value={formatCurrency(taxPosition.incomeAfterProperty)}
              variant={taxPosition.incomeAfterProperty < taxPosition.incomeBeforeProperty ? 'success' : 'default'}
            />
            <BrutalMetric
              label="Tax Payable"
              value={formatCurrency(taxPosition.taxAfterProperty)}
              variant={taxPosition.taxAfterProperty < taxPosition.taxBeforeProperty ? 'success' : 'default'}
            />
            <BrutalMetric
              label="Marginal Rate"
              value={formatPercent(taxPosition.marginalRateAfterProperty * 100)}
            />
          </div>
        </div>
      </div>

      {/* Tax Saving */}
      {isNegativelyGeared && (
        <div className="border-2 border-semantic-positive bg-semantic-positive/5 p-4">
          <h3 className="font-mono text-xs uppercase font-bold tracking-wider mb-3 text-semantic-positive">
            Negative Gearing Benefit
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <BrutalMetric
              label="Annual Tax Saving"
              value={formatCurrency(taxPosition.annualTaxSaving)}
              variant="success"
            />
            <BrutalMetric
              label="Weekly Tax Saving"
              value={formatCurrency(taxPosition.weeklyTaxSaving)}
              variant="success"
            />
            <BrutalMetric
              label="Net Property Loss"
              value={formatCurrency(taxPosition.netPropertyIncome)}
              variant="danger"
            />
          </div>
        </div>
      )}

      {/* Deductions Breakdown */}
      <div className="border-2 border-black p-4">
        <h3 className="font-mono text-xs uppercase font-bold tracking-wider mb-3">
          Annual Deductions
        </h3>
        <div className="grid grid-cols-2 gap-2 font-mono text-sm">
          <span className="text-gray-600">Loan Interest</span>
          <span className="text-right font-bold">{formatCurrency(taxPosition.deductionBreakdown.interest)}</span>
          <span className="text-gray-600">Property Expenses</span>
          <span className="text-right font-bold">{formatCurrency(taxPosition.deductionBreakdown.expenses)}</span>
          {taxPosition.deductionBreakdown.depreciation > 0 && (
            <>
              <span className="text-gray-600">Depreciation</span>
              <span className="text-right font-bold">{formatCurrency(taxPosition.deductionBreakdown.depreciation)}</span>
            </>
          )}
          <span className="font-bold border-t-2 border-black pt-2">Total Deductions</span>
          <span className="text-right font-bold border-t-2 border-black pt-2">
            {formatCurrency(taxPosition.deductionBreakdown.total)}
          </span>
        </div>
      </div>

      {/* Net Position */}
      <div className="border-2 border-black p-4">
        <h3 className="font-mono text-xs uppercase font-bold tracking-wider mb-3">
          Property Income vs Deductions
        </h3>
        <div className="grid grid-cols-2 gap-2 font-mono text-sm">
          <span className="text-semantic-positive">Rental Income</span>
          <span className="text-right font-bold text-semantic-positive">
            +{formatCurrency(taxPosition.propertyIncome)}
          </span>
          <span className="text-semantic-negative">Total Deductions</span>
          <span className="text-right font-bold text-semantic-negative">
            -{formatCurrency(taxPosition.propertyDeductions)}
          </span>
          <span className="font-bold border-t-2 border-black pt-2">Net Property Income</span>
          <span className={`text-right font-bold border-t-2 border-black pt-2 ${taxPosition.netPropertyIncome >= 0 ? 'text-semantic-positive' : 'text-semantic-negative'}`}>
            {formatCurrency(taxPosition.netPropertyIncome)}
          </span>
        </div>
      </div>
    </div>
  );
}
