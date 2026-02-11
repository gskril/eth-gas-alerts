import { useEffect, useState } from 'react';

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
  const scalePercentage = (gasNow / 100) * 100;
  const position = scalePercentage > 98 ? 98 : scalePercentage || 50;
  const scale = [0, 25, 50, 75, 100];

  return (
    <div className="w-full max-w-content mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 leading-tight">
        {stats?.gas.message || 'Loading...'}
      </h1>

      <div className="relative mb-20">
        <div
          className="w-full h-8 sm:h-10 rounded-2xl"
          style={{
            background: 'linear-gradient(90deg, #61ff00 0%, #ffe142 30%, #ff0000 75%)',
          }}
        >
          <div
            className="absolute h-[calc(100%+0.75rem)] w-1 bg-[var(--text-color-dark)] rounded-full top-1/2 -translate-y-1/2"
            style={{
              left: `${position}%`,
              transition: 'left 0.75s ease-in-out',
            }}
          />
          <div className="flex w-full justify-between absolute -bottom-8 sm:-bottom-10">
            {scale.map((gwei, i) => (
              <span
                key={gwei}
                className={i % 2 !== 0 ? 'hidden sm:inline' : ''}
              >
                {gwei}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
