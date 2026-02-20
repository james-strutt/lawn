import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BrutalMetricProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  detail?: string;
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

export default function BrutalMetric({
  label,
  value,
  detail,
  variant = 'default',
  className,
  ...props
}: BrutalMetricProps) {
  const valueColorClasses = {
    default: 'text-black',
    success: 'text-semantic-positive',
    danger: 'text-semantic-negative',
    warning: 'text-semantic-warning',
  };

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <div className="font-mono text-xs uppercase text-gray-600 tracking-wider mb-1">
        {label}
      </div>
      <div className={cn('font-mono text-2xl font-bold', valueColorClasses[variant])}>
        {value}
      </div>
      {detail && (
        <div className="font-mono text-xs text-gray-500 mt-1">
          {detail}
        </div>
      )}
    </div>
  );
}
