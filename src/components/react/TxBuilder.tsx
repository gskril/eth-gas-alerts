import { useEffect, useRef, useState } from 'react';

import { calculateCostUsd } from '@/lib/constants';
import { useStats } from '@/lib/hooks';

import QueryProvider from './QueryProvider';

export default function TxBuilder() {
  return (
    <QueryProvider>
      <TxBuilderInner />
    </QueryProvider>
  );
}

function TxBuilderInner() {
  const { data: stats } = useStats();
  const [gasAmount, setGasAmount] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const seededRef = useRef(false);

  useEffect(() => {
    if (stats && !seededRef.current) {
      seededRef.current = true;
      if (stats.gas?.now) setGasPrice(stats.gas.now);
      if (stats.eth?.price) setEthPrice(stats.eth.price);
    }
  }, [stats]);

  const feePrice = calculateCostUsd(gasAmount, gasPrice, ethPrice);
  const feePriceStr = feePrice.toFixed(2);
  const hasInput = gasAmount > 0 && gasPrice > 0 && ethPrice > 0;

  return (
    <div className="relative z-10 mx-auto w-full max-w-content animate-fade-in-up">
      <h1 className="mb-2 text-center text-2xl font-semibold leading-tight text-text-primary sm:text-3xl">
        Transaction Builder
      </h1>
      <p className="mb-8 text-center text-text-secondary">
        Calculate the cost of any Ethereum transaction.
      </p>

      <div className="mx-auto max-w-md rounded-xl border border-border bg-surface-raised p-6">
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
            value={gasPrice}
            onChange={(v) => setGasPrice(v)}
          />
          <InputField
            label="ETH Price"
            suffix="USD"
            placeholder="2000"
            value={ethPrice}
            onChange={(v) => setEthPrice(v)}
          />
        </div>

        {/* Result */}
        <div className="mt-6 border-t border-border pt-5">
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
  value,
  onChange,
}: {
  label: string;
  suffix: string;
  placeholder: string;
  value?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-text-secondary">{label}</label>
      <div className="relative">
        <input
          type="number"
          placeholder={placeholder}
          value={value !== undefined ? value || '' : undefined}
          className="focus:border-accent/50 focus:ring-accent/20 w-full rounded-lg border border-border bg-surface-overlay px-3 py-2.5 pr-14 font-mono text-text-primary transition-all placeholder:text-text-muted focus:outline-none focus:ring-1"
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-text-muted">
          {suffix}
        </span>
      </div>
    </div>
  );
}
