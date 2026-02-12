import { handle } from '@astrojs/cloudflare/handler';
import type { D1Database, ExecutionContext, ScheduledEvent } from '@cloudflare/workers-types';
import type { SSRManifest } from 'astro';
import { App } from 'astro/app';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

interface Env {
  ETH_RPC?: string;
  DB?: D1Database;
}

export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);

  return {
    default: {
      async fetch(request: Request, env: Env, ctx: ExecutionContext) {
        return handle(manifest, app, request, env, ctx);
      },

      async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
        if (!env.DB) {
          console.error('Database not configured');
          return;
        }

        const client = createPublicClient({
          chain: mainnet,
          transport: http(env.ETH_RPC || 'https://ethereum-rpc.publicnode.com', { batch: true }),
        });

        const [block, gasPrice] = await Promise.all([client.getBlock(), client.getGasPrice()]);

        await env.DB.prepare(
          'INSERT OR IGNORE INTO gas_prices (block_number, timestamp, gas_price, block_gas_limit) VALUES (?, ?, ?, ?)'
        )
          .bind(
            Number(block.number),
            Number(block.timestamp),
            gasPrice.toString(),
            block.gasLimit.toString()
          )
          .run();
      },
    },
  };
}
