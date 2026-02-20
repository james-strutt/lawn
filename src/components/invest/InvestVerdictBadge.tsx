import type { InvestmentVerdict } from '@/types/investment';
import { BrutalBadge } from '@/components/brutal';

interface InvestVerdictBadgeProps {
  verdict: InvestmentVerdict;
}

const VERDICT_CONFIG: Record<InvestmentVerdict, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  strong: { label: 'STRONG BUY', variant: 'success' },
  consider: { label: 'CONSIDER', variant: 'warning' },
  caution: { label: 'CAUTION', variant: 'danger' },
};

export default function InvestVerdictBadge({ verdict }: InvestVerdictBadgeProps) {
  const config = VERDICT_CONFIG[verdict];
  return (
    <BrutalBadge variant={config.variant} className="text-sm px-4 py-2">
      {config.label}
    </BrutalBadge>
  );
}
