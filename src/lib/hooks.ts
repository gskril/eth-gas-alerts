import { useQuery } from '@tanstack/react-query';

interface Stats {
  gas: { now: number };
  eth: { price: number };
}

interface DataPoint {
  block_number: number;
  timestamp: number;
  gas_price: number;
  block_gas_limit: number;
}

interface HistoryResponse {
  data: DataPoint[];
  oldest_timestamp: number | null;
}

export function useStats() {
  return useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: () => fetch('/api/stats').then((res) => res.json()),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

export function useHistory(hours: number) {
  return useQuery<HistoryResponse>({
    queryKey: ['history', hours],
    queryFn: () => fetch(`/api/history?hours=${hours}`).then((res) => res.json()),
    staleTime: 5 * 60_000,
  });
}
