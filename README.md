# ETH Gas Alerts

Real-time Ethereum gas tracker with a human-readable scale, transaction fee estimates for popular protocols, gas price history charts, and a transaction builder.

## Stack

- **Framework**: Astro 5 + Cloudflare adapter (SSR)
- **UI**: React islands, Tailwind CSS 3
- **Ethereum**: viem v2
- **Charts**: uPlot
- **Database**: Cloudflare D1 (gas price history)

## Development

```bash
bun install
bun dev          # Start dev server
bun build        # Production build
```

## Deploy (Cloudflare Workers)

This project uses Astro SSR on Cloudflare Workers (not Pages).

```bash
bun run build
bunx wrangler deploy
```

Or use the helper script:

```bash
bun run deploy:worker
```

### Scripts

```bash
bun run seed-history        # Seed D1 with local gas history data
bun run seed-history:prod   # Seed remote D1
```

## Routes

- `/` — Gas meter with real-time scale
- `/estimates` — Fee estimates for popular protocols
- `/transaction-builder` — Custom transaction gas estimator
- `/history` — Gas price history charts

## API

- `GET /api/stats` — Current gas prices and network stats
- `POST /api/record-gas` — Record a gas price sample to D1
- `GET /api/history` — Query gas price history
