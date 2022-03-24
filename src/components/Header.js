import Link from 'next/link'
import { useRouter } from "next/router"

import Container from '../components/Container'

export default function Header() {

  const router = useRouter()

  return (
    <>
      <Container>
        <header className="header">
          <Link href="/">
            <a className="header__logo">
              ETH Gas Alerts
            </a>
          </Link>
          <div className="header__nav">
            <Link href="/">
              <a className={["header__link", router.pathname == "/" ? "header__link--active" : ""].join(" ")}>
                Live Gas
              </a>
            </Link>
            <Link href="/estimates">
              <a className={["header__link", router.pathname == "/estimates" ? "header__link--active" : ""].join(" ")}>
                Estimates
              </a>
            </Link>
            <a className="header__link header__link--mobile-only" href="https://twitter.com/ethgasalerts" target="_blank" rel="noreferrer">
              Twitter
            </a>
          </div>
        </header>

        <style jsx>{`
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding-top: 2.5rem;
            padding-bottom: 2.5rem;
          }

          .header__logo {
            font-size: 1.125rem;
            font-weight: 700;
          }

          .header__logo:hover,
          .header__logo:focus-visible {
            opacity: 0.8;
          }

          .header__nav {
            display: flex;
            gap: 3rem;
            font-weight: 400;
          }

          .header__link:hover,
          .header__link:focus-visible {
            outline: none;
            text-decoration: underline;
          }

          .header__link--active {
            font-weight: 700;
          }

          @media (max-width: 40em) {
            .header__nav {
              gap: 1.5rem;
              font-size: 0.875rem;
            }

            .header__link--mobile-only {
              display: none;
            }
          }
        `}</style>
      </Container>
    </>
  )
}
