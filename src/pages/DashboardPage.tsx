import { MoreHorizontal, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { TooltipProps } from 'recharts';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '@/components/ChartCard';
import { DataQualityCard } from '@/components/DataQualityCard';
import { DataTableCard } from '@/components/DataTableCard';
import { FiltersBar } from '@/components/FiltersBar';
import { RecentUsersCard } from '@/components/RecentUsersCard';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { Topbar } from '@/components/Topbar';
import { Button } from '@/components/ui/Button';
import { useCorporateData } from '@/hooks/useCorporateData';
import type { DashboardFilters, DashboardSectionId, FilterValue } from '@/types/corporate';
import {
  filterRecords,
  getDataQualityMetrics,
  getFilterOptions,
  getMetrics,
  getRegionData,
  getSourceData,
  getStatCards,
  getTopOwners,
  getTrendData,
} from '@/utils/corporateData';

const axisStyle = {
  fill: '#64748B',
  fontSize: 12,
};

const regionAxisStyle = {
  fill: '#64748B',
  fontSize: 11,
};

const sectionAnchorClass = 'scroll-mt-28';

type TrendMode = 'all' | 'records' | 'owners';
type OwnerSortMode = 'records' | 'ownership';

function cycleTrendMode(mode: TrendMode): TrendMode {
  if (mode === 'all') {
    return 'records';
  }

  if (mode === 'records') {
    return 'owners';
  }

  return 'all';
}

function SourceTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];
  const payloadItem = item.payload as { fill?: string } | undefined;
  const color =
    typeof payloadItem?.fill === 'string'
      ? payloadItem.fill
      : typeof item.color === 'string'
        ? item.color
        : '#4DE2FF';

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/88 px-3 py-2.5 text-sm text-slate-100 shadow-[0_18px_48px_rgba(2,6,23,0.45)] backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor]"
          style={{ backgroundColor: color, color }}
        />
        <span className="font-medium text-white">{item.name}</span>
      </div>
      <div className="mt-1 text-xs text-slate-400">
        Записей: <span className="font-medium text-slate-100">{item.value}</span>
      </div>
    </div>
  );
}

type ActiveSourceShapeProps = {
  cx?: number | string;
  cy?: number | string;
  innerRadius?: number | string;
  outerRadius?: number | string;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
  payload?: {
    index?: number;
  };
};

function ActiveSourceShape({
  cx = 0,
  cy = 0,
  innerRadius = 0,
  outerRadius = 0,
  startAngle = 0,
  endAngle = 0,
  fill = '#4DE2FF',
  payload,
}: ActiveSourceShapeProps) {
  const glowIndex = payload?.index ?? 0;
  const centerX = typeof cx === 'number' ? cx : Number(cx);
  const centerY = typeof cy === 'number' ? cy : Number(cy);
  const outer = typeof outerRadius === 'number' ? outerRadius : Number(outerRadius);
  const inner = typeof innerRadius === 'number' ? innerRadius : Number(innerRadius);

  return (
    <g>
      <Sector
        cx={centerX}
        cy={centerY}
        innerRadius={Math.max(inner - 1, 0)}
        outerRadius={outer + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.28}
        filter={`url(#sourceGlowActive-${glowIndex})`}
      />
      <Sector
        cx={centerX}
        cy={centerY}
        innerRadius={inner}
        outerRadius={outer + 2}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="rgba(255,255,255,0.26)"
        strokeWidth={1.8}
        filter={`url(#sourceGlowActive-${glowIndex})`}
      />
    </g>
  );
}

