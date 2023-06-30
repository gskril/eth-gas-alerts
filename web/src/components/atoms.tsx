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
    padding: ${theme.space['6']};
    gap: ${theme.space['18']};

    ${mq.sm.min(css`
      padding: ${theme.space['8']};
    `)}
  `
)

export const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 55rem;
`

export const Card = styled(ThorinCard)(
  ({ theme }) => css`
    width: 100%;
    line-height: 1.4;
    max-width: ${theme.space['112']};
    margin: 0 auto;
  `
)

export const Title = styled(Heading)`
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.2;

  ${mq.xs.min(css`
    font-size: 2rem;
  `)}

  ${mq.sm.min(css`
    font-size: 2.5rem;
  `)}
`
