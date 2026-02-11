import type { APIContext } from 'astro';

import { getClient, getGasPriceWei, getEthPriceRaw } from '@/lib/ethereum';

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
    const client = getClient(rpcUrl);

    const [block, gasPriceWei, ethPriceRaw] = await Promise.all([
      client.getBlock(),
      getGasPriceWei(rpcUrl),
      getEthPriceRaw(rpcUrl),
    ]);

    await db
      .prepare(
        'INSERT INTO gas_prices (block_number, timestamp, gas_price, eth_price, block_gas_limit) VALUES (?, ?, ?, ?, ?)'
      )
      .bind(
        Number(block.number),
        Number(block.timestamp),
        gasPriceWei.toString(),
        ethPriceRaw.toString(),
        block.gasLimit.toString()
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
