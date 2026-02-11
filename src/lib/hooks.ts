import useSWR from 'swr';

interface Stats {
  gas: { now: number };
  eth: { price: number };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useStats() {
  return useSWR<Stats>('/api/stats', fetcher, {
    refreshInterval: 30_000,
    dedupingInterval: 15_000,
  });
}
