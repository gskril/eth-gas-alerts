import { execFileSync } from 'child_process';
import { unlinkSync, writeFileSync } from 'fs';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const BLOCK_COUNT = 1000;
const BLOCK_SKIP = 5;

async function main() {
  const rpcUrl = process.env.ETH_RPC || 'https://ethereum-rpc.publicnode.com';

  const client = createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl, { batch: true }),
  });

  const latestBlock = await client.getBlock();
  const latestNumber = latestBlock.number;

  console.log(`Latest block: ${latestNumber}`);
  console.log(`Fetching ${BLOCK_COUNT} blocks (every ${BLOCK_SKIP})...`);

  const blockNumbers = Array.from(
    { length: BLOCK_COUNT },
    (_, i) => latestNumber - BigInt(i * BLOCK_SKIP)
  );

  // Fetch in batches of 100 to avoid overwhelming the RPC
  const blocks = [];
  for (let i = 0; i < blockNumbers.length; i += 100) {
    const batch = blockNumbers.slice(i, i + 100);
    const results = await Promise.all(batch.map((n) => client.getBlock({ blockNumber: n })));
    blocks.push(...results);
    if (i + 100 < blockNumbers.length) {
      console.log(`  fetched ${blocks.length}/${BLOCK_COUNT}...`);
    }
  }

  const rows = blocks
    .filter((b) => b.baseFeePerGas != null)
    .map((b) => {
      const gasPrice = b.baseFeePerGas!.toString();
      return `(${b.number}, ${b.timestamp}, '${gasPrice}', '${b.gasLimit.toString()}')`;
    });

  const CHUNK_SIZE = 1000;
  const tmpFile = '.seed-history.sql';

  const header = [
    `CREATE TABLE IF NOT EXISTS gas_prices (block_number INTEGER PRIMARY KEY, timestamp INTEGER NOT NULL, gas_price TEXT NOT NULL, block_gas_limit TEXT NOT NULL);`,
    `CREATE INDEX IF NOT EXISTS idx_timestamp ON gas_prices(timestamp DESC);`,
  ].join('\n');

  const chunks = [];
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    chunks.push(rows.slice(i, i + CHUNK_SIZE));
  }

  console.log(`Inserting ${rows.length} records in ${chunks.length} batch(es)...`);

  for (let i = 0; i < chunks.length; i++) {
    const sql =
      i === 0
        ? `${header}\nINSERT OR REPLACE INTO gas_prices (block_number, timestamp, gas_price, block_gas_limit) VALUES\n${chunks[i].join(',\n')};`
        : `INSERT OR REPLACE INTO gas_prices (block_number, timestamp, gas_price, block_gas_limit) VALUES\n${chunks[i].join(',\n')};`;

    writeFileSync(tmpFile, sql);

    try {
      const remote = process.env.SEED_REMOTE === '1';
      execFileSync(
        'bunx',
        [
          'wrangler',
          'd1',
          'execute',
          'eth-gas-alerts',
          ...(remote ? [`--remote`] : ['--local']),
          `--file=${tmpFile}`,
        ],
        {
          stdio: 'inherit',
        }
      );
      console.log(`  batch ${i + 1}/${chunks.length} done (${chunks[i].length} rows)`);
    } catch (err) {
      console.error(`  batch ${i + 1} failed:`, err);
      throw err;
    }
  }

  unlinkSync(tmpFile);
  console.log('Done! Restart the dev server to see history data.');
}

main().catch(console.error);
