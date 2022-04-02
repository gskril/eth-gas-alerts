import Head from 'next/head'

import Container from '../components/Container'
import Header from '../components/Header'
import { Gas, Stats } from '../components/Stats'
import Scale from '../components/Scale'

export default function Home() {
	const gweiString = Gas().gwei

	return (
		<>
			<Head>
				<title>
					{gweiString == '__' ? '' : `${gweiString} Gwei | `}
					ETH Gas Alerts
				</title>
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
					<h1 className="title">{Gas().message}</h1>
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
