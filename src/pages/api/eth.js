export default function handler(req, res) {
  return fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.ETHERSCAN_API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      res.status(200).json(data.result.ethusd)
    })
    .catch((err) => {
      res.status(400).json({ err })
    })
}
