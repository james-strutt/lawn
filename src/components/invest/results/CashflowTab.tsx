import CashflowChart from '@/components/invest/charts/CashflowChart';
import type { AnnualProjection, InvestmentSummary } from '@/types/investment';
import { formatCurrency } from '@/lib/utils';

interface CashflowTabProps {
  projections: AnnualProjection[];
  summary: InvestmentSummary;
}

export default function CashflowTab({ projections, summary }: CashflowTabProps) {
  return (
    <div className="space-y-6">
      {/* Monthly Breakdown */}
      <div className="border-2 border-black p-4">
        <h3 className="font-mono text-xs uppercase font-bold tracking-wider mb-3">Monthly Breakdown (Year 1)</h3>
        <div className="grid grid-cols-2 gap-2 font-mono text-sm">
          <span className="text-semantic-positive">Rental Income</span>
          <span className="text-right font-bold text-semantic-positive">
            +{formatCurrency(Math.round(summary.annualRent / 12))}
          </span>
          <span className="text-semantic-negative">Expenses</span>
          <span className="text-right font-bold text-semantic-negative">
            -{formatCurrency(Math.round(summary.annualExpenses / 12))}
          </span>
          <span className="text-semantic-negative">Loan Repayment</span>
          <span className="text-right font-bold text-semantic-negative">
            -{formatCurrency(summary.monthlyRepayment)}
          </span>
          <span className="font-bold border-t-2 border-black pt-2">Pre-Tax Cashflow</span>
          <span className={`text-right font-bold border-t-2 border-black pt-2 ${summary.monthlyCashflow >= 0 ? 'text-semantic-positive' : 'text-semantic-negative'}`}>
            {formatCurrency(summary.monthlyCashflow)}
          </span>
          {summary.taxBenefitAnnual > 0 && (
            <>
              <span className="text-semantic-positive">Tax Benefit</span>
              <span className="text-right font-bold text-semantic-positive">
                +{formatCurrency(Math.round(summary.taxBenefitAnnual / 12))}
              </span>
              <span className="font-bold border-t-2 border-black pt-2">After-Tax Cashflow</span>
              <span className={`text-right font-bold border-t-2 border-black pt-2 ${summary.afterTaxMonthlyCashflow >= 0 ? 'text-semantic-positive' : 'text-semantic-negative'}`}>
                {formatCurrency(summary.afterTaxMonthlyCashflow)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Chart */}
      <div>
        <h3 className="font-mono text-xs uppercase font-bold tracking-wider mb-3">Annual Cashflow Projection</h3>
        <CashflowChart projections={projections} />
      </div>

      {/* Year-by-Year Table */}
      <div className="overflow-x-auto">
        <h3 className="font-mono text-xs uppercase font-bold tracking-wider mb-3">Year-by-Year</h3>
        <table className="w-full font-mono text-xs border-2 border-black">
          <thead>
            <tr className="bg-black text-white">
              <th className="px-2 py-2 text-left">Year</th>
              <th className="px-2 py-2 text-right">Rent</th>
              <th className="px-2 py-2 text-right">Costs</th>
              <th className="px-2 py-2 text-right">Net</th>
              <th className="px-2 py-2 text-right">Cumulative</th>
            </tr>
          </thead>
          <tbody>
            {projections.map((p) => (
              <tr key={p.year} className="border-b border-gray-200 hover:bg-surface-secondary">
                <td className="px-2 py-1.5">{p.year}</td>
                <td className="px-2 py-1.5 text-right">{formatCurrency(p.annualRent)}</td>
                <td className="px-2 py-1.5 text-right text-semantic-negative">
                  {formatCurrency(p.annualExpenses + p.annualRepayment)}
                </td>
                <td className={`px-2 py-1.5 text-right font-bold ${p.afterTaxCashflow >= 0 ? 'text-semantic-positive' : 'text-semantic-negative'}`}>
                  {formatCurrency(p.afterTaxCashflow)}
                </td>
                <td className={`px-2 py-1.5 text-right ${p.cumulativeCashflow >= 0 ? 'text-semantic-positive' : 'text-semantic-negative'}`}>
                  {formatCurrency(p.cumulativeCashflow)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
