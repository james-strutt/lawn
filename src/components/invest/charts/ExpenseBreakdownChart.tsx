import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ExpenseBreakdown } from '@/types/investment';

interface ExpenseBreakdownChartProps {
  expenses: ExpenseBreakdown;
}

const COLORS = ['#002664', '#146CFD', '#9747FF', '#16A34A', '#F59E0B', '#D7153A', '#64748B'];

export default function ExpenseBreakdownChart({ expenses }: ExpenseBreakdownChartProps) {
  const data = [
    { name: 'Council', value: expenses.councilRates },
    { name: 'Water', value: expenses.waterRates },
    { name: 'Strata', value: expenses.strataFees },
    { name: 'Insurance', value: expenses.landlordInsurance },
    { name: 'PM Fee', value: expenses.propertyManagement },
    { name: 'Repairs', value: expenses.repairs },
    { name: 'Land Tax', value: expenses.landTax },
  ].filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 40)}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 60, bottom: 5 }}>
        <XAxis
          type="number"
          tick={{ fontSize: 10, fontFamily: 'Space Mono, monospace' }}
          tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 10, fontFamily: 'Space Mono, monospace' }}
          width={60}
        />
        <Tooltip
          contentStyle={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 11,
            border: '3px solid black',
            borderRadius: 0,
          }}
        />
        <Bar dataKey="value" barSize={20}>
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
