import { ChevronRight, PanelLeftClose } from 'lucide-react';
import { menuItems } from '@/data/dashboardConfig';
import type { DashboardSectionId } from '@/types/corporate';
import { cn } from '@/lib/utils';

type SidebarProps = {
  activeSection: DashboardSectionId;
  onNavigate: (sectionId: DashboardSectionId) => void;
};

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="relative flex h-full w-full max-w-[280px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-panel shadow-panel">
      <div className="pointer-events-none absolute inset-x-4 top-0 h-32 rounded-full bg-neon-violet/10 blur-3xl" />
      <div className="panel-scroll relative flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-8 flex items-center justify-between rounded-3xl border border-white/8 bg-white/[0.03] px-4 py-3">
          <div className="mt-1 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-cyber shadow-neon">
              <span className="text-lg font-semibold text-white">F</span>
            </div>
          <div>
            <div className="font-semibold text-white">FORIT TECH</div>
            <div className="text-xs text-slate-400">Панель анализа собственников</div>
          </div>
          </div>
          <button className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60">
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <nav className="relative flex flex-col gap-2">
          {menuItems.map(({ id, label, icon: Icon }) => {
            const active = activeSection === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className={cn(
                  'group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-2xl border px-4 py-3 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60',
                  active
                    ? 'border-white/15 bg-white/[0.08] text-white shadow-[0_12px_28px_rgba(79,124,255,0.16)]'
                    : 'border-transparent bg-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-slate-100',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <span
                  className={cn(
                    'pointer-events-none absolute inset-y-3 left-0 w-1 rounded-full bg-gradient-cyber transition-all duration-300',
                    active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50',
                  )}
                />
                <span
                  className={cn(
                    'pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.06] via-transparent to-transparent opacity-0 transition duration-300',
                    active ? 'opacity-100' : 'group-hover:opacity-100',
                  )}
                />
                <span className="relative flex items-center gap-3">
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-2xl border transition duration-300',
                      active
                        ? 'border-neon-cyan/25 bg-gradient-cyber text-white shadow-neon'
                        : 'border-white/8 bg-white/[0.035] text-slate-400 group-hover:-translate-y-0.5 group-hover:border-white/12 group-hover:text-slate-100',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-medium">{label}</span>
                </span>
                <ChevronRight
                  className={cn(
                    'relative h-4 w-4 transition duration-300',
                    active
                      ? 'translate-x-0 text-white/80'
                      : 'text-slate-600 group-hover:translate-x-0.5 group-hover:text-slate-300',
                  )}
                />
              </button>
            );
          })}
        </nav>

      </div>

      <div className="pointer-events-none absolute inset-x-4 bottom-0 h-12 bg-gradient-to-t from-[#0d1324] via-[#0d1324]/78 to-transparent" />
    </aside>
  );
}
