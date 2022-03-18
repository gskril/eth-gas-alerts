export default function handler(req, res) {
  return fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      const lowGas = data.result.SafeGasPrice
      const averageGas = data.result.ProposeGasPrice
      const highGas = data.result.FastGasPrice

      let message
      if (lowGas < 40) {
        message = `Amazing time to make transactions!`
      } else if (lowGas < 60) {
        message = 'Good time to make transactions!'
      } else if (lowGas < 80) {
        message = 'Decent time to make transactions, could be better.'
      } else if (lowGas > 100) {
        message = 'Gas is rather high, consider waiting to save money.'
      }

      res.status(200).json({
        low: lowGas,
        average: averageGas,
        high: highGas,
        message: message
      })
    })
    .catch((err) => {
      res.status(400).json({ err })
    })
}
