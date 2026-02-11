import { useState } from 'react';

import { calculateCostUsd } from '@/lib/constants';

export default function TxBuilder() {
  const [gasAmount, setGasAmount] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);

  const feePrice = calculateCostUsd(gasAmount, gasPrice, ethPrice).toFixed(2);

  return (
    <div className="w-full max-w-content mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 leading-tight">
        Transaction Builder
      </h1>

      <div className="bg-highlight rounded-xl p-6 max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Gas Amount</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="21000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setGasAmount(Number(e.target.value))}
            />
            <span className="text-sm text-[var(--text-color-light)] whitespace-nowrap">gas</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gas Price</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="30"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setGasPrice(Number(e.target.value))}
            />
            <span className="text-sm text-[var(--text-color-light)] whitespace-nowrap">gwei</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ETH Price</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="2000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEthPrice(Number(e.target.value))}
            />
            <span className="text-sm text-[var(--text-color-light)] whitespace-nowrap">USD</span>
          </div>
        </div>

        <p className="text-xl font-semibold pt-2">Fee: ${feePrice}</p>
      </div>
    </div>
  );
}
