import { AlertTriangle, Binary, FileX2 } from 'lucide-react';
import type { DataQualityMetrics } from '@/types/corporate';

type DataQualityCardProps = {
  metrics: DataQualityMetrics;
};

const qualityItems = [
  {
    key: 'missingInnCompany',
    label: 'Пустой ИНН',
    description: 'Строки, где `INN_company` не заполнен.',
    icon: Binary,
    accent: 'from-cyan-400/20 to-blue-500/10 text-cyan-200',
  },
  {
    key: 'missingOwnership',
    label: 'Нет доли',
    description: 'Строки без числового значения `Ownership`.',
    icon: FileX2,
    accent: 'from-violet-400/20 to-fuchsia-500/10 text-violet-200',
  },
  {
    key: 'ownershipAnomalies',
    label: 'Аномалии доли',
    description: 'Строки, где `Ownership > 100` или `<= 0`.',
    icon: AlertTriangle,
    accent: 'from-amber-400/20 to-orange-500/10 text-amber-200',
  },
] as const;

export function DataQualityCard({ metrics }: DataQualityCardProps) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-gradient-panel p-5 shadow-panel">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Качество данных</h2>
        <p className="mt-1 text-sm text-slate-400">
          Null-значения и аномалии владения, найденные в загруженном CSV.
        </p>
      </div>

      <div className="space-y-3">
        {qualityItems.map((item) => {
          const value = metrics[item.key];
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{item.label}</div>
                    <div className="mt-1 text-sm text-slate-400">{item.description}</div>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-white">{value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
