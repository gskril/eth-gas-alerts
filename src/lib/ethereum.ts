import { createPublicClient, formatUnits, http, parseAbi } from 'viem';
import { mainnet } from 'viem/chains';

import { CHAINLINK_ETH_USD } from './constants';

export function getClient(rpcUrl?: string) {
  return createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl || 'https://ethereum-rpc.publicnode.com', { batch: true }),
  });
}

/** Returns gas price in wei as a bigint */
export async function getGasPriceWei(rpcUrl?: string): Promise<bigint> {
  const client = getClient(rpcUrl);
  return client.getGasPrice();
}

/** Returns Chainlink ETH/USD answer (8 decimals) as a bigint */
export async function getEthPriceRaw(rpcUrl?: string): Promise<bigint> {
  const client = getClient(rpcUrl);
  const price = await client.readContract({
    address: CHAINLINK_ETH_USD,
    abi: parseAbi(['function latestAnswer() view returns (int256)']),
    functionName: 'latestAnswer',
  });
  return price;
}

/** Format raw gas price (wei) to gwei as a number */
export function formatGasPrice(wei: bigint): number {
  return Number(formatUnits(wei, 9));
}

/** Format raw Chainlink answer (8 decimals) to USD as a number */
export function formatEthPrice(raw: bigint): number {
  return Number(formatUnits(raw, 8));
}
