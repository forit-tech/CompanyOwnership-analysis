import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BarChart3,
  Building2,
  Compass,
  CreditCard,
  Database,
  LayoutDashboard,
  Map,
  Rocket,
  Settings,
  Users,
} from 'lucide-react';
import type { DashboardSectionId, DashboardStatId } from '@/types/corporate';

export type MenuItem = {
  id: DashboardSectionId;
  label: string;
  icon: LucideIcon;
};

export const menuItems: MenuItem[] = [
  { id: 'overview', label: 'Обзор', icon: LayoutDashboard },
  { id: 'insights', label: 'Инсайты', icon: BarChart3 },
  { id: 'owners', label: 'Владельцы', icon: Users },
  { id: 'companies', label: 'Компании', icon: Building2 },
  { id: 'regions', label: 'Регионы', icon: Map },
  { id: 'sources', label: 'Источники', icon: CreditCard },
  { id: 'quality', label: 'Качество', icon: Activity },
  { id: 'growth', label: 'Динамика', icon: Rocket },
  { id: 'settings', label: 'Настройки', icon: Settings },
];

export const statMeta = [
  {
    id: 'totalRecords' satisfies DashboardStatId,
    title: 'Всего записей',
    icon: Database,
    accent: 'gradient-royal',
  },
  {
    id: 'averageOwnership' satisfies DashboardStatId,
    title: 'Средняя доля',
    icon: Compass,
    accent: 'gradient-cyber',
  },
  {
    id: 'totalCompanies' satisfies DashboardStatId,
    title: 'Уникальных компаний',
    icon: Building2,
    accent: 'default',
  },
  {
    id: 'totalOwners' satisfies DashboardStatId,
    title: 'Уникальных владельцев',
    icon: Users,
    accent: 'default',
  },
] as const;

export const sourcePalette = ['#4F7CFF', '#8B5CF6', '#4DE2FF', '#22C55E', '#F59E0B', '#F43F5E'];
