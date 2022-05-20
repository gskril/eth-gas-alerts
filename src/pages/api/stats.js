export default async function handler(req, res) {
	const data = await fetch('https://gas.best/stats')
		.then((res) => res.json())
		.catch((err) => {
			console.log(err)
			return null
		})

	let gas, gas5m, gas1h, eth, message, error

	if (!data) {
		gas = 0
		gas5m = 0
		gas1h = 0
		eth = 0
		message = 'Loading...'
		error = 'Error fetching data.'
		res.status(400)
	} else {
		gas = data.pending.fee
		gas5m = data.forecast['5 min']
		gas1h = data.forecast['1 hour']
		eth = data.ethPrice

		if (gas < 30) {
			message = 'Amazing time to make transactions!'
		} else if (gas < 50) {
			message = 'Good time to make transactions!'
		} else if (gas <= 70) {
			message = 'Decent time to make transactions.'
		} else if (gas > 70) {
			message = 'Gas is pretty high, consider waiting to save money.'
		}

		res.status(200)
	}

	res.json({
		gas: {
			now: gas,
			'5 min': gas5m,
			'1 hour': gas1h,
			message: message,
		},
		eth: {
			price: eth,
		},
		update: new Date(),
	})
}
