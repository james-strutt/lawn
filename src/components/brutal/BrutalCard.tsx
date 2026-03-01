import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface BrutalCardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  headerBg?: 'black' | 'accent' | 'white';
}

export default function BrutalCard({
  header,
  headerBg = 'black',
  children,
  className,
  ...props
}: BrutalCardProps) {
  const headerBgClasses = {
    black: 'bg-black text-white',
    accent: 'bg-brand-accent text-white',
    white: 'bg-white text-black border-b-2 border-black',
  };

  return (
    <div
      className={cn('border-2 sm:border-brutal border-black bg-white shadow-brutal-sm sm:shadow-brutal-lg', className)}
      {...props}
    >
      {header && (
        <div className={cn(
          'px-3 sm:px-4 py-2 sm:py-3 font-mono uppercase text-[10px] sm:text-xs font-bold tracking-wider',
          headerBgClasses[headerBg]
        )}>
          {header}
        </div>
      )}
      <div className="p-3 sm:p-4">
        {children}
      </div>
    </div>
  );
}
