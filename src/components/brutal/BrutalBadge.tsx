import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BrutalBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'success' | 'danger' | 'warning';
}

export default function BrutalBadge({
  variant = 'default',
  children,
  className,
  ...props
}: BrutalBadgeProps) {
  const variantClasses = {
    default: 'bg-white text-black border-black',
    accent: 'bg-brand-accent text-white border-brand-accent',
    success: 'bg-semantic-positive text-white border-semantic-positive',
    danger: 'bg-semantic-negative text-white border-semantic-negative',
    warning: 'bg-semantic-warning text-black border-semantic-warning',
  };

  return (
    <span
      className={cn(
        'badge-brutal',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
