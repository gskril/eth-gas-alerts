import { Heading, Card as ThorinCard, mq } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'

export const Layout = styled.div(
  ({ theme }) => css`
    width: 100%;
    min-height: 100svh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding: ${theme.space['6']} ${theme.space['4']};
    gap: ${theme.space['18']};

    ${mq.sm.min(css`
      padding: ${theme.space['8']};
    `)}
  `
)

export const Columns = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.space['6']};
  `
)

export const Link = styled.a(
  ({ theme }) => css`
    color: ${theme.colors.bluePrimary};
    text-decoration: underline;

    @media (hover: hover) {
      &:hover {
        text-decoration: none;
      }
    }
  `
)

export const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 65rem;
`

export const Card = styled(ThorinCard)(
  ({ theme }) => css`
    align-items: center;
    max-width: ${theme.space['112']};
    margin: 0 auto;
  `
)

export const Title = styled(Heading)`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 3rem;
  line-height: 1.2;
  max-width: 38rem;

  ${mq.sm.min(css`
    font-size: 2.5rem;
  `)}
`
