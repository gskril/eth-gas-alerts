import Head from 'next/head'

import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import Scale from '@/components/Scale'
import { useStats } from '@/components/Stats'
import { Container, Layout, Title } from '@/components/atoms'

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

      <Layout>
        <Nav />

        <main>
          <Container>
            <Title align="center" style={{ marginBottom: '1.5rem' }}>
              {useStats().gas.message}
            </Title>
            <Scale />
          </Container>
        </main>

        <Footer />
      </Layout>
    </>
  )
}
