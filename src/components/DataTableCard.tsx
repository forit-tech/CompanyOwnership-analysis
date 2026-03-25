import type { CorporateRecord } from '@/types/corporate';
import { ChartCard } from '@/components/ChartCard';
import { formatTableDate } from '@/utils/corporateData';

type DataTableCardProps = {
  records: CorporateRecord[];
  highlightTerm: string;
};

export function DataTableCard({ records, highlightTerm }: DataTableCardProps) {
  const normalizedHighlight = highlightTerm.trim().toLowerCase();

  return (
    <ChartCard
      title="Таблица записей"
      description="Реальные строки CSV с уже применёнными фильтрами и поиском."
    >
      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/30">
        <div className="max-h-[520px] overflow-auto">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur">
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-slate-500">
                <th className="px-4 py-4 font-medium">Владелец</th>
                <th className="px-4 py-4 font-medium">Компания</th>
                <th className="px-4 py-4 font-medium">Регион</th>
                <th className="px-4 py-4 font-medium">Доля</th>
                <th className="px-4 py-4 font-medium">Источник</th>
                <th className="px-4 py-4 font-medium">Дата</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    По текущим фильтрам записи не найдены.
                  </td>
                </tr>
              ) : null}
              {records.map((record) => {
                const matchesHighlight =
                  normalizedHighlight.length > 0 &&
                  [record.owner, record.companyName, record.innCompany]
                    .filter((value): value is string => Boolean(value))
                    .some((value) => value.toLowerCase().includes(normalizedHighlight));

                return (
                  <tr
                    key={record.id}
                    className={`border-b border-white/6 transition ${
                      matchesHighlight
                        ? 'bg-cyan-400/[0.07] hover:bg-cyan-400/[0.11]'
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <td className="px-4 py-4 font-medium text-white">{record.owner ?? 'н/д'}</td>
                    <td className="px-4 py-4">{record.companyName ?? 'н/д'}</td>
                    <td className="px-4 py-4">{record.region ?? 'н/д'}</td>
                  <td className="px-4 py-4">
                    {record.ownership !== null ? `${record.ownership.toFixed(1)}%` : 'н/д'}
                  </td>
                    <td className="px-4 py-4">{record.source ?? 'н/д'}</td>
                  <td className="px-4 py-4">{formatTableDate(record.ownershipDate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ChartCard>
  );
}
