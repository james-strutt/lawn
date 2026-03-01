import { cn } from '@/lib/utils';
import type { RentVsBuyVerdict } from '@/types/rentVsBuy';

interface RentVsBuyVerdictCardProps {
  verdict: RentVsBuyVerdict;
  confidence: number;
  reasoning: string[];
}

const VERDICT_CONFIG: Record<RentVsBuyVerdict, { label: string; bgClass: string; textClass: string }> = {
  buy: {
    label: 'YOU SHOULD BUY',
    bgClass: 'bg-semantic-positive',
    textClass: 'text-white',
  },
  rent: {
    label: 'YOU SHOULD RENT',
    bgClass: 'bg-semantic-negative',
    textClass: 'text-white',
  },
  'close-call': {
    label: "IT'S CLOSE",
    bgClass: 'bg-semantic-warning',
    textClass: 'text-black',
  },
};

export default function RentVsBuyVerdictCard({ verdict, confidence, reasoning }: RentVsBuyVerdictCardProps) {
  const config = VERDICT_CONFIG[verdict];

  return (
    <div className="border-brutal border-black shadow-brutal overflow-hidden">
      {/* Verdict Badge */}
      <div className={cn('px-6 py-4 text-center', config.bgClass, config.textClass)}>
        <div className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wide sm:tracking-widest">
          {config.label}
        </div>
        <div className="font-mono text-xs mt-1 opacity-80 uppercase">
          Confidence: {Math.round(confidence * 100)}%
        </div>
      </div>

      {/* Reasoning */}
      <div className="px-4 py-3 bg-white">
        <ul className="space-y-1">
          {reasoning.map((reason, i) => (
            <li key={i} className="font-mono text-xs flex gap-2">
              <span className="text-gray-400 flex-shrink-0">
                {verdict === 'buy' ? '+' : verdict === 'rent' ? '-' : '~'}
              </span>
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
