CREATE TABLE IF NOT EXISTS gas_prices (
  block_number INTEGER PRIMARY KEY,
  timestamp INTEGER NOT NULL,
  gas_price TEXT NOT NULL,       -- raw wei
  block_gas_limit TEXT NOT NULL  -- raw
);

CREATE INDEX IF NOT EXISTS idx_timestamp ON gas_prices(timestamp DESC);
