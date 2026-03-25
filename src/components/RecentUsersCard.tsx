import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { TopOwnerPoint } from '@/types/corporate';

type RecentUsersCardProps = {
  owners: TopOwnerPoint[];
  selectedOwner: string | null;
  sortMode: 'records' | 'ownership';
  onToggleSort: () => void;
  onOwnerSelect: (ownerName: string) => void;
};

export function RecentUsersCard({
  owners,
  selectedOwner,
  sortMode,
  onToggleSort,
  onOwnerSelect,
}: RecentUsersCardProps) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-gradient-panel p-5 shadow-panel">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Топ владельцев</h2>
          <p className="mt-1 text-sm text-slate-400">
            Нажатие на владельца сразу отфильтрует таблицу и связанные метрики.
          </p>
        </div>
        <Button onClick={onToggleSort}>
          {sortMode === 'records' ? 'По записям' : 'По доле'}
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {owners.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-6 text-sm text-slate-400">
            По текущим фильтрам владельцы не найдены.
          </div>
        ) : null}

        {owners.map((owner, index) => {
          const isSelected = selectedOwner === owner.name;

          return (
            <button
              key={owner.name}
              type="button"
              onClick={() => onOwnerSelect(owner.name)}
              className={cn(
                'flex w-full cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60',
                isSelected
                  ? 'border-cyan-400/25 bg-cyan-400/[0.09] shadow-[0_12px_28px_rgba(77,226,255,0.12)]'
                  : 'border-white/8 bg-white/[0.03] hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.05]',
              )}
            >
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold text-white transition duration-300',
                  index % 2 === 0 ? 'bg-gradient-cyber' : 'bg-gradient-royal',
                  isSelected && 'shadow-neon',
                )}
              >
                {owner.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="truncate font-medium text-white">{owner.name}</div>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/12 px-2 py-1 text-[11px] font-medium text-cyan-300">
                    {owner.records} строк
                  </span>
                </div>
                <div className="mt-1 truncate text-sm text-slate-400">
                  Средняя доля:{' '}
                  {owner.averageOwnership !== null ? `${owner.averageOwnership.toFixed(1)}%` : 'н/д'}
                </div>
              </div>
              <div className="hidden text-right sm:block">
                <div className="text-sm font-medium text-slate-200">Последняя дата</div>
                <div className="mt-1 text-xs text-slate-500">{owner.latestDateLabel}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
