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

    // check if gas is expected to drop within 1 hour
    const isGasLoweringIn1h = gas - 5 > gas1h
    const isGasLoweringALotIn1h = gas - 10 > gas1h

    if (gas < 30 && !isGasLoweringIn1h) {
      message = 'Great time to make transactions!'
    } else if (gas < 50 && !isGasLoweringIn1h) {
      message = 'Good time to make transactions!'
    } else if (gas <= 70) {
      if (isGasLoweringALotIn1h) {
        message = 'Wait a bit, gas is expected to drop soon.'
      } else {
        message = 'Decent time to make transactions.'
      }
    } else if (gas > 70) {
      if (isGasLoweringALotIn1h) {
        message = 'Gas is pretty high, consider waiting to save money.'
      } else {
        message = 'Gas is pretty high but not expected to drop soon :/'
      }
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
