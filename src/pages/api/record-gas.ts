import type { APIContext } from 'astro';
import { createPublicClient, http, parseAbi } from 'viem';
import { mainnet } from 'viem/chains';

import { CHAINLINK_ETH_USD } from '@/lib/constants';

export async function POST(context: APIContext) {
  const secret = context.request.headers.get('x-cron-secret');
  const expected = context.locals.runtime?.env?.CRON_SECRET;

  if (!expected || secret !== expected) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rpcUrl = context.locals.runtime?.env?.ETH_RPC || undefined;
  const db = context.locals.runtime?.env?.DB;

  if (!db) {
    return Response.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const client = createPublicClient({
      chain: mainnet,
      transport: http(rpcUrl || undefined, { batch: true }),
    });

    const [block, gasPrice, ethPriceRaw] = await Promise.all([
      client.getBlock(),
      client.getGasPrice(),
      client.readContract({
        address: CHAINLINK_ETH_USD,
        abi: parseAbi(['function latestAnswer() view returns (int256)']),
        functionName: 'latestAnswer',
      }),
    ]);

    const gasPriceGwei = Number(gasPrice) / 1e9;
    const ethPriceUsd = Number(ethPriceRaw) / 1e8;

    await db
      .prepare(
        'INSERT INTO gas_prices (block_number, timestamp, gas_price, eth_price, block_gas_limit) VALUES (?, ?, ?, ?, ?)'
      )
      .bind(
        Number(block.number),
        Number(block.timestamp),
        Math.round(gasPriceGwei * 100),
        Math.round(ethPriceUsd * 100),
        Number(block.gasLimit)
      )
      .run();

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: 'Failed to record gas price' },
      { status: 500 }
    );
  }
}
