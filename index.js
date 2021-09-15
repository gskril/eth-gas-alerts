require("dotenv").config()
const express = require("express")
const app = express()
const axios = require("axios").default

app.get("/", function (req, res) {
	res.send("Gas monitor online")
})

app.listen(process.env.PORT || 8080)

getGasPrice()

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
			let averageGas = parseInt(response.data.result.ProposeGasPrice)
			let time = response.headers.date.slice(-12)
			let priceCategory
			if (averageGas <= process.env.targetGasPrice) {
				if (averageGas <= 60) {
					priceCategory = "(solid price)"
				} else if (averageGas <= 50) {
					priceCategory = "(good price)"
				} else if (averageGas <= 40) {
					priceCategory = "(great price)"
				} else if (averageGas <= 30) {
					priceCategory = "(amazing price)"
				}
				sendWebhook(averageGas, priceCategory, time)
			} else {
				// Check gas every minute if it's not below the target
				console.log(`Gas is expensive right now (${averageGas}). Checking again in 1 min`)
				setTimeout(() => {
					getGasPrice()
				}, 60*1000);
			}
		})
		.catch(function (error) {
			console.log(error)
		})
}

function sendWebhook(averageGas, priceCategory, time) {
	axios
		.post(process.env.ZapierWebook, {
			gas: averageGas,
			cost: priceCategory,
			time: time
		})
		.then((response) => {
			console.info(`Sent gas price (${averageGas} GWEI) to Zapier Webhook`)
			// Wait set amount of minutes before checking again after tweet
			setTimeout(() => {
				getGasPrice()
			}, process.env.minsBetweenTweets*60*1000);
		})
		.catch((error) => {
			console.log(error)
		})
}
