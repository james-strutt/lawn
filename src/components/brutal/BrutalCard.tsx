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
      className={cn('border-brutal border-black bg-white shadow-brutal-lg', className)}
      {...props}
    >
      {header && (
        <div className={cn(
          'px-4 py-3 font-mono uppercase text-xs font-bold tracking-wider',
          headerBgClasses[headerBg]
        )}>
          {header}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
