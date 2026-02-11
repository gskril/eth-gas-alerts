import { createPublicClient, formatUnits, http, parseAbi } from 'viem';
import { mainnet } from 'viem/chains';
import { execFileSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';

const CHAINLINK_ETH_USD = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419' as const;
const BLOCK_COUNT = 50;
const BLOCK_SKIP = 5;

async function main() {
  const rpcUrl = process.env.ETH_RPC || 'https://ethereum-rpc.publicnode.com';

  const client = createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl, { batch: true }),
  });

  const latestBlock = await client.getBlock();
  const latestNumber = latestBlock.number;

  const ethPriceRaw = await client.readContract({
    address: CHAINLINK_ETH_USD,
    abi: parseAbi(['function latestAnswer() view returns (int256)']),
    functionName: 'latestAnswer',
  });

  console.log(`Latest block: ${latestNumber}`);
  console.log(`ETH price: $${Number(formatUnits(ethPriceRaw, 8)).toFixed(2)}`);
  console.log(`Fetching ${BLOCK_COUNT} blocks (every ${BLOCK_SKIP})...`);

  const blockNumbers = Array.from(
    { length: BLOCK_COUNT },
    (_, i) => latestNumber - BigInt(i * BLOCK_SKIP)
  );

  const blocks = await Promise.all(
    blockNumbers.map((n) => client.getBlock({ blockNumber: n }))
  );

  const rows = blocks
    .filter((b) => b.baseFeePerGas != null)
    .map((b) => {
      const gasPrice = b.baseFeePerGas!.toString();
      return `(${b.number}, ${b.timestamp}, '${gasPrice}', '${ethPriceRaw.toString()}', '${b.gasLimit.toString()}')`;
    });

  const sql = [
    `CREATE TABLE IF NOT EXISTS gas_prices (block_number INTEGER NOT NULL, timestamp INTEGER NOT NULL, gas_price TEXT NOT NULL, eth_price TEXT NOT NULL, block_gas_limit TEXT NOT NULL);`,
    `CREATE INDEX IF NOT EXISTS idx_timestamp ON gas_prices(timestamp DESC);`,
    `INSERT OR REPLACE INTO gas_prices (block_number, timestamp, gas_price, eth_price, block_gas_limit) VALUES\n${rows.join(',\n')};`,
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
