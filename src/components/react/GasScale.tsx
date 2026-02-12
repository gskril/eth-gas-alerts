import { useStats } from '@/lib/hooks';

const SCALE_TIERS = [
  { max: 10, labels: [0, 2, 4, 6, 8, 10] },
  { max: 50, labels: [0, 10, 20, 30, 40, 50] },
  { max: 150, labels: [0, 30, 60, 90, 120, 150] },
];

function getScaleTier(gwei: number) {
  return SCALE_TIERS.find((t) => gwei < t.max) || SCALE_TIERS[SCALE_TIERS.length - 1];
}

export default function GasScale() {
  const { data: stats } = useStats();

  const gasNow = typeof stats?.gas.now === 'number' ? stats.gas.now : 0;
  const tier = getScaleTier(gasNow);
  const scalePercentage = (gasNow / tier.max) * 100;
  const position = Math.min(scalePercentage, 98) || 50;

  // Vibrant hex for decorative glow/needle effects (doesn't need contrast)
  const glowColor = gasNow < 3 ? '#34d399' : gasNow < 8 ? '#fbbf24' : '#f87171';

  return (
    <div className="relative z-10 mx-auto w-full max-w-content animate-fade-in-up">
      {/* Big gas number */}
      <div className="mb-10 flex items-baseline justify-center gap-3">
        <span
          className="font-mono text-7xl font-medium tabular-nums tracking-tighter text-gas-low transition-colors duration-500 sm:text-8xl"
          style={{
            color:
              gasNow < 3 ? 'var(--gas-low)' : gasNow < 8 ? 'var(--gas-mid)' : 'var(--gas-high)',
          }}
        >
          {stats ? gasNow.toFixed(2) : '-.--'}
        </span>
        <span className="font-mono text-xl text-text-secondary">Gwei</span>
      </div>

      {/* Scale */}
      <div className="relative mb-14">
        {/* Glow under the bar */}
        <div
          className="absolute inset-0 top-px rounded-full opacity-40 blur-xl"
          style={{
            background: 'linear-gradient(90deg, #34d399 0%, #fbbf24 40%, #f87171 80%)',
          }}
        />

        {/* The bar */}
        <div
          className="relative h-3 w-full overflow-hidden rounded-full"
          style={{
            background:
              'linear-gradient(90deg, #34d399 0%, #22c55e 15%, #a3e635 30%, #fbbf24 50%, #f97316 65%, #f87171 80%, #ef4444 100%)',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-[1px] rounded-full bg-white/20" />
        </div>

        {/* Indicator — vertical needle */}
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            left: `${position}%`,
            transition: 'left 0.75s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="relative flex -translate-x-1/2 flex-col items-center">
            {/* Wide ambient glow */}
            <div
              className="absolute top-1/2 h-8 w-8 -translate-y-1/2 rounded-full opacity-50 blur-lg"
              style={{ backgroundColor: glowColor }}
            />
            {/* Needle line */}
            <div
              className="relative h-4 w-[2px] rounded-full"
              style={{
                backgroundColor: glowColor,
                boxShadow: `0 0 6px ${glowColor}, 0 0 12px ${glowColor}40`,
              }}
            />
            {/* Center dot */}
            <div
              className="absolute top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full"
              style={{
                backgroundColor: '#fff',
                boxShadow: `0 0 4px ${glowColor}, 0 0 8px ${glowColor}`,
              }}
            />
          </div>
        </div>

        {/* Labels */}
        <div className="mt-4 flex w-full justify-between font-mono text-xs text-text-muted">
          {tier.labels.map((gwei) => (
            <span key={gwei}>{gwei}</span>
          ))}
        </div>
      </div>

      {/* Context cards */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: 'Low', range: '< 1', color: '#34d399' },
          { label: 'Medium', range: '1 - 5', color: '#fbbf24' },
          { label: 'High', range: '> 5', color: '#f87171' },
        ].map(({ label, range, color }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-surface-raised p-3 text-center"
          >
            <div className="mb-1 flex items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm font-medium text-text-primary">{label}</span>
            </div>
            <span className="font-mono text-xs text-text-muted">{range} Gwei</span>
          </div>
        ))}
      </div>
    </div>
  );
}
