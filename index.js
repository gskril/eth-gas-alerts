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
			let message
			if (averageGas <= process.env.targetGasPrice) {
				if (averageGas <= 40) {
					message = 'Amazing time to make $ETH transactions!'
				} else if (averageGas <= 50) {
					message = 'Great time to make $ETH transactions!'
				} else if (averageGas <= 60) {
					message = 'Good time to make $ETH transactions!'
				} else if (averageGas <= 70) {
					message = 'Not a bad time to make $ETH transactions!'
				} else {
					message = 'Considering waiting until prices go down to make your ETH transactions.'
				}
				sendWebhook(averageGas, message, time)
			} else {
				// Check gas every minute if it's not below the target
				console.log(`Gas is expensive right now (${averageGas}). Checking again in 1 min`)
				setTimeout(() => {
					getGasPrice()
				}, 60*1000);
			}
		})
		.catch(function (error) {
			console.log('Error fetching data from Etherscan API')
			setTimeout(() => {
				getGasPrice()
			}, 60*1000);
		})
}

function sendWebhook(averageGas, message, time) {
	axios
		.post(process.env.ZapierWebook, {
			gas: averageGas,
			message: message,
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
