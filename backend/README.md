# ETH Gas Tracker

Tweet when gas on the ETH network is low.  
Update the Twitter profile's location every minute with the live gas price.

Follow [@ETHGasAlerts](https://twitter.com/ETHGasAlerts) on Twitter for alerts.

## How To Use
1. Clone the repo
2. Install dependencies using `yarn install`
3. Change the name of .env.example to .env and configure the following:
	- [Etherscan API Key](https://docs.etherscan.io/getting-started/creating-an-account)
	- Minimum time to wait between tweets, regardless of gas price
	- Gas price that triggers a tweet
	- Twitter API consumer keys from the [developer portal](https://developer.twitter.com/)
	- Twitter API access tokens from the account you want to tweet from
5. Start the monitor using `yarn start`
