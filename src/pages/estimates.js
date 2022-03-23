import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

import useSWR from 'swr'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import data from '../data.json'
import Container from '../components/Container'
import Header from '../components/Header'
import { Gas, EthPrice, Stats } from '../components/Stats'

export default function Home() {
  const gasPriceEstimate = (gasAmount) => {
    // 1 ether = 1000000000000000000 wei
    return `$${parseFloat(
      gasAmount * gasPrice * 0.000000001 * EthPrice()
    ).toFixed(2)}`
  }

  const [sliderValue, setSliderValue] = useState(0)
  const [gasPrice, setGasPrice] = useState(0) // TODO: fix default value to be the current gas price
  
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
            Transaction fee estimates for popular Ethereum protocols
					</h1>

					<Slider
						value={sliderValue}
						onChange={handleSliderChange}
						{...sliderProps}
					/>
					<div style={{ marginTop: 40, marginBottom: 20 }}>
						<b>Gwei for estimate: </b>
						{sliderValue}
						{/* <button onClick={resetGasPrice}>Reset</button> */}
					</div>

					<div className="project-grid">
						{data.map((project) => {
							return (
								<div
									className={'project'}
									key={stringToClass(project.name)}
								>
									<h2 className="project__name">
                    {project.link
                      ? <Link href={project.link}>
                          <a target="_blank" rel="noreferrer">
                            {project.name}
                          </a>
                        </Link>
                      : project.name
                    }
									</h2>
									<div className="project__actions">
										{project.actions.map((action) => {
											// Add all action.contractFunctions.gas together
											const totalGas =
												action.contractFunctions
													.map((f) => f.gas)
													.reduce((a, b) => a + b, 0)

											return (
												<div
													className={
														'project__action'
													}
													key={stringToClass(
														action.name
													)}
												>
                          <details>
                            <summary>
                              <span className="project__action-name">
                                {action.name}:{' '}
                                {gasPriceEstimate(
                                  totalGas
                                )}
                              </span>
                            </summary>
                            <span className="project__action-functions">
                              Transactions:{' '}
                              {action.contractFunctions.map(
                                (f, i) => {
                                  const numberOfFunctions =
                                    action
                                      .contractFunctions
                                      .length

                                  return (
                                    <>
                                      {f.name}{' '}
                                      {numberOfFunctions >
                                      1
                                        ? `(${gasPriceEstimate(
                                            f.gas
                                          )})`
                                        : null}
                                      {i <
                                      numberOfFunctions -
                                        1
                                        ? ', '
                                        : ''}
                                    </>
                                  )
                                }
                              )}
                            </span>
                          </details>
												</div>
											)
										})}
									</div>
								</div>
							)
						})}
					</div>
				</Container>
			</main>
		</>
  )
}

const stringToClass = (str) => {
  // remove special characters then replace spaces with dashes
  str = str.replace(/[^a-zA-Z0-9- ]/g, '').toLowerCase()
  return str.replace(/ /g, '-')
}
