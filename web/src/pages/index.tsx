import { Heading, mq } from '@ensdomains/thorin'
import Head from 'next/head'
import styled, { css } from 'styled-components'

import { Nav } from '@/components/Nav'
import Scale from '@/components/Scale'
import { useStats } from '@/components/Stats'
import { Container, Layout } from '@/components/atoms'

const Title = styled(Heading)`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-align: center;

  ${mq.sm.min(css`
    font-size: 2.5rem;
  `)}
`

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
            <Title>{useStats().gas.message}</Title>
            <Scale />
          </Container>
        </main>

        {/* Footer placeholder */}
        <div />
      </Layout>
    </>
  )
}
