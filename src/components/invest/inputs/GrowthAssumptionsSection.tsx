import { BrutalInput } from '@/components/brutal';
import { useInvestmentStore } from '@/stores/investmentStore';

export default function GrowthAssumptionsSection() {
  const { inputs, setGrowth } = useInvestmentStore();
  const { growth } = inputs;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <BrutalInput
          label="Capital Growth (%)"
          type="number"
          min={-5}
          max={15}
          step={0.5}
          value={growth.capitalGrowthRate}
          onChange={(e) => setGrowth({ capitalGrowthRate: Number(e.target.value) })}
        />
        <BrutalInput
          label="Rent Growth (%)"
          type="number"
          min={-5}
          max={15}
          step={0.5}
          value={growth.rentGrowthRate}
          onChange={(e) => setGrowth({ rentGrowthRate: Number(e.target.value) })}
        />
      </div>

      <BrutalInput
        label="Expense Inflation (%)"
        type="number"
        min={0}
        max={10}
        step={0.5}
        value={growth.expenseInflationRate}
        onChange={(e) => setGrowth({ expenseInflationRate: Number(e.target.value) })}
      />

      <div>
        <label className="block mb-2 font-mono text-xs uppercase font-bold tracking-wider">
          Projection Horizon: {growth.projectionYears} years
        </label>
        <input
          type="range"
          min={5}
          max={30}
          step={1}
          value={growth.projectionYears}
          onChange={(e) => setGrowth({ projectionYears: Number(e.target.value) })}
          className="w-full h-2 bg-black rounded-none appearance-none cursor-pointer accent-brand-accent"
        />
        <div className="flex justify-between font-mono text-[10px] text-gray-500 mt-1">
          <span>5yr</span>
          <span>30yr</span>
        </div>
      </div>
    </div>
  );
}
