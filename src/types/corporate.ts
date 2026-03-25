import type { LucideIcon } from 'lucide-react';

export type RawCorporateCsvRow = {
  FIO_owner?: string;
  Company_name?: string;
  INN_company?: string;
  Ownership?: string;
  Region?: string;
  Source?: string;
  Ownership_date?: string;
};

export type CorporateRecord = {
  id: string;
  owner: string | null;
  companyName: string | null;
  innCompany: string | null;
  ownership: number | null;
  region: string | null;
  source: string | null;
  ownershipDate: Date | null;
  year: number | null;
};

export type FilterValue = 'all' | string;

export type DashboardFilters = {
  region: FilterValue;
  source: FilterValue;
  year: FilterValue;
};

export type FilterOptions = {
  regions: string[];
  sources: string[];
  years: number[];
};

export type DashboardSectionId =
  | 'overview'
  | 'insights'
  | 'owners'
  | 'companies'
  | 'regions'
  | 'sources'
  | 'quality'
  | 'growth'
  | 'settings';

export type StatAccent = 'gradient-cyber' | 'gradient-royal' | 'default';

export type DashboardStatId =
  | 'totalRecords'
  | 'totalOwners'
  | 'totalCompanies'
  | 'averageOwnership';

export type DashboardStat = {
  id: DashboardStatId;
  title: string;
  value: string;
  delta: string;
  description: string;
  icon: LucideIcon;
  accent: StatAccent;
  trend: number[];
};

export type TrendPoint = {
  year: string;
  records: number;
  owners: number;
};

export type SourcePoint = {
  name: string;
  value: number;
  fill: string;
};

export type RegionPoint = {
  region: string;
  records: number;
  averageOwnership: number;
};

export type TopOwnerPoint = {
  name: string;
  records: number;
  averageOwnership: number | null;
  latestDateLabel: string;
};

export type DataQualityMetrics = {
  missingInnCompany: number;
  missingOwnership: number;
  ownershipAnomalies: number;
};

export type DashboardMetrics = {
  totalRecords: number;
  totalOwners: number;
  totalCompanies: number;
  averageOwnership: number | null;
};
