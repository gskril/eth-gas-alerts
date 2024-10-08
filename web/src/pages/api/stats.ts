import { NextApiRequest, NextApiResponse } from 'next'
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let gas = 0
  let eth = 0
  let message = 'Loading...'
  let error = 'Error fetching data'

  const client = createPublicClient({
    chain: mainnet,
    transport: http(process.env.ETH_RPC, { batch: true }),
  })

  try {
    const [_gasPrice, _ethPrice] = await Promise.all([
      (await client.getGasPrice().then((res) => Number(res) / 1e9)).toFixed(0),
      client
        .readContract({
          address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419', // Chainlink Price Feed
          abi: parseAbi(['function latestAnswer() view returns (int256)']),
          functionName: 'latestAnswer',
        })
        .then((res) => (Number(res) / 1e8).toFixed(2)),
    ])

    gas = Number(_gasPrice)
    eth = Number(_ethPrice)
  } catch (error) {
    return res.status(400).json(error)
  }

  if (gas < 30) {
    message = 'Great time to make transactions!'
  } else if (gas < 50) {
    message = 'Good time to make transactions!'
  } else if (gas <= 70) {
    message = 'Decent time to make transactions.'
  } else if (gas > 70) {
    message = 'Gas is pretty high, consider waiting to save money.'
  }

  res.json({
    gas: {
      now: gas,
      message: message,
    },
    eth: {
      price: eth,
    },
    update: new Date(),
  })
}
