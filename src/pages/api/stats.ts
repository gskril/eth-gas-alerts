import type { APIContext } from 'astro';

import { getGasPriceWei, getEthPriceRaw, formatGasPrice, formatEthPrice } from '@/lib/ethereum';

export async function GET(context: APIContext) {
  const rpcUrl = context.locals.runtime?.env?.ETH_RPC || undefined;

  try {
    const [gasPriceWei, ethPriceRaw] = await Promise.all([
      getGasPriceWei(rpcUrl),
      getEthPriceRaw(rpcUrl),
    ]);

    const gasGwei = Math.round(formatGasPrice(gasPriceWei) * 100) / 100;
    const ethUsd = Math.round(formatEthPrice(ethPriceRaw) * 100) / 100;

    return Response.json({
      gas: {
        now: gasGwei,
      },
      eth: {
        price: ethUsd,
      },
      update: new Date(),
    });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
