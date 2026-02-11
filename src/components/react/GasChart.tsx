import { useCallback, useEffect, useRef, useState } from 'react';
import 'uplot/dist/uPlot.min.css';

interface DataPoint {
  timestamp: number;
  gas_price: number;
  block_gas_limit: number;
}

type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';

const RANGE_HOURS: Record<TimeRange, number> = {
  '1h': 1,
  '6h': 6,
  '24h': 24,
  '7d': 168,
  '30d': 720,
};

function getVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const ALL_RANGES: TimeRange[] = ['1h', '6h', '24h', '7d', '30d'];

function getAvailableRanges(oldestTimestamp: number | null): TimeRange[] {
  if (!oldestTimestamp) return ALL_RANGES;
  const dataAgeHours = (Date.now() / 1000 - oldestTimestamp) / 3600;
  return ALL_RANGES.filter((r) => RANGE_HOURS[r] <= Math.max(dataAgeHours * 2, 1));
}

function getBestDefaultRange(available: TimeRange[]): TimeRange {
  // Prefer 24h, then the largest available
  if (available.includes('24h')) return '24h';
  return available[available.length - 1] || '1h';
}

export default function GasChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const uplotRef = useRef<any>(null);
  const [range, setRange] = useState<TimeRange | null>(null);
  const [availableRanges, setAvailableRanges] = useState<TimeRange[]>(ALL_RANGES);
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (hours: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/history?hours=${hours}`);
      const json = await res.json();
      setData(json.data || []);

      if (json.oldest_timestamp != null) {
        const available = getAvailableRanges(json.oldest_timestamp);
        setAvailableRanges(available);
        return available;
      }
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  // Initial load: fetch 24h first to discover available ranges, then pick best default
  useEffect(() => {
    fetchData(RANGE_HOURS['24h']).then((available) => {
      if (available) {
        setRange(getBestDefaultRange(available));
      } else {
        setRange('24h');
      }
    });
  }, [fetchData]);

  // Refetch when range changes (skip initial null)
  useEffect(() => {
    if (range === null) return;
    fetchData(RANGE_HOURS[range]);
  }, [range, fetchData]);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    let cancelled = false;

    import('uplot').then((uPlotModule) => {
      if (cancelled) return;

      const uPlot = uPlotModule.default;

      if (uplotRef.current) {
        uplotRef.current.destroy();
        uplotRef.current = null;
      }

      const timestamps = data.map((d) => d.timestamp);
      const gasPrices = data.map((d) => d.gas_price);

      const opts: any = {
        width: chartRef.current!.clientWidth,
        height: 320,
        padding: [16, 8, 0, 0],
        series: [
          {},
          {
            label: 'Gas (Gwei)',
            stroke: '#818cf8',
            fill: 'rgba(129, 140, 248, 0.08)',
            width: 2,
            points: { show: false },
          },
        ],
        axes: [
          {
            stroke: getVar('--text-muted'),
            grid: { stroke: getVar('--border'), width: 1 },
            ticks: { stroke: getVar('--border'), width: 1 },
            font: '11px "DM Mono", monospace',
          },
          {
            stroke: getVar('--text-muted'),
            grid: { stroke: getVar('--border'), width: 1 },
            ticks: { stroke: getVar('--border'), width: 1 },
            font: '11px "DM Mono", monospace',
            label: '',
          },
        ],
        scales: {
          x: { time: true },
        },
        cursor: {
          drag: { x: false, y: false },
          points: {
            size: 8,
            stroke: getVar('--accent'),
            fill: getVar('--surface'),
            width: 2,
          },
        },
        legend: { show: false },
      };

      const plotData = [timestamps, gasPrices];
      uplotRef.current = new uPlot(opts, plotData as any, chartRef.current!);
    });

    return () => {
      cancelled = true;
    };
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      if (uplotRef.current && chartRef.current) {
        uplotRef.current.setSize({
          width: chartRef.current.clientWidth,
          height: 320,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return () => {
      if (uplotRef.current) {
        uplotRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-content mx-auto animate-fade-in-up relative z-10">
      <h1 className="text-2xl sm:text-3xl font-semibold leading-tight mb-2 text-text-primary text-center">
        Gas Price History
      </h1>
      <p className="text-text-secondary text-center mb-8">
        Track Ethereum gas prices over time.
      </p>

      <div className="bg-surface-raised border border-border rounded-xl p-5">
        {/* Range selector */}
        <div className="flex justify-end gap-1 mb-4">
          {availableRanges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                range === r
                  ? 'bg-accent/15 text-accent border border-accent/20'
                  : 'text-text-muted hover:text-text-secondary hover:bg-surface-overlay border border-transparent'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Chart */}
        {loading && data.length === 0 ? (
          <div className="flex items-center justify-center py-24 text-text-muted text-sm">
            <svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading chart data...
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-text-muted text-sm">
            <svg className="mb-3 opacity-40" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3v18h18" />
              <path d="M7 16l4-4 4 4 6-6" />
            </svg>
            No history data yet
          </div>
        ) : (
          <div ref={chartRef} className="[&_.u-wrap]:!bg-transparent" />
        )}
      </div>
    </div>
  );
}
