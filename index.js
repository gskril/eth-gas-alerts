require("dotenv").config()
const express = require("express")
const app = express()
const axios = require("axios").default

app.get("/", function (req, res) {
	res.send("Gas monitor online")
})

app.listen(process.env.PORT || 8080)

getGasPrice()

const minsBetweenTweets = 60
const targetGasPrice = 60

function getGasPrice() {
	axios
		.get("https://api.etherscan.io/api", {
			params: {
				module: "gastracker",
				action: "gasoracle",
				apikey: process.env.EtherscanApiKeyToken,
			},
		})
		.then(function (response) {
			let averageGas = response.data.result.ProposeGasPrice
			if (averageGas <= targetGasPrice) {
				sendWebhook(averageGas)
			} else {
				// Check gas every 30 seconds if it's not below the target
				console.log(`Gas is expensive right now (${averageGas}). Checking again in 30sec`)
				setTimeout(() => {
					getGasPrice()
				}, 30*1000);
			}
		})
		.catch(function (error) {
			console.log(error)
		})
}

function sendWebhook(averageGas) {
	axios
		.post(process.env.ZapierWebook, {
			gas: averageGas,
		})
		.then((response) => {
			console.info(`Sent gas price (${averageGas} GWEI) to Zapier Webhook`)
			// Wait set amount of minutes before checking again after tweet
			setTimeout(() => {
				getGasPrice()
			}, minsBetweenTweets*60*1000);
		})
		.catch((error) => {
			console.log(error)
		})
}
