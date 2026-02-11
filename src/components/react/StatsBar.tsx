import { useStats } from '@/lib/hooks';

export default function StatsBar() {
  const { data: stats } = useStats();

  const gasNum = typeof stats?.gas.now === 'number' ? stats.gas.now : 0;
  const gasColor =
    gasNum < 30 ? 'text-gas-low' : gasNum < 50 ? 'text-gas-mid' : 'text-gas-high';

  return (
    <div className="flex items-center gap-3 text-xs font-mono">
      <div className="flex items-center gap-2 bg-surface-raised border border-border rounded-lg px-2.5 py-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gas-low opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gas-low" />
        </span>
        <span className={`font-medium tabular-nums transition-colors ${gasColor}`}>
          {stats?.gas.now ?? '---'}
        </span>
        <span className="text-text-muted">Gwei</span>
      </div>
      <div className="items-center gap-2 bg-surface-raised border border-border rounded-lg px-2.5 py-1.5 hidden md:flex">
        <svg width="10" height="16" viewBox="0 0 11 16" fill="none" className="text-text-muted opacity-60">
          <path d="M5.05058 0L4.94043 0.364667V10.9417L5.05091 11.0487L10.1015 8.14667L5.05091 0H5.05058Z" fill="currentColor" />
          <path d="M5.05095 0L0 8.14667L5.05095 11.0487V0Z" fill="currentColor" opacity="0.6" />
          <path d="M5.05124 11.9786L4.98926 12.0523V15.8203L5.05124 15.997L10.1056 9.07764L5.05124 11.9783V11.9786Z" fill="currentColor" />
          <path d="M5.05095 15.9966V11.978L0 9.07764L5.05095 15.9963V15.9966Z" fill="currentColor" opacity="0.6" />
        </svg>
        <span className="font-medium tabular-nums text-text-primary">
          ${typeof stats?.eth.price === 'number' ? stats.eth.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'}
        </span>
      </div>
    </div>
  );
}
