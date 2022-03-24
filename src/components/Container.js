export default function Container({ children }) {
  return (
    <div className="container">
      {children}

      <style jsx>{`
        .container {
          margin: 0 auto;
          max-width: 70rem;
          padding-left: 1rem;
          padding-right: 1rem;
        }

        @media (min-width: 40em) {
          .container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }
      `}</style>
    </div>
  )
}