export function DashboardPage() {
  const { records, loading, error } = useCorporateData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<DashboardSectionId>('overview');
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [activeSourceIndex, setActiveSourceIndex] = useState<number | null>(null);
  const [trendMode, setTrendMode] = useState<TrendMode>('all');
  const [ownerSortMode, setOwnerSortMode] = useState<OwnerSortMode>('records');
  const [filters, setFilters] = useState<DashboardFilters>({
    region: 'all',
    source: 'all',
    year: 'all',
  });

  const filterOptions = useMemo(() => getFilterOptions(records), [records]);
  const filteredRecords = useMemo(
    () => filterRecords(records, filters, searchTerm),
    [filters, records, searchTerm],
  );
  const metrics = useMemo(() => getMetrics(filteredRecords), [filteredRecords]);
  const trendData = useMemo(() => getTrendData(filteredRecords), [filteredRecords]);
  const sourceData = useMemo(() => getSourceData(filteredRecords), [filteredRecords]);
  const sourceChartData = useMemo(
    () => sourceData.map((item, index) => ({ ...item, index })),
    [sourceData],
  );
  const regionData = useMemo(() => getRegionData(filteredRecords), [filteredRecords]);
  const rawTopOwners = useMemo(() => getTopOwners(filteredRecords), [filteredRecords]);
  const qualityMetrics = useMemo(() => getDataQualityMetrics(filteredRecords), [filteredRecords]);
  const stats = useMemo(
    () => getStatCards(filteredRecords, records, trendData),
    [filteredRecords, records, trendData],
  );

  const topOwners = useMemo(() => {
    const owners = [...rawTopOwners];

    if (ownerSortMode === 'ownership') {
      return owners
        .sort((left, right) => (right.averageOwnership ?? -1) - (left.averageOwnership ?? -1))
        .slice(0, 6);
    }

    return owners;
  }, [ownerSortMode, rawTopOwners]);

  const sourceTotal = sourceData.reduce((sum, item) => sum + item.value, 0);
  const hasActiveSourceFilter = filters.source !== 'all';

  useEffect(() => {
    const sectionElements = Array.from(document.querySelectorAll<HTMLElement>('[data-section-id]'));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        const nextSectionId = visibleEntries[0]?.target.getAttribute(
          'data-section-id',
        ) as DashboardSectionId | null;

        if (nextSectionId) {
          setActiveSection(nextSectionId);
        }
      },
      {
        rootMargin: '-15% 0px -50% 0px',
        threshold: [0.2, 0.35, 0.5, 0.7],
      },
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId: DashboardSectionId) => {
    setActiveSection(sectionId);
    document
      .querySelector<HTMLElement>(`[data-section-id="${sectionId}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFilterChange = (key: keyof DashboardFilters, value: FilterValue) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (selectedOwner && value.trim() !== selectedOwner) {
      setSelectedOwner(null);
    }
  };

  const handleOwnerSelect = (ownerName: string) => {
    const nextSelectedOwner = selectedOwner === ownerName ? null : ownerName;
    setSelectedOwner(nextSelectedOwner);
    setSearchTerm(nextSelectedOwner ?? '');
    scrollToSection('companies');
  };

  const handleRegionSelect = (region: string) => {
    handleFilterChange('region', filters.region === region ? 'all' : region);
    scrollToSection('regions');
  };

  const handleSourceSelect = (source: string) => {
    handleFilterChange('source', filters.source === source ? 'all' : source);
    scrollToSection('sources');
  };

  const resetFilters = () => {
    setFilters({
      region: 'all',
      source: 'all',
      year: 'all',
    });
    setSearchTerm('');
    setSelectedOwner(null);
  };

  const trendActionLabel =
    trendMode === 'all'
      ? 'Все метрики'
      : trendMode === 'records'
        ? 'Только записи'
        : 'Только владельцы';

  const settingsOwnersLabel =
    ownerSortMode === 'records' ? 'Рейтинг по числу записей' : 'Рейтинг по средней доле';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-hero-grid opacity-90" />
      <div className="pointer-events-none fixed left-[-10%] top-[10%] h-80 w-80 rounded-full bg-neon-violet/12 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-12%] right-[-8%] h-80 w-80 rounded-full bg-neon-cyan/10 blur-[160px]" />

      <main className="relative mx-auto flex max-w-[1600px] flex-col gap-4 p-4 lg:flex-row lg:p-6">
        <div className="lg:h-[calc(100vh-3rem)] lg:w-[280px] lg:flex-none">
          <Sidebar activeSection={activeSection} onNavigate={scrollToSection} />
        </div>

        <div className="panel-scroll flex min-w-0 flex-1 flex-col gap-4 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
          <section data-section-id="overview" className={sectionAnchorClass}>
            <Topbar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              totalRecords={metrics.totalRecords}
              onOpenSettings={() => scrollToSection('settings')}
            />
          </section>

          <div className={sectionAnchorClass}>
            <FiltersBar
              filters={filters}
              options={filterOptions}
              onChange={handleFilterChange}
              onReset={resetFilters}
            />
          </div>

          {loading ? (
            <section className="rounded-[1.75rem] border border-white/10 bg-gradient-panel p-7 shadow-panel">
              <div className="text-lg font-semibold text-white">Загрузка CSV-данных...</div>
              <div className="mt-2 text-sm text-slate-400">
                Разбираю строки, строю агрегаты и подключаю фильтры к панели.
              </div>
            </section>
          ) : null}

          {error ? (
            <section className="rounded-[1.75rem] border border-rose-400/20 bg-rose-500/10 p-6 shadow-panel">
              <div className="text-lg font-semibold text-white">Ошибка загрузки CSV</div>
              <div className="mt-2 text-sm text-rose-100/80">{error}</div>
            </section>
          ) : null}

          <section className={`grid gap-5 md:grid-cols-2 xl:grid-cols-4 ${sectionAnchorClass}`}>
            {stats.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </section>

          <section
            data-section-id="insights"
            className={`grid gap-4 xl:grid-cols-[1.6fr_1fr] ${sectionAnchorClass}`}
          >
            <div data-section-id="growth" className={sectionAnchorClass}>
              <ChartCard
                title="Динамика владения"
                description="Годовая динамика по числу записей и уникальных владельцев в текущей выборке."
                action={
                  <Button onClick={() => setTrendMode((current) => cycleTrendMode(current))}>
                    {trendActionLabel}
                    <MoreHorizontal className="ml-2 h-4 w-4" />
                  </Button>
                }
              >
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData} barGap={12}>
                      <defs>
                        <linearGradient id="barSessions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4F7CFF" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#4F7CFF" stopOpacity={0.22} />
                        </linearGradient>
                        <linearGradient id="barUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4DE2FF" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#4DE2FF" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={axisStyle} />
                      <YAxis axisLine={false} tickLine={false} tick={axisStyle} />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        contentStyle={{
                          borderRadius: '16px',
                          border: '1px solid rgba(255,255,255,0.08)',
                          background: 'rgba(2, 6, 23, 0.95)',
                          color: '#E2E8F0',
                        }}
                      />
                      {(trendMode === 'all' || trendMode === 'records') && (
                        <Bar
                          dataKey="records"
                          name="Записи"
                          radius={[12, 12, 6, 6]}
                          fill="url(#barSessions)"
                          maxBarSize={24}
                        />
                      )}
                      {(trendMode === 'all' || trendMode === 'owners') && (
                        <Bar
                          dataKey="owners"
                          name="Владельцы"
                          radius={[12, 12, 6, 6]}
                          fill="url(#barUsers)"
                          maxBarSize={24}
                        />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>

            <div data-section-id="sources" className={sectionAnchorClass}>
              <ChartCard
                title="Распределение по источникам"
                description="Нажмите на источник, чтобы применить фильтр."
              >
                <div className="flex min-h-[344px] flex-col gap-4 pt-1">
                  <div className="flex justify-center pb-1">
                    <div className="relative h-[206px] w-full max-w-[260px]">
                      <div className="pointer-events-none absolute inset-6 rounded-full bg-[radial-gradient(circle,rgba(148,163,184,0.12),transparent_65%)] blur-2xl" />
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <defs>
                            {sourceChartData.map((entry, index) => (
                              <filter
                                key={entry.name}
                                id={`sourceGlow-${index}`}
                                x="-40%"
                                y="-40%"
                                width="180%"
                                height="180%"
                              >
                                <feDropShadow
                                  dx="0"
                                  dy="0"
                                  stdDeviation={filters.source === entry.name ? 5.5 : 3.5}
                                  floodColor={entry.fill}
                                  floodOpacity={filters.source === entry.name ? 0.34 : 0.2}
                                />
                              </filter>
                            ))}
                            {sourceChartData.map((entry, index) => (
                              <filter
                                key={`${entry.name}-active`}
                                id={`sourceGlowActive-${index}`}
                                x="-60%"
                                y="-60%"
                                width="220%"
                                height="220%"
                              >
                                <feDropShadow
                                  dx="0"
                                  dy="0"
                                  stdDeviation="8"
                                  floodColor={entry.fill}
                                  floodOpacity="0.4"
                                />
                              </filter>
                            ))}
                          </defs>
                          <Pie
                            data={sourceChartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={72}
                            outerRadius={98}
                            paddingAngle={6}
                            stroke="rgba(11,16,32,0.95)"
                            strokeWidth={6}
                            activeIndex={activeSourceIndex ?? undefined}
                            activeShape={<ActiveSourceShape />}
                            onMouseEnter={(_, index) => setActiveSourceIndex(index)}
                            onMouseLeave={() => setActiveSourceIndex(null)}
                          >
                            {sourceChartData.map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={entry.fill}
                                filter={`url(#sourceGlow-${index})`}
                                stroke={
                                  filters.source === entry.name
                                    ? 'rgba(255,255,255,0.24)'
                                    : 'rgba(255,255,255,0.08)'
                                }
                                strokeWidth={filters.source === entry.name ? 1.6 : 1}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<SourceTooltip />} cursor={false} position={{ x: 156, y: 10 }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <div className="rounded-full border border-white/6 bg-slate-950/55 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md">
                          <div className="text-center text-3xl font-semibold text-white">{sourceTotal}</div>
                          <div className="mt-1 text-center text-sm text-slate-400">записей</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid w-full gap-2 pb-1">
                    {sourceChartData.map((item, index) => {
                      const isActive = filters.source === item.name;
                      const isHovered = activeSourceIndex === index;

                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => handleSourceSelect(item.name)}
                          onMouseEnter={() => setActiveSourceIndex(index)}
                          onMouseLeave={() => setActiveSourceIndex(null)}
                          className={`group flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 ${
                            isActive
                              ? 'border-cyan-400/25 bg-cyan-400/[0.08] shadow-[0_10px_30px_rgba(77,226,255,0.12)]'
                              : hasActiveSourceFilter
                                ? 'border-white/8 bg-white/[0.03] opacity-75 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.05] hover:opacity-100 hover:shadow-[0_10px_24px_rgba(15,23,42,0.28)]'
                                : 'border-white/8 bg-white/[0.03] hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.05] hover:shadow-[0_10px_24px_rgba(15,23,42,0.28)]'
                          }`}
                          aria-pressed={isActive}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span
                              className={`h-3 w-3 flex-none rounded-full shadow-[0_0_14px_currentColor] transition duration-300 ${
                                isActive || isHovered
                                  ? 'scale-110 shadow-[0_0_16px_currentColor]'
                                  : 'group-hover:scale-105'
                              }`}
                              style={{ backgroundColor: item.fill, color: item.fill }}
                            />
                            <span
                              className={`truncate text-sm transition duration-300 ${
                                isActive ? 'text-white' : 'text-slate-300 group-hover:text-slate-100'
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>
                          <div className="ml-4 flex flex-none items-center gap-2">
                            {isActive ? (
                              <span
                                className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.8)]"
                                aria-hidden="true"
                              />
                            ) : null}
                            <span
                              className={`min-w-[2ch] text-right text-sm font-medium transition duration-300 ${
                                isActive ? 'text-white' : 'text-slate-200'
                              }`}
                            >
                              {item.value}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </ChartCard>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
            <div data-section-id="regions" className={sectionAnchorClass}>
              <ChartCard
                title="Региональный срез"
                description="Топ регионов по числу записей. Кнопки снизу позволяют сразу сузить выборку."
              >
                <div className="h-[324px] px-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={regionData}
                      margin={{ top: 8, right: 8, left: 14, bottom: 18 }}
                    >
                      <defs>
                        <linearGradient id="areaRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="areaVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4DE2FF" stopOpacity={0.55} />
                          <stop offset="95%" stopColor="#4DE2FF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
                      <XAxis
                        dataKey="region"
                        axisLine={false}
                        tickLine={false}
                        tick={regionAxisStyle}
                        interval={0}
                        tickMargin={14}
                        height={52}
                        padding={{ left: 22, right: 14 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={axisStyle}
                        width={36}
                        tickMargin={10}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '16px',
                          border: '1px solid rgba(255,255,255,0.08)',
                          background: 'rgba(2, 6, 23, 0.95)',
                          color: '#E2E8F0',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="records"
                        name="Записи"
                        stroke="#4DE2FF"
                        fill="url(#areaVisits)"
                        strokeWidth={2.5}
                      />
                      <Area
                        type="monotone"
                        dataKey="averageOwnership"
                        name="Средняя доля"
                        stroke="#8B5CF6"
                        fill="url(#areaRevenue)"
                        strokeWidth={2.5}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {regionData.map((item) => {
                    const isActive = filters.region === item.region;

                    return (
                      <button
                        key={item.region}
                        type="button"
                        onClick={() => handleRegionSelect(item.region)}
                        className={`cursor-pointer rounded-2xl border px-4 py-2 text-sm transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 ${
                          isActive
                            ? 'border-cyan-400/25 bg-cyan-400/[0.08] text-white'
                            : 'border-white/10 bg-white/[0.03] text-slate-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.05]'
                        }`}
                      >
                        {item.region}
                      </button>
                    );
                  })}
                </div>
              </ChartCard>
            </div>

            <div data-section-id="owners" className={sectionAnchorClass}>
              <RecentUsersCard
                owners={topOwners}
                selectedOwner={selectedOwner}
                sortMode={ownerSortMode}
                onToggleSort={() =>
                  setOwnerSortMode((current) => (current === 'records' ? 'ownership' : 'records'))
                }
                onOwnerSelect={handleOwnerSelect}
              />
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.65fr_1fr]">
            <div data-section-id="companies" className={sectionAnchorClass}>
              <DataTableCard records={filteredRecords} highlightTerm={searchTerm} />
            </div>
            <div data-section-id="quality" className={sectionAnchorClass}>
              <DataQualityCard metrics={qualityMetrics} />
            </div>
          </section>

          <section data-section-id="settings" className={sectionAnchorClass}>
            <ChartCard
              title="Настройки панели"
              description="Быстрое управление интерактивностью без изменения структуры интерфейса."
              action={
                <Button onClick={resetFilters} variant="primary">
                  Сбросить всё
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              }
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setTrendMode((current) => cycleTrendMode(current))}
                  className="cursor-pointer rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60"
                >
                  <div className="text-sm font-semibold text-white">Режим динамики</div>
                  <div className="mt-2 text-sm text-slate-400">{trendActionLabel}</div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setOwnerSortMode((current) => (current === 'records' ? 'ownership' : 'records'))
                  }
                  className="cursor-pointer rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60"
                >
                  <div className="text-sm font-semibold text-white">Рейтинг владельцев</div>
                  <div className="mt-2 text-sm text-slate-400">{settingsOwnersLabel}</div>
                </button>
              </div>
            </ChartCard>
          </section>
        </div>
      </main>
    </div>
  );
}
