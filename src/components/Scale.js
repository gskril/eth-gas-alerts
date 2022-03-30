import { Gas } from '../components/Stats'

export default function Scale() {
	const scale = [0, 25, 50, 75, 100, 125, 150]

	// Base the percentage on the highest price of the meter
	const scalePercentage = (Gas().gwei / scale[scale.length - 1]) * 100

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

			<style jsx>
				{`
					.scale {
						position: relative;
					}

					.scale__background {
						width: 100%;
						height: 2rem;
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
						height: 2.75rem;
						width: 0.25rem;
						background: var(--text-color-dark);
						border-radius: 1rem;
						top: 50%;
						left: ${scalePercentage > 98
							? 98
							: scalePercentage || 50}%;
						transform: translateY(-50%);
						transition: left 0.75s ease-in-out;
					}

					.scale__labels {
						display: flex;
						width: 100%;
						justify-content: space-between;
						position: absolute;
						bottom: -2rem;
					}

					@media screen and (max-width: 40em) {
						.scale__label--desktop {
							display: none;
						}
					}
				`}
			</style>
		</>
	)
}
