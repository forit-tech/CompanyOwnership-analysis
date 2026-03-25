import { ChevronDown } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';

type TopbarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalRecords: number;
  onOpenSettings: () => void;
};

export function Topbar({
  searchTerm,
  onSearchChange,
  totalRecords,
  onOpenSettings,
}: TopbarProps) {
  return (
    <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.03] px-5 py-5 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <div className="text-sm uppercase tracking-[0.32em] text-slate-500">Аналитическая панель</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Обзор дашборда
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Собственники, компании, доли и источники — в одной интерактивной панели.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[480px] lg:max-w-[640px] lg:flex-row lg:items-center lg:justify-end">
        <div className="w-full lg:flex-1">
          <SearchBar value={searchTerm} onChange={onSearchChange} />
        </div>
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex h-12 shrink-0 cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 pr-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-royal text-sm font-semibold text-white">
            ФИ
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">Искяндярова Ф.И</div>
            <div className="truncate text-xs text-slate-400">Аналитика данных</div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>
      </div>
    </header>
  );
}
