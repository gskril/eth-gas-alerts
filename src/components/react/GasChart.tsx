import { useCallback, useEffect, useRef, useState } from 'react';
import 'uplot/dist/uPlot.min.css';

interface DataPoint {
  timestamp: number;
  gas_price: number;
  eth_price: number;
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

export default function GasChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const uplotRef = useRef<any>(null);
  const [range, setRange] = useState<TimeRange>('24h');
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (hours: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/history?hours=${hours}`);
      const json = await res.json();
      setData(json.data || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(RANGE_HOURS[range]);
  }, [range, fetchData]);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    let cancelled = false;

    import('uplot').then((uPlotModule) => {
      if (cancelled) return;

      const uPlot = uPlotModule.default;

      // Clean up previous chart
      if (uplotRef.current) {
        uplotRef.current.destroy();
        uplotRef.current = null;
      }

      const timestamps = data.map((d) => d.timestamp);
      const gasPrices = data.map((d) => d.gas_price / 100);

      const opts: any = {
        width: chartRef.current!.clientWidth,
        height: 300,
        series: [
          {},
          {
            label: 'Gas (Gwei)',
            stroke: '#3b82f6',
            fill: 'rgba(59, 130, 246, 0.1)',
            width: 2,
          },
        ],
        axes: [
          {
            stroke: '#888',
            grid: { stroke: '#eee' },
          },
          {
            stroke: '#888',
            grid: { stroke: '#eee' },
            label: 'Gwei',
          },
        ],
        scales: {
          x: { time: true },
        },
        cursor: {
          drag: { x: false, y: false },
        },
      };

      const plotData = [timestamps, gasPrices];
      uplotRef.current = new uPlot(opts, plotData as any, chartRef.current!);
    });

    return () => {
      cancelled = true;
    };
  }, [data]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (uplotRef.current && chartRef.current) {
        uplotRef.current.setSize({
          width: chartRef.current.clientWidth,
          height: 300,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (uplotRef.current) {
        uplotRef.current.destroy();
      }
    };
  }, []);

  const ranges: TimeRange[] = ['1h', '6h', '24h', '7d', '30d'];

  return (
    <div className="w-full max-w-content mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 leading-tight">
        Gas Price History
      </h1>

      <div className="flex justify-center gap-2 mb-6">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              range === r
                ? 'bg-blue-500 text-white'
                : 'bg-highlight text-black/70 hover:bg-blue-100'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {loading && data.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Loading chart data...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No history data available yet. Data will appear after the cron worker starts recording.
        </div>
      ) : (
        <div ref={chartRef} />
      )}
    </div>
  );
}
