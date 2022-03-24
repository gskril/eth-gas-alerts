import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export const Gas = () => {
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

export const EthPrice = () => {
  const { data, error } = useSWR('/api/eth', fetcher, {
    refreshInterval: 30 * 1000
  })

  if (error) return 'Error'
  if (!data) return '____.__'

  return data
}

export function Stats() {
  return (
    <div className="analytics">
      <span className="analytics__icon">
        <svg
          width="13"
          height="14"
          viewBox="0 0 13 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_16_63)">
            <path
              d="M10.5003 12.8333C9.56038 12.8333 8.55588 12.3227 8.55588 10.8888C8.55588 10.0834 8.99066 9.53628 9.41105 9.00739C9.57555 8.8005 9.74199 8.59128 9.89288 8.3595C9.28816 7.80767 8.62277 7.38883 8.16699 7.38883V6.61106C8.79738 6.61106 9.56816 7.05167 10.26 7.64939C10.407 7.26245 10.5003 6.80278 10.5003 6.22217H11.2781C11.2781 7.06567 11.1039 7.70617 10.8593 8.22456C11.4212 8.82422 11.8669 9.48067 12.0357 9.98778C12.3032 10.7912 12.2235 11.632 11.8276 12.1819C11.525 12.6019 11.0533 12.8333 10.5003 12.8333ZM10.4498 8.92417C10.3067 9.13028 10.1593 9.31617 10.02 9.49117C9.6366 9.97339 9.33366 10.3549 9.33366 10.8888C9.33366 11.8529 9.96833 12.0555 10.5003 12.0555C10.8052 12.0555 11.0397 11.9451 11.1968 11.7269C11.4457 11.3816 11.485 10.7955 11.2983 10.2339C11.1712 9.85361 10.8511 9.37761 10.4498 8.92417Z"
              fill="#B5BDDB"
            ></path>
            <path
              d="M7.0984 3.88867H2.33373C1.47468 3.88867 0.823679 4.58517 0.87929 5.44423L1.33429 12.4442C1.39029 13.3033 2.02457 13.9998 2.75179 13.9998H6.68035C7.40718 13.9998 8.04185 13.3033 8.09785 12.4442L8.55323 5.44423C8.60846 4.58517 7.95746 3.88867 7.0984 3.88867Z"
              fill="#B5BDDB"
            ></path>
            <path
              d="M8.94444 12.8335H0.388889C0.174222 12.8335 0 13.0073 0 13.2224V14.0002H9.33333V13.2224C9.33333 13.0073 9.1595 12.8335 8.94444 12.8335Z"
              fill="#B5BDDB"
            ></path>
            <path
              d="M10.8889 3.88878C10.6738 3.88878 10.5 3.71456 10.5 3.49989V2.24145L11.3186 0.603837C11.4151 0.411726 11.6484 0.33356 11.8405 0.430004C12.0326 0.52606 12.1104 0.759782 12.0143 0.951893L11.2778 2.425V3.49989C11.2778 3.71456 11.1039 3.88878 10.8889 3.88878Z"
              fill="#B5BDDB"
            ></path>
            <path
              d="M11.8615 6.22244H11.5594C11.6263 6.10772 11.6671 5.97588 11.6671 5.83355V4.27799C11.6671 3.99099 11.51 3.74288 11.2782 3.60794V3.50022C11.2782 3.28555 11.1044 3.11133 10.8893 3.11133C10.6743 3.11133 10.5004 3.28555 10.5004 3.50022V3.60794C10.2687 3.74288 10.1115 3.99061 10.1115 4.27799V5.83355C10.1115 5.97588 10.1524 6.10772 10.2193 6.22244H9.9171C9.80977 6.22244 9.72266 6.30955 9.72266 6.41688C9.72266 6.52422 9.80977 6.61133 9.9171 6.61133H11.8615C11.9689 6.61133 12.056 6.52422 12.056 6.41688C12.056 6.30955 11.9689 6.22244 11.8615 6.22244Z"
              fill="#B5BDDB"
            ></path>
            <path
              d="M8.55566 5.44455C8.55566 5.65922 8.7295 5.83344 8.94455 5.83344H10.889C11.1041 5.83344 11.2779 5.65922 11.2779 5.44455C11.2779 5.22989 11.1041 5.05566 10.889 5.05566H8.94455C8.7295 5.05566 8.55566 5.22989 8.55566 5.44455Z"
              fill="#B5BDDB"
            ></path>
            <path
              d="M9.33333 5.44444C9.33333 6.3035 8.63683 7 7.77778 7H1.55556C0.6965 7 0 6.3035 0 5.44444V1.55556C0 0.6965 0.6965 0 1.55556 0H7.77778C8.63683 0 9.33333 0.6965 9.33333 1.55556V5.44444Z"
              fill="#B5BDDB"
            ></path>
            <path
              d="M8.55512 5.4445C8.55512 5.87383 8.20668 6.22228 7.77734 6.22228H1.55512C1.12579 6.22228 0.777344 5.87383 0.777344 5.4445V1.55561C0.777344 1.12628 1.12579 0.777832 1.55512 0.777832H7.77734C8.20668 0.777832 8.55512 1.12628 8.55512 1.55561V5.4445Z"
              fill="#1B2236"
            ></path>
            <path
              d="M3.88867 1.94434H7.38867V3.111H3.88867V1.94434Z"
              fill="#B5BDDB"
            ></path>
          </g>
          <defs>
            <clipPath id="clip0_16_63">
              <rect
                width="13"
                height="14"
                fill="white"
              ></rect>
            </clipPath>
          </defs>
        </svg>
        {Gas().gwei}&nbsp;
        <span className="light-text">Gwei</span>
      </span>
      <span className="analytics__icon hide-mobile">
        <svg
          width="11"
          height="16"
          viewBox="0 0 11 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_317_267)">
            <path
              d="M5.05058 0L4.94043 0.364667V10.9417L5.05091 11.0487L10.1015 8.14667L5.05091 0H5.05058Z"
              fill="#B5BDDB"
            />
            <path
              d="M5.05095 0L0 8.14667L5.05095 11.0487V0Z"
              fill="#B5BDDB"
            />
            <path
              d="M5.05124 11.9786L4.98926 12.0523V15.8203L5.05124 15.997L10.1056 9.07764L5.05124 11.9783V11.9786Z"
              fill="#B5BDDB"
            />
            <path
              d="M5.05095 15.9966V11.978L0 9.07764L5.05095 15.9963V15.9966Z"
              fill="#B5BDDB"
            />
            <path
              d="M5.05176 11.0487L10.1027 8.14671L5.05176 5.91504V11.0487Z"
              fill="#B5BDDB"
            />
            <path
              d="M0 8.14637L5.05095 11.0484V5.91504L0 8.14637Z"
              fill="#B5BDDB"
            />
          </g>
          <defs>
            <clipPath id="clip0_317_267">
              <rect
                width="10.1053"
                height="16"
                fill="white"
              />
            </clipPath>
          </defs>
        </svg>
        {EthPrice()}&nbsp;
        <span className="light-text">USD</span>
      </span>

      <style jsx>{`
        .analytics {
          display: flex;
          gap: 1rem;
          position: absolute;
          transform: translateY(-2rem);
          background-color: var(--color-highlight);
          padding: 0.25rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }

        .analytics__icon {
          display: flex;
          align-items: center;
        }

        .analytics__icon svg {
          margin-right: 0.325rem;
        }
      `}</style>
    </div>
  )
}