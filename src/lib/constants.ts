export const CHAINLINK_ETH_USD = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419' as const;

export const CHAINLINK_ABI = [
  {
    inputs: [],
    name: 'latestAnswer',
    outputs: [{ name: '', type: 'int256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const GAS_SCALE_MAX = 20;

export function getGasMessage(gwei: number): string {
  if (gwei < 3) return 'Great time to make transactions!';
  if (gwei < 8) return 'Good time to make transactions!';
  if (gwei <= 15) return 'Decent time to make transactions.';
  return 'Gas is pretty high, consider waiting to save money.';
}

export function calculateCostUsd(gasUnits: number, gasPriceGwei: number, ethPriceUsd: number): number {
  return gasUnits * gasPriceGwei * 1e-9 * ethPriceUsd;
}
