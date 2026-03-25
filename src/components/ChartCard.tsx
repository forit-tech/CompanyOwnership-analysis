import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ChartCardProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function ChartCard({
  title,
  description,
  action,
  className,
  children,
}: ChartCardProps) {
  return (
    <section
      className={cn(
        'rounded-[1.75rem] border border-white/10 bg-gradient-panel p-5 shadow-panel transition duration-300 hover:border-white/15',
        className,
      )}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
