import { mq } from '@ensdomains/thorin'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'

import { Stats } from './Stats'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
`

const TitleWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;

  ${mq.md.max(css`
    gap: 0.5rem;
    flex-direction: column;
  `)}
`

const Title = styled.span`
  font-size: 1.25rem;
  font-weight: 600;

  ${mq.xs.max(css`
    font-size: 1.125rem;
  `)}
`

const Links = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  ${mq.md.max(css`
    gap: 0.5rem;
    flex-direction: column;
  `)}
`

const Link = styled.a<{ $active: boolean }>(
  ({ $active }) => css`
    color: rgba(0, 0, 0, ${$active ? 1 : 0.5});
    font-weight: 600;
    transition: color 0.15s ease-in-out;

    @media (hover: hover) {
      &:hover {
        color: rgba(0, 0, 0, 1);
      }
    }
  `
)
export function Nav() {
  const router = useRouter()

  return (
    <Wrapper>
      <TitleWrapper>
        <NextLink href="/">
          <Title>ETH Gas Alerts</Title>
        </NextLink>
        <Stats />
      </TitleWrapper>
      <Links>
        <Link href="/" $active={router.pathname === '/'}>
          Live Gas
        </Link>

        <Link href="/estimates" $active={router.pathname === '/estimates'}>
          Estimates
        </Link>

        <Link
          href="/transaction-builder"
          $active={router.pathname === '/transaction-builder'}
          className="hide-mobile"
        >
          Custom
        </Link>
      </Links>
    </Wrapper>
  )
}
