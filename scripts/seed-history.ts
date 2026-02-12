import { execFileSync } from 'child_process';
import { unlinkSync, writeFileSync } from 'fs';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const BLOCK_COUNT = 50000;
const BLOCK_SKIP = 5;
const RPC_BATCH_SIZE = 100;
const DB_BATCH_SIZE = 1000;
// calculate history: BLOCK_COUNT * BLOCK_SKIP * 12 seconds to days
// 50k BLOCK_COPUNT gives us 34 days of history
// 260k BLOCK_COUNT gives us 180 days of history
// Wipe db before seeding:
// bunx wrangler d1 execute eth-gas-alerts --remote --command "DROP TABLE IF EXISTS gas_prices;"

async function main() {
  const rpcUrl = process.env.ETH_RPC || 'https://ethereum-rpc.publicnode.com';
  const remote = process.env.SEED_REMOTE === '1';
  const tmpFile = '.seed-history.sql';

  const client = createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl, { batch: true }),
  });

  const latestBlock = await client.getBlock();
  const latestNumber = latestBlock.number;

  console.log(`Latest block: ${latestNumber}`);
  console.log(
    `Fetching ${BLOCK_COUNT} blocks (every ${BLOCK_SKIP}), uploading every ${DB_BATCH_SIZE}...`
  );

  const header = [
    `CREATE TABLE IF NOT EXISTS gas_prices (block_number INTEGER PRIMARY KEY, timestamp INTEGER NOT NULL, gas_price TEXT NOT NULL, block_gas_limit TEXT NOT NULL);`,
    `CREATE INDEX IF NOT EXISTS idx_timestamp ON gas_prices(timestamp DESC);`,
  ].join('\n');

  let rows: string[] = [];
  let totalFetched = 0;
  let totalUploaded = 0;
  let isFirstBatch = true;

  for (let i = 0; i < BLOCK_COUNT; i += RPC_BATCH_SIZE) {
    const batchSize = Math.min(RPC_BATCH_SIZE, BLOCK_COUNT - i);
    const blockNumbers = Array.from(
      { length: batchSize },
      (_, j) => latestNumber - BigInt((i + j) * BLOCK_SKIP)
    );

    const blocks = await Promise.all(blockNumbers.map((n) => client.getBlock({ blockNumber: n })));
    totalFetched += blocks.length;

    for (const b of blocks) {
      if (b.baseFeePerGas != null) {
        rows.push(
          `(${b.number}, ${b.timestamp}, '${b.baseFeePerGas.toString()}', '${b.gasLimit.toString()}')`
        );
      }
    }

    console.log(`  fetched ${totalFetched}/${BLOCK_COUNT} blocks (${rows.length} rows buffered)`);

    // Upload when we have enough rows or this is the last RPC batch
    while (rows.length >= DB_BATCH_SIZE || (totalFetched >= BLOCK_COUNT && rows.length > 0)) {
      const chunk = rows.splice(0, DB_BATCH_SIZE);
      const sql = isFirstBatch
        ? `${header}\nINSERT OR IGNORE INTO gas_prices (block_number, timestamp, gas_price, block_gas_limit) VALUES\n${chunk.join(',\n')};`
        : `INSERT OR IGNORE INTO gas_prices (block_number, timestamp, gas_price, block_gas_limit) VALUES\n${chunk.join(',\n')};`;

      writeFileSync(tmpFile, sql);

      try {
        execFileSync(
          'bunx',
          [
            'wrangler',
            'd1',
            'execute',
            'eth-gas-alerts',
            ...(remote ? ['--remote', '--yes'] : ['--local']),
            `--file=${tmpFile}`,
          ],
          { stdio: 'inherit' }
        );
        totalUploaded += chunk.length;
        console.log(`  uploaded ${totalUploaded} rows`);
        isFirstBatch = false;
      } catch (err) {
        console.error(`  upload failed at ${totalUploaded} rows:`, err);
        throw err;
      }
    }
  }

  unlinkSync(tmpFile);
  console.log(`Done! ${totalUploaded} rows uploaded.`);
}

main().catch(console.error);
