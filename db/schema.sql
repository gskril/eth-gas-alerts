CREATE TABLE gas_prices (
  block_number INTEGER NOT NULL,
  timestamp INTEGER NOT NULL,
  gas_price INTEGER NOT NULL,
  eth_price INTEGER NOT NULL,
  block_gas_limit INTEGER NOT NULL
);

CREATE INDEX idx_timestamp ON gas_prices(timestamp DESC);
