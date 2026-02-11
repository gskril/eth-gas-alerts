import { createPublicClient, http, parseAbi } from 'viem';
import { mainnet } from 'viem/chains';

import { CHAINLINK_ETH_USD } from './constants';

export function getClient(rpcUrl?: string) {
  return createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl || 'https://ethereum-rpc.publicnode.com', { batch: true }),
  });
}

export async function getGasPrice(rpcUrl?: string): Promise<number> {
  const client = getClient(rpcUrl);
  const gasPrice = await client.getGasPrice();
  return Number((Number(gasPrice) / 1e9).toFixed(2));
}

export async function getEthPrice(rpcUrl?: string): Promise<number> {
  const client = getClient(rpcUrl);
  const price = await client.readContract({
    address: CHAINLINK_ETH_USD,
    abi: parseAbi(['function latestAnswer() view returns (int256)']),
    functionName: 'latestAnswer',
  });
  return Number((Number(price) / 1e8).toFixed(2));
}
