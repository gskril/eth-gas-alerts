import Head from 'next/head'

import Container from '../components/Container'
import Header from '../components/Header'
import { Gas, Stats } from '../components/Stats'

export default function Home() {
  return (
		<>
			<Head>
				<title>Gas Estimates</title>
				<meta
					name="description"
					content="Real-time gas price estimates for popular Ethereum protocols."
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
