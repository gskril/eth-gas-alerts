import { formatEther, parseGwei } from 'viem';

export const CHAINLINK_ETH_USD = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419' as const;

export function calculateCostUsd(
  gasUnits: number,
  gasPriceGwei: number,
  ethPriceUsd: number
): number {
  const gasPriceWei = parseGwei(gasPriceGwei.toString());
  const costWei = gasPriceWei * BigInt(Math.round(gasUnits));
  const costEth = Number(formatEther(costWei));
  return costEth * ethPriceUsd;
}
