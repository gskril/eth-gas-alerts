import { useEffect, useRef, useState } from 'react';
import 'uplot/dist/uPlot.min.css';

import { useHistory } from '@/lib/hooks';

import QueryProvider from './QueryProvider';

type TimeRange = '6h' | '24h' | '7d' | '30d' | '6mo';

const RANGE_HOURS: Record<TimeRange, number> = {
  '6h': 6,
  '24h': 24,
  '7d': 168,
  '30d': 720,
  '6mo': 4320,
};

function getVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const ALL_RANGES: TimeRange[] = ['6h', '24h', '7d', '30d', '6mo'];

function getAvailableRanges(oldestTimestamp: number | null): TimeRange[] {
  if (!oldestTimestamp) return ALL_RANGES;
  const dataAgeHours = (Date.now() / 1000 - oldestTimestamp) / 3600;
  return ALL_RANGES.filter((r) => RANGE_HOURS[r] <= dataAgeHours);
}

function getBestDefaultRange(available: TimeRange[]): TimeRange {
  if (available.includes('24h')) return '24h';
  return available[available.length - 1] || '6h';
}

function formatTooltipDate(ts: number): string {
  const d = new Date(ts * 1000);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function GasChart() {
  return (
    <QueryProvider>
      <GasChartInner />
    </QueryProvider>
  );
}

function GasChartInner() {
  const chartRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const uplotRef = useRef<any>(null);
  const [range, setRange] = useState<TimeRange>('24h');
  const initializedRef = useRef(false);

  const { data: historyData, isPending, isFetching } = useHistory(RANGE_HOURS[range]);
  const points = historyData?.data ?? [];
  const availableRanges = getAvailableRanges(historyData?.oldest_timestamp ?? null);

  // One-time: pick the best default range once data arrives
  useEffect(() => {
    if (historyData && !initializedRef.current) {
      initializedRef.current = true;
      const best = getBestDefaultRange(availableRanges);
      if (best !== range) setRange(best);
    }
  }, [historyData, availableRanges, range]);

  useEffect(() => {
    if (!chartRef.current || points.length === 0) return;

    let cancelled = false;

    import('uplot').then((uPlotModule) => {
      if (cancelled) return;

      const uPlot = uPlotModule.default;

      if (uplotRef.current) {
        uplotRef.current.destroy();
        uplotRef.current = null;
      }

      const timestamps = points.map((d) => d.timestamp);
      const gasPrices = points.map((d) => d.gas_price);
      const blockNumbers = points.map((d) => d.block_number);

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
          { show: false },
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
        plugins: [
          {
            hooks: {
              setCursor: (u: any) => {
                const tt = tooltipRef.current;
                if (!tt) return;
                const idx = u.cursor.idx;
                if (idx == null) {
                  tt.style.display = 'none';
                  return;
                }
                const ts = u.data[0][idx];
                const val = u.data[1][idx];
                if (ts == null || val == null) {
                  tt.style.display = 'none';
                  return;
                }
                tt.style.display = '';
                const block = u.data[2][idx];
                const dateEl = tt.children[0] as HTMLElement;
                const blockEl = tt.children[1] as HTMLElement;
                const valEl = tt.children[2] as HTMLElement;
                dateEl.textContent = formatTooltipDate(ts);
                blockEl.textContent =
                  block != null ? `Block ${Number(block).toLocaleString()}` : '';
                valEl.textContent = `${val.toFixed(2)} Gwei`;
                const overRect = u.over.getBoundingClientRect();
                const wrapRect = u.over.closest('.relative')!.getBoundingClientRect();
                const ox = overRect.left - wrapRect.left;
                const oy = overRect.top - wrapRect.top;
                const left = ox + (u.cursor.left ?? 0);
                const top = oy + (u.cursor.top ?? 0);
                const ttW = tt.offsetWidth;
                const wrapW = wrapRect.width;
                const x = left + ttW + 16 > wrapW ? left - ttW - 8 : left + 8;
                tt.style.left = `${x}px`;
                tt.style.top = `${top - tt.offsetHeight - 8}px`;
              },
            },
          },
        ],
      };

      const plotData = [timestamps, gasPrices, blockNumbers];
      uplotRef.current = new uPlot(opts, plotData as any, chartRef.current!);
    });

    return () => {
      cancelled = true;
    };
  }, [points]);

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

  const loading = isPending;
  const fetching = isFetching && !isPending;

  return (
    <div className="relative z-10 mx-auto w-full max-w-content animate-fade-in-up">
      <h1 className="mb-2 text-center text-2xl font-semibold leading-tight text-text-primary sm:text-3xl">
        Gas Price History
      </h1>
      <p className="mb-8 text-center text-text-secondary">Track Ethereum gas prices over time.</p>

      <div className="rounded-xl border border-border bg-surface-raised p-5">
        {/* Range selector */}
        <div className="mb-4 flex justify-end gap-1">
          {availableRanges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-lg px-3 py-1 font-mono text-xs font-medium transition-all ${
                range === r
                  ? 'bg-accent/15 border-accent/20 border text-accent'
                  : 'border border-transparent text-text-muted hover:bg-surface-overlay hover:text-text-secondary'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Chart */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-sm text-text-muted">
            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading chart data...
          </div>
        ) : points.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-sm text-text-muted">
            <svg
              className="mb-3 opacity-40"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 3v18h18" />
              <path d="M7 16l4-4 4 4 6-6" />
            </svg>
            No history data yet
          </div>
        ) : (
          <div className="relative">
            {fetching && (
              <div className="bg-surface-raised/60 absolute inset-0 z-10 flex items-center justify-center rounded-lg backdrop-blur-[1px] transition-opacity">
                <svg className="h-5 w-5 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              </div>
            )}
            <div ref={chartRef} className="[&_.u-wrap]:!bg-transparent" />
            <div
              ref={tooltipRef}
              style={{ display: 'none' }}
              className="pointer-events-none absolute z-20 rounded-lg border border-border bg-surface-overlay px-3 py-1.5 font-mono text-xs shadow-lg"
            >
              <div className="text-text-secondary" />
              <div className="text-text-muted" />
              <div className="font-semibold text-accent" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
