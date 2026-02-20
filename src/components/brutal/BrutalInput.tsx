import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BrutalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const BrutalInput = forwardRef<HTMLInputElement, BrutalInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 font-mono text-xs uppercase font-bold tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'input-brutal w-full',
            error && 'border-semantic-negative',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs font-mono text-semantic-negative">
            {error}
          </p>
        )}
      </div>
    );
  }
);

BrutalInput.displayName = 'BrutalInput';

export default BrutalInput;
