import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

import useSWR from 'swr'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import data from '../data.json'

export default function Home() {
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  
  const Gas = () => {
    const { data, error } = useSWR('/api/gas', fetcher, {
      refreshInterval: 1000 * 30 // 30 seconds
    })

    if (error) return {
      gwei: 'Error',
      message: 'Error fetching data'
    }
    if (!data) return {
      gwei: '__',
      message: 'Loading data...'
    }

    return {
      gwei: data.low,
      message: data.message
    }
  }

  const EthPrice = () => {
    const { data, error } = useSWR('/api/eth', fetcher, {
      refreshInterval: 30 * 1000
    })
  
    if (error) return 'Error'
    if (!data) return '____.__'

    return data
  }
  
  const gasPriceEstimate = (gasAmount) => {
    // 1 ether = 1000000000000000000 wei
    return `$${parseFloat(
      gasAmount * gasPrice * 0.000000001 * EthPrice()
    ).toFixed(2)}`
  }

  const [sliderValue, setSliderValue] = useState(25)
  const [gasPrice, setGasPrice] = useState(Gas().gwei) // TODO: fix default value to be the current gas price
  
  const sliderProps = {
    min: 0,
    max: 150,
    step: 1,
    marks: { 0: '0', 25: '25', 50: "50", 75: "75", 100: '100', 125: '125', 150: '150' },
  }

  const handleSliderChange = (value) => {
    setSliderValue(value)
    setGasPrice(value)
  }

  const resetGasPrice = () => {
    setGasPrice(Gas().gwei)
    setSliderValue(Gas().gwei)
  }

  return (
    <>
      <Head>
        <title>Gas Estimates</title>
        <meta name="description" content="Real-time gas price estimates for popular Ethereum protocols." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="info">
        Gas: {Gas().gwei} gwei
        <br />
        ETH: ${EthPrice()}
      </div>

      <main>
        <div className="container">
          <h1 className="title">
            Live estimates for gas fees on popular transactions
          </h1>

          <Slider
            value={sliderValue}
            onChange={handleSliderChange}
            {...sliderProps}
          />
          <div style={{ marginTop: 40, marginBottom: 20 }}>
            <b>Selected Value: </b>{sliderValue}
            {/* <button onClick={resetGasPrice}>Reset</button> */}
          </div>

          <div className="project-grid">
            {data.map(project => {
              return (
                <div className={"project"} key={stringToClass(project.name)}>
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
                        <div className={"project__action"} key={stringToClass(action.name)}>
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
