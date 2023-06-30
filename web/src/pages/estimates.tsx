import Head from 'next/head'
import Link from 'next/link'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { useEffect, useState } from 'react'

import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { useStats } from '@/components/Stats'
import { Container, Layout, Title } from '@/components/atoms'

import data from '../data.json'

export default function Estimates() {
  const ethPrice = useStats().eth.price
  const LiveGasPrice = useStats().gas.now

  const gasPriceEstimate = (gasAmount: number) => {
    // 1 ether = 1000000000000000000 wei
    const number = gasAmount * gasPrice * 0.000000001 * ethPrice
    return `$${parseFloat(number.toString()).toFixed(2)}`
  }

  const [didMoveSlider, setDidMoveSlider] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)
  const [gasPrice, setGasPrice] = useState(0)

  useEffect(() => {
    if (typeof LiveGasPrice === 'number' && !didMoveSlider) {
      setGasPrice(LiveGasPrice)
      setSliderValue(LiveGasPrice)
    }
  }, [LiveGasPrice, didMoveSlider])

  const sliderProps = {
    min: 0,
    max: 100,
    step: 1,
    handleStyle: [
      {
        width: '20px',
        height: '20px',
        marginTop: '-8px',
      },
    ],
    marks: { 0: '0', 25: '25', 50: '50', 75: '75', 100: '100' },
  }

  const handleSliderChange = (value: number) => {
    setDidMoveSlider(true)
    setSliderValue(value)
    setGasPrice(value)
  }

  return (
    <>
      <Head>
        <title>Ethereum Gas Estimates</title>
        <meta
          name="description"
          content="Transaction fee estimates for popular Ethereum protocols"
        />
      </Head>

      <Layout>
        <Nav />

        <main>
          <Container>
            <Title>
              Transaction fee estimates for popular Ethereum protocols
            </Title>

            <Slider
              value={sliderValue}
              // @ts-ignore
              onChange={handleSliderChange}
              {...sliderProps}
            />
            <div style={{ marginTop: 40, marginBottom: 20 }}>
              <b>Gwei for estimate: </b>
              {sliderValue}
            </div>

            <div className="project-grid">
              {data.map((project) => {
                return (
                  <div className={'project'} key={stringToClass(project.name)}>
                    <h2 className="project__name">
                      {project.link ? (
                        <Link href={project.link} legacyBehavior>
                          <a target="_blank" rel="noreferrer">
                            {project.name}
                          </a>
                        </Link>
                      ) : (
                        project.name
                      )}
                    </h2>
                    <div className="project__actions">
                      {project.actions.map((action) => {
                        // Add all action.contractFunctions.gas together
                        const totalGas = action.contractFunctions
                          .map((f) => f.gas)
                          .reduce((a, b) => a + b, 0)

                        return (
                          <div
                            className={'project__action'}
                            key={stringToClass(action.name)}
                          >
                            <details>
                              <summary>
                                <span className="project__action-name">
                                  {action.name}: {gasPriceEstimate(totalGas)}
                                </span>
                              </summary>
                              <span className="project__action-functions">
                                Transactions:{' '}
                                {action.contractFunctions.map((f, i) => {
                                  const numberOfFunctions =
                                    action.contractFunctions.length

                                  return (
                                    <span key={i}>
                                      {f.name}{' '}
                                      {numberOfFunctions > 1
                                        ? `(${gasPriceEstimate(f.gas)})`
                                        : null}
                                      {i < numberOfFunctions - 1 ? ', ' : ''}
                                    </span>
                                  )
                                })}
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

        <Footer />
      </Layout>

      <style jsx>{`
        .project-grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: 1fr;
          justify-content: space-around;
        }

        .project {
          padding: 1rem;
          background-color: var(--color-highlight);
          border-radius: 0.5rem;
        }

        .project__name {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 1.25rem;
        }

        .project__actions {
          display: grid;
          gap: 1rem;
        }

        .project summary {
          outline: none !important;
        }

        .project summary:hover {
          cursor: pointer;
        }

        .project__action-name {
          margin-left: 0.125rem;
        }

        .project__action-functions {
          font-size: 0.875rem;
          color: var(--text-color-light);
        }

        @media screen and (min-width: 40em) {
          .project-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }

        @media screen and (min-width: 60em) {
          .project-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </>
  )
}

const stringToClass = (str: string) => {
  // remove special characters then replace spaces with dashes
  str = str.replace(/[^a-zA-Z0-9- ]/g, '').toLowerCase()
  return str.replace(/ /g, '-')
}
