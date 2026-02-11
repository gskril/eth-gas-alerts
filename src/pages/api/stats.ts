import type { APIContext } from 'astro';

import { getEthPrice, getGasPrice } from '@/lib/ethereum';
import { getGasMessage } from '@/lib/constants';

export async function GET(context: APIContext) {
  const rpcUrl = context.locals.runtime?.env?.ETH_RPC || undefined;

  try {
    const [gas, eth] = await Promise.all([
      getGasPrice(rpcUrl),
      getEthPrice(rpcUrl),
    ]);

    return Response.json({
      gas: {
        now: gas,
        message: getGasMessage(gas),
      },
      eth: {
        price: eth,
      },
      update: new Date(),
    });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
