import { X } from 'lucide-react';
import type { DashboardFilters, FilterOptions, FilterValue } from '@/types/corporate';
import { Button } from '@/components/ui/Button';

type FiltersBarProps = {
  filters: DashboardFilters;
  options: FilterOptions;
  onChange: (key: keyof DashboardFilters, value: FilterValue) => void;
  onReset: () => void;
};

type FilterSelectProps = {
  label: string;
  value: FilterValue;
  options: string[];
  onChange: (value: FilterValue) => void;
};

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="flex min-w-[180px] flex-1 flex-col gap-1.5">
      <span className="pl-1 text-[12px] font-medium tracking-[0.02em] text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 outline-none transition hover:border-white/15 focus:border-neon-cyan/50 focus:shadow-[0_0_0_1px_rgba(77,226,255,0.18)]"
      >
        <option value="all">Все</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-950 text-slate-100">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FiltersBar({ filters, options, onChange, onReset }: FiltersBarProps) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 shadow-panel backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Фильтры данных</h2>
        </div>
        <Button onClick={onReset}>
          Сбросить
          <X className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FilterSelect
          label="Регион"
          value={filters.region}
          options={options.regions}
          onChange={(value) => onChange('region', value)}
        />
        <FilterSelect
          label="Источник"
          value={filters.source}
          options={options.sources}
          onChange={(value) => onChange('source', value)}
        />
        <FilterSelect
          label="Год"
          value={filters.year}
          options={options.years.map(String)}
          onChange={(value) => onChange('year', value)}
        />
      </div>
    </section>
  );
}
