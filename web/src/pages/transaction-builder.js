import Head from 'next/head'
import { useState } from 'react'

import Container from '../components/Container'
import Header from '../components/Header'
import { Stats, useStats } from '../components/Stats'

export default function TransactionBuilder() {
  const ethNum = useStats().eth.price

  const [gasAmount, setGasAmount] = useState(0)
  const [gasPrice, setGasPrice] = useState(0)

  const feePrice = parseFloat(
    gasAmount * gasPrice * 0.000000001 * ethNum
  ).toFixed(2)

  return (
    <>
      <Head>
        <title>Ethereum Transaction Builder - Gas Costs</title>
        <meta
          name="description"
          content="Enter the amount of gas a transaction requires, and we'll estimate the cost of the transaction."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <Header />

      <Container>
        <Stats />
      </Container>

      <main>
        <Container>
          <h1 className="title">Transaction Builder</h1>
          <div className="transaction-builder">
            <label htmlFor="gasAmount">Gas Amount</label>
            <input
              type="number"
              onChange={(e) => setGasAmount(e.target.value)}
              id="gasAmount"
              placeholder="Gas Amount"
            />
            <br />
            <label htmlFor="gasPrice">Gas Price</label>
            <input
              type="number"
              id="gasPrice"
              placeholder="Gas Price"
              onChange={(e) => setGasPrice(e.target.value)}
            />
            <br />
            <span className="output">{feePrice}</span>
          </div>
        </Container>
      </main>
    </>
  )
}
