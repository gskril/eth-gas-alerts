import { useEffect, useState } from 'react';

import { protocols } from '@/data/protocols';
import { calculateCostUsd } from '@/lib/constants';

export default function Estimates() {
  const [ethPrice, setEthPrice] = useState(0);
  const [liveGasPrice, setLiveGasPrice] = useState(0);
  const [didMoveSlider, setDidMoveSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        setEthPrice(data.eth.price);
        setLiveGasPrice(data.gas.now);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof liveGasPrice === 'number' && !didMoveSlider) {
      setGasPrice(liveGasPrice);
      setSliderValue(liveGasPrice);
    }
  }, [liveGasPrice, didMoveSlider]);

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
    <div className="w-full max-w-content mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-12 max-w-[38rem]">
        Transaction fee estimates for popular Ethereum protocols
      </h1>

      <div className="mb-2">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      <div className="mt-4 mb-5">
        <b>Gwei for estimate: </b>
        {sliderValue}
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        {protocols.map((project) => (
          <div key={project.name} className="bg-highlight rounded-xl p-5 leading-relaxed">
            <h2 className="text-xl font-bold mb-4">
              {project.link ? (
                <a href={project.link} target="_blank" rel="noreferrer" className="hover:underline">
                  {project.name}
                </a>
              ) : (
                project.name
              )}
            </h2>
            <div className="grid gap-3">
              {project.actions.map((action) => {
                const totalGas = action.contractFunctions
                  .map((f) => f.gas)
                  .reduce((a, b) => a + b, 0);

                return (
                  <details key={action.name}>
                    <summary className="cursor-pointer">
                      <span className="ml-0.5">
                        {action.name}: {gasPriceEstimate(totalGas)}
                      </span>
                    </summary>
                    <span className="text-sm text-[var(--text-color-light)]">
                      Transactions:{' '}
                      {action.contractFunctions.map((f, i) => (
                        <span key={i}>
                          {f.name}
                          {action.contractFunctions.length > 1 ? ` (${gasPriceEstimate(f.gas)})` : ''}
                          {i < action.contractFunctions.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </span>
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
