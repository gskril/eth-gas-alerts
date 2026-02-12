import type { APIContext } from 'astro';
import { formatUnits } from 'viem';

const VALID_HOURS = new Set([6, 24, 168, 720, 4320]);

// Returns the time-bucket size in seconds for a given range.
// Targets ~200-400 data points per range to keep payloads light.
//  1h  → raw          (~60 pts)
//  6h  → raw          (~360 pts)
//  24h → 5 min        (~288 pts)
//  7d  → 30 min       (~336 pts)
//  30d → 2 hours      (~360 pts)
//  6mo → 12 hours     (~360 pts)
function bucketSize(hours: number): number | null {
  if (hours <= 6) return null; // no bucketing
  if (hours <= 24) return 300;
  if (hours <= 168) return 1800;
  if (hours <= 720) return 7200;
  return 43200;
}

export async function GET(context: APIContext) {
  const db = context.locals.runtime?.env?.DB;

  if (!db) {
    return Response.json({ error: 'Database not configured' }, { status: 500 });
  }

  const url = new URL(context.request.url);
  const hoursParam = Number(url.searchParams.get('hours') || '24');
  const hours = VALID_HOURS.has(hoursParam) ? hoursParam : 24;

  const since = Math.floor(Date.now() / 1000) - hours * 3600;

  try {
    let result;
    const bucket = bucketSize(hours);

    if (bucket === null) {
      result = await db
        .prepare(
          'SELECT block_number, timestamp, gas_price, block_gas_limit FROM gas_prices WHERE timestamp > ? ORDER BY timestamp ASC'
        )
        .bind(since)
        .all();
    } else {
      result = await db
        .prepare(
          `SELECT
            MAX(block_number) as block_number,
            (timestamp / ? * ?) as timestamp,
            gas_price,
            block_gas_limit
          FROM gas_prices
          WHERE timestamp > ?
          GROUP BY timestamp / ?
          ORDER BY timestamp ASC`
        )
        .bind(bucket, bucket, since, bucket)
        .all();
    }

    const data = result.results.map((row: any) => ({
      block_number: row.block_number,
      timestamp: row.timestamp,
      gas_price: Number(formatUnits(BigInt(row.gas_price), 9)),
      block_gas_limit: Number(row.block_gas_limit),
    }));

    const oldest = await db
      .prepare('SELECT MIN(timestamp) as oldest FROM gas_prices')
      .first<{ oldest: number | null }>();

    return Response.json({ data, oldest_timestamp: oldest?.oldest ?? null });
  } catch (error) {
    return Response.json({ error: 'Failed to query history' }, { status: 500 });
  }
}
