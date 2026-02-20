import EquityGrowthChart from '@/components/invest/charts/EquityGrowthChart';
import type { AnnualProjection, InvestmentSummary } from '@/types/investment';
import { formatCurrency } from '@/lib/utils';

interface ProjectionsTabProps {
  projections: AnnualProjection[];
  summary: InvestmentSummary;
}

export default function ProjectionsTab({ projections, summary }: ProjectionsTabProps) {
  const initialEquity = summary.depositRequired;

  return (
    <div className="space-y-6">
      {/* Equity Growth Chart */}
      <div>
        <h3 className="font-mono text-xs uppercase font-bold tracking-wider mb-3">Equity Growth</h3>
        <EquityGrowthChart projections={projections} initialEquity={initialEquity} />
      </div>

      {/* Key Milestones */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 5, 10, 20].map((yr) => {
          const p = projections.find((proj) => proj.year === yr);
          if (!p) return null;
          return (
            <div key={yr} className="border-2 border-black p-3">
              <div className="font-mono text-[10px] uppercase text-gray-500 mb-1">Year {yr}</div>
              <div className="font-mono text-lg font-bold">{formatCurrency(p.equity)}</div>
              <div className="font-mono text-[10px] text-gray-500">
                {formatCurrency(p.capitalGain)} gain
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Table */}
      <div className="overflow-x-auto">
        <h3 className="font-mono text-xs uppercase font-bold tracking-wider mb-3">Full Projection</h3>
        <table className="w-full font-mono text-xs border-2 border-black">
          <thead>
            <tr className="bg-black text-white">
              <th className="px-2 py-2 text-left">Yr</th>
              <th className="px-2 py-2 text-right">Value</th>
              <th className="px-2 py-2 text-right">Loan</th>
              <th className="px-2 py-2 text-right">Equity</th>
              <th className="px-2 py-2 text-right">Cashflow</th>
              <th className="px-2 py-2 text-right">Gain</th>
            </tr>
          </thead>
          <tbody>
            {projections.map((p) => (
              <tr key={p.year} className="border-b border-gray-200 hover:bg-surface-secondary">
                <td className="px-2 py-1.5">{p.year}</td>
                <td className="px-2 py-1.5 text-right">{formatCurrency(p.propertyValue)}</td>
                <td className="px-2 py-1.5 text-right text-gray-500">{formatCurrency(p.loanBalance)}</td>
                <td className="px-2 py-1.5 text-right font-bold">{formatCurrency(p.equity)}</td>
                <td className={`px-2 py-1.5 text-right ${p.afterTaxCashflow >= 0 ? 'text-semantic-positive' : 'text-semantic-negative'}`}>
                  {formatCurrency(p.afterTaxCashflow)}
                </td>
                <td className="px-2 py-1.5 text-right text-semantic-positive">
                  {formatCurrency(p.capitalGain)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
