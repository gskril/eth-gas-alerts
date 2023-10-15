import { Input, Typography } from '@ensdomains/thorin'
import Head from 'next/head'
import { useState } from 'react'

import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { Card, Container, Layout, Title } from '@/components/atoms'
import { useIsMounted } from '@/hooks/useIsMounted'

export default function TransactionBuilder() {
  const [ethPrice, setEthPrice] = useState(0)
  const [gasAmount, setGasAmount] = useState(0)
  const [gasPrice, setGasPrice] = useState(0)

  const feePriceNum = gasAmount * gasPrice * 0.000000001 * ethPrice
  const feePrice = parseFloat(feePriceNum.toString()).toFixed(2)

  const isMounted = useIsMounted()

  return (
    <>
      <Head>
        <title>Ethereum Transaction Builder - Gas Costs</title>
        <meta
          name="description"
          content="Enter the amount of gas a transaction requires, and we'll estimate the cost of the transaction."
        />
      </Head>

      <Layout>
        <Nav />

        <Container as="main">
          <Title
            style={{
              textAlign: 'center',
              marginBottom: '1rem',
            }}
          >
            Transaction Builder
          </Title>

          {isMounted && (
            <Card>
              <Input
                label="Gas Amount"
                itemType="number"
                placeholder="21000"
                suffix="gas"
                // @ts-ignore
                onChange={(e) => setGasAmount(e.target.value)}
              />

              <Input
                label="Gas Price"
                itemType="number"
                placeholder="30"
                suffix="gwei"
                // @ts-ignore
                onChange={(e) => setGasPrice(e.target.value)}
              />

              <Input
                label="ETH Price"
                itemType="number"
                placeholder="2000"
                suffix="USD"
                // @ts-ignore
                onChange={(e) => setEthPrice(e.target.value)}
              />

              <Typography className="output">Fee: ${feePrice}</Typography>
            </Card>
          )}
        </Container>

        <Footer />
      </Layout>
    </>
  )
}
