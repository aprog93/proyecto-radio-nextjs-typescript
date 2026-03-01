import { useState, useCallback, useEffect, useRef } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiOptions {
  /**
   * Auto-fetch on mount
   * @default true
   */
  autoFetch?: boolean;
  /**
   * Dependency array to re-fetch
   */
  deps?: React.DependencyList;
}

/**
 * Generic hook for API calls with loading and error states
 * @param asyncFn - Async function that fetches data
 * @param options - Hook options
 * @returns {object} { data, loading, error, fetch, refetch }
 */
export const useApi = <T,>(
  asyncFn: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> & {
  fetch: () => Promise<void>;
  refetch: () => Promise<void>;
} => {
  const { autoFetch = true, deps = [] } = options;
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const isMountedRef = useRef(true);
  // Store asyncFn in ref to prevent infinite loops
  const asyncFnRef = useRef(asyncFn);
  // Store autoFetch in ref to track changes
  const autoFetchRef = useRef(autoFetch);
  
  // Update refs when they change
  useEffect(() => {
    asyncFnRef.current = asyncFn;
  }, [asyncFn]);
  
  useEffect(() => {
    autoFetchRef.current = autoFetch;
  }, [autoFetch]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetch = useCallback(async () => {
    if (!isMountedRef.current) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await asyncFnRef.current();
      if (isMountedRef.current) {
        setState({ data: result, loading: false, error: null });
      }
    } catch (err) {
      if (isMountedRef.current) {
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err : new Error('Unknown error'),
        });
      }
    }
  }, []); // Empty deps - fetch is now stable

  const refetch = useCallback(async () => {
    await fetch();
  }, [fetch]);

  // Auto-fetch on mount or when deps change
  useEffect(() => {
    if (autoFetchRef.current) {
      fetch();
    }
  }, [autoFetch, ...deps]); // Only re-fetch when autoFetch or deps change

  return {
    ...state,
    fetch,
    refetch,
  };
};

export default useApi;

