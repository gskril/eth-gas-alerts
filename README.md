# ETH Gas Tracker

Send a tweet when gas is cheap on the ETH network.  
Follow [@________](https://twitter.com/) on Twitter for alerts.

## How To Use
1. Clone the project
	```bash
	git clone https://github.com/gskril/eth-gas-alerts.git
	```

2. Go to the project directory
	```bash
	cd eth-gas-alerts
	```

3. Install dependencies
	```bash
	npm install
	```

4. Change the name of .env.example to .env and configure the following:
    - [Etherscan API Key](https://docs.etherscan.io/getting-started/creating-an-account)
    - [Zapier Webhook](https://zapier.com/shared/787474b6f8cca2ea9df23b95324318704cbbd0e4)

5. Start the monitor
	```bash
	npm start
	```