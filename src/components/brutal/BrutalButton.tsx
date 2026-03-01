import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

const BrutalButton = forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'border-2 sm:border-brutal border-black font-mono uppercase font-bold transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      default: 'bg-white text-black hover:bg-surface-secondary shadow-brutal-sm sm:shadow-brutal hover:shadow-brutal-hover active:shadow-none',
      primary: 'bg-brand-accent text-white border-brand-accent shadow-brutal-sm sm:shadow-brutal hover:shadow-brutal-hover active:shadow-none',
      danger: 'bg-semantic-negative text-white border-semantic-negative shadow-brutal-sm sm:shadow-brutal-danger hover:shadow-brutal-hover active:shadow-none',
      success: 'bg-semantic-positive text-white border-semantic-positive shadow-brutal-sm sm:shadow-brutal-success hover:shadow-brutal-hover active:shadow-none',
    };

    const sizeClasses = {
      sm: 'px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs',
      md: 'px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm',
      lg: 'px-5 sm:px-8 py-3 sm:py-4 text-sm sm:text-base',
    };

    const hoverTransform = 'hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px]';

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          hoverTransform,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

BrutalButton.displayName = 'BrutalButton';

export default BrutalButton;
