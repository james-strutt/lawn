import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts';
import type { AnnualProjection } from '@/types/investment';

interface CashflowChartProps {
  projections: AnnualProjection[];
}

export default function CashflowChart({ projections }: CashflowChartProps) {
  const data = projections.map((p) => ({
    year: `Yr ${p.year}`,
    income: p.annualRent,
    expenses: -(p.annualExpenses + p.annualRepayment),
    netCashflow: p.afterTaxCashflow,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 10, fontFamily: 'Space Mono, monospace' }}
        />
        <YAxis
          tick={{ fontSize: 10, fontFamily: 'Space Mono, monospace' }}
          tickFormatter={(v: number) => `${v >= 0 ? '' : '-'}$${Math.abs(Math.round(v / 1000))}k`}
        />
        <Tooltip
          contentStyle={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 11,
            border: '3px solid black',
            borderRadius: 0,
          }}
        />
        <Legend
          wrapperStyle={{ fontFamily: 'Space Mono, monospace', fontSize: 10 }}
        />
        <ReferenceLine y={0} stroke="#000" strokeWidth={2} />
        <Bar dataKey="income" fill="#16A34A" name="Rent" />
        <Bar dataKey="expenses" fill="#D7153A" name="Costs" />
        <Line
          type="monotone"
          dataKey="netCashflow"
          stroke="#146CFD"
          strokeWidth={3}
          dot={{ r: 3, fill: '#146CFD' }}
          name="Net (after tax)"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
