import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BrutalToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const BrutalToggle = forwardRef<HTMLInputElement, BrutalToggleProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            'w-5 h-5 border-brutal border-black bg-white cursor-pointer',
            'checked:bg-brand-accent checked:border-brand-accent',
            'focus:outline-none focus:ring-0',
            className
          )}
          {...props}
        />
        {label && (
          <span className="ml-3 font-mono text-sm font-medium uppercase">
            {label}
          </span>
        )}
      </label>
    );
  }
);

BrutalToggle.displayName = 'BrutalToggle';

export default BrutalToggle;
