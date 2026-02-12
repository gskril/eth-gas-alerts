import { useEffect, useRef, useState } from 'react';

import { protocols } from '@/data/protocols';
import { calculateCostUsd } from '@/lib/constants';
import { useStats } from '@/lib/hooks';

export default function Estimates() {
  const { data: stats } = useStats();
  const [didMoveSlider, setDidMoveSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);
  const ethPrice = stats?.eth.price ?? 0;

  useEffect(() => {
    if (typeof stats?.gas.now === 'number' && !didMoveSlider) {
      setGasPrice(stats.gas.now);
      setSliderValue(stats.gas.now);
    }
  }, [stats?.gas.now, didMoveSlider]);

  const gasPriceEstimate = (gasAmount: number) => {
    const cost = calculateCostUsd(gasAmount, gasPrice, ethPrice);
    return `$${cost.toFixed(2)}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setDidMoveSlider(true);
    setSliderValue(value);
    setGasPrice(value);
  };

  return (
    <div className="relative z-10 mx-auto w-full max-w-content animate-fade-in-up">
      <h1 className="mb-2 text-2xl font-semibold leading-tight text-text-primary sm:text-3xl">
        Gas Estimates
      </h1>
      <p className="mb-8 max-w-lg text-text-secondary">
        Fee estimates for popular Ethereum protocols at current gas prices. Adjust the slider to see
        costs at different gas levels.
      </p>

      {/* Slider section */}
      <div className="mb-8 rounded-xl border border-border bg-surface-raised p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <span className="text-sm text-text-secondary">Gas Price</span>
          <span className="font-mono text-2xl font-medium tabular-nums text-text-primary">
            {sliderValue} <span className="text-sm text-text-muted">Gwei</span>
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={50}
          step={0.5}
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-full"
        />
        <div className="mt-2 flex justify-between font-mono text-[10px] text-text-muted">
          <span>0</span>
          <span>10</span>
          <span>20</span>
          <span>30</span>
          <span>40</span>
          <span>50</span>
        </div>
      </div>

      {/* Protocol cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {protocols.map((project, idx) => (
          <div
            key={project.name}
            className="hover:border-border/80 rounded-xl border border-border bg-surface-raised p-5 transition-all hover:shadow-lg hover:shadow-black/20"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-primary transition-colors hover:text-accent"
                >
                  {project.name}
                  <span className="ml-1 text-xs text-text-muted">{'\u2197'}</span>
                </a>
              ) : (
                <span className="text-text-primary">{project.name}</span>
              )}
            </h2>
            <div className="space-y-1">
              {project.actions.map((action) => {
                const totalGas = action.contractFunctions
                  .map((f) => f.gas)
                  .reduce((a, b) => a + b, 0);

                return (
                  <details key={action.name} className="group">
                    <summary className="-mx-2 flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-surface-overlay">
                      <span className="text-text-secondary transition-colors group-open:text-text-primary">
                        {action.name}
                      </span>
                      <span className="font-mono tabular-nums text-text-primary">
                        {gasPriceEstimate(totalGas)}
                      </span>
                    </summary>
                    <div className="pb-2 pl-2 font-mono text-xs text-text-muted">
                      {action.contractFunctions.map((f, i) => (
                        <span key={i}>
                          {f.name}
                          {action.contractFunctions.length > 1
                            ? ` (${gasPriceEstimate(f.gas)})`
                            : ''}
                          {i < action.contractFunctions.length - 1 ? ' + ' : ''}
                        </span>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
