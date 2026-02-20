import { BrutalMetric } from '@/components/brutal';
import InvestVerdictBadge from '@/components/invest/InvestVerdictBadge';
import ExpenseBreakdownChart from '@/components/invest/charts/ExpenseBreakdownChart';
import type { InvestmentSummary, InvestmentVerdict } from '@/types/investment';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface SummaryTabProps {
  summary: InvestmentSummary;
  verdict: InvestmentVerdict;
}

export default function SummaryTab({ summary, verdict }: SummaryTabProps) {
  return (
    <div className="space-y-6">
      {/* Verdict */}
      <div className="flex items-center gap-4">
        <InvestVerdictBadge verdict={verdict} />
        <span className="font-mono text-xs text-gray-500 uppercase">
          {verdict === 'strong' && 'Strong fundamentals — positive or near-positive cashflow'}
          {verdict === 'consider' && 'Reasonable investment with manageable negative gearing'}
          {verdict === 'caution' && 'High holding costs — review your assumptions'}
        </span>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <BrutalMetric
          label="Gross Yield"
          value={formatPercent(summary.grossYield)}
          variant={summary.grossYield >= 4 ? 'success' : summary.grossYield >= 3 ? 'default' : 'danger'}
        />
        <BrutalMetric
          label="Net Yield"
          value={formatPercent(summary.netYield)}
          variant={summary.netYield >= 3 ? 'success' : summary.netYield >= 2 ? 'default' : 'danger'}
        />
        <BrutalMetric
          label="Monthly Cashflow"
          value={formatCurrency(summary.monthlyCashflow)}
          detail="Before tax"
          variant={summary.monthlyCashflow >= 0 ? 'success' : 'danger'}
        />
        <BrutalMetric
          label="After-Tax Cashflow"
          value={formatCurrency(summary.afterTaxMonthlyCashflow)}
          detail="Per month"
          variant={summary.afterTaxMonthlyCashflow >= 0 ? 'success' : 'warning'}
        />
        <BrutalMetric
          label="Tax Benefit"
          value={formatCurrency(summary.taxBenefitAnnual)}
          detail="Annual saving"
          variant={summary.taxBenefitAnnual > 0 ? 'success' : 'default'}
        />
        <BrutalMetric
          label="10yr Equity"
          value={formatCurrency(summary.projectedEquity10yr)}
          variant="success"
        />
      </div>

      {/* Upfront Costs */}
      <div className="border-2 border-black p-4">
        <h3 className="font-mono text-xs uppercase font-bold tracking-wider mb-3">Upfront Costs</h3>
        <div className="grid grid-cols-2 gap-2 font-mono text-sm">
          <span className="text-gray-600">Deposit</span>
          <span className="text-right font-bold">{formatCurrency(summary.depositRequired)}</span>
          <span className="text-gray-600">Stamp Duty</span>
          <span className="text-right font-bold">{formatCurrency(summary.stampDuty)}</span>
          {summary.lmiAmount > 0 && (
            <>
              <span className="text-gray-600">LMI</span>
              <span className="text-right font-bold text-semantic-warning">{formatCurrency(summary.lmiAmount)}</span>
            </>
          )}
          <span className="text-gray-600">Other Costs</span>
          <span className="text-right font-bold">
            {formatCurrency(summary.totalUpfrontCosts - summary.stampDuty - summary.lmiAmount)}
          </span>
          <span className="text-gray-600 font-bold border-t-2 border-black pt-2">Total Cash Required</span>
          <span className="text-right font-bold border-t-2 border-black pt-2">{formatCurrency(summary.totalCashRequired)}</span>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div>
        <h3 className="font-mono text-xs uppercase font-bold tracking-wider mb-3">Annual Expenses</h3>
        <ExpenseBreakdownChart expenses={summary.expenses} />
        <div className="flex items-center justify-between mt-2 px-3 py-2 bg-surface-secondary border-2 border-black">
          <span className="font-mono text-xs uppercase font-bold">Total Expenses</span>
          <span className="font-mono text-sm font-bold">{formatCurrency(summary.annualExpenses)}/yr</span>
        </div>
      </div>
    </div>
  );
}
