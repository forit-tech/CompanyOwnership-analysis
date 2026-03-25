import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from 'recharts';
import type { DashboardStat } from '@/types/corporate';
import { cn } from '@/lib/utils';

function TrendTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/90 px-3 py-2 text-xs text-slate-200 shadow-panel backdrop-blur-md">
      Тренд: {payload[0].value}
    </div>
  );
}

export function StatCard({ stat }: { stat: DashboardStat }) {
  const chartData = stat.trend.map((value, index) => ({
    index,
    value,
  }));

  const cardClasses =
    stat.accent === 'gradient-cyber'
      ? 'bg-gradient-cyber'
      : stat.accent === 'gradient-royal'
        ? 'bg-gradient-royal'
        : 'bg-gradient-panel';

  const isGradient = stat.accent !== 'default';
  const isCompaniesCard = stat.id === 'totalCompanies';
  const isOwnershipCard = stat.id === 'averageOwnership';
  const defaultAccentGlow = isCompaniesCard
    ? 'bg-[radial-gradient(circle_at_top_right,rgba(77,226,255,0.18),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]'
    : isOwnershipCard
      ? 'bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.14),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]'
      : '';
  const defaultIconTone = isCompaniesCard
    ? 'border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-200'
    : isOwnershipCard
      ? 'border-violet-400/15 bg-violet-400/[0.08] text-violet-200'
      : 'border-white/8 bg-white/[0.04] text-neon-cyan';
  const mutedStroke = isCompaniesCard ? '#67E8F9' : isOwnershipCard ? '#A78BFA' : '#4DE2FF';
  const mutedFillId = isCompaniesCard
    ? `${stat.title}-fill-cyan`
    : isOwnershipCard
      ? `${stat.title}-fill-violet`
      : `${stat.title}-fill-muted`;

  return (
    <div
      className={cn(
        'group relative flex min-h-[250px] flex-col overflow-hidden rounded-[1.75rem] border p-5 shadow-glow transition duration-300 hover:-translate-y-1 hover:border-white/15',
        isGradient
          ? 'border-white/10 text-white shadow-neon'
          : 'border-white/10 text-white hover:bg-white/[0.045]',
        cardClasses,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-white/5 opacity-70 blur-2xl" />
      {!isGradient ? (
        <>
          <div className={cn('pointer-events-none absolute inset-0 opacity-100', defaultAccentGlow)} />
          <div className="pointer-events-none absolute right-4 top-4 h-24 w-24 rounded-full bg-white/[0.04] blur-3xl" />
        </>
      ) : null}
      <div className="relative flex flex-1 flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className={cn('text-sm', isGradient ? 'text-white/70' : 'text-slate-400')}>
              {stat.title}
            </div>
          </div>
          <div
            className={cn(
              'flex h-12 w-12 flex-none items-center justify-center rounded-2xl border',
              isGradient
                ? 'border-white/15 bg-white/10'
                : defaultIconTone,
            )}
          >
            <stat.icon className="h-5 w-5" />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-5">
          <div className="space-y-2">
            <div className="text-3xl font-semibold tracking-tight">{stat.value}</div>
            <div className={cn('text-sm leading-6', isGradient ? 'text-white/80' : 'text-slate-400')}>
              <span className="font-medium text-white">{stat.delta}</span> {stat.description}
            </div>
          </div>

          <div className="h-[82px] pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`${stat.title}-fill`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(255,255,255,0.95)" />
                    <stop offset="95%" stopColor="rgba(255,255,255,0.04)" />
                  </linearGradient>
                  <linearGradient id={`${stat.title}-fill-muted`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(77,226,255,0.55)" />
                    <stop offset="95%" stopColor="rgba(77,226,255,0.02)" />
                  </linearGradient>
                  <linearGradient id={`${stat.title}-fill-cyan`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(103,232,249,0.5)" />
                    <stop offset="95%" stopColor="rgba(103,232,249,0.03)" />
                  </linearGradient>
                  <linearGradient id={`${stat.title}-fill-violet`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(167,139,250,0.48)" />
                    <stop offset="95%" stopColor="rgba(45,212,191,0.03)" />
                  </linearGradient>
                </defs>
                <Tooltip content={<TrendTooltip />} cursor={false} />
                <Area
                  dataKey="value"
                  type="monotone"
                  stroke={isGradient ? 'rgba(255,255,255,0.92)' : mutedStroke}
                  strokeWidth={2.6}
                  fill={`url(#${isGradient ? `${stat.title}-fill` : mutedFillId})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
