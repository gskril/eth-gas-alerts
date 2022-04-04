export default async function handler(req, res) {
  try {
    const response = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.ETHERSCAN_API_KEY}`)
    const data = await response.json()
    res.status(200).json(data.result.ethusd)
  } catch (err) {
    res.status(400).json({ err })
  }
}
