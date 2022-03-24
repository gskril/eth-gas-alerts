import Head from 'next/head'

import Container from '../components/Container'
import Header from '../components/Header'
import { Gas, Stats } from '../components/Stats'

export default function Home() {
  return (
		<>
			<Head>
				<title>ETH Gas Alerts</title>
				<meta
					name="description"
					content="Human-readable scale for Ethereum gas prices"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			<Container>
				<Stats />
			</Container>

			<main>
				<Container>
					<h1 className="title">
            {Gas().message}
					</h1>
				</Container>
			</main>
		</>
  )
}
