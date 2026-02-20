import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { AnnualProjection } from '@/types/investment';

interface EquityGrowthChartProps {
  projections: AnnualProjection[];
  initialEquity: number;
}

export default function EquityGrowthChart({ projections, initialEquity }: EquityGrowthChartProps) {
  const data = [
    { year: 'Now', equity: initialEquity, propertyValue: projections[0]?.propertyValue ?? 0, loanBalance: projections[0]?.loanBalance ?? 0 },
    ...projections.map((p) => ({
      year: `Yr ${p.year}`,
      equity: p.equity,
      propertyValue: p.propertyValue,
      loanBalance: p.loanBalance,
    })),
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 10, fontFamily: 'Space Mono, monospace' }}
        />
        <YAxis
          tick={{ fontSize: 10, fontFamily: 'Space Mono, monospace' }}
          tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
        />
        <Tooltip
          contentStyle={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 11,
            border: '3px solid black',
            borderRadius: 0,
          }}
        />
        <Area
          type="monotone"
          dataKey="equity"
          stroke="#146CFD"
          fill="#146CFD"
          fillOpacity={0.2}
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
