import { useEffect, useMemo, useState } from 'react';
import type { CorporateRecord } from '@/types/corporate';
import { decodeCsvBuffer, parseCorporateCsv } from '@/utils/corporateData';

type UseCorporateDataResult = {
  records: CorporateRecord[];
  loading: boolean;
  error: string | null;
};

export function useCorporateData(): UseCorporateDataResult {
  const [records, setRecords] = useState<CorporateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCsv() {
      try {
        const response = await fetch('/data.csv');
        if (!response.ok) {
          throw new Error(`Unable to load CSV: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const csvText = decodeCsvBuffer(buffer);
        const parsedRecords = parseCorporateCsv(csvText);

        if (!cancelled) {
          setRecords(parsedRecords);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load CSV data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCsv();

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () => ({
      records,
      loading,
      error,
    }),
    [error, loading, records],
  );
}
