CREATE TABLE gas_prices (
  block_number INTEGER NOT NULL,
  timestamp INTEGER NOT NULL,
  gas_price TEXT NOT NULL,       -- raw wei
  block_gas_limit TEXT NOT NULL  -- raw
);

CREATE INDEX idx_timestamp ON gas_prices(timestamp DESC);
