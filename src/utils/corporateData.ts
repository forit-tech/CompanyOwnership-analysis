import Papa from 'papaparse';
import { statMeta, sourcePalette } from '@/data/dashboardConfig';
import type {
  CorporateRecord,
  DashboardFilters,
  DashboardMetrics,
  DashboardStat,
  DataQualityMetrics,
  FilterOptions,
  RawCorporateCsvRow,
  RegionPoint,
  SourcePoint,
  TopOwnerPoint,
  TrendPoint,
} from '@/types/corporate';

const UNKNOWN_REGION = 'Не указан';
const UNKNOWN_SOURCE = 'Не указан';
const UNKNOWN_OWNER = 'Неизвестный владелец';

function normalizeText(value: string | undefined): string | null {
  const normalized = value?.trim();

  if (!normalized) {
    return null;
  }

  const lowered = normalized.toLowerCase();
  if (lowered === 'null' || lowered === 'undefined' || lowered === 'nan') {
    return null;
  }

  return normalized;
}

function parseOwnership(value: string | undefined): number | null {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  const parsed = Number.parseFloat(normalized.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseOwnershipDate(value: string | undefined): Date | null {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function looksLikeMojibake(text: string): boolean {
  const suspiciousMatches = text.match(/[ÐÑРС][^\s,.;:!?]{1,2}/g) ?? [];
  const replacementMatches = text.match(/�/g) ?? [];

  return suspiciousMatches.length + replacementMatches.length > 4;
}

function getCyrillicScore(text: string): number {
  const cyrillicMatches = text.match(/[А-Яа-яЁё]/g) ?? [];
  const mojibakePenalty = (text.match(/[ÐÑРС][^\s,.;:!?]{1,2}/g) ?? []).length * 3;
  const replacementPenalty = (text.match(/�/g) ?? []).length * 5;

  return cyrillicMatches.length - mojibakePenalty - replacementPenalty;
}

export function decodeCsvBuffer(buffer: ArrayBuffer): string {
  const utf8 = new TextDecoder('utf-8').decode(buffer);
  const cp1251 = new TextDecoder('windows-1251').decode(buffer);

  if (!looksLikeMojibake(utf8) && getCyrillicScore(utf8) >= getCyrillicScore(cp1251)) {
    return utf8;
  }

  return getCyrillicScore(cp1251) > getCyrillicScore(utf8) ? cp1251 : utf8;
}

export function parseCorporateCsv(csvText: string): CorporateRecord[] {
  const parsed = Papa.parse<RawCorporateCsvRow>(csvText, {
    header: true,
    skipEmptyLines: 'greedy',
  });

  return parsed.data.map((row, index) => {
    const ownershipDate = parseOwnershipDate(row.Ownership_date);

    return {
      id: `${row.INN_company ?? 'row'}-${index}`,
      owner: normalizeText(row.FIO_owner),
      companyName: normalizeText(row.Company_name),
      innCompany: normalizeText(row.INN_company),
      ownership: parseOwnership(row.Ownership),
      region: normalizeText(row.Region),
      source: normalizeText(row.Source),
      ownershipDate,
      year: ownershipDate?.getUTCFullYear() ?? null,
    };
  });
}

export function getFilterOptions(records: CorporateRecord[]): FilterOptions {
  const uniqueValues = <T>(values: T[]): T[] => Array.from(new Set(values));

  return {
    regions: uniqueValues(records.map((record) => record.region ?? UNKNOWN_REGION)).sort((left, right) =>
      left.localeCompare(right, 'ru'),
    ),
    sources: uniqueValues(records.map((record) => record.source ?? UNKNOWN_SOURCE)).sort((left, right) =>
      left.localeCompare(right, 'ru'),
    ),
    years: uniqueValues(records.map((record) => record.year).filter((value): value is number => value !== null)).sort(
      (left, right) => right - left,
    ),
  };
}

export function filterRecords(
  records: CorporateRecord[],
  filters: DashboardFilters,
  searchTerm: string,
): CorporateRecord[] {
  const normalizedQuery = searchTerm.trim().toLowerCase();

  return records.filter((record) => {
    const recordRegion = record.region ?? UNKNOWN_REGION;
    const recordSource = record.source ?? UNKNOWN_SOURCE;
    const matchesRegion = filters.region === 'all' || recordRegion === filters.region;
    const matchesSource = filters.source === 'all' || recordSource === filters.source;
    const matchesYear = filters.year === 'all' || String(record.year) === filters.year;

    if (!matchesRegion || !matchesSource || !matchesYear) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [record.owner, record.companyName, record.innCompany, recordRegion, recordSource]
      .filter((value): value is string => Boolean(value))
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function getMetrics(records: CorporateRecord[]): DashboardMetrics {
  const companyKeys = new Set<string>();
  const owners = new Set<string>();
  let ownershipSum = 0;
  let ownershipCount = 0;

  for (const record of records) {
    if (record.owner) {
      owners.add(record.owner);
    }

    const companyKey = record.innCompany ?? record.companyName;
    if (companyKey) {
      companyKeys.add(companyKey);
    }

    if (record.ownership !== null) {
      ownershipSum += record.ownership;
      ownershipCount += 1;
    }
  }

  return {
    totalRecords: records.length,
    totalOwners: owners.size,
    totalCompanies: companyKeys.size,
    averageOwnership: ownershipCount > 0 ? ownershipSum / ownershipCount : null,
  };
}

export function getTrendData(records: CorporateRecord[]): TrendPoint[] {
  const grouped = new Map<number, { records: number; owners: Set<string> }>();

  for (const record of records) {
    if (record.year === null) {
      continue;
    }

    const current = grouped.get(record.year) ?? { records: 0, owners: new Set<string>() };
    current.records += 1;
    if (record.owner) {
      current.owners.add(record.owner);
    }
    grouped.set(record.year, current);
  }

  return Array.from(grouped.entries())
    .sort(([left], [right]) => left - right)
    .map(([year, value]) => ({
      year: String(year),
      records: value.records,
      owners: value.owners.size,
    }));
}

export function getSourceData(records: CorporateRecord[]): SourcePoint[] {
  const grouped = new Map<string, number>();

  for (const record of records) {
    const source = record.source ?? UNKNOWN_SOURCE;
    grouped.set(source, (grouped.get(source) ?? 0) + 1);
  }

  return Array.from(grouped.entries())
    .sort((left, right) => right[1] - left[1])
    .map(([name, value], index) => ({
      name,
      value,
      fill: sourcePalette[index % sourcePalette.length],
    }));
}

export function getRegionData(records: CorporateRecord[]): RegionPoint[] {
  const grouped = new Map<string, { records: number; ownershipSum: number; ownershipCount: number }>();

  for (const record of records) {
    const region = record.region ?? UNKNOWN_REGION;
    const current = grouped.get(region) ?? { records: 0, ownershipSum: 0, ownershipCount: 0 };

    current.records += 1;
    if (record.ownership !== null) {
      current.ownershipSum += record.ownership;
      current.ownershipCount += 1;
    }

    grouped.set(region, current);
  }

  return Array.from(grouped.entries())
    .sort((left, right) => right[1].records - left[1].records)
    .slice(0, 8)
    .map(([region, value]) => ({
      region,
      records: value.records,
      averageOwnership: value.ownershipCount > 0 ? value.ownershipSum / value.ownershipCount : 0,
    }));
}

export function getTopOwners(records: CorporateRecord[]): TopOwnerPoint[] {
  const grouped = new Map<
    string,
    { records: number; ownershipSum: number; ownershipCount: number; latestDate: Date | null }
  >();

  for (const record of records) {
    const owner = record.owner ?? UNKNOWN_OWNER;
    const current = grouped.get(owner) ?? {
      records: 0,
      ownershipSum: 0,
      ownershipCount: 0,
      latestDate: null,
    };

    current.records += 1;
    if (record.ownership !== null) {
      current.ownershipSum += record.ownership;
      current.ownershipCount += 1;
    }
    if (record.ownershipDate && (!current.latestDate || record.ownershipDate > current.latestDate)) {
      current.latestDate = record.ownershipDate;
    }

    grouped.set(owner, current);
  }

  return Array.from(grouped.entries())
    .sort((left, right) => right[1].records - left[1].records)
    .slice(0, 6)
    .map(([name, value]) => ({
      name,
      records: value.records,
      averageOwnership: value.ownershipCount > 0 ? value.ownershipSum / value.ownershipCount : null,
      latestDateLabel: value.latestDate
        ? new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }).format(value.latestDate)
        : 'No date',
    }));
}

export function getDataQualityMetrics(records: CorporateRecord[]): DataQualityMetrics {
  return records.reduce<DataQualityMetrics>(
    (accumulator, record) => {
      if (!record.innCompany) {
        accumulator.missingInnCompany += 1;
      }

      if (record.ownership === null) {
        accumulator.missingOwnership += 1;
      }

      if (record.ownership !== null && (record.ownership > 100 || record.ownership <= 0)) {
        accumulator.ownershipAnomalies += 1;
      }

      return accumulator;
    },
    {
      missingInnCompany: 0,
      missingOwnership: 0,
      ownershipAnomalies: 0,
    },
  );
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function formatOwnership(value: number | null): string {
  if (value === null) {
    return 'N/A';
  }

  return `${value.toFixed(1)}%`;
}

function buildSparklineSeries(metrics: DashboardMetrics, trendData: TrendPoint): number[] {
  return [
    metrics.totalRecords,
    metrics.totalOwners,
    metrics.totalCompanies,
    trendData.records,
    trendData.owners,
    metrics.averageOwnership ?? 0,
  ].map((value) => Math.max(0, Number(value.toFixed(2))));
}

export function getStatCards(
  filteredRecords: CorporateRecord[],
  allRecords: CorporateRecord[],
  trendData: TrendPoint[],
): DashboardStat[] {
  const filteredMetrics = getMetrics(filteredRecords);
  const totalMetrics = getMetrics(allRecords);
  const latestTrendPoint = trendData.at(-1) ?? { year: '0', records: 0, owners: 0 };

  const filteredRatio =
    totalMetrics.totalRecords > 0 ? (filteredMetrics.totalRecords / totalMetrics.totalRecords) * 100 : 0;
  const validOwnershipCount = filteredRecords.filter((record) => record.ownership !== null).length;
  const activeRegions = new Set(filteredRecords.map((record) => record.region).filter(Boolean)).size;
  const activeSources = new Set(filteredRecords.map((record) => record.source).filter(Boolean)).size;

  return statMeta.map((meta) => {
    const trend = buildSparklineSeries(filteredMetrics, latestTrendPoint);

    switch (meta.id) {
      case 'totalRecords':
        return {
          ...meta,
          value: formatCompactNumber(filteredMetrics.totalRecords),
          delta: `${filteredRatio.toFixed(0)}%`,
          description: 'от загруженного массива',
          trend,
        };
      case 'totalOwners':
        return {
          ...meta,
          value: formatCompactNumber(filteredMetrics.totalOwners),
          delta: `${activeRegions}`,
          description: 'регионов в выборке',
          trend: trend.map((value, index) => value + index),
        };
      case 'totalCompanies':
        return {
          ...meta,
          value: formatCompactNumber(filteredMetrics.totalCompanies),
          delta: `${activeSources}`,
          description: 'источников задействовано',
          trend: trend.map((value, index) => value + index * 0.5),
        };
      default:
        return {
          ...meta,
          value: formatOwnership(filteredMetrics.averageOwnership),
          delta: `${validOwnershipCount}`,
          description: 'строк с валидной долей',
          trend: trend.map((value, index) => value + index * 0.2),
        };
    }
  });
}

export function formatTableDate(value: Date | null): string {
  if (!value) {
    return 'н/д';
  }

  return new Intl.DateTimeFormat('ru-RU').format(value);
}
