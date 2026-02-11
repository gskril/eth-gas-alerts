/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type D1Database = import('@cloudflare/workers-types').D1Database;

type Runtime = import('@astrojs/cloudflare').Runtime<{
  DB: D1Database;
  ETH_RPC: string;
  CRON_SECRET: string;
}>;

declare namespace App {
  interface Locals extends Runtime {}
}
