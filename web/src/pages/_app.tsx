import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'
import PlausibleProvider from 'next-plausible'
import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'

import '../styles/style.css'

function App({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain="ethgasalerts.xyz" trackOutboundLinks>
      <ThemeProvider theme={lightTheme}>
        <ThorinGlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    </PlausibleProvider>
  )
}

export default App
