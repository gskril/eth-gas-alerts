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
    <div className="w-full max-w-content mx-auto animate-fade-in-up relative z-10">
      <h1 className="text-2xl sm:text-3xl font-semibold leading-tight mb-2 text-text-primary">
        Gas Estimates
      </h1>
      <p className="text-text-secondary mb-8 max-w-lg">
        Fee estimates for popular Ethereum protocols at current gas prices. Adjust the slider to see costs at different gas levels.
      </p>

      {/* Slider section */}
      <div className="bg-surface-raised border border-border rounded-xl p-5 mb-8">
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-sm text-text-secondary">Gas Price</span>
          <span className="font-mono text-2xl font-medium text-text-primary tabular-nums">
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
        <div className="flex justify-between text-[10px] font-mono text-text-muted mt-2">
          <span>0</span>
          <span>10</span>
          <span>20</span>
          <span>30</span>
          <span>40</span>
          <span>50</span>
        </div>
      </div>

      {/* Protocol cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {protocols.map((project, idx) => (
          <div
            key={project.name}
            className="bg-surface-raised border border-border rounded-xl p-5 transition-all hover:border-border/80 hover:shadow-lg hover:shadow-black/20"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-primary hover:text-accent transition-colors"
                >
                  {project.name}
                  <span className="text-text-muted ml-1 text-xs">{'\u2197'}</span>
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
                    <summary className="cursor-pointer py-1.5 flex items-center justify-between text-sm rounded-lg hover:bg-surface-overlay px-2 -mx-2 transition-colors">
                      <span className="text-text-secondary group-open:text-text-primary transition-colors">
                        {action.name}
                      </span>
                      <span className="font-mono text-text-primary tabular-nums">
                        {gasPriceEstimate(totalGas)}
                      </span>
                    </summary>
                    <div className="text-xs text-text-muted pl-2 pb-2 font-mono">
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
