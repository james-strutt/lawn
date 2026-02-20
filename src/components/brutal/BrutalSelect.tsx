import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BrutalSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const BrutalSelect = forwardRef<HTMLSelectElement, BrutalSelectProps>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 font-mono text-xs uppercase font-bold tracking-wider">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'input-brutal w-full cursor-pointer',
            error && 'border-semantic-negative',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1 text-xs font-mono text-semantic-negative">
            {error}
          </p>
        )}
      </div>
    );
  }
);

BrutalSelect.displayName = 'BrutalSelect';

export default BrutalSelect;
