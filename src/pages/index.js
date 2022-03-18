import Head from 'next/head'
import Link from 'next/link'
import data from '../data.json'

const gas = {
  gwei: 40,
  message: "low"
}

const ethPrice = 2800

const gasPriceEstimate = (gasAmount) => {
	// 1 ether = 1000000000000000000 wei
	return `$${parseFloat(
		gasAmount * gas.gwei * 0.000000001 * ethPrice
	).toFixed(2)}`
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Gas Estimates</title>
        <meta name="description" content="Real-time gas price estimates for popular Ethereum protocols." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container">
          <h1 className="title">
            Live estimates for gas fees on popular transactions
          </h1>

          <div className="project-grid">
            {data.map(project => {
              return (
                <div className={["project", stringToClass(project.name)].join(" ")}>
                  <h2 className="project__name">
                    <Link href={project.link}>
                      {project.name}
                    </Link>
                  </h2>
                  <div className="project__actions">
                    {project.actions.map((action) => {
                      // Add all action.contractFunctions.gas together
                      const totalGas = action.contractFunctions.map(f => f.gas).reduce((a, b) => a + b, 0)

                      return (
                        <div className={["project__action", stringToClass(action.name)].join(" ")}>
                          <span className="project__action-name">
                            {action.name}: {gasPriceEstimate(totalGas)}
                          </span>
                          <span className="project__action-functions">
                            Transactions: {action.contractFunctions.map((f, i) => {
                              const numberOfFunctions = action.contractFunctions.length

                              return (
                                <>
                                  {f.name} {numberOfFunctions > 1 ? `(${gasPriceEstimate(f.gas)})` : null}
                                  {i < numberOfFunctions - 1 ? ", " : ""}
                                </>
                              )
                            })}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </>
  )
}

const stringToClass = (str) => {
  // remove special characters then replace spaces with dashes
  str = str.replace(/[^a-zA-Z0-9- ]/g, '').toLowerCase()
  return str.replace(/ /g, '-')
}
