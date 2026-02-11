import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { execFileSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';

const BLOCK_COUNT = 200;
const BLOCK_SKIP = 10;

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

  // Fetch in batches of 50 to avoid overwhelming the RPC
  const blocks = [];
  for (let i = 0; i < blockNumbers.length; i += 50) {
    const batch = blockNumbers.slice(i, i + 50);
    const results = await Promise.all(
      batch.map((n) => client.getBlock({ blockNumber: n }))
    );
    blocks.push(...results);
    if (i + 50 < blockNumbers.length) {
      console.log(`  fetched ${blocks.length}/${BLOCK_COUNT}...`);
    }
  }

  const rows = blocks
    .filter((b) => b.baseFeePerGas != null)
    .map((b) => {
      const gasPrice = b.baseFeePerGas!.toString();
      return `(${b.number}, ${b.timestamp}, '${gasPrice}', '${b.gasLimit.toString()}')`;
    });

  const sql = [
    `CREATE TABLE IF NOT EXISTS gas_prices (block_number INTEGER NOT NULL, timestamp INTEGER NOT NULL, gas_price TEXT NOT NULL, block_gas_limit TEXT NOT NULL);`,
    `CREATE INDEX IF NOT EXISTS idx_timestamp ON gas_prices(timestamp DESC);`,
    `INSERT OR REPLACE INTO gas_prices (block_number, timestamp, gas_price, block_gas_limit) VALUES\n${rows.join(',\n')};`,
  ].join('\n');

  const tmpFile = '.seed-history.sql';
  writeFileSync(tmpFile, sql);

  console.log(`Inserting ${rows.length} records into local D1...`);

  try {
    execFileSync('bunx', ['wrangler', 'd1', 'execute', 'eth-gas-alerts', '--local', `--file=${tmpFile}`], {
      stdio: 'inherit',
    });
    console.log('Done! Restart the dev server to see history data.');
  } finally {
    unlinkSync(tmpFile);
  }
}

main().catch(console.error);
