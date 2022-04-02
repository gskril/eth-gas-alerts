import '../styles/globals.css'
import Script from 'next/script'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
		<>
      <Head>
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
      </Head>
			<Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script strategy="lazyOnload" id="">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

			<Component {...pageProps} />
		</>
  )
}

export default MyApp
