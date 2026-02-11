import type { APIContext } from 'astro';
import { formatUnits } from 'viem';

const VALID_HOURS = new Set([1, 6, 24, 168, 720]);

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

    if (hours <= 24) {
      result = await db
        .prepare(
          'SELECT timestamp, gas_price, block_gas_limit FROM gas_prices WHERE timestamp > ? ORDER BY timestamp ASC'
        )
        .bind(since)
        .all();
    } else {
      const bucketSize = hours <= 168 ? 300 : 1800;
      result = await db
        .prepare(
          `SELECT
            (timestamp / ? * ?) as timestamp,
            gas_price,
            block_gas_limit
          FROM gas_prices
          WHERE timestamp > ?
          GROUP BY timestamp / ?
          ORDER BY timestamp ASC`
        )
        .bind(bucketSize, bucketSize, since, bucketSize)
        .all();
    }

    const data = result.results.map((row: any) => ({
      timestamp: row.timestamp,
      gas_price: Number(formatUnits(BigInt(row.gas_price), 9)),
      block_gas_limit: Number(row.block_gas_limit),
    }));

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error: 'Failed to query history' }, { status: 500 });
  }
}
