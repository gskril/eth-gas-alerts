export default async function handler(req, res) {
  try {
    const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_KEY}`)
    const data = await response.json()
    const lowGas = data.result.SafeGasPrice
    const averageGas = data.result.ProposeGasPrice
    const highGas = data.result.FastGasPrice

    let message
    if (lowGas < 30) {
      message = 'Amazing time to make transactions!'
    } else if (lowGas < 50) {
      message = 'Good time to make transactions!'
    } else if (lowGas <= 80) {
      message = 'Not a bad time to make transactions.'
    } else if (lowGas > 80) {
      message = 'Gas is pretty high, consider waiting to save money.'
    }

    res.status(200).json({
      low: lowGas,
      average: averageGas,
      high: highGas,
      message: message
    })
  } catch (err) {
    res.status(400).json({ err })
  }
}
