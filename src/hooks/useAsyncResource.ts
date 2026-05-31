import { useEffect, useState, type DependencyList } from 'react';

import { getErrorMessage } from '../services/api';

type AsyncState<T> = {
  data: T;
  error: string;
  loading: boolean;
  reload: () => void;
};

export function useAsyncResource<T>(loader: () => Promise<T>, deps: DependencyList, initialData: T): AsyncState<T> {
  const [data, setData] = useState<T>(initialData);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const nextData = await loader();

        if (active) {
          setData(nextData);
        }
      } catch (resourceError) {
        if (active) {
          setError(getErrorMessage(resourceError));
          setData(initialData);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [...deps, refreshKey]);

  return {
    data,
    error,
    loading,
    reload: () => setRefreshKey((key) => key + 1),
  };
}
