import type { SSRManifest } from 'astro';
import { App } from 'astro/app';
import { handle } from '@astrojs/cloudflare/handler';
import { createPublicClient, formatUnits, http, parseAbi } from 'viem';
import { mainnet } from 'viem/chains';

const CHAINLINK_ETH_USD = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419' as const;

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

        const [block, gasPrice, ethPriceRaw] = await Promise.all([
          client.getBlock(),
          client.getGasPrice(),
          client.readContract({
            address: CHAINLINK_ETH_USD,
            abi: parseAbi(['function latestAnswer() view returns (int256)']),
            functionName: 'latestAnswer',
          }),
        ]);

        await env.DB.prepare(
          'INSERT INTO gas_prices (block_number, timestamp, gas_price, eth_price, block_gas_limit) VALUES (?, ?, ?, ?, ?)'
        )
          .bind(
            Number(block.number),
            Number(block.timestamp),
            gasPrice.toString(),
            ethPriceRaw.toString(),
            block.gasLimit.toString()
          )
          .run();
      },
    } satisfies ExportedHandler<Env>,
  };
}
