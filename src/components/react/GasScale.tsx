import { useEffect, useState } from 'react';

import { GAS_SCALE_MAX } from '@/lib/constants';

interface Stats {
  gas: { now: number; message: string };
  eth: { price: number };
}

export default function GasScale() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = () => {
      fetch('/api/stats')
        .then((res) => res.json())
        .then(setStats)
        .catch(() => {});
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  }, []);

  const gasNow = typeof stats?.gas.now === 'number' ? stats.gas.now : 0;
  const scalePercentage = (gasNow / GAS_SCALE_MAX) * 100;
  const position = Math.min(scalePercentage, 98) || 50;
  const scale = [0, 5, 10, 15, 20];

  const gasColor =
    gasNow < 3 ? '#34d399' : gasNow < 8 ? '#fbbf24' : '#f87171';

  return (
    <div className="w-full max-w-content mx-auto animate-fade-in-up relative z-10">
      {/* Big gas number */}
      <div className="text-center mb-2">
        <span
          className="font-mono text-7xl sm:text-8xl font-medium tabular-nums tracking-tighter transition-colors duration-500"
          style={{ color: gasColor }}
        >
          {stats ? gasNow.toFixed(1) : '--.-'}
        </span>
        <span className="block text-text-secondary text-lg mt-1 font-mono">Gwei</span>
      </div>

      {/* Message */}
      <p className="text-center text-text-secondary text-lg mb-10">
        {stats?.gas.message || 'Loading...'}
      </p>

      {/* Scale */}
      <div className="relative mb-14">
        {/* Glow under the bar */}
        <div
          className="absolute inset-0 top-1 blur-xl opacity-40 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #34d399 0%, #fbbf24 40%, #f87171 80%)',
          }}
        />

        {/* The bar */}
        <div
          className="relative w-full h-3 rounded-full overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, #34d399 0%, #22c55e 15%, #a3e635 30%, #fbbf24 50%, #f97316 65%, #f87171 80%, #ef4444 100%)',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 rounded-full" />
        </div>

        {/* Indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            left: `${position}%`,
            transition: 'left 0.75s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="relative -translate-x-1/2">
            <div
              className="absolute -inset-2 rounded-full blur-md opacity-60"
              style={{ backgroundColor: gasColor }}
            />
            <div
              className="relative w-5 h-5 rounded-full border-[3px] border-[var(--surface)]"
              style={{ backgroundColor: gasColor }}
            />
          </div>
        </div>

        {/* Labels */}
        <div className="flex w-full justify-between mt-4 font-mono text-xs text-text-muted">
          {scale.map((gwei) => (
            <span key={gwei}>{gwei}</span>
          ))}
        </div>
      </div>

      {/* Context cards */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { label: 'Low', range: '< 3', color: '#34d399' },
          { label: 'Medium', range: '3 - 15', color: '#fbbf24' },
          { label: 'High', range: '> 15', color: '#f87171' },
        ].map(({ label, range, color }) => (
          <div
            key={label}
            className="bg-surface-raised border border-border rounded-xl p-3 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm font-medium text-text-primary">{label}</span>
            </div>
            <span className="text-xs text-text-muted font-mono">{range} Gwei</span>
          </div>
        ))}
      </div>
    </div>
  );
}
