import { useStats } from '../components/Stats'

export default function Scale() {
  const scale = [0, 25, 50, 75, 100]

  // Base the percentage on the highest price of the meter
  const scalePercentage = (useStats().gas.now / scale[scale.length - 1]) * 100
  const gasLive = useStats().gas.now
  const gasHourlyForecast = useStats().gas['1 hour']

  return (
    <>
      <div className="scale">
        <div className="scale__background">
          <div className="scale__bar" />
          <div className="scale__labels">
            {scale.map((gwei, index) => (
              <span
                key={index}
                className={
                  index % 2 === 0
                    ? 'scale__label'
                    : 'scale__label scale__label--desktop'
                }
              >
                {gwei}
              </span>
            ))}
          </div>
        </div>
      </div>
      {gasHourlyForecast + 2 < gasLive ? (
        <p className="prediction">
          Expected to drop to <strong>{gasHourlyForecast} gwei</strong> in the
          next hour
        </p>
      ) : (
        <p className="prediction">
          Not expected to go much lower in the next hour
        </p>
      )}

      <style jsx>
        {`
          .scale {
            position: relative;
            margin-bottom: 5rem;
            --scale-height: 2rem;
          }

          .scale__background {
            width: 100%;
            height: var(--scale-height);
            border-radius: 1rem;
            background: linear-gradient(
              90deg,
              #61ff00 0%,
              #ffe142 30%,
              #ff0000 75%
            );
          }

          .scale__bar {
            position: absolute;
            height: calc(var(--scale-height) + 0.75rem);
            width: 0.25rem;
            background: var(--text-color-dark);
            border-radius: 1rem;
            top: 50%;
            left: ${scalePercentage > 98 ? 98 : scalePercentage || 50}%;
            transform: translateY(-50%);
            transition: left 0.75s ease-in-out;
          }

          .scale__labels {
            display: flex;
            width: 100%;
            justify-content: space-between;
            position: absolute;
            bottom: calc(var(--scale-height) * -1);
          }

          .prediction {
            text-align: center;
          }

          @media screen and (max-width: 40em) {
            .scale {
              --scale-height: 1.5rem;
            }
            .scale__labels {
              bottom: calc(var(--scale-height) * -1 - 0.5rem);
            }
            .scale__label--desktop {
              display: none;
            }
          }
        `}
      </style>
    </>
  )
}
