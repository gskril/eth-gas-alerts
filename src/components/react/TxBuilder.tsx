import { useState } from 'react';

import { calculateCostUsd } from '@/lib/constants';

export default function TxBuilder() {
  const [gasAmount, setGasAmount] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);

  const feePrice = calculateCostUsd(gasAmount, gasPrice, ethPrice);
  const feePriceStr = feePrice.toFixed(2);
  const hasInput = gasAmount > 0 && gasPrice > 0 && ethPrice > 0;

  return (
    <div className="w-full max-w-content mx-auto animate-fade-in-up relative z-10">
      <h1 className="text-2xl sm:text-3xl font-semibold leading-tight mb-2 text-text-primary text-center">
        Transaction Builder
      </h1>
      <p className="text-text-secondary text-center mb-8">
        Calculate the cost of any Ethereum transaction.
      </p>

      <div className="bg-surface-raised border border-border rounded-xl p-6 max-w-md mx-auto">
        <div className="space-y-5">
          <InputField
            label="Gas Amount"
            suffix="gas"
            placeholder="21000"
            onChange={(v) => setGasAmount(v)}
          />
          <InputField
            label="Gas Price"
            suffix="gwei"
            placeholder="30"
            onChange={(v) => setGasPrice(v)}
          />
          <InputField
            label="ETH Price"
            suffix="USD"
            placeholder="2000"
            onChange={(v) => setEthPrice(v)}
          />
        </div>

        {/* Result */}
        <div className="mt-6 pt-5 border-t border-border">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-text-secondary">Estimated Fee</span>
            <span
              className={`font-mono text-3xl font-medium tabular-nums transition-colors ${
                hasInput ? 'text-text-primary' : 'text-text-muted'
              }`}
            >
              ${feePriceStr}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  suffix,
  placeholder,
  onChange,
}: {
  label: string;
  suffix: string;
  placeholder: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm text-text-secondary mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="number"
          placeholder={placeholder}
          className="w-full px-3 py-2.5 pr-14 bg-surface-overlay border border-border rounded-lg text-text-primary font-mono placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-mono">
          {suffix}
        </span>
      </div>
    </div>
  );
}
