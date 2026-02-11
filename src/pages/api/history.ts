import type { APIContext } from 'astro';

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
      // Return all data points for 24h or less
      result = await db
        .prepare(
          'SELECT timestamp, gas_price, eth_price, block_gas_limit FROM gas_prices WHERE timestamp > ? ORDER BY timestamp ASC'
        )
        .bind(since)
        .all();
    } else {
      // Downsample for longer ranges: group by 5-minute buckets
      const bucketSize = hours <= 168 ? 300 : 1800; // 5min for 7d, 30min for 30d
      result = await db
        .prepare(
          `SELECT
            (timestamp / ? * ?) as timestamp,
            CAST(AVG(gas_price) AS INTEGER) as gas_price,
            CAST(AVG(eth_price) AS INTEGER) as eth_price,
            CAST(AVG(block_gas_limit) AS INTEGER) as block_gas_limit
          FROM gas_prices
          WHERE timestamp > ?
          GROUP BY timestamp / ?
          ORDER BY timestamp ASC`
        )
        .bind(bucketSize, bucketSize, since, bucketSize)
        .all();
    }

    return Response.json({ data: result.results });
  } catch (error) {
    return Response.json({ error: 'Failed to query history' }, { status: 500 });
  }
}
