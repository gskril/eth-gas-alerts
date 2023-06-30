import Head from 'next/head'

import Container from '../components/Container'
import Header from '../components/Header'
import Scale from '../components/Scale'
import { Stats, useStats } from '../components/Stats'

export default function Home() {
  const gweiString = useStats().gas.now

  return (
    <>
      <Head>
        <title>
          {typeof gweiString === 'number'
            ? `${gweiString} Gwei | ETH Gas Alerts`
            : 'ETH Gas Alerts'}
        </title>
        <meta
          name="description"
          content="Human-readable scale for Ethereum gas prices"
        />
      </Head>

      <Header />

      <Container>
        <Stats />
      </Container>

      <main>
        <Container>
          <h1 className="title">{useStats().gas.message}</h1>
          <Scale />
        </Container>
      </main>

      <style jsx>
        {`
          @media screen and (min-width: 40em) {
            .title {
              text-align: center;
              margin-left: auto;
              margin-right: auto;
            }
          }
        `}
      </style>
    </>
  )
}
